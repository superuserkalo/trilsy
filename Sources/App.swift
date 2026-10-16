import SwiftUI
import AppKit

@main
struct TrilsyApp: App {
    @NSApplicationDelegateAdaptor(AppDelegate.self) private var delegate
    @StateObject private var model = AppModel()

    var body: some Scene {
        WindowGroup {
            ContentView(model: model)
                .frame(minWidth: 880, minHeight: 600)
                .onAppear { delegate.model = model }
        }
        .defaultSize(width: 1080, height: 760)
        .windowToolbarStyle(.unifiedCompact(showsTitle: false))
        .commands {
            CommandGroup(replacing: .newItem) {
                Button("New Recording") { model.start() }
                    .keyboardShortcut("n")
                    .disabled(model.busy || model.recorder.isActive)
                Button("Import Audio or Video…") { model.importMedia() }
                    .keyboardShortcut("o")
                    .disabled(model.busy || model.recorder.isActive)
            }
        }
        MenuBarExtra("Trilsy", systemImage: model.recorder.isActive ? "record.circle.fill" : "bird") {
            Button("Open Trilsy") { NSApp.activate(ignoringOtherApps: true) }
            if model.recorder.isActive {
                Button("Stop Recording") { model.stop() }
            } else {
                Button("New Recording") { model.start() }.disabled(model.busy)
            }
            Divider()
            Button("Quit Trilsy") { NSApp.terminate(nil) }
        }
    }
}

@MainActor
final class AppDelegate: NSObject, NSApplicationDelegate {
    weak var model: AppModel?
    func applicationShouldTerminate(_ sender: NSApplication) -> NSApplication.TerminateReply {
        guard let model, model.recorder.isActive || model.busy else { return .terminateNow }
        let alert = NSAlert()
        alert.messageText = "Recording or processing is still running"
        alert.informativeText = "Stop recording and wait for saving, or cancel processing before quitting."
        alert.addButton(withTitle: "Keep Trilsy Open")
        alert.runModal()
        return .terminateCancel
    }
}
