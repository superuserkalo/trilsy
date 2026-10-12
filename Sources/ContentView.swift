import SwiftUI

struct ContentView: View {
    @ObservedObject var model: AppModel
    @State private var search = ""
    @State private var tab = "Notes"
    @State private var settings = false
    @State private var confirmDelete = false
    @State private var confirmReplace = false

    var body: some View {
        NavigationSplitView {
            VStack(alignment: .leading, spacing: 16) {
                Label("Trilsy", systemImage: "waveform").font(.title2.bold()).padding(.top)
                TextField("Search your recordings", text: $search).textFieldStyle(.roundedBorder)
                List(selection: $model.selectedID) {
                    ForEach(model.recordings.filter { search.isEmpty || ($0.title + $0.transcript + $0.notes).localizedCaseInsensitiveContains(search) }) { recording in
                        VStack(alignment: .leading, spacing: 5) {
                            Text(recording.title).lineLimit(2)
                            Text(recording.created, style: .date).font(.caption).foregroundStyle(.secondary)
                            Text(recording.status).font(.caption2).foregroundStyle(.secondary)
                        }.padding(.vertical, 5).tag(recording.id)
                    }
                }.listStyle(.sidebar)
                Button("Import audio or video…", systemImage: "square.and.arrow.down") { model.importMedia() }
                    .disabled(model.busy || model.recorder.isActive)
                Button("Settings", systemImage: "gearshape") { settings = true }
            }.padding().navigationSplitViewColumnWidth(min: 220, ideal: 250)
        } detail: {
            VStack(spacing: 0) {
                captureControls.padding(20).background(.bar)
                Divider()
                if let recording = model.selected {
                    VStack(alignment: .leading, spacing: 16) {
                        TextField("Title", text: Binding(get: { model.selected?.title ?? "" }, set: { value in model.edit { $0.title = value } }))
                            .font(.title.bold()).textFieldStyle(.plain)
                        HStack {
                            Text("\(timestamp(recording.duration)) · \(recording.status)").font(.caption).foregroundStyle(.secondary)
                            Spacer()
                            Button(model.playback.playing ? "Stop playback" : "Play", systemImage: model.playback.playing ? "stop.fill" : "play.fill") {
                                if model.playback.playing { model.playback.stop() } else { model.play() }
                            }.disabled(recording.parts.isEmpty || model.recorder.isActive)
                            Menu("Export") {
                                Button("Markdown with transcript") { model.export("md") }
                                Button("Plain text transcript") { model.export("txt") }
                                Button("SRT subtitles") { model.export("srt") }
                            }
                            Button("Delete", systemImage: "trash", role: .destructive) { confirmDelete = true }
                                .labelStyle(.iconOnly).disabled(model.busy || model.recorder.isActive)
                        }
                        if model.playback.playing { Text("Playing \(timestamp(model.playback.position))").monospacedDigit().font(.caption) }
                        Picker("View", selection: $tab) { Text("Notes").tag("Notes"); Text("Transcript").tag("Transcript") }.pickerStyle(.segmented)
                        if tab == "Notes" {
                            TextField("Optional instructions, e.g. include examples and open questions", text: Binding(get: { model.selected?.instructions ?? "" }, set: { value in model.edit { $0.instructions = value } }))
                                .textFieldStyle(.roundedBorder).disabled(model.busy)
                            if recording.notes.isEmpty {
                                ContentUnavailableView("The conversation, made useful", systemImage: "text.alignleft", description: Text("Stop recording, then generate a transcript and detailed notes. Processing happens on this Mac."))
                            } else {
                                TextEditor(text: Binding(get: { model.selected?.notes ?? "" }, set: { value in model.edit { $0.notes = value } }))
                                    .font(.body).disabled(model.busy).accessibilityLabel("Editable notes in Markdown")
                            }
                        } else {
                            ScrollView {
                                LazyVStack(alignment: .leading, spacing: 14) {
                                    ForEach(recording.segments) { segment in
                                        HStack(alignment: .top) {
                                            Button(timestamp(segment.start)) { model.play(at: segment.start) }.font(.caption.monospacedDigit())
                                                .disabled(model.recorder.isActive)
                                            VStack(alignment: .leading) {
                                                Text(segment.source.capitalized).font(.caption).foregroundStyle(.secondary)
                                                TextField("Transcript", text: Binding(get: { model.selected?.segments.first(where: { $0.id == segment.id })?.text ?? segment.text }, set: { value in
                                                    model.edit { recording in if let index = recording.segments.firstIndex(where: { $0.id == segment.id }) { recording.segments[index].text = value } }
                                                }), axis: .vertical).textFieldStyle(.plain).disabled(model.busy)
                                            }
                                        }
                                    }
                                }.padding(.vertical)
                            }
                            Text("Labels identify audio sources, not individual speakers.").font(.caption).foregroundStyle(.secondary)
                        }
                        HStack {
                            if model.busy {
                                ProgressView().controlSize(.small)
                                Text(model.progress.isEmpty ? "Saving…" : model.progress).font(.caption)
                                if !model.progress.isEmpty { Button("Cancel") { model.cancel() } }
                            } else {
                                Button(recording.segments.isEmpty ? "Transcribe & create notes" : "Continue processing") { model.process() }
                                    .buttonStyle(.borderedProminent).disabled(model.recorder.isActive || recording.parts.isEmpty)
                                if !recording.segments.isEmpty {
                                    Button("Rewrite notes") { confirmReplace = true }.disabled(model.recorder.isActive)
                                }
                            }
                        }
                    }.padding(24)
                } else {
                    ContentUnavailableView("Be here. Keep the details.", systemImage: "waveform", description: Text("Record a conversation or import a file. Your audio, transcript, and notes stay on this Mac."))
                }
            }
        }
        .onChange(of: model.selectedID) { _, _ in model.playback.stop() }
        .alert("Trilsy", isPresented: Binding(get: { model.error != nil }, set: { if !$0 { model.error = nil } })) {
            Button("OK") { model.error = nil }
        } message: { Text(model.error ?? "") }
        .confirmationDialog("Permanently delete this recording, audio, and notes?", isPresented: $confirmDelete) {
            Button("Delete recording", role: .destructive) { model.deleteSelected() }
        }
        .confirmationDialog("Replace these notes with newly generated notes? Export first to keep your edits.", isPresented: $confirmReplace) {
            Button("Rewrite notes", role: .destructive) { model.process(notesOnly: true) }
        }
        .sheet(isPresented: $settings) { settingsView }
    }

