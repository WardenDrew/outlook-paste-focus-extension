# Firefox Add-ons listing

Copy the relevant fields into the [Add-ons Developer Hub](https://addons.mozilla.org/developers/addon/submit/distribution). Suggested URLs and tags are subject to availability.

## Name

Outlook Paste Focus

## Suggested slug

`outlook-paste-focus`

## Summary

Keep typing after pasting in Outlook on the web. Prevent Firefox's extra Paste prompt while keeping Microsoft's paste options available. No data collection.

## Description

Paste into your Outlook email and keep typing.

In Firefox, Outlook on the web can trigger an extra browser "Paste" confirmation after your content is already pasted. That prompt can interrupt typing until you press Escape or click back into the message.

Outlook Paste Focus prevents the redundant clipboard request that opens that extra prompt. Microsoft's "Paste options (Ctrl)" control stays available, so you can still choose how your pasted content is formatted.

- Works automatically when you paste into a message body.
- Supports Ctrl+V, Cmd+V, Shift+Insert, and native paste events.
- Runs only on outlook.cloud.microsoft and outlook.office.com.
- No setup, account, subscription, or payment required for the extension. An Outlook account is needed to use Outlook.
- No clipboard reading, data collection, analytics, or background service.

The workaround applies briefly around each paste. Deliberate menu interactions end that interval, and normal clipboard handling continues outside it.

Requires Firefox 140 or later. This is an independent community extension, not affiliated with or endorsed by Microsoft or Mozilla.

## Category and tags

- Category: Other (productivity utility).
- Suggested tags: outlook, paste, clipboard, productivity, email.
- Default language: English (US).
- Platforms: Firefox desktop on Windows, macOS, and Linux. Firefox for Android is not declared or verified.
- License: MIT.
- Data collection: None; the manifest declares `required: ["none"]`.

## Icon

Use `extension/icons/icon-128.png` for the store listing. PNG exports at 32 and 64 pixels are also included if the submission interface requests those sizes. The editable original is `extension/icons/icon.svg`.

## Version notes: 0.1.0

Initial release. Prevents Firefox's redundant clipboard confirmation when pasting into Outlook on the web while keeping Microsoft's paste-options control available. Includes no analytics or data collection.

## Privacy policy

Paste the text from `PRIVACY.md` into the privacy-policy field. Once the public repository exists, you can also link directly to that document.

## Homepage and support

- Homepage: the public repository URL.
- Support website: the repository's Issues URL.
- Support email: optional; supply an address only if you want it published.

## Reviewer notes

This extension is a small, readable content script with no build step, minification, external dependencies, remote code, or background process. The uploaded ZIP contains the source as executed by Firefox.

It runs at document_start in the MAIN world on exactly https://outlook.cloud.microsoft/* and https://outlook.office.com/*, including matching frames. MAIN world is necessary to wrap the navigator.clipboard.read method that Outlook's own page code calls; an isolated content script cannot replace that page method.

On a paste shortcut or paste event in a contenteditable message editor, the wrapper returns Promise.resolve([]) for up to one second. This prevents a redundant browser clipboard confirmation. A pointer interaction, context menu, another keypress, window blur, or hidden document ends the interval. Outside the interval, calls delegate to the original method with the original receiver and arguments. The extension does not read clipboard data, modify readText, insert text, suppress paste events, close Microsoft's paste-options control, or change Firefox preferences.

The approach is based on the behavior documented in Mozilla bug 1815733, with suppression restricted to a paste interval rather than every clipboard read on the site: https://bugzilla.mozilla.org/show_bug.cgi?id=1815733#c13 and https://bugzilla.mozilla.org/show_bug.cgi?id=1815733#c23.

To reproduce: sign into Outlook on one of the supported domains in Firefox, compose a message, copy text from another application or site, paste into the message body, and type immediately. With the extension enabled, the extra Firefox Paste confirmation should not interrupt typing. Microsoft's Paste options control should remain available. An Outlook account is required; no extension-specific credentials are needed.

Known limitation: another legitimate programmatic clipboard.read call during the same interval also receives an empty list. The workaround does not change readText and cannot address future changes to Outlook's API calls or timing without an update.

## Upload

1. From the repository root, run `node scripts/package.mjs` (Node.js and the `zip` command are required).
2. Upload `dist/outlook-paste-focus-0.1.0.zip` and choose distribution on addons.mozilla.org.
3. Copy the listing fields, add the icon, and provide the privacy policy and license.
4. If adding screenshots, use a real Outlook message containing sample text. A useful caption is: "Paste into Outlook and keep typing, with Microsoft's paste options still available." Screenshots are not supplied in this repository.
5. Submit for Mozilla review and signing. The generated ZIP is an unsigned submission package.

See Mozilla's [submission guide](https://extensionworkshop.com/documentation/publish/submitting-an-add-on/), [listing guide](https://extensionworkshop.com/documentation/develop/create-an-appealing-listing/), and [icon documentation](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/icons).

# Public repository details

## Suggested repository name

`outlook-paste-focus-extension`

## Repository description

Lightweight Firefox extension that prevents Outlook's redundant Paste prompt while keeping Microsoft's paste options available. No data collection.

## Suggested topics

`firefox-extension`, `webextension`, `outlook`, `clipboard`, `productivity`, `javascript`

## Repository setup

Publish the source files, icons, documentation, and MIT license. Keep `dist/` out of Git; attach the upload ZIP to the 0.1.0 release if desired. Enable Issues for support. After Mozilla publishes the extension, add the actual store URL to the README and repository About section.
