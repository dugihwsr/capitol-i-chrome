// Capitalizes a standalone "i" as you type, in any text box on any site.
// "i " -> "I ", "i'm" -> "I'm", "i," -> "I,", "i?" -> "I?", and "i" + Enter -> "I".
// Deliberately ignores "." so "i.e." is left alone.
//
// The fix runs on keydown, *before* the space/punctuation is inserted: it selects the
// "i" and replaces it via execCommand("insertText"), which keeps Ctrl+Z working and
// lets sites built on React etc. see the change like normal typing.

(() => {
  // Keys that end the word "i" and trigger the fix.
  const TRIGGER = /^[\s,!?;:)\]}"'’”]$/;
  // A lone "i" at the end of the text: start of text, or preceded by whitespace/opening punctuation.
  const LONE_I = /(^|[\s(\[{"'‘“])i$/;

  // Never touch code editors or fields that opt out of spellcheck.
  const SKIP_SELECTOR = [
    ".cm-editor", ".CodeMirror", ".monaco-editor", ".ace_editor",
    "pre", "code", '[spellcheck="false"]',
  ].join(",");

  // Sites excluded via the toolbar popup. Check the top-level site so embedded
  // editors (iframes) on an excluded site are skipped too.
  const origins = location.ancestorOrigins;
  const siteHost = origins && origins.length
    ? new URL(origins[origins.length - 1]).hostname
    : location.hostname;

  let excluded = false;
  chrome.storage.sync.get({ excludedSites: [] }, ({ excludedSites }) => {
    excluded = excludedSites.includes(siteHost);
  });
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.excludedSites) {
      excluded = (changes.excludedSites.newValue || []).includes(siteHost);
    }
  });

  const TEXT_INPUT_TYPES = new Set(["text", "search", ""]);

  function isPlainField(el) {
    return (
      el.tagName === "TEXTAREA" ||
      (el.tagName === "INPUT" && TEXT_INPUT_TYPES.has(el.getAttribute("type") || ""))
    );
  }

  function fixPlainField(el) {
    const pos = el.selectionStart;
    if (pos == null || pos !== el.selectionEnd || pos === 0) return;
    if (!LONE_I.test(el.value.slice(0, pos))) return;
    el.setSelectionRange(pos - 1, pos);
    if (!document.execCommand("insertText", false, "I")) {
      el.setRangeText("I", pos - 1, pos, "end");
      el.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }

  function fixContentEditable() {
    const sel = window.getSelection();
    if (!sel || !sel.isCollapsed) return;
    const node = sel.anchorNode;
    const offset = sel.anchorOffset;
    if (!node || node.nodeType !== Node.TEXT_NODE || offset === 0) return;
    if (!LONE_I.test(node.data.slice(0, offset))) return;

    const range = document.createRange();
    range.setStart(node, offset - 1);
    range.setEnd(node, offset);
    sel.removeAllRanges();
    sel.addRange(range);
    if (!document.execCommand("insertText", false, "I")) {
      node.replaceData(offset - 1, 1, "I");
      sel.collapse(node, offset);
    }
  }

  document.addEventListener(
    "keydown",
    (e) => {
      if (excluded || e.ctrlKey || e.metaKey || e.altKey || e.isComposing) return;
      if (e.key !== "Enter" && !TRIGGER.test(e.key)) return;

      const el = e.composedPath()[0];
      if (!(el instanceof Element) || el.closest(SKIP_SELECTOR)) return;

      if (isPlainField(el)) {
        fixPlainField(el);
      } else if (el.isContentEditable) {
        fixContentEditable();
      }
    },
    true
  );
})();
