import SwiftUI

/// A native reading view for the Markdown saved by the notes model.
/// Editing and export continue to use the original, unmodified text.
struct NotesDocument: View {
    let text: String

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            ForEach(Array(blocks.enumerated()), id: \.offset) { _, block in
                switch block {
                case let .heading(title, level):
                    inline(title)
                        .font(.system(size: level == 1 ? 22 : level == 2 ? 18 : 15, weight: .semibold))
                        .padding(.top, level < 3 ? 8 : 2)
                case let .paragraph(value):
                    inline(value).font(.system(size: 14)).lineSpacing(5)
                case let .bullet(value, marker):
                    HStack(alignment: .firstTextBaseline, spacing: 12) {
                        Text(marker).foregroundStyle(.secondary).frame(minWidth: 12, alignment: .trailing)
                        inline(value).frame(maxWidth: .infinity, alignment: .leading)
                    }.font(.system(size: 14)).lineSpacing(5)
                case .divider:
                    Divider().padding(.vertical, 6)
                case let .table(rows):
                    table(rows)
                }
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .textSelection(.enabled)
    }

    private func inline(_ value: String) -> Text {
        let markdown = try? AttributedString(markdown: value, options: .init(interpretedSyntax: .inlineOnlyPreservingWhitespace))
        return Text(markdown ?? AttributedString(value))
    }

    private func table(_ rows: [[String]]) -> some View {
        Grid(alignment: .topLeading, horizontalSpacing: 20, verticalSpacing: 14) {
            ForEach(Array(rows.enumerated()), id: \.offset) { rowIndex, row in
                GridRow {
                    ForEach(Array(row.enumerated()), id: \.offset) { _, cell in
                        inline(cell)
                            .font(.system(size: 13, weight: rowIndex == 0 ? .semibold : .regular))
                            .foregroundStyle(.primary)
                            .lineSpacing(4)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .fixedSize(horizontal: false, vertical: true)
                    }
                }
                if rowIndex == 0 { Divider().gridCellColumns(rows.map(\.count).max() ?? 1) }
            }
        }
        .padding(.vertical, 8).frame(maxWidth: .infinity, alignment: .leading)
    }

    private enum Block {
        case heading(String, Int)
        case paragraph(String)
        case bullet(String, String)
        case divider
        case table([[String]])
    }

    private var blocks: [Block] {
        let lines = text.components(separatedBy: .newlines)
        var result: [Block] = []
        var paragraph: [String] = []
        var index = 0
        func flush() {
            if !paragraph.isEmpty {
                result.append(.paragraph(paragraph.joined(separator: "\n")))
                paragraph.removeAll()
            }
        }
        while index < lines.count {
            let line = lines[index].trimmingCharacters(in: .whitespaces)
            if line.isEmpty {
                flush()
            } else if line.hasPrefix("|"), index + 1 < lines.count, isTableSeparator(lines[index + 1]) {
                flush()
                var rows = [tableCells(line)]
                index += 2
                while index < lines.count, lines[index].trimmingCharacters(in: .whitespaces).hasPrefix("|") {
                    rows.append(tableCells(lines[index]))
                    index += 1
                }
                result.append(.table(rows))
                continue
            } else if ["---", "***", "___"].contains(line) {
                flush()
                result.append(.divider)
            } else if line.hasPrefix("#") {
                let level = line.prefix(while: { $0 == "#" }).count
                if level <= 6, line.dropFirst(level).hasPrefix(" ") {
                    flush()
                    result.append(.heading(String(line.dropFirst(level + 1)), level))
                } else { paragraph.append(line) }
            } else if line.hasPrefix("- ") || line.hasPrefix("* ") {
                flush()
                let value = String(line.dropFirst(2))
                if value.hasPrefix("[ ] ") { result.append(.bullet(String(value.dropFirst(4)), "☐")) }
                else if value.hasPrefix("[x] ") || value.hasPrefix("[X] ") { result.append(.bullet(String(value.dropFirst(4)), "☑")) }
                else { result.append(.bullet(value, "•")) }
            } else if let dot = line.firstIndex(of: "."), !line[..<dot].isEmpty,
                      line[..<dot].allSatisfy(\.isNumber), line[dot...].hasPrefix(". ") {
                flush()
                result.append(.bullet(String(line[line.index(dot, offsetBy: 2)...]), String(line[...dot])))
            } else {
                paragraph.append(line)
            }
            index += 1
        }
        flush()
        return result
    }

    private func tableCells(_ line: String) -> [String] {
        var cells = line.trimmingCharacters(in: .whitespaces).components(separatedBy: "|")
        if cells.first?.isEmpty == true { cells.removeFirst() }
        if cells.last?.isEmpty == true { cells.removeLast() }
        return cells.map { $0.trimmingCharacters(in: .whitespaces) }
    }

    private func isTableSeparator(_ line: String) -> Bool {
        let cells = tableCells(line)
        return !cells.isEmpty && cells.allSatisfy { cell in
            cell.filter { $0 == "-" }.count >= 3 && cell.allSatisfy { $0 == "-" || $0 == ":" || $0.isWhitespace }
        }
    }
}
