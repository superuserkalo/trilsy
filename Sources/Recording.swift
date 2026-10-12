import Foundation

struct AudioPart: Codable, Identifiable, Equatable {
    var id: String { file }
    var file: String
    var start: Double
    var duration: Double
    var source: String
}

struct Segment: Codable, Identifiable, Equatable {
    var id = UUID()
    var start: Double
    var end: Double
    var text: String
    var source: String
    var partID: String
}

struct Recording: Codable, Identifiable, Equatable {
    var id = UUID()
    var schemaVersion = 1
    var title: String
    var created = Date()
    var parts: [AudioPart] = []
    var segments: [Segment] = []
    var transcribedParts: [String] = []
    var notes = ""
    var instructions = ""
    var status = "Recorded"
    var duration: Double { parts.map { $0.start + $0.duration }.max() ?? 0 }
    var transcript: String {
        segments.sorted { $0.start < $1.start }.map {
            "[\(timestamp($0.start))] [\($0.source)] \($0.text)"
        }.joined(separator: "\n")
    }
}

func timestamp(_ seconds: Double) -> String {
    let value = max(0, Int(seconds.isFinite ? seconds : 0))
    return String(format: "%02d:%02d:%02d", value / 3600, value / 60 % 60, value % 60)
}

func subtitleTime(_ seconds: Double) -> String {
    let milliseconds = max(0, Int((seconds * 1000).rounded()))
    return timestamp(Double(milliseconds / 1000)) + String(format: ",%03d", milliseconds % 1000)
}

extension Recording {
    var subtitles: String {
        segments.sorted { $0.start < $1.start }.enumerated().map { index, segment in
            "\(index + 1)\n\(subtitleTime(segment.start)) --> \(subtitleTime(segment.end))\n\(segment.text)\n"
        }.joined(separator: "\n")
    }
}

/// Character-bounded inputs keep long recordings out of a single prompt.
/// Source timestamps survive each stage. This is a conservative bound, not token counting.
func noteChunks(_ text: String, limit: Int = 6000) -> [String] {
    guard !text.isEmpty, limit > 0 else { return [] }
    var chunks: [String] = []
    var current = ""
    for line in text.components(separatedBy: "\n") {
        var remaining = line
        while remaining.count > limit {
            if !current.isEmpty { chunks.append(current); current = "" }
            chunks.append(String(remaining.prefix(limit)))
            remaining = String(remaining.dropFirst(limit))
        }
        if current.count + remaining.count + 1 > limit {
            chunks.append(current)
            current = ""
        }
        current += (current.isEmpty ? "" : "\n") + remaining
    }
    if !current.isEmpty { chunks.append(current) }
    return chunks
}
