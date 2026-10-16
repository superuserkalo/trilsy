import SwiftUI

struct ContentView: View {
    @ObservedObject var model: AppModel
    @AppStorage("appearance") private var appearance = "System"
    @State private var search = ""
    @State private var showingLibrary = true
    @State private var tab = "Notes"
    @State private var settings = false
    @State private var editingNotes = false
    @State private var instructions = false
    @State private var confirmDelete = false
    @State private var confirmReplace = false
    @State private var confirmContinue = false
    @State private var seeking = false
    @State private var seekPosition = 0.0

    private var filteredRecordings: [Recording] {
        model.recordings.filter {
            search.isEmpty || ($0.title + $0.transcript + $0.notes).localizedCaseInsensitiveContains(search)
        }
    }

    private var colorScheme: ColorScheme? {
        appearance == "Light" ? .light : appearance == "Dark" ? .dark : nil
    }

    private var sidebarRecordings: [Recording] {
        if !search.isEmpty { return Array(filteredRecordings.prefix(8)) }
        var recent = Array(model.recordings.prefix(8))
        if !showingLibrary, let selected = model.selected, !recent.contains(where: { $0.id == selected.id }) {
            if !recent.isEmpty { recent.removeLast() }
            recent.append(selected)
        }
        return recent
    }

    var body: some View {
        NavigationSplitView {
            sidebar.navigationSplitViewColumnWidth(min: 210, ideal: 224, max: 270)
        } detail: {
            VStack(spacing: 0) {
                if !showingLibrary, let recording = model.selected {
                    recordingDetail(recording)
                } else {
                    NotesLibrary(recordings: filteredRecordings, searching: !search.isEmpty,
                                 open: open, importMedia: model.importMedia,
                                 importDisabled: model.busy || model.recorder.isActive)
                }
                if model.busy && !model.recorder.isActive { processingBar }
            }
            .background(WorkspacePalette.canvas)
            .navigationTitle("Trilsy")
            .toolbar { recordingToolbar }
        }
        .preferredColorScheme(colorScheme)
        .onChange(of: search) { _, value in if !value.isEmpty { showLibrary() } }
        .onChange(of: model.selectedID) { _, newID in
            model.playback.stop()
            editingNotes = false
            instructions = false
            seeking = false
            seekPosition = 0
            if newID != nil { showingLibrary = false }
        }
        .alert("Trilsy", isPresented: Binding(get: { model.error != nil }, set: { if !$0 { model.error = nil } })) {
            Button("OK") { model.error = nil }
        } message: { Text(model.error ?? "") }
        .confirmationDialog("Permanently delete this recording, audio, and notes?", isPresented: $confirmDelete) {
            Button("Delete recording", role: .destructive) { model.deleteSelected() }
        }
        .confirmationDialog("Replace these notes with newly generated notes? Export first to keep your edits.", isPresented: $confirmReplace) {
            Button("Rewrite notes", role: .destructive) { model.process(notesOnly: true) }
        }
        .confirmationDialog("Continuing replaces these notes with newly generated notes. Export first to keep your edits.", isPresented: $confirmContinue) {
            Button("Continue processing", role: .destructive) { model.process() }
        }
        .sheet(isPresented: $settings) { settingsView }
    }

    private func showLibrary() {
        model.playback.stop()
        showingLibrary = true
        editingNotes = false
    }

    private func open(_ recording: Recording) {
        model.selectedID = recording.id
        showingLibrary = false
        editingNotes = false
        tab = "Notes"
    }

    private var sidebar: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack(spacing: 9) {
                Image(systemName: "waveform").font(.system(size: 19, weight: .medium)).foregroundStyle(WorkspacePalette.accent)
                Text("Trilsy").font(.system(size: 18, weight: .semibold))
                Spacer()
            }.padding(.horizontal, 18).padding(.top, 14).padding(.bottom, 24)

            Button { model.start() } label: {
                Label("New recording", systemImage: "plus").font(.system(size: 13, weight: .medium))
                    .frame(maxWidth: .infinity).padding(.vertical, 2)
            }
            .modifier(NativeActionStyle(prominent: true)).tint(WorkspacePalette.accent).controlSize(.large)
            .disabled(model.busy || model.recorder.isActive || (!model.micEnabled && !model.systemEnabled))
            .padding(.horizontal, 14).padding(.bottom, 16)

