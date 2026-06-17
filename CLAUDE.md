# New Hope Band — Songbook PWA (project context for Claude)

A worship songbook PWA for a church team. Static site, no build step. Author: Avdey Axonov. MIT licensed.

## Hosting / deploy
- **GitHub Pages**, auto-deploys from branch **`claude/kind-mendel-wSAqa`** (develop & push here).
- After ANY change: bump `CACHE_VERSION` in `service-worker.js` AND the build stamp `#ver` in `index.html` (footer, "build N"). The footer build number is how the user verifies the live version (GitHub Pages CDN + service worker can serve stale files ~10 min).
- Commit + push every change to the branch. Validate JS with `node --check app.js`.

## Files
- `index.html` — all markup + CSS (single `<style>`). Views: list (#list-view) and song (#song-view); overlays: #editor, #login, #share; floating controls bubble #fab-wrap.
- `app.js` — all logic, one big IIFE. No framework. `$ = getElementById`.
- `convert-core.js` — "chords above lyrics" → ChordPro converter (used by app + converter.html).
- `songs.js` — `window.SONGS` array; now only an **offline seed/fallback**. Source of truth is Supabase.
- `service-worker.js` — network-first for app shell (cache:'no-store'), cache-first for vendor/icons.
- `converter.html` — standalone admin tool (paste sheet → ChordPro block, incl. bilingual).
- `migrate.sql` — recreates the Supabase `songs` table + loads songs.js. Plus run these ALTERs:
  `alter table public.songs add column if not exists num serial;`
  `alter table public.songs add column if not exists tags text;`
  `alter table public.songs add column if not exists prev jsonb;`
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

## Features
search; tag chips + filter; favorites (local, row star + ★ filter); named sets (per service) with share link+QR + import; swipe between songs (touch only); transpose + admin "save key"; size +/−/reset + pinch; autoscroll; chords on/off; stage mode; PDF print (2-col, no headers); in-app add/edit/delete (global, bilingual); restore previous version; back-to-top; remembers open song + tab on refresh; editor closes on back gesture.

## localStorage keys
sets, activeSet, globalsongs, usersongs, favs, opensong, listmode, size, scrollspeed, theme, chords, sb_token/sb_exp/sb_email/sb_refresh.

## Conventions
- Keep it simple, mobile-first, offline-friendly, free. Save tokens: small focused edits.
- Bump build stamp + SW version on every change; commit + push to the claude branch.
