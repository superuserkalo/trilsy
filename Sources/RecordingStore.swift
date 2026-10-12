import Foundation
import AVFoundation

struct RecordingStore {
    let root: URL

    init(root: URL? = nil) throws {
        self.root = try root ?? FileManager.default.url(
            for: .applicationSupportDirectory, in: .userDomainMask,
            appropriateFor: nil, create: true
        ).appendingPathComponent("Trilsy/Recordings", isDirectory: true)
        try FileManager.default.createDirectory(at: self.root, withIntermediateDirectories: true)
    }

    func folder(_ id: UUID) -> URL { root.appendingPathComponent(id.uuidString, isDirectory: true) }

    func save(_ recording: Recording) throws {
        let directory = folder(recording.id)
        try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
        let encoder = JSONEncoder()
        encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
        try encoder.encode(recording).write(to: directory.appendingPathComponent("recording.json"), options: .atomic)
    }

    /// Recover unfinished audio from self-describing chunk filenames, including chunks
    /// whose final callback was never saved. Corrupt manifests remain untouched.
    func load() throws -> (recordings: [Recording], warnings: [String]) {
        var recordings: [Recording] = []
        var warnings: [String] = []
        let directories = try FileManager.default.contentsOfDirectory(at: root, includingPropertiesForKeys: nil)
        for directory in directories where UUID(uuidString: directory.lastPathComponent) != nil {
            do {
                var recording = try JSONDecoder().decode(Recording.self, from: Data(contentsOf: directory.appendingPathComponent("recording.json")))
                guard recording.schemaVersion == 1 else {
                    warnings.append("Unsupported recording format: \(directory.lastPathComponent)")
                    continue
                }
                let files = try FileManager.default.contentsOfDirectory(at: directory, includingPropertiesForKeys: nil)
                for file in files where file.pathExtension == "caf" && !recording.parts.contains(where: { $0.file == file.lastPathComponent }) {
                    let fields = file.deletingPathExtension().lastPathComponent.split(separator: "_")
                    guard fields.count >= 3, let milliseconds = Double(fields[1]) else { continue }
                    do {
                        let audio = try AVAudioFile(forReading: file)
                        let duration = Double(audio.length) / audio.processingFormat.sampleRate
                        if duration > 0 {
                            recording.parts.append(AudioPart(file: file.lastPathComponent, start: milliseconds / 1000, duration: duration, source: String(fields[0])))
                        }
                    } catch {
                        warnings.append("Could not recover audio \(file.lastPathComponent): \(error.localizedDescription)")
                    }
                }
                if ["Recording", "Paused", "Transcribing", "Summarizing", "Importing"].contains(recording.status) {
                    recording.status = "Interrupted — ready to resume processing"
                }
                recording.parts.sort { $0.start < $1.start }
                try save(recording)
                recordings.append(recording)
            } catch {
                warnings.append("Could not load \(directory.lastPathComponent): \(error.localizedDescription)")
            }
        }
        return (recordings.sorted { $0.created > $1.created }, warnings)
    }

    func delete(_ id: UUID) throws { try FileManager.default.removeItem(at: folder(id)) }
}
