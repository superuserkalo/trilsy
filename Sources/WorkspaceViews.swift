import SwiftUI

// Product register, Utilitarian Minimal. Dials: variance 4, motion 2, density 6.
// Granola's desktop library informs the compact sidebar and date-grouped notes:
// https://docs.granola.ai/help-center/getting-started/granola-101
// Otter's document hierarchy informs the compact metadata, tabs, and reading measure:
// https://mobbin.com/screens/125553b3-4114-4f24-8294-394c3f45f488
// Wispr's notepad presentation informs the restrained paper and ink palette:
// https://wisprflow.ai/notetaker
// Native materials are reserved for controls. Content follows the app's appearance.
enum WorkspacePalette {
    static let canvas = adaptive(light: 0xFAFAF7, dark: 0x20221F)
    static let sidebar = adaptive(light: 0xF0F1EC, dark: 0x282B26)
    static let selection = adaptive(light: 0xE1E7D8, dark: 0x3B4334)
    static let accent = adaptive(light: 0x4D633B, dark: 0xB5CA99)
    static let iconFill = adaptive(light: 0xEAEEE3, dark: 0x343C2E)
    static let border = adaptive(light: 0xE2E5DC, dark: 0x3B3F37)

    private static func adaptive(light: UInt32, dark: UInt32) -> Color {
        Color(nsColor: NSColor(name: nil) { appearance in
            let value = appearance.bestMatch(from: [.darkAqua, .aqua]) == .darkAqua ? dark : light
            return NSColor(srgbRed: Double((value >> 16) & 255) / 255,
                           green: Double((value >> 8) & 255) / 255,
                           blue: Double(value & 255) / 255, alpha: 1)
        })
    }
}

struct SidebarItem: View {
    let title: String
    let icon: String
    var selected = false
    var subtitle: String? = nil
    var count: Int? = nil
    let action: () -> Void
    @State private var hovered = false

    var body: some View {
        Button(action: action) {
            HStack(spacing: 10) {
                Image(systemName: icon).font(.system(size: 14)).foregroundStyle(selected ? WorkspacePalette.accent : .secondary)
                    .frame(width: 18)
                VStack(alignment: .leading, spacing: 3) {
                    Text(title).font(.system(size: 13, weight: selected ? .medium : .regular)).lineLimit(1)
                    if let subtitle { Text(subtitle).font(.system(size: 11)).foregroundStyle(.secondary).lineLimit(1) }
                }
                Spacer(minLength: 0)
                if let count { Text("\(count)").font(.system(size: 11)).foregroundStyle(.secondary) }
            }
            .padding(.horizontal, 10).padding(.vertical, subtitle == nil ? 9 : 8)
            .contentShape(Rectangle())
            .background(selected ? WorkspacePalette.selection : hovered ? Color.primary.opacity(0.045) : .clear,
                        in: RoundedRectangle(cornerRadius: 7))
        }
        .buttonStyle(.plain).onHover { hovered = $0 }
        .accessibilityAddTraits(selected ? .isSelected : [])
    }
}

struct NotesLibrary: View {
    let recordings: [Recording]
    let searching: Bool
    let open: (Recording) -> Void
    let importMedia: () -> Void
    let importDisabled: Bool

