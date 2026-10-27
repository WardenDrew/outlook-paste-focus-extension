(() => {
  "use strict";

  // Firefox's native clipboard prompt lives outside the page DOM. Prevent the
  // redundant read that opens it instead of trying to focus behind the prompt.
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1815733#c13
  const clipboard = navigator.clipboard;
  if (typeof clipboard?.read !== "function") return;

  const originalRead = clipboard.read;
  const SUPPRESS_MS = 1000;
  const EDITOR_SELECTOR = [
    '[contenteditable="true"][role="textbox"]',
    '[contenteditable="true"][aria-multiline="true"]',
    '[contenteditable="true"][aria-label="Message body" i]',
  ].join(",");

  let editor = null;
  let expiresAt = 0;
  let expiryTimer;

  function stopSuppressing() {
    clearTimeout(expiryTimer);
    editor = null;
    expiresAt = 0;
  }

  function startSuppressing(target) {
    stopSuppressing();
    if (!(target instanceof Element)) return;
    if (target.closest("[contenteditable]")?.getAttribute("contenteditable") === "false") return;
    editor = target.closest(EDITOR_SELECTOR);
    if (!editor) return;
    expiresAt = Date.now() + SUPPRESS_MS;
    expiryTimer = setTimeout(stopSuppressing, SUPPRESS_MS);
  }

  Object.defineProperty(clipboard, "read", {
    configurable: true,
    writable: true,
    value: function read(...args) {
      if (this === clipboard && editor?.isConnected &&
          editor.matches(EDITOR_SELECTOR) && Date.now() < expiresAt && !document.hidden) {
        // Mozilla's Outlook intervention also no-ops read(). Return the API's
        // empty-array shape; native paste still supplies the actual content.
        // Do not read, cache, replace, or insert any clipboard data ourselves.
        return Promise.resolve([]);
      }
      return Reflect.apply(originalRead, this, args);
    },
  });

  // Window capture runs before Outlook's document/element handlers. Cover a
  // read on Ctrl/Cmd+V keydown as well as a read during the paste event itself.
  window.addEventListener("keydown", (event) => {
    const pasteShortcut = !event.altKey && (
      ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "v") ||
      (event.shiftKey && !event.ctrlKey && !event.metaKey && event.key === "Insert")
    );
    if (pasteShortcut) startSuppressing(event.target);
    else stopSuppressing();
  }, true);
  window.addEventListener("paste", (event) => startSuppressing(event.target), true);

  // Explicit use of Outlook's menus must be allowed to read the clipboard.
  window.addEventListener("pointerdown", stopSuppressing, true);
  window.addEventListener("contextmenu", stopSuppressing, true);
  window.addEventListener("blur", stopSuppressing);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopSuppressing();
  });
})();
