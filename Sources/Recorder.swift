import Foundation
import AVFoundation
import ScreenCaptureKit
import CoreMedia
import Combine

/// Only this serial queue touches audio files. Audio callbacks hand off owned copies.
final class ChunkWriter: @unchecked Sendable {
    private let queue = DispatchQueue(label: "com.superuserkalo.trilsy.audio-writer")
    private let directory: URL
    private let source: String
    private let sessionStart: Double
    private let offset: Double
    private let onPart: @Sendable (AudioPart) -> Void
    private let onFailure: @Sendable (String) -> Void
    private var file: AVAudioFile?
    private var start = 0.0
    private var frames: AVAudioFramePosition = 0
    private var accepting = true

    init(directory: URL, source: String, offset: Double, sessionStart: Double,
         onPart: @escaping @Sendable (AudioPart) -> Void,
         onFailure: @escaping @Sendable (String) -> Void) {
        self.directory = directory; self.source = source; self.offset = offset
        self.sessionStart = sessionStart; self.onPart = onPart; self.onFailure = onFailure
    }

    func append(_ buffer: AVAudioPCMBuffer) {
        let capturedAt = ProcessInfo.processInfo.systemUptime
        guard let copy = AVAudioPCMBuffer(pcmFormat: buffer.format, frameCapacity: buffer.frameLength) else { return }
        copy.frameLength = buffer.frameLength
        let input = UnsafeMutableAudioBufferListPointer(buffer.mutableAudioBufferList)
        let output = UnsafeMutableAudioBufferListPointer(copy.mutableAudioBufferList)
        for index in 0..<min(input.count, output.count) {
            if let src = input[index].mData, let dst = output[index].mData {
                memcpy(dst, src, Int(input[index].mDataByteSize))
                output[index].mDataByteSize = input[index].mDataByteSize
            }
        }
        queue.async { [self] in
            guard accepting else { return }
            do {
                if let file, file.processingFormat != copy.format { close() }
                if file == nil {
                    start = offset + max(0, capturedAt - sessionStart)
                    let name = "\(source)_\(Int(start * 1000))_\(UUID().uuidString).caf"
                    file = try AVAudioFile(forWriting: directory.appendingPathComponent(name), settings: copy.format.settings,
                                           commonFormat: copy.format.commonFormat, interleaved: copy.format.isInterleaved)
                    frames = 0
                }
                try file?.write(from: copy)
                frames += AVAudioFramePosition(copy.frameLength)
                if Double(frames) / copy.format.sampleRate >= 60 { close() }
            } catch {
                accepting = false
                close()
                onFailure(error.localizedDescription)
            }
        }
    }

    private func close() {
        guard let file else { return }
        let part = AudioPart(file: file.url.lastPathComponent, start: start,
                             duration: Double(frames) / file.processingFormat.sampleRate, source: source)
        self.file = nil
        if frames > 0 { onPart(part) }
        frames = 0
    }

    func finish() async {
        await withCheckedContinuation { continuation in
            queue.async { [self] in accepting = false; close(); continuation.resume() }
        }
    }
}

final class SystemAudioOutput: NSObject, SCStreamOutput, SCStreamDelegate, @unchecked Sendable {
    let writer: ChunkWriter
    let failure: @Sendable (String) -> Void
    init(writer: ChunkWriter, failure: @escaping @Sendable (String) -> Void) {
        self.writer = writer; self.failure = failure
    }
    func stream(_ stream: SCStream, didStopWithError error: Error) { failure(error.localizedDescription) }
    func stream(_ stream: SCStream, didOutputSampleBuffer sample: CMSampleBuffer, of type: SCStreamOutputType) {
        guard type == .audio, CMSampleBufferDataIsReady(sample),
              let description = sample.formatDescription,
              let asbd = CMAudioFormatDescriptionGetStreamBasicDescription(description),
              let format = AVAudioFormat(streamDescription: asbd) else { return }
        let count = CMSampleBufferGetNumSamples(sample)
        guard count > 0, let pcm = AVAudioPCMBuffer(pcmFormat: format, frameCapacity: AVAudioFrameCount(count)) else { return }
        pcm.frameLength = AVAudioFrameCount(count)
        let result = CMSampleBufferCopyPCMDataIntoAudioBufferList(sample, at: 0, frameCount: Int32(count), into: pcm.mutableAudioBufferList)
        if result == noErr { writer.append(pcm) }
        else { failure("Could not copy system audio (\(result)).") }
    }
}

@MainActor
final class Recorder: ObservableObject {
    @Published var isActive = false
    @Published var isPaused = false
    @Published var elapsed = 0.0
    @Published var applications: [SCRunningApplication] = []
    @Published var level: Float = 0
    var onPart: ((AudioPart) -> Void)?
    var onFailure: ((String) -> Void)?
    private var microphone: AVAudioEngine?
    private var stream: SCStream?
    private var systemOutput: SystemAudioOutput?
    private var writers: [ChunkWriter] = []
    private var timer: Timer?
    private var startTime = 0.0
    private var offset = 0.0
    private var directory: URL?
    private var useMic = true
    private var useSystem = false
    private var selectedApp: Int32?