    private var days: [Date] {
        Set(recordings.map { Calendar.current.startOfDay(for: $0.created) }).sorted(by: >)
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 30) {
                HStack(alignment: .top) {
                    VStack(alignment: .leading, spacing: 8) {
                        Text(searching ? "Search results" : "All notes")
                            .font(.system(size: 30, weight: .regular, design: .serif))
                        Text(searching ? (recordings.count == 1 ? "1 matching note" : "\(recordings.count) matching notes") : "Your conversations, all in one place.")
                            .font(.system(size: 13)).foregroundStyle(.secondary)
                    }
                    Spacer()
                    Button("Import file", systemImage: "square.and.arrow.down", action: importMedia)
                        .modifier(NativeActionStyle()).controlSize(.regular).disabled(importDisabled)
                }
                if recordings.isEmpty {
                    VStack(alignment: .leading, spacing: 10) {
                        Image(systemName: searching ? "magnifyingglass" : "text.page")
                            .font(.system(size: 26, weight: .light)).foregroundStyle(WorkspacePalette.accent)
                            .padding(.bottom, 8)
                        Text(searching ? "No notes found" : "A place for your next conversation")
                            .font(.system(size: 20, weight: .medium, design: .serif))
                        Text(searching ? "Try another title or a word from the transcript." : "Start a new recording or import an audio file. Your notes will appear here.")
                            .font(.system(size: 14)).foregroundStyle(.secondary).lineSpacing(4)
                    }.padding(.vertical, 40)
                } else {
                    VStack(alignment: .leading, spacing: 26) {
                        ForEach(days, id: \.self) { day in
                            VStack(alignment: .leading, spacing: 8) {
                                Text(dayLabel(day)).font(.system(size: 12, weight: .medium)).foregroundStyle(.secondary)
                                    .padding(.leading, 10)
                                ForEach(recordings.filter { Calendar.current.isDate($0.created, inSameDayAs: day) }) { recording in
                                    LibraryNoteRow(recording: recording) { open(recording) }
                                }
                            }
                        }
                    }
                }
            }
            .frame(maxWidth: 740, alignment: .leading)
            .padding(.horizontal, 44).padding(.top, 38).padding(.bottom, 50)
            .frame(maxWidth: .infinity, alignment: .top)
        }
    }

    private func dayLabel(_ date: Date) -> String {
        if Calendar.current.isDateInToday(date) { return "Today" }
        if Calendar.current.isDateInYesterday(date) { return "Yesterday" }
        return date.formatted(.dateTime.weekday(.wide).month(.wide).day())
    }
}

private struct LibraryNoteRow: View {
    let recording: Recording
    let action: () -> Void
    @State private var hovered = false

    private var preview: String {
        for line in recording.notes.components(separatedBy: .newlines) {
            let value = line.trimmingCharacters(in: .whitespaces)
            guard !value.isEmpty, !value.hasPrefix("#"), !value.hasPrefix("|"), value != "---" else { continue }
            let parsed = try? AttributedString(markdown: value, options: .init(interpretedSyntax: .inlineOnlyPreservingWhitespace))
            let plain = parsed.map { String($0.characters) } ?? value
            if plain.count < 80 && plain.hasSuffix(":") { continue }
            return String(plain.prefix(240))
        }
        return recording.segments.first?.text ?? (recording.parts.isEmpty ? "No audio saved" : recording.status)
    }

    var body: some View {
        Button(action: action) {
            HStack(spacing: 14) {
                Image(systemName: recording.status == "Ready" ? "doc.text" : "waveform")
                    .font(.system(size: 17, weight: .regular)).foregroundStyle(WorkspacePalette.accent)
                    .frame(width: 38, height: 42)
                    .background(WorkspacePalette.iconFill, in: RoundedRectangle(cornerRadius: 7))
                VStack(alignment: .leading, spacing: 6) {
                    Text(recording.title).font(.system(size: 14, weight: .medium)).lineLimit(1)
                    Text(preview).font(.system(size: 12)).foregroundStyle(.secondary).lineLimit(1)
                }
                Spacer(minLength: 12)
                VStack(alignment: .trailing, spacing: 6) {
                    Text(recording.created, format: .dateTime.hour().minute())
                        .font(.system(size: 12)).foregroundStyle(.secondary)
                    Text(shortDuration(recording.duration))
                        .font(.system(size: 11)).foregroundStyle(.secondary).lineLimit(1)
                }
                Image(systemName: "chevron.right").font(.system(size: 10, weight: .medium))
                    .foregroundStyle(.tertiary).padding(.leading, 4)
            }
            .padding(10).contentShape(Rectangle())
            .background(hovered ? Color.primary.opacity(0.035) : .clear, in: RoundedRectangle(cornerRadius: 9))
        }
        .buttonStyle(.plain).onHover { hovered = $0 }
        .accessibilityElement(children: .combine)
    }
}

func shortDuration(_ seconds: Double) -> String {
    let value = max(0, Int(seconds.isFinite ? seconds : 0))
    return value < 60 ? "\(value) sec" : "\(value / 60) min"
}