            HStack(spacing: 7) {
                Image(systemName: "magnifyingglass").font(.system(size: 12)).foregroundStyle(.secondary)
                TextField("Search notes", text: $search).textFieldStyle(.plain).font(.system(size: 12))
                    .accessibilityLabel("Search notes")
                if !search.isEmpty {
                    Button { search = "" } label: { Image(systemName: "xmark.circle.fill").foregroundStyle(.secondary) }
                        .buttonStyle(.plain).accessibilityLabel("Clear search")
                }
            }.padding(9).background(Color.primary.opacity(0.045), in: RoundedRectangle(cornerRadius: 7))
                .padding(.horizontal, 14).padding(.bottom, 18)

            SidebarItem(title: "All notes", icon: "square.stack", selected: showingLibrary,
                        count: model.recordings.count, action: showLibrary)
                .padding(.horizontal, 10)

            Text(search.isEmpty ? "Recent" : "Matches").font(.system(size: 11, weight: .medium)).foregroundStyle(.secondary)
                .padding(.horizontal, 20).padding(.top, 26).padding(.bottom, 9)
            ScrollViewReader { proxy in
                ScrollView {
                    LazyVStack(spacing: 2) {
                        ForEach(sidebarRecordings) { recording in
                            SidebarItem(title: recording.title, icon: recording.status == "Ready" ? "doc.text" : "waveform",
                                        selected: !showingLibrary && model.selectedID == recording.id) { open(recording) }
                                .id(recording.id)
                        }
                    }.padding(.horizontal, 10)
                }
                .onChange(of: showingLibrary) { _, library in
                    if !library, let id = model.selectedID { proxy.scrollTo(id, anchor: .center) }
                }
                .onChange(of: model.selectedID) { _, id in
                    if !showingLibrary, let id { proxy.scrollTo(id, anchor: .center) }
                }
            }
            Spacer(minLength: 16)
            SidebarItem(title: "Settings", icon: "gearshape") { settings = true }
                .keyboardShortcut(",").padding(.horizontal, 10)
            HStack(spacing: 6) {
                Image(systemName: "internaldrive").font(.system(size: 11))
                Text("Stored on this Mac").font(.system(size: 11))
            }.foregroundStyle(.secondary).padding(.horizontal, 20).padding(.top, 12).padding(.bottom, 20)
        }
        .background(WorkspacePalette.sidebar)
    }

    @ToolbarContentBuilder
    private var recordingToolbar: some ToolbarContent {
        if !showingLibrary {
            ToolbarItem(placement: .navigation) {
                Button("All notes", systemImage: "chevron.left", action: showLibrary)
                    .help("Back to all notes")
            }
        }
        ToolbarItemGroup(placement: .primaryAction) {
            if model.recorder.isActive {
                HStack(spacing: 7) {
                    Circle().fill(model.recorder.isPaused ? Color.secondary : .red).frame(width: 6, height: 6)
                    Text(model.recorder.isPaused ? "Paused" : "Recording").foregroundStyle(.secondary)
                    Text(timestamp(model.recorder.elapsed)).monospacedDigit()
                    ProgressView(value: Double(model.recorder.level), total: 1)
                        .frame(width: 40).accessibilityLabel("Microphone level")
                }.font(.system(size: 12))
                Button(model.recorder.isPaused ? "Resume" : "Pause", systemImage: model.recorder.isPaused ? "play.fill" : "pause.fill") {
                    model.pauseOrResume()
                }.disabled(model.busy)
                Button("Stop & save", systemImage: "stop.fill") { model.stop() }.disabled(model.busy)
            } else {
                Menu {
                    Toggle("Microphone", isOn: $model.micEnabled)
                    Toggle("App audio", isOn: $model.systemEnabled)
                    if model.systemEnabled {
                        Picker("Application", selection: $model.applicationID) {
                            Text("All apps").tag(nil as Int32?)
                            ForEach(model.recorder.applications, id: \.processID) { app in
                                Text(app.applicationName).tag(Optional(app.processID))
                            }
                        }
                        Button("Refresh apps", systemImage: "arrow.clockwise") { model.refreshApplications() }
                    }
                } label: { Label("Audio sources", systemImage: "slider.horizontal.3") }
                .help("Choose microphone and app audio").accessibilityLabel("Audio sources").disabled(model.busy)
            }
        }
    }

    private func recordingDetail(_ recording: Recording) -> some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                VStack(alignment: .leading, spacing: 14) {
                    TextField("Untitled recording", text: Binding(get: { model.selected?.title ?? "" }, set: { value in model.edit { $0.title = value } }), axis: .vertical)
                        .font(.system(size: 28, weight: .regular, design: .serif)).textFieldStyle(.plain)
                        .accessibilityLabel("Recording title")
                    HStack(spacing: 14) {
                        Label(recording.created.formatted(.dateTime.month(.abbreviated).day().hour().minute()), systemImage: "calendar")
                        Label(shortDuration(recording.duration), systemImage: "clock")
                        Spacer(minLength: 0)
                        if recording.status == "Ready" {
                            Label("Ready", systemImage: "checkmark.circle").foregroundStyle(WorkspacePalette.accent)
                        } else { Text(recording.status).lineLimit(1) }
                    }.font(.system(size: 11)).foregroundStyle(.secondary)
                }
                if !recording.parts.isEmpty && !model.recorder.isActive { audioPlayer(recording) }
                HStack(spacing: 22) {
                    documentTab("Notes")
                    documentTab("Transcript")
                    Spacer()
                    if tab == "Notes", !recording.notes.isEmpty {
                        Button(editingNotes ? "Done" : "Edit", systemImage: editingNotes ? "checkmark" : "pencil") { editingNotes.toggle() }
                            .buttonStyle(.borderless).font(.system(size: 12)).disabled(model.busy)
                    }
                    recordingMenu
                }
                .overlay(alignment: .bottom) { WorkspacePalette.border.frame(height: 1) }
                if tab == "Notes" {
                    if recording.notes.isEmpty {
                        emptyDocument(recording)
                    } else if editingNotes {
                        TextEditor(text: Binding(get: { model.selected?.notes ?? "" }, set: { value in model.edit { $0.notes = value } }))
                            .font(.system(size: 14)).lineSpacing(5).scrollContentBackground(.hidden)
                            .frame(minHeight: 420).disabled(model.busy).accessibilityLabel("Editable notes in Markdown")
                    } else {
                        NotesDocument(text: recording.notes)
                    }
                } else {
                    transcript(recording)
                }
                if !recording.notes.isEmpty && recording.status != "Ready", !model.busy, !model.recorder.isActive {
                    Button("Continue processing", systemImage: "arrow.clockwise") { confirmContinue = true }
                        .modifier(NativeActionStyle()).disabled(recording.parts.isEmpty)
                }
            }
            .frame(maxWidth: 680, alignment: .leading)
            .padding(.horizontal, 44).padding(.top, 38).padding(.bottom, 56)
            .frame(maxWidth: .infinity, alignment: .top)
        }.id(recording.id)
    }

    private func documentTab(_ title: String) -> some View {
        Button { tab = title } label: {
            Text(title).font(.system(size: 13, weight: tab == title ? .medium : .regular))
                .foregroundStyle(tab == title ? .primary : .secondary)
                .padding(.top, 2).padding(.bottom, 13)
                .overlay(alignment: .bottom) {
                    if tab == title { Color.primary.frame(height: 2).zIndex(1) }
                }
                .contentShape(Rectangle())
        }.buttonStyle(.plain).accessibilityAddTraits(tab == title ? .isSelected : [])
    }

    private var recordingMenu: some View {
        Menu {
            Button("Note instructions…", systemImage: "text.badge.plus") { instructions = true }
            if model.selected?.segments.isEmpty == false {
                Button("Rewrite notes", systemImage: "arrow.clockwise") { confirmReplace = true }
                    .disabled(model.busy || model.recorder.isActive)
            }
            Divider()
            Menu("Export", systemImage: "square.and.arrow.up") {
                Button("Markdown with transcript") { model.export("md") }
                Button("Plain text transcript") { model.export("txt") }
                Button("SRT subtitles") { model.export("srt") }
            }
            Divider()
            Button("Delete recording", systemImage: "trash", role: .destructive) { confirmDelete = true }
                .disabled(model.busy || model.recorder.isActive)
        } label: { Image(systemName: "ellipsis").frame(width: 28, height: 26) }
        .menuIndicator(.hidden).menuStyle(.borderlessButton).fixedSize().padding(.bottom, 10)
        .accessibilityLabel("Recording actions")
        .popover(isPresented: $instructions, arrowEdge: .bottom) { instructionsView }
    }

    private func audioPlayer(_ recording: Recording) -> some View {
        HStack(spacing: 12) {
            Button {
                if model.playback.playing { model.playback.stop() } else { model.play() }
            } label: {
                Image(systemName: model.playback.playing ? "stop.fill" : "play.fill").font(.system(size: 11))
                    .frame(width: 18, height: 22)
            }
            .modifier(NativeActionStyle()).controlSize(.small)
            .accessibilityLabel(model.playback.playing ? "Stop playback" : "Play recording")
            .disabled(model.recorder.isActive)
            Text(timestamp(min(model.playback.position, recording.duration))).font(.system(size: 10).monospacedDigit()).foregroundStyle(.secondary)
            Slider(value: Binding(get: { seeking ? seekPosition : min(model.playback.position, recording.duration) }, set: { value in
                seekPosition = value
                if !seeking { model.play(at: value) }
            }),
                   in: 0...max(recording.duration, 0.01), onEditingChanged: { editing in
                seeking = editing
                if !editing { model.play(at: seekPosition) }
            })
            .tint(WorkspacePalette.accent).controlSize(.mini).accessibilityLabel("Playback position")
            .disabled(model.recorder.isActive)
            Text(timestamp(recording.duration)).font(.system(size: 10).monospacedDigit()).foregroundStyle(.secondary)
        }
        .padding(.horizontal, 12).padding(.vertical, 8)
        .background(Color.primary.opacity(0.035), in: RoundedRectangle(cornerRadius: 9))
    }

    private func emptyDocument(_ recording: Recording) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(model.recorder.isActive ? "Recording in progress" : "Ready to make sense of it")
                .font(.system(size: 19, weight: .regular, design: .serif))
            Text(model.recorder.isActive ? "Your audio is being saved on this Mac. Stop recording when you're ready to create notes." : "Turn this recording into a transcript and detailed notes, processed on your Mac.")
                .font(.system(size: 14)).foregroundStyle(.secondary).lineSpacing(5)
            if !model.recorder.isActive {
                Button(recording.segments.isEmpty ? "Create notes" : "Continue processing", systemImage: "text.badge.checkmark") { model.process() }
                    .modifier(NativeActionStyle(prominent: true)).tint(WorkspacePalette.accent)
                    .disabled(model.busy || recording.parts.isEmpty).padding(.top, 6)
            }
        }.padding(.vertical, 24)
    }

    private func transcript(_ recording: Recording) -> some View {
        LazyVStack(alignment: .leading, spacing: 22) {
            if recording.segments.isEmpty {
                Text("The transcript will appear here after processing.").font(.system(size: 14)).foregroundStyle(.secondary)
                    .padding(.vertical, 24)
            }
            ForEach(recording.segments) { segment in
                VStack(alignment: .leading, spacing: 8) {
                    HStack(spacing: 8) {
                        Image(systemName: segment.source == "microphone" ? "mic" : "waveform")
                            .foregroundStyle(WorkspacePalette.accent)
                        Text(segment.source.capitalized).foregroundStyle(.secondary)
                        Button(timestamp(segment.start)) { model.play(at: segment.start) }
                            .buttonStyle(.borderless).monospacedDigit().disabled(model.recorder.isActive)
                    }.font(.system(size: 11, weight: .medium))
                    TextField("Transcript", text: Binding(get: { model.selected?.segments.first(where: { $0.id == segment.id })?.text ?? segment.text }, set: { value in
                        model.edit { recording in
                            if let index = recording.segments.firstIndex(where: { $0.id == segment.id }) { recording.segments[index].text = value }
                        }
                    }), axis: .vertical).textFieldStyle(.plain).font(.system(size: 14)).lineSpacing(5).disabled(model.busy)
                }
            }
            if !recording.segments.isEmpty {
                Text("Labels identify audio sources, not individual speakers.").font(.system(size: 11)).foregroundStyle(.secondary)
            }
        }
    }

    private var processingBar: some View {
        HStack(spacing: 10) {
            ProgressView().controlSize(.small)
            Text(model.progress.isEmpty ? "Saving…" : model.progress).font(.system(size: 12)).foregroundStyle(.secondary)
            Spacer()
            if !model.progress.isEmpty { Button("Cancel") { model.cancel() }.controlSize(.small) }
        }.padding(16).background(.bar)
    }
    private var instructionsView: some View {
        VStack(alignment: .leading, spacing: 14) {
            Text("Note instructions").font(.headline)
            Text("Guide the next set of notes. Your current notes stay as they are until you rewrite them.")
                .font(.callout).foregroundStyle(.secondary)
            TextField("Include examples and open questions…", text: Binding(get: { model.selected?.instructions ?? "" }, set: { value in model.edit { $0.instructions = value } }), axis: .vertical)
                .textFieldStyle(.roundedBorder).lineLimit(3...6).disabled(model.busy)
            HStack { Spacer(); Button("Done") { instructions = false }.keyboardShortcut(.defaultAction) }
        }.padding(20).frame(width: 340)
    }

    private var settingsView: some View {
        VStack(spacing: 0) {
            HStack {
                Text("Settings").font(.title2.weight(.semibold))
                Spacer()
                Button("Done") { settings = false }.keyboardShortcut(.defaultAction)
                    .modifier(NativeActionStyle(prominent: true))
            }.padding(24)
            Form {
                Section("Appearance") {
                    Picker("Theme", selection: $appearance) {
                        Text("System").tag("System")
                        Text("Light").tag("Light")
                        Text("Dark").tag("Dark")
                    }.pickerStyle(.segmented)
                }
                Section {
                    LabeledContent("Microphone", value: "System default")
                    Text("Application audio needs Screen & System Audio Recording permission. Use headphones when recording both sources to avoid echo.")
                        .font(.callout).foregroundStyle(.secondary)
                } header: { Text("Recording") }
                Section {
                    Toggle("Allow model downloads", isOn: $model.modelDownloadConsent)
                    Text("First use downloads several GB from Hugging Face. Once cached, the speech and notes models run on this Mac. Trilsy never uploads your recordings.")
                        .font(.callout).foregroundStyle(.secondary)
                } header: { Text("Local processing") }
                Section {
                    TextField("Language code", text: $model.language, prompt: Text("Auto-detect"))
                    Text("Use a language code such as en or de, or leave blank to detect it.")
                        .font(.caption).foregroundStyle(.secondary)
                    TextField("Names & vocabulary", text: $model.vocabulary, prompt: Text("People, products, specialist terms"))
                } header: { Text("Transcription") }
                Section {
                    Text("Record with permission. AI notes can be wrong. Use the transcript timestamps to check important details.")
                        .font(.caption).foregroundStyle(.secondary)
                }
            }.formStyle(.grouped)
        }.frame(width: 540, height: 650)
    }
}
/// Use the system's glass artwork, with native controls on older supported Macs.
struct NativeActionStyle: ViewModifier {
    var prominent = false

    @ViewBuilder func body(content: Content) -> some View {
        // The glass styles exist only in the macOS 26 SDK (Xcode 26, Swift 6.2), so older toolchains compile the fallback alone.
        #if compiler(>=6.2)
        if #available(macOS 26.0, *) {
            if prominent { content.buttonStyle(.glassProminent) }
            else { content.buttonStyle(.glass) }
        } else {
            fallback(content)
        }
        #else
        fallback(content)
        #endif
    }

    @ViewBuilder private func fallback(_ content: Content) -> some View {
        if prominent { content.buttonStyle(.borderedProminent) }
        else { content.buttonStyle(.bordered) }
    }
}