    func listApplications() async throws {
        let content = try await SCShareableContent.excludingDesktopWindows(false, onScreenWindowsOnly: false)
        applications = content.applications.filter { $0.bundleIdentifier != Bundle.main.bundleIdentifier && !$0.applicationName.isEmpty }
            .sorted { $0.applicationName < $1.applicationName }
    }

    func start(directory: URL, microphone: Bool, system: Bool, application: Int32?) async throws {
        guard microphone || system else { throw TrilsyError.message("Choose microphone or application audio.") }
        self.directory = directory; useMic = microphone; useSystem = system; selectedApp = application
        offset = 0; elapsed = 0
        try await beginCapture()
        isActive = true
    }

    private func beginCapture() async throws {
        guard let directory else { return }
        if useMic {
            guard await AVCaptureDevice.requestAccess(for: .audio) else {
                throw TrilsyError.message("Enable Trilsy’s microphone access in System Settings → Privacy & Security → Microphone.")
            }
        }
        startTime = ProcessInfo.processInfo.systemUptime
        let failure: @Sendable (String) -> Void = { [weak self] message in
            Task { @MainActor in self?.onFailure?(message) }
        }
        func makeWriter(_ source: String) -> ChunkWriter {
            let writer = ChunkWriter(directory: directory, source: source, offset: offset, sessionStart: startTime,
                onPart: { [weak self] part in Task { @MainActor in self?.onPart?(part) } }, onFailure: failure)
            writers.append(writer)
            return writer
        }
        do {
            if useSystem {
                let content = try await SCShareableContent.excludingDesktopWindows(false, onScreenWindowsOnly: false)
                guard let display = content.displays.first else { throw TrilsyError.message("No display is available for system audio capture.") }
                let filter: SCContentFilter
                if let selectedApp {
                    guard let application = content.applications.first(where: { $0.processID == selectedApp }) else {
                        throw TrilsyError.message("The selected application closed. Refresh the app list and try again.")
                    }
                    filter = SCContentFilter(display: display, including: [application], exceptingWindows: [])
                } else {
                    let own = content.applications.filter { $0.bundleIdentifier == Bundle.main.bundleIdentifier }
                    filter = SCContentFilter(display: display, excludingApplications: own, exceptingWindows: [])
                }
                let config = SCStreamConfiguration()
                config.capturesAudio = true
                config.excludesCurrentProcessAudio = true
                config.sampleRate = 48000; config.channelCount = 2
                config.width = 2; config.height = 2
                config.minimumFrameInterval = CMTime(value: 1, timescale: 1)
                let output = SystemAudioOutput(writer: makeWriter("system"), failure: failure)
                let capture = SCStream(filter: filter, configuration: config, delegate: output)
                try capture.addStreamOutput(output, type: .audio, sampleHandlerQueue: DispatchQueue(label: "trilsy.system-audio"))
                systemOutput = output; stream = capture
                try await capture.startCapture()
            }
            if useMic {
                let engine = AVAudioEngine()
                let input = engine.inputNode
                let format = input.outputFormat(forBus: 0)
                guard format.sampleRate > 0, format.channelCount > 0 else { throw TrilsyError.message("No working microphone is available.") }
                let writer = makeWriter("microphone")
                input.installTap(onBus: 0, bufferSize: 4096, format: format) { [weak self] buffer, _ in
                    writer.append(buffer)
                    if let channel = buffer.floatChannelData?[0], buffer.frameLength > 0 {
                        var peak: Float = 0
                        for i in 0..<Int(buffer.frameLength) { peak = max(peak, abs(channel[i])) }
                        Task { @MainActor in self?.level = peak }
                    }
                }
                microphone = engine
                try engine.start()
            }
            isPaused = false
            timer = Timer.scheduledTimer(withTimeInterval: 0.25, repeats: true) { [weak self] _ in
                Task { @MainActor in
                    guard let self else { return }
                    self.elapsed = self.offset + ProcessInfo.processInfo.systemUptime - self.startTime
                }
            }
        } catch {
            await endCapture()
            throw error
        }
    }

    func pause() async {
        offset += ProcessInfo.processInfo.systemUptime - startTime
        await endCapture(); elapsed = offset; isPaused = true
    }
    func resume() async throws { try await beginCapture() }
    func stop() async {
        if !isPaused { offset += ProcessInfo.processInfo.systemUptime - startTime }
        await endCapture(); elapsed = offset; isActive = false; isPaused = false
    }
    private func endCapture() async {
        timer?.invalidate(); timer = nil
        if let microphone { microphone.inputNode.removeTap(onBus: 0); microphone.stop() }
        microphone = nil
        if let stream { try? await stream.stopCapture() }
        stream = nil; systemOutput = nil
        for writer in writers { await writer.finish() }
        writers.removeAll(); level = 0
    }
}

enum TrilsyError: LocalizedError {
    case message(String)
    var errorDescription: String? { if case .message(let value) = self { return value }; return nil }
}
