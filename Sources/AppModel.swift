import SwiftUI
import AppKit
import UniformTypeIdentifiers
import Combine

@MainActor
final class AppModel: ObservableObject {
    @Published var recordings: [Recording] = []
    @Published var selectedID: UUID?
    @Published var busy = false
    @Published var progress = ""
    @Published var error: String?
    @Published var micEnabled = true
    @Published var systemEnabled = false
    @Published var applicationID: Int32? = nil
    @AppStorage("language") var language = ""
    @AppStorage("vocabulary") var vocabulary = ""
    @AppStorage("modelDownloadConsent") var modelDownloadConsent = false
    let recorder = Recorder()
    let playback = Playback()
    private(set) var store: RecordingStore?
    private let transcriber = Transcriber()
    private let summarizer = Summarizer()
    private var work: Task<Void, Never>?
    private var recordingID: UUID?
    private var stopping = false
    private var subscriptions: Set<AnyCancellable> = []

    var selected: Recording? { recordings.first { $0.id == selectedID } }

    init() {
        do {
            store = try RecordingStore()
            try reload()
        } catch { self.error = error.localizedDescription }
        recorder.objectWillChange.sink { [weak self] in self?.objectWillChange.send() }.store(in: &subscriptions)
        playback.objectWillChange.sink { [weak self] in self?.objectWillChange.send() }.store(in: &subscriptions)
        recorder.onPart = { [weak self] part in
            guard let self, let id = self.recordingID else { return }
            do { try self.update(id) { recording in
                if !recording.parts.contains(where: { $0.id == part.id }) { recording.parts.append(part) }
            } } catch { self.error = "Could not save recording metadata: \(error.localizedDescription)" }
        }
        recorder.onFailure = { [weak self] message in self?.error = message; self?.stop() }
    }

    func reload() throws {
        guard let store else { return }
        let result = try store.load()
        recordings = result.recordings
        if !result.warnings.isEmpty { error = result.warnings.joined(separator: "\n") }
        if selectedID == nil { selectedID = recordings.first?.id }
    }

    func update(_ id: UUID, _ change: (inout Recording) -> Void) throws {
        guard let index = recordings.firstIndex(where: { $0.id == id }), let store else { return }
        var changed = recordings[index]
        change(&changed)
        try store.save(changed)
        recordings[index] = changed
    }

    func edit(_ change: (inout Recording) -> Void) {
        guard let id = selectedID else { return }
        do { try update(id, change) } catch { self.error = error.localizedDescription }
    }

    func refreshApplications() {
        Task { do { try await recorder.listApplications() } catch { self.error = error.localizedDescription } }
    }

    func start() {
        guard !busy, !recorder.isActive, let store else { return }
        playback.stop(); busy = true
        let recording = Recording(title: "Recording \(Date().formatted(date: .abbreviated, time: .shortened))")
        do {
            try store.save(recording); recordings.insert(recording, at: 0)
            selectedID = recording.id; recordingID = recording.id
        } catch { self.error = error.localizedDescription; busy = false; return }
        Task {
            defer { busy = false }
            do {
                try await recorder.start(directory: store.folder(recording.id), microphone: micEnabled, system: systemEnabled, application: applicationID)
                try update(recording.id) { $0.status = "Recording" }
            } catch {
                self.error = error.localizedDescription
                try? update(recording.id) { $0.status = "Recording could not start" }
            }
        }
    }

    func pauseOrResume() {
        guard !busy, recorder.isActive else { return }
        busy = true
        Task {
            defer { busy = false }
            do {
                if recorder.isPaused { try await recorder.resume() } else { await recorder.pause() }
                if let id = recordingID { try update(id) { $0.status = recorder.isPaused ? "Paused" : "Recording" } }
            } catch { self.error = error.localizedDescription }
        }
    }

    func stop() {
        guard recorder.isActive, !stopping else { return }
        stopping = true; busy = true
        Task {
            await recorder.stop()
            do {
                try reload() // Includes chunks saved on disk before their metadata callback.
                if let id = recordingID { try update(id) { $0.status = "Recorded" } }
            } catch { self.error = error.localizedDescription }
            recordingID = nil; busy = false; stopping = false
        }
    }

    func importMedia() {
        guard !busy, !recorder.isActive, let store else { return }
        let panel = NSOpenPanel()
        panel.allowedContentTypes = [.audio, .movie]
        panel.allowsMultipleSelection = false
        guard panel.runModal() == .OK, let url = panel.url else { return }
        let recording = Recording(title: url.deletingPathExtension().lastPathComponent)
        do { try store.save(recording) } catch { self.error = error.localizedDescription; return }
        recordings.insert(recording, at: 0); selectedID = recording.id
        busy = true; progress = "Importing audio…"
        work = Task {
            defer { busy = false; work = nil; progress = "" }
            do {
                try update(recording.id) { $0.status = "Importing" }
                try await MediaImporter().run(url: url, directory: store.folder(recording.id)) { [weak self] part in
                    try await self?.update(recording.id) { $0.parts.append(part) }
                }
                try update(recording.id) { $0.status = "Recorded" }
            } catch {
                self.error = error is CancellationError ? "Import stopped. Completed chunks are saved." : error.localizedDescription
                try? reload()
            }
        }
    }

