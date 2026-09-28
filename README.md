# Capital I for Chrome

A tiny Chrome extension that fixes the one thing Chrome's built-in autocorrect won't: a lowercase **i** on its own. A lowercase "i" should never exist — this makes sure it's always **I**.

It works as you type, in any text box on any website: Gmail, chat apps, comment boxes, search fields, forms, and so on.

## What it does

| You type | You get |
|---|---|
| `i think` | `I think` |
| `i'm`, `i'll`, `i've`, `i'd` | `I'm`, `I'll`, `I've`, `I'd` |
| `so did i,` / `can i?` / `me and i!` | `so did I,` / `can I?` / `me and I!` |
| `i` + Enter | `I` |

It leaves these alone:

- **"i" inside words**: *hi*, *ski*, *this*
- **"i.e."**: the fix never triggers on a period
- **Code editors** (GitHub, CodeMirror, Monaco, Ace, `<pre>`/`<code>` blocks), so `for i in range` stays correct
- **Password, email and URL fields**, and any field where the site has turned spell check off

Corrections behave like normal typing, so **Ctrl+Z** undoes one if you ever need a real lowercase "i".

## Exclude a site

Click the **Capital I** icon in the Chrome toolbar:

- **Exclude this site** turns correction off for the current site immediately, with no reload.
- **Re-enable on this site** turns it back on.
- The popup lists every excluded site, each with a **Remove** button.

Exclusions sync across computers where you're signed into Chrome.

## Install

The extension isn't on the Chrome Web Store, so you load it directly:

1. Download this repo: **Code → Download ZIP**, then unzip it (or `git clone` it).
2. Open `chrome://extensions` in Chrome.
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked** and select the unzipped folder.
5. Click the puzzle-piece icon in the toolbar and pin **Capital I**.
6. Refresh any tabs that were already open.

It also works in Microsoft Edge and other Chromium browsers (use `edge://extensions`).

## Where it can't work

- **Chrome's address bar and `chrome://` pages**: Chrome doesn't allow extensions there.
- **Google Docs**: Docs doesn't use normal web text boxes, so extensions like this can't edit it as you type.
- **Apps outside the browser**, like Word or Outlook desktop.
- **Pasted text**: only text you type is corrected.

## Privacy

The extension needs permission to run on all websites so it can fix text wherever you type. It doesn't collect, store or send anything you type. The only thing it saves is your list of excluded sites, in Chrome's own sync storage. All of the code is in this repo and is short enough to read in a few minutes.

## Files

| File | Purpose |
|---|---|
| `manifest.json` | Extension configuration |
| `content.js` | Watches typing and capitalizes a standalone "i" |
| `popup.html` / `popup.js` | Toolbar popup for excluding sites |

## License

[MIT](LICENSE)
