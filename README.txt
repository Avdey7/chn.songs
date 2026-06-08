# New Hope Band Songbook (PWA)

A worship songbook with chords and live key transposition. Runs on iOS + Android
+ desktop from one web link. Installs to the home screen. Works offline.

Author: Avdey Axonov
License: MIT (free to use/modify/share) — see the LICENSE file.

## Files
- index.html ............ the app (markup + styles)
- app.js ................ app logic (rename the app at the top: APP_NAME)
- songs.js .............. >>> THIS is the file you edit to add/remove songs <<<
- vendor/chordsheetjs.min.js  transposition engine (don't edit)
- manifest.json, service-worker.js, icons/  PWA plumbing

## Run it locally to preview
You can't just double-click index.html (service workers need http). From this folder:
    python3 -m http.server 8080
then open http://localhost:8080 in a browser.

## Deploy (pick one, all free)
- Netlify Drop: go to https://app.netlify.com/drop and drag this whole folder in.
  You get a public https link in seconds. Easiest option.
- Cloudflare Pages / Vercel / GitHub Pages also work — just upload these files.

## Add songs — EASIEST: use the converter (admin tool)
Open converter.html in a browser (locally or on your deployed site). Paste a
normal "chords above lyrics" sheet, set the Title + Original key, then click
"Copy as songs.js block". Paste that into the SONGS array in songs.js. Done.
  - It auto-detects chord lines, lyric lines and section headers
    (VERSE / CHORUS / Приспів / Куплет …) and turns headers into {comment: ...}
    labels — those become the tappable section chips in the app.
  - Tick "Slavic notation" for sheets that write H for B.
  - Bilingual: convert each language, then combine into a "versions" object
    (see the sample at the bottom of songs.js).

## Add songs — by hand
Open songs.js, copy one block, edit the text. Chords go in [brackets] right
before the syllable. Save, re-upload/redeploy.

## Formatting is automatic (you don't have to do it per song)
Just type the section name on its own line — Intro, Verse 1, Pre-Chorus,
Chorus, Bridge, Tag, Outro, Solo (English/Ukrainian/Russian all recognised).
The app turns it into a uniform section label and automatically emphasises
choruses (tinted block). So every song lays out the same way without manual
markup. If you prefer to be explicit, {comment: ...} and {start_of_chorus} /
{end_of_chorus} still work and are left exactly as you wrote them. You can also
edit the ChordPro directly in the right-hand box of converter.html.

## IMPORTANT after any edit
Bump CACHE_VERSION in service-worker.js (e.g. "songbook-v1" -> "songbook-v2")
or phones may keep showing the old cached version.

## Swap the icon / app name
- App name: APP_NAME at the top of app.js, plus "name"/"short_name" in manifest.json.
- Icon: replace the PNGs in icons/ (keep the same filenames and sizes).

## Two-language songs (e.g. Ukrainian + English)
See the bilingual example at the bottom of songs.js. A song can be an object
with a "versions" array; the app shows a tab per language. Each language keeps
its own key and its own transpose. To instead show both languages at once
(line under line), just write one ChordPro block with alternating lines.