    func process(notesOnly: Bool = false) {
        guard !busy, !recorder.isActive, let recording = selected, let store else { return }
        guard modelDownloadConsent else { error = "Enable model downloads in settings first. Models use several GB; recordings stay on this Mac."; return }
        guard !recording.parts.isEmpty else { error = "Record or import audio first."; return }
        playback.stop(); busy = true
        let language = language, vocabulary = vocabulary
        work = Task {
            defer { busy = false; work = nil; progress = "" }
            do {
                if !notesOnly {
                    progress = "Loading speech model (downloads on first use)…"
                    try update(recording.id) { $0.status = "Transcribing" }
                    for (index, part) in recording.parts.enumerated() {
                        try Task.checkCancellation()
                        if recordings.first(where: { $0.id == recording.id })?.transcribedParts.contains(part.id) == true { continue }
                        progress = "Transcribing chunk \(index + 1) of \(recording.parts.count)…"
                        let segments = try await transcriber.transcribe(part: part, directory: store.folder(recording.id), language: language, vocabulary: vocabulary)
                        try update(recording.id) {
                            $0.segments.removeAll { $0.partID == part.id }
                            $0.segments.append(contentsOf: segments)
                            $0.segments.sort { $0.start < $1.start }
                            $0.transcribedParts.append(part.id)
                        }
                    }
                }
                await transcriber.unload()
                guard let current = recordings.first(where: { $0.id == recording.id }), !current.segments.isEmpty else {
                    throw TrilsyError.message("No speech was detected. Check the audio by playing it back.")
                }
                try update(recording.id) { $0.status = "Summarizing" }
                progress = "Loading notes model (downloads on first use)…"
                var sections: [String] = []
                let chunks = noteChunks(current.transcript)
                for (index, chunk) in chunks.enumerated() {
                    try Task.checkCancellation()
                    progress = "Writing detailed notes \(index + 1) of \(chunks.count)…"
                    let section = try await summarizer.summarize(chunk, instructions: current.instructions)
                    sections.append(section)
                    // Persist detailed sections immediately; later sections never replace earlier detail.
                    try update(recording.id) { $0.notes = sections.joined(separator: "\n\n---\n\n") }
                }
                // Overview covers every section through bounded intermediate reductions.
                var outline = sections.joined(separator: "\n\n")
                var rounds = 0
                while outline.count > 6000 && rounds < 5 {
                    var reduced: [String] = []
                    for chunk in noteChunks(outline) {
                        reduced.append(try await summarizer.summarize(chunk, instructions: current.instructions, overview: true))
                    }
                    let next = reduced.joined(separator: "\n")
                    guard next.count < outline.count else { break }
                    outline = next; rounds += 1
                }
                if outline.count <= 6000 {
                    let overview = try await summarizer.summarize(outline, instructions: current.instructions, overview: true)
                    try update(recording.id) { $0.notes = "## Overview\n\n\(overview)\n\n" + sections.joined(separator: "\n\n---\n\n") }
                }
                try update(recording.id) { $0.status = "Ready" }
            } catch {
                self.error = error is CancellationError ? "Processing stopped. Saved progress is kept." : error.localizedDescription
                try? update(recording.id) { $0.status = "Processing incomplete — retry available" }
            }
            await transcriber.unload(); await summarizer.unload()
        }
    }

    func cancel() { work?.cancel(); progress = "Stopping after the current operation…" }
    func play(at time: Double = 0) {
        guard !recorder.isActive, let recording = selected, let store else { return }
        playback.play(recording, directory: store.folder(recording.id), at: time)
    }
    func export(_ format: String) {
        guard let recording = selected else { return }
        let panel = NSSavePanel()
        panel.nameFieldStringValue = recording.title.replacingOccurrences(of: "/", with: "-") + "." + format
        guard panel.runModal() == .OK, let url = panel.url else { return }
        let content = format == "srt" ? recording.subtitles : format == "txt" ? recording.transcript : "# \(recording.title)\n\n\(recording.notes)\n\n## Transcript\n\n\(recording.transcript)"
        do { try content.write(to: url, atomically: true, encoding: .utf8) } catch { self.error = error.localizedDescription }
    }
    func deleteSelected() {
        guard !busy, !recorder.isActive, let id = selectedID, let store else { return }
        playback.stop()
        do { try store.delete(id); recordings.removeAll { $0.id == id }; selectedID = recordings.first?.id }
        catch { self.error = error.localizedDescription }
    }
}
