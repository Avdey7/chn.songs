# New Hope Band — Songbook PWA (project context for Claude)

A worship songbook PWA for a church team. Static site, no build step. Author: Avdey Axonov. MIT licensed.

## Hosting / deploy
- **GitHub Pages**, auto-deploys from branch **`claude/kind-mendel-wSAqa`** (develop & push here).
- After ANY change: bump `CACHE_VERSION` in `service-worker.js` AND the build stamp `#ver` in `index.html` (footer, "build N"). The footer build number is how the user verifies the live version (GitHub Pages CDN + service worker can serve stale files ~10 min).
- Commit + push every change to the branch. Validate JS with `node --check app.js`.
- **Update this CLAUDE.md with every change**: keep the docs above accurate AND add a line to the Changelog at the bottom (build N — what/why). It's the project's history + knowledge base.

## Files
- `index.html` — all markup + CSS (single `<style>`). Views: list (#list-view) and song (#song-view); overlays: #editor, #login, #share; floating controls bubble #fab-wrap.
- `app.js` — all logic, one big IIFE. No framework. `$ = getElementById`.
- `convert-core.js` — "chords above lyrics" → ChordPro converter (used by app + converter.html).
- `songs.js` — `window.SONGS` array; now only an **offline seed/fallback**. Source of truth is Supabase.
- `service-worker.js` — network-first for app shell (cache:'no-store'), cache-first for vendor/icons/songs.js (songs.js is just the offline seed; a version bump re-precaches it).
- `converter.html` — standalone admin tool (paste sheet → ChordPro block, incl. bilingual).
- `migrate.sql` — recreates the Supabase `songs` table + loads songs.js. Plus run these ALTERs:
  `alter table public.songs add column if not exists num serial;`
  `alter table public.songs add column if not exists tags text;`
  `alter table public.songs add column if not exists prev jsonb;`
- `chord-diagrams.js` — offline guitar chord diagrams: `window.ChordDiagram.svg("Am7")` → SVG string or null (open shapes preferred, movable barre fallback from the root; unknown qualities → null and the popover shows just the name).
- `icons/`, `manifest.json`, `vendor/chordsheetjs.min.js`.

## Supabase (global catalog)
- URL + **anon key** are embedded in `app.js` (anon is public/safe; writes need login + RLS).
- Table `songs(id uuid, num serial, title text, data jsonb, src text, tags text, prev jsonb, created_at)`.
  - `data` = a SONGS entry: a ChordPro **string** (single language) or `{title, versions:[{lang,text}]}` (bilingual).
  - `src` = JSON of the editor's friendly inputs (for round-trip editing).
  - `prev` = the data before the last save (Restore previous).
  - song uid in-app = `"g:" + num`.
- RLS: public read; insert/update/delete require an authenticated user. Sign-ups disabled; admins added in dashboard.
- Auth: email/password via `/auth/v1/token`; **remember-me** stores refresh token, auto-refresh (`ensureAuth`).
- Fetch is resilient: selects fall back if `prev`/`tags` columns are missing (`hasPrevCol` gates writing `prev`).
- `refreshGlobal()` loads + caches to localStorage `globalsongs`; `build()` uses cache (else songs.js) + device `usersongs`.

## Formatting rules (in `standardize()` / `app.js`)
- Section labels auto-detected (any language) → English `{comment:}` (Verse/Chorus/Bridge/Intro/Half-Chorus…). `[VERSE]` bracket labels too.
- Chord-only lines auto-bracketed; bar lines `|` and beat dots stripped from them.
- Parenthesised chords `(Fm)` supported (transposed post-render since ChordSheetJS can't parse them).
- Impossible enharmonics fixed (Cb→B, Fb→E, B#→C, E#→F).
- Bilingual: English version shown first.
- `chordproToSheet()` reverses ChordPro → friendly sheet for editing old songs.

## Design system (UI)
- **Font:** `Inter` for all UI + body (covers Latin **and** Cyrillic so English/Ukrainian match); `JetBrains Mono` for chords/keys/badges. (Replaced Hanken Grotesk, which lacked Cyrillic.)
- **Themes:** light = warm paper/ivory; dark = cool near-black. Indigo (light) / periwinkle (dark) accent. Single **flat** `--bg` color (no gradient — it used to read as bands). `theme-color` meta updated in `applyTheme()`.
- **Duotone accent:** `--accent-grad` (indigo→violet) on the FAB, progress bar, and active All/Set + language tabs.
- **Glassmorphism:** `--glass-bg`/`--glass-border`/`--glass-blur` tokens (frosted translucent + blur) on the header, FAB control panel, phone bottom-nav, and modal backdrops.
- **Flat/borderless list:** rows are one continuous column with hairline dividers (no per-row cards). No index numbers.
- **Pills:** search, icon buttons, control/row/editor buttons are fully rounded; circular buttons center their glyphs (`grid` + `line-height:0`).
- **Stage mode:** forces a true-black OLED palette regardless of theme (`html.stage` var overrides).
- `scrollbar-gutter: stable` on `<html>` so the centered layout never shifts when the list grows tall enough to scroll.
- Editor bottom-sheet height is capped with `dvh` minus `safe-area-inset-top` so Save/Close clear the iPhone notch.

## Layout / navigation
- **Phone (≤640px):** All/Set tabs dock as a fixed bottom-nav bar (moved OUT of `<header>` because the header's `backdrop-filter` traps `position:fixed`). **Swipe left/right on the list** switches All↔Set (animated slide); tap also works.
- **Search:** always-visible custom clear (×) button (`#search-clear`), toggled in JS on input.
- **Set reorder:** drag the grip handle (mouse), OR **press-and-hold anywhere on a row** (touch). Hold-drag floats a *clone* while the real row stays in the DOM as a hidden traveling gap (avoids iOS `touchcancel`); rows are `user-select:none`.

## Features
search; tag chips + filter; favorites (local, row star + ★ filter); named sets (per service) with share link+QR + import; swipe between songs; swipe between All/Set tabs (menu); transpose + admin "save key"; size +/−/reset + pinch; autoscroll; chords on/off; stage mode (OLED); PDF print (2-col, no headers); in-app add/edit/delete (global, bilingual); restore previous version; always-visible add-to-set + favorite in the song header; back-to-top; remembers open song + tab on refresh; editor closes on back gesture; **chord popover**: tap any chord → guitar diagram (follows transpose); pencil edit for admins (global songs; local songs need no login) — the edit is untransposed before saving so the stored ChordPro stays in the original key, `prev` is kept for restore.

### Chord popover internals (app.js)
- `renderSheet()` stamps `data-ci` (running index) on non-empty `.chord` spans; the same enumeration order over `v.parsed`'s non-empty `ChordLyricsPair`s locates the tapped chord (verified 1:1 incl. paren chords; empty pairs are skipped on both sides).
- `saveChordEdit()` mutates `pair.chords`, reformats with `ChordProFormatter` (standardized output, same precedent as bakeTranspose), matches the bilingual `data.versions` entry by text→lang→index (display order is English-first-sorted), writes `{data, src:null, prev}` via `sbWrite`, reverts the in-memory chord on failure.
- ChordSheetJS normalizes some names on render (`Gsus4` shows as `Gsus`); the stored text keeps what the user typed.

## localStorage keys
sets, activeSet, globalsongs, usersongs, favs, opensong, listmode, size, scrollspeed, theme, chords, sb_token/sb_exp/sb_email/sb_refresh.

## Conventions
- Keep it simple, mobile-first, offline-friendly, free. Save tokens: small focused edits.
- Bump build stamp + SW version on every change; commit + push to the claude branch.
- Update the Changelog below (and any stale docs above) with every change.

## Changelog
- **build 35** (2026-07-06) — Chord popover: tap a chord in the song view → glass card with the chord name + guitar diagram (new `chord-diagrams.js`, offline, theme-aware via currentColor); admins (or local songs) get a pencil to edit the chord in place — saved to Supabase with `prev` backup, correctly untransposed when the view is transposed. Popover anchors near the tapped chord, clamped to the viewport; backdrop tap / Escape closes. Verified with Playwright: diagram render, edit persistence, transposed-edit math (D→stored C at +2).
- **build 34** (2026-07-06) — Perf + deploy visibility: `songs.js` served cache-first by the SW (saves ~135 KB per online load; it's only the offline seed, a `CACHE_VERSION` bump re-precaches it); `preconnect` to Supabase in `<head>` (faster first catalog fetch); "App updated — tap to reload" glass toast shown on SW `controllerchange` (skipped on first visit, auto-hides in 15 s, sits above the phone bottom-nav, z-index 70). Toast CSS lives at the end of the `<style>` block; logic in the inline SW-registration script at the end of `<body>`.
- **builds ≤33** — see git history (`git log --oneline`): flat/borderless list, glassmorphism chrome, bottom-nav All/Set tabs with swipe, press-and-hold set reorder, stage mode, bilingual editor, sets + share QR, favorites, tags, transpose/save-key, autoscroll, PDF print, Supabase catalog with auth + restore-previous.
