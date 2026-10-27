<img src="extension/icons/icon-128.png" alt="Clipboard and typing caret" width="80" height="80">

# Outlook Paste Focus

[![Get the Firefox add-on](https://img.shields.io/badge/Firefox-Get_the_add--on-FF7139?logo=firefoxbrowser&logoColor=white)](https://addons.mozilla.org/en-US/firefox/addon/outlook-paste-focus/)

**Paste into Outlook. Keep typing.**

A lightweight Firefox extension that prevents the extra browser **Paste** prompt in Outlook on the web, while keeping Microsoft's **Paste options (Ctrl)** control available.

When Outlook triggers Firefox's clipboard confirmation after content is already pasted, typing can stop until you press Escape or click back into the message. This extension prevents the redundant request that causes that interruption.

- Works automatically in the message editor.
- Runs only on `outlook.cloud.microsoft` and `outlook.office.com`.
- Supports Ctrl/Cmd+V, Shift+Insert, and native paste events.
- No clipboard reading, data collection, network requests, or background service.
- No dependencies or build step required to use the extension.

Firefox 140+ on desktop is required. This is an independent community extension, not affiliated with or endorsed by Microsoft or Mozilla.

## Load locally

In Firefox 140+, open `about:debugging#/runtime/this-firefox`, select **Load Temporary Add-on**, and choose `extension/manifest.json`. Temporary add-ons are removed when Firefox restarts; permanent distribution requires Mozilla signing.

Reload Outlook after loading or updating the extension. If Firefox asks for permission to run on the Outlook site, grant it there.

See Mozilla's [temporary installation documentation](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/).

## How it works

Outlook sometimes calls `navigator.clipboard.read()` even though the paste event already supplied the content. Firefox can respond by opening a native confirmation that blocks typing. Mozilla documented this in [bug 1815733](https://bugzilla.mozilla.org/show_bug.cgi?id=1815733#c13) and implemented an [Outlook workaround](https://bugzilla.mozilla.org/show_bug.cgi?id=1815733#c23). As of Firefox 157, the bug still occurs despite Mozilla's workaround.

This extension wraps the page's `clipboard.read()` method and returns an empty list of clipboard items for up to one second around a paste in the message editor. A pointer interaction, another keypress, opening a context menu, leaving the window, or hiding the document ends that interval early. Other calls pass through to Firefox. Native paste handles the actual content, and `readText()` is unchanged.

The script runs in the page's MAIN world so Outlook calls the wrapped method. It does not read or cache clipboard data, insert text, send Escape, change browser preferences, or dismiss Microsoft's paste-options control.

## Package for Firefox Add-ons

From the repository root, with Node.js and the `zip` command installed:

```sh
node scripts/package.mjs
```

This creates `dist/outlook-paste-focus-0.1.0.zip` with `manifest.json` at the archive root. Upload it to the [Add-ons Developer Hub](https://addons.mozilla.org/developers/addon/submit/distribution) for review and signing. The ZIP is not a signed add-on.

[Store listing and reviewer notes](docs/firefox-addons-listing.md) include ready-to-copy descriptions, release notes, repository details, and submission steps.

### GitHub Actions

Pull requests run the **Package build** check to ensure the extension packages successfully.

To create a release package, publish a GitHub release with the same name and tag in `vN.N.N` format, for example `v1.2.3`. The release workflow sets the packaged manifest version to `1.2.3` and attaches `outlook-paste-focus-1.2.3.zip` to the release for upload to the Add-ons Developer Hub. The source manifest does not need a version bump. Release names and tags must match; leading zeroes and prerelease suffixes are rejected.

To build the same versioned package locally:

```sh
node scripts/package.mjs v1.2.3
```

## Icon

The original clipboard-and-caret icon is provided as an editable [SVG](extension/icons/icon.svg) and PNG exports at 16, 32, 48, 64, 96, 128, and 512 pixels. Use [icon-128.png](extension/icons/icon-128.png) for the store listing. The manifest declares the browser icon sizes.

## Privacy and permissions

The extension requests access only to the two Outlook domains above. It needs that site access to observe paste events and apply the workaround to Outlook's clipboard calls. It requests no clipboard-read, storage, or browsing-history permissions.

No personal data is collected, stored, or transmitted. See the [privacy policy](PRIVACY.md).

## Testing

Test manually in Outlook: paste text, formatted content, or an image into a new message, then type immediately. Firefox's extra **Paste** prompt should stay hidden, and Microsoft's **Paste options (Ctrl)** control should still work.

## Support and contributions

Report issues using this repository's Issues page. Include your Firefox version, operating system, Outlook domain, paste shortcut, source application, and steps to reproduce using sample content. Small, focused contributions are welcome.

## License

[MIT](LICENSE). Copyright 2026 Andrew Haskell. The license covers the code, documentation, and original icon assets.
