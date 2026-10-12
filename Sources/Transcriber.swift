import Foundation
@preconcurrency import WhisperKit

actor Transcriber {
    private var engine: WhisperKit?

    func prepare() async throws {
        if engine == nil {
            engine = try await WhisperKit(WhisperKitConfig(model: "openai_whisper-small", verbose: false))
        }
    }

    func transcribe(part: AudioPart, directory: URL, language: String, vocabulary: String) async throws -> [Segment] {
        try Task.checkCancellation()
        try await prepare()
        guard let engine else { throw TrilsyError.message("Speech model did not load.") }
        let tokens = vocabulary.isEmpty ? nil : engine.tokenizer?.encode(text: String(vocabulary.prefix(1000)))
        let options = DecodingOptions(language: language.isEmpty ? nil : language,
                                      detectLanguage: language.isEmpty,
                                      skipSpecialTokens: true, wordTimestamps: true,
                                      promptTokens: tokens.map { Array($0.suffix(200)) })
        let results = try await engine.transcribe(audioPath: directory.appendingPathComponent(part.file).path, decodeOptions: options)
        try Task.checkCancellation()
        return results.flatMap(\.segments).compactMap { segment in
            let text = segment.text.trimmingCharacters(in: .whitespacesAndNewlines)
            guard !text.isEmpty, segment.noSpeechProb < 0.8 else { return nil }
            let start = min(part.duration, max(0, Double(segment.start)))
            let end = min(part.duration, max(start, Double(segment.end)))
            return Segment(start: part.start + start, end: part.start + end,
                           text: text, source: part.source, partID: part.id)
        }
    }

    func unload() { engine = nil }
}
