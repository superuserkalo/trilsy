import XCTest
import AVFoundation
@testable import Trilsy

final class RecordingTests: XCTestCase {
    func testLongNotesKeepEveryCharacterAndBoundPrompts() {
        let text = String(repeating: "é", count: 13001)
        let chunks = noteChunks(text)
        XCTAssertEqual(chunks.joined(), text)
        XCTAssertTrue(chunks.allSatisfy { $0.count <= 6000 })
        XCTAssertEqual(noteChunks(""), [])
    }
    func testTranscriptAndSubtitlesAreChronological() {
        var recording = Recording(title: "Example")
        recording.segments = [
            Segment(start: 63.2, end: 65, text: "Second", source: "system", partID: "b"),
            Segment(start: 1, end: 2, text: "First", source: "microphone", partID: "a")
        ]
        XCTAssertTrue(recording.transcript.hasPrefix("[00:00:01] [microphone] First"))
        XCTAssertTrue(recording.subtitles.contains("00:01:03,200 --> 00:01:05,000"))
        XCTAssertTrue(recording.subtitles.hasPrefix("1\n00:00:01,000"))
    }
    func testRecoveryFindsFlushedAudioWithoutManifestEntry() throws {
        let root = FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString)
        defer { try? FileManager.default.removeItem(at: root) }
        let store = try RecordingStore(root: root)
        var recording = Recording(title: "Interrupted")
        recording.status = "Recording"
        try store.save(recording)
        let format = try XCTUnwrap(AVAudioFormat(standardFormatWithSampleRate: 16000, channels: 1))
        let buffer = try XCTUnwrap(AVAudioPCMBuffer(pcmFormat: format, frameCapacity: 16000))
        buffer.frameLength = 16000
        buffer.floatChannelData![0].initialize(repeating: 0, count: 16000)
        let url = store.folder(recording.id).appendingPathComponent("microphone_2500_\(UUID().uuidString).caf")
        var file: AVAudioFile? = try AVAudioFile(forWriting: url, settings: format.settings)
        try file?.write(from: buffer)
        file = nil
        let result = try store.load()
        XCTAssertEqual(result.recordings.count, 1)
        XCTAssertEqual(result.recordings[0].parts.count, 1)
        XCTAssertEqual(result.recordings[0].parts[0].start, 2.5)
        XCTAssertEqual(result.recordings[0].parts[0].duration, 1, accuracy: 0.01)
        XCTAssertTrue(result.recordings[0].status.hasPrefix("Interrupted"))
        XCTAssertEqual(try store.load().recordings[0].parts.count, 1)
    }
    func testCorruptAudioDoesNotHideRecording() throws {
        let root = FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString)
        defer { try? FileManager.default.removeItem(at: root) }
        let store = try RecordingStore(root: root)
        let recording = Recording(title: "Recoverable")
        try store.save(recording)
        let url = store.folder(recording.id).appendingPathComponent("microphone_0_broken.caf")
        try Data("broken".utf8).write(to: url)
        let result = try store.load()
        XCTAssertEqual(result.recordings.map(\.id), [recording.id])
        XCTAssertEqual(result.warnings.count, 1)
        XCTAssertEqual(try Data(contentsOf: url), Data("broken".utf8))
    }
    func testCorruptManifestIsNotOverwritten() throws {
        let root = FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString)
        defer { try? FileManager.default.removeItem(at: root) }
        let store = try RecordingStore(root: root)
        let recording = Recording(title: "Bad metadata")
        try store.save(recording)
        let url = store.folder(recording.id).appendingPathComponent("recording.json")
        try Data("broken".utf8).write(to: url)
        let result = try store.load()
        XCTAssertTrue(result.recordings.isEmpty)
        XCTAssertEqual(result.warnings.count, 1)
        XCTAssertEqual(try String(contentsOf: url, encoding: .utf8), "broken")
    }
}
