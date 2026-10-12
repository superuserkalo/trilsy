import Foundation
import Combine
import CoreMedia
import AVFoundation

actor MediaImporter {
    func run(url: URL, directory: URL, onPart: @escaping @Sendable (AudioPart) async throws -> Void) async throws {
        let asset = AVURLAsset(url: url)
        guard let track = try await asset.loadTracks(withMediaType: .audio).first else {
            throw TrilsyError.message("This file has no readable audio track.")
        }
        let reader = try AVAssetReader(asset: asset)
        let output = AVAssetReaderTrackOutput(track: track, outputSettings: [
            AVFormatIDKey: kAudioFormatLinearPCM,
            AVLinearPCMBitDepthKey: 32,
            AVLinearPCMIsFloatKey: true,
            AVLinearPCMIsNonInterleaved: false
        ])
        guard reader.canAdd(output) else { throw TrilsyError.message("Unsupported audio format.") }
        reader.add(output)
        guard reader.startReading() else { throw reader.error ?? TrilsyError.message("Could not read media.") }
        defer { reader.cancelReading() }
        var file: AVAudioFile?
        var frames: AVAudioFramePosition = 0
        var offset = 0.0
        func completedPart() -> AudioPart? {
            guard let file else { return nil }
            return AudioPart(file: file.url.lastPathComponent, start: offset,
                             duration: Double(frames) / file.processingFormat.sampleRate, source: "import")
        }
        while let sample = output.copyNextSampleBuffer() {
            try Task.checkCancellation()
            guard let description = sample.formatDescription,
                  let asbd = CMAudioFormatDescriptionGetStreamBasicDescription(description),
                  let format = AVAudioFormat(streamDescription: asbd) else { continue }
            let count = CMSampleBufferGetNumSamples(sample)
            guard count > 0, let buffer = AVAudioPCMBuffer(pcmFormat: format, frameCapacity: AVAudioFrameCount(count)) else { continue }
            buffer.frameLength = AVAudioFrameCount(count)
            guard CMSampleBufferCopyPCMDataIntoAudioBufferList(sample, at: 0, frameCount: Int32(count), into: buffer.mutableAudioBufferList) == noErr else {
                throw TrilsyError.message("Could not decode audio.")
            }
            if file == nil {
                let name = "import_\(Int(offset * 1000))_\(UUID().uuidString).caf"
                file = try AVAudioFile(forWriting: directory.appendingPathComponent(name), settings: format.settings,
                                       commonFormat: format.commonFormat, interleaved: format.isInterleaved)
            }
            try file?.write(from: buffer)
            frames += AVAudioFramePosition(count)
            if Double(frames) / format.sampleRate >= 60, let part = completedPart() {
                file = nil; frames = 0; offset += part.duration
                try await onPart(part)
            }
        }
        if let part = completedPart() { file = nil; try await onPart(part) }
        if reader.status == .failed { throw reader.error ?? TrilsyError.message("Import failed.") }
    }
}

@MainActor
final class Playback: ObservableObject {
    @Published var playing = false
    @Published var position = 0.0
    private var players: [String: AVAudioPlayer] = [:]
    private var timer: Timer?
    private var parts: [AudioPart] = []
    private var directory: URL?
    private var origin = 0.0
    private var began = 0.0

    func play(_ recording: Recording, directory: URL, at time: Double = 0) {
        stop()
        parts = recording.parts; self.directory = directory
        origin = max(0, time); position = origin; began = ProcessInfo.processInfo.systemUptime
        playing = true
        tick()
        timer = Timer.scheduledTimer(withTimeInterval: 0.05, repeats: true) { [weak self] _ in
            Task { @MainActor in self?.tick() }
        }
    }
    private func tick() {
        guard let directory else { return }
        position = origin + ProcessInfo.processInfo.systemUptime - began
        let end = parts.map { $0.start + $0.duration }.max() ?? 0
        if position >= end { stop(); return }
        let active = parts.filter { position >= $0.start && position < $0.start + $0.duration }
        for key in Array(players.keys) where !active.contains(where: { $0.id == key }) {
            players[key]?.stop(); players.removeValue(forKey: key)
        }
        for part in active where players[part.id] == nil {
            if let player = try? AVAudioPlayer(contentsOf: directory.appendingPathComponent(part.file)) {
                player.currentTime = position - part.start
                player.play(); players[part.id] = player
            }
        }
    }
    func stop() {
        timer?.invalidate(); timer = nil
        players.values.forEach { $0.stop() }; players.removeAll(); playing = false
    }
}
