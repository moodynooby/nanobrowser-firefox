// The side panel belongs to the tab. The manifest sets no default path, so a tab has no panel until the user opens it
// there. `chrome.sidePanel.open` is accepted only inside the user's gesture, so it is called synchronously in the
// handler, before any await.
export const PANEL_PATH = 'sidepanel.html';
const TEST_PANEL_PATH = 'testpanel.html';

/** Enables the panel on a tab with a path, and opens it. Must be called synchronously in a user gesture. */
export function openPanel(tabId: number, path: string = PANEL_PATH): void {
  if (chrome.sidePanel) {
    void chrome.sidePanel.setOptions({ tabId, path, enabled: true });
    chrome.sidePanel.open({ tabId }).catch(error => console.warn('[panel] open failed', error));
  } else if (
    (
      chrome as unknown as {
        sidebarAction?: { setPanel: (opts: { panel: string }) => Promise<void>; open: () => Promise<void> };
      }
    ).sidebarAction
  ) {
    const sidebar = (
      chrome as unknown as {
        sidebarAction?: { setPanel: (opts: { panel: string }) => Promise<void>; open: () => Promise<void> };
      }
    ).sidebarAction;
    void sidebar?.setPanel({ panel: path });
    void sidebar?.open();
  }
}

chrome.sidePanel?.setPanelBehavior?.({ openPanelOnActionClick: false })?.catch?.(() => undefined);

chrome.action?.onClicked?.addListener(tab => {
  if (tab.id !== undefined) openPanel(tab.id);
});

(
  chrome as unknown as { browserAction?: { onClicked: { addListener: (cb: (tab: chrome.tabs.Tab) => void) => void } } }
).browserAction?.onClicked?.addListener(tab => {
  if (tab.id !== undefined) openPanel(tab.id);
});

chrome.commands?.onCommand?.addListener((command, tab) => {
  if (tab?.id === undefined) return;
  if (command === 'open-panel') openPanel(tab.id);
  // The layer's test panel is a developer tool; it has no button.
  if (command === 'open-test-panel') openPanel(tab.id, TEST_PANEL_PATH);
});
