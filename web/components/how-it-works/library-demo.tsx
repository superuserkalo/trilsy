import { AppBody, RecordingHeader, RecordingMenu, SidebarRow } from "@/components/use-cases/app-chrome";
import { MockWindow, ViewControl } from "./mock";

const results = ["Design review", "Onboarding interviews, round 2"] as const;

/**
 * Block 5: the search field filtering the recording list (the sidebar says
 * "Matches"), and the "…" menu of the open recording with its Export entries.
 * The menu's labels are the app's. The right pane keeps the height of the open
 * menu, so it is not cut off in the window.
 */
export function LibraryDemo() {
  return (
    <MockWindow
      title="Trilsy"
      role="img"
      aria-label="The recording list filtered by the search word permissions, and the menu of the open recording with Export opened: Markdown with transcript, Plain text transcript and SRT subtitles."
    >
      <div aria-hidden>
        <AppBody
          search="permissions"
          label="Matches"
          allSelected={false}
          collapse={false}
          list={results.map((title, i) => (
            <li key={title}>
              <SidebarRow title={title} selected={i === 0} />
            </li>
          ))}
        >
          <div className="flex min-h-[316px] flex-col gap-4 px-4 py-4">
            <RecordingHeader title="Design review" date="15 Oct, 10:30" length="24 min" status="Ready" />
            <ViewControl active="Notes" menu={<RecordingMenu open highlight="export" exportOpen />} />
          </div>
        </AppBody>
      </div>
    </MockWindow>
  );
}