    private var captureControls: some View {
        HStack(spacing: 16) {
            if model.recorder.isActive {
                Image(systemName: "record.circle.fill").foregroundStyle(.red)
                Text(timestamp(model.recorder.elapsed)).font(.title3.monospacedDigit())
                Text(model.recorder.isPaused ? "Paused" : "Recording").foregroundStyle(.secondary)
                ProgressView(value: Double(model.recorder.level), total: 1).frame(width: 65).accessibilityLabel("Microphone level")
                Spacer()
                Button(model.recorder.isPaused ? "Resume" : "Pause") { model.pauseOrResume() }.disabled(model.busy)
                Button("Stop & save", systemImage: "stop.fill") { model.stop() }.disabled(model.busy)
            } else {
                Toggle("Microphone", isOn: $model.micEnabled)
                Toggle("App audio", isOn: $model.systemEnabled)
                if model.systemEnabled {
                    Picker("App", selection: $model.applicationID) {
                        Text("All apps").tag(nil as Int32?)
                        ForEach(model.recorder.applications, id: \.processID) { app in Text(app.applicationName).tag(Optional(app.processID)) }
                    }.frame(maxWidth: 160)
                    Button("Refresh apps", systemImage: "arrow.clockwise") { model.refreshApplications() }.labelStyle(.iconOnly)
                }
                Spacer()
                Button("Record", systemImage: "record.circle") { model.start() }
                    .buttonStyle(.borderedProminent).disabled(model.busy || (!model.micEnabled && !model.systemEnabled))
            }
        }.disabled(model.busy && !model.recorder.isActive)
    }

    private var settingsView: some View {
        VStack(alignment: .leading, spacing: 20) {
            Text("A little setup. All yours.").font(.title2.bold())
            Text("Trilsy uses your default microphone. Application audio requires macOS Screen & System Audio Recording permission. Use headphones when capturing both sources to avoid echo.")
            Toggle("Allow speech and notes model downloads", isOn: $model.modelDownloadConsent)
            Text("First use downloads several GB from Hugging Face. After models are cached, audio and notes are processed locally. Recordings are never uploaded by Trilsy.").font(.callout).foregroundStyle(.secondary)
            TextField("Language code (blank = detect, e.g. en, de)", text: $model.language)
            TextField("Names and specialist vocabulary", text: $model.vocabulary)
            Text("Record only with the appropriate permission. AI notes can be wrong; use timestamps to verify important details.").font(.caption).foregroundStyle(.secondary)
            HStack { Spacer(); Button("Done") { settings = false }.keyboardShortcut(.defaultAction) }
        }.padding(28).frame(width: 520)
    }
}
