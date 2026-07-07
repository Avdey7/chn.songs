/* ============================================================================
   New Hope Band songbook — app logic. You normally won't need to touch this
   file — add songs in songs.js. Edit the app name on the next line if you like.

   Author: Avdey Axonov
   License: MIT (see LICENSE) — Copyright (c) 2026 Avdey Axonov
   ========================================================================== */
const APP_NAME = "New Hope Band";

(function () {
  "use strict";

  const CS = window.ChordSheetJS;
  const parser = new CS.ChordProParser();
  const formatter = new CS.HtmlDivFormatter();

  // ---- DOM ----
  const $ = (id) => document.getElementById(id);
  const listView = $("list-view"),
    songView = $("song-view");
  const listEl = $("list"),
    countEl = $("count"),
    searchEl = $("search");
  const titleEl = $("song-title"),
    keylineEl = $("keyline"),
    sheetEl = $("sheet");
  const keyNowEl = $("key-now"),
    langTabsEl = $("lang-tabs");

  // ---- state ----
  let songs = []; // normalized songs (see normalize())
  let current = null; // open song index
  let vi = 0; // open version index
  let delta = 0; // transpose offset for the open version
  let listMode = "all"; // "all" | "set"
  let listScrollY = 0; // remember scroll position in the list
  let currentMatches = []; // songs currently shown in the list (nav source)
  let navList = []; // song objects to swipe through
  let navPos = -1; // position within navList
  let suppressSwipe = false; // true briefly after a set-row hold-drag

  // ---- persistence (localStorage works in a deployed PWA) ----
  const store = {
    get: (k, d) => {
      try {
        const v = localStorage.getItem(k);
        return v === null ? d : v;
      } catch {
        return d;
      }
    },
    set: (k, v) => {
      try {
        localStorage.setItem(k, v);
      } catch {}
    },
  };

  // ---- Supabase: global song catalog shared by the whole team ----
  // The anon key is meant to be public; writes are protected by login + RLS.
  const SB_URL = "https://rryafqahqkgnwfxpvnbt.supabase.co";
  const SB_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyeWFmcWFocWtnbndmeHB2bmJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5Mzk2NzMsImV4cCI6MjA5NjUxNTY3M30.HDgmG4mz35S3t_Kq0b1UbdLqlbQcsNyTByrJCG65Z2w";
  const sbOn = () => !!SB_URL && !!SB_KEY;
  const sbToken = () => store.get("sb_token", "");
  function loggedIn() {
    return !!sbToken() && Date.now() < +store.get("sb_exp", "0");
  }
  function logoutAdmin() {
    store.set("sb_token", "");
    store.set("sb_exp", "0");
    store.set("sb_email", "");
    store.set("sb_refresh", "");
    updateAdminUI();
  }
  function updateAdminUI() {
    const row = $("ed-admin");
    if (!row) return;
    row.classList.toggle("hidden", !sbOn());
    const inn = loggedIn();
    $("ed-status").textContent = inn
      ? "Signed in: " + store.get("sb_email", "admin")
      : "Not signed in";
    $("ed-login").classList.toggle("hidden", inn);
    $("ed-logout").classList.toggle("hidden", !inn);
  }
  function sbHeaders(extra) {
    return Object.assign(
      { apikey: SB_KEY, "Content-Type": "application/json" },
      extra || {},
    );
  }
  function getGlobalCache() {
    try {
      const a = JSON.parse(store.get("globalsongs", "[]"));
      return Array.isArray(a) ? a : [];
    } catch {
      return [];
    }
  }
  let hasPrevCol = false; // does the songs table have the 'prev' column yet?
  async function refreshGlobal() {
    if (!sbOn()) return;
    try {
      const hdr = { headers: sbHeaders({ Authorization: "Bearer " + (sbToken() || SB_KEY) }) };
      const base = SB_URL + "/rest/v1/songs?order=num&select=";
      // include newer columns, but fall back if they don't exist yet
      let r = await fetch(base + "id,num,title,data,src,tags,prev", hdr);
      hasPrevCol = r.ok;
      if (!r.ok) r = await fetch(base + "id,num,title,data,src,tags", hdr);
      if (!r.ok) r = await fetch(base + "id,num,title,data,src", hdr);
      if (!r.ok) return;
      store.set("globalsongs", JSON.stringify(await r.json()));
      const openId =
        current !== null ? songs[current].uid || songs[current].title : null;
      build();
      if (openId !== null) {
        const i = songs.findIndex((s) => (s.uid || s.title) === openId);
        if (i >= 0) current = i; // keep the open song valid after rebuild
      }
      renderList();
      syncNav(); // keep the swipe sequence pointing at the new song objects
      restoreOpen(); // open the pre-refresh song once the catalog has loaded
    } catch {
      /* offline -> keep cached copy */
    }
  }
  function storeSession(d, email, remember) {
    store.set("sb_token", d.access_token || "");
    store.set("sb_exp", String(Date.now() + (d.expires_in || 3600) * 1000));
    if (email != null) store.set("sb_email", email);
    if (remember && d.refresh_token) store.set("sb_refresh", d.refresh_token);
  }
  async function adminLogin(email, password, remember) {
    try {
      const r = await fetch(SB_URL + "/auth/v1/token?grant_type=password", {
        method: "POST",
        headers: sbHeaders(),
        body: JSON.stringify({ email, password }),
      });
      if (!r.ok) return false;
      const d = await r.json();
      if (!remember) store.set("sb_refresh", "");
      storeSession(d, email || "", remember);
      return !!d.access_token;
    } catch {
      return false;
    }
  }
  // "remember me": use the stored refresh token to get a fresh access token
  async function refreshSession() {
    const rt = store.get("sb_refresh", "");
    if (!rt) return false;
    try {
      const r = await fetch(SB_URL + "/auth/v1/token?grant_type=refresh_token", {
        method: "POST",
        headers: sbHeaders(),
        body: JSON.stringify({ refresh_token: rt }),
      });
      if (!r.ok) {
        if (r.status === 400) store.set("sb_refresh", ""); // revoked
        return false;
      }
      const d = await r.json();
      if (!d.access_token) return false;
      storeSession(d, null, true);
      return true;
    } catch {
      return false;
    }
  }
  // valid access token, refreshing first if needed
  async function ensureAuth() {
    if (sbToken() && Date.now() < +store.get("sb_exp", "0")) return true;
    return await refreshSession();
  }
  // masked login dialog -> resolves true if signed in
  function promptLogin() {
    return new Promise((resolve) => {
      const ov = $("login");
      $("login-email").value = store.get("sb_email", "");
      $("login-pass").value = "";
      $("login-err").textContent = "";
      ov.classList.remove("hidden");
      document.documentElement.classList.add("noscroll");
      $("login-email").focus();
      const finish = (ok) => {
        ov.classList.add("hidden");
        document.documentElement.classList.remove("noscroll");
        $("login-go").removeEventListener("click", go);
        $("login-cancel").removeEventListener("click", cancel);
        ov.removeEventListener("keydown", onKey);
        resolve(ok);
      };
      const go = async () => {
        const ok = await adminLogin(
          $("login-email").value.trim(),
          $("login-pass").value,
          $("login-remember").checked,
        );
        if (!ok) {
          $("login-err").textContent = "Wrong email or password.";
          return;
        }
        finish(true);
      };
      const cancel = () => finish(false);
      const onKey = (e) => {
        if (e.key === "Enter") go();
        if (e.key === "Escape") cancel();
      };
      $("login-go").addEventListener("click", go);
      $("login-cancel").addEventListener("click", cancel);
      ov.addEventListener("keydown", onKey);
    });
  }
  // write (insert if no id, else update); returns {ok} or {needLogin}
  // short numeric ids filter by num, legacy uuids by id
  const sbFilter = (v) => (/^\d+$/.test(String(v)) ? "num=eq." : "id=eq.") + v;
  async function sbWrite(row, id) {
    if (!(await ensureAuth())) return { needLogin: true };
    const base = SB_URL + "/rest/v1/songs";
    const opts = {
      headers: sbHeaders({
        Authorization: "Bearer " + sbToken(),
        Prefer: "return=minimal",
      }),
    };
    let r;
    if (id)
      r = await fetch(base + "?" + sbFilter(id), { method: "PATCH", body: JSON.stringify(row), ...opts });
    else r = await fetch(base, { method: "POST", body: JSON.stringify(row), ...opts });
    if (r.status === 401) {
      store.set("sb_token", "");
      return { needLogin: true };
    }
    return { ok: r.ok };
  }
  async function sbDelete(id) {
    if (!(await ensureAuth())) return { needLogin: true };
    const r = await fetch(SB_URL + "/rest/v1/songs?" + sbFilter(id), {
      method: "DELETE",
      headers: sbHeaders({ Authorization: "Bearer " + sbToken() }),
    });
    if (r.status === 401) {
      store.set("sb_token", "");
      return { needLogin: true };
    }
    return { ok: r.ok };
  }

  // ---- helpers ----
  function plainText(raw) {
    return raw
      .replace(/\{[^}]*\}/g, " ")
      .replace(/\[[^\]]*\]/g, "")
      .replace(/\s+/g, " ")
      .toLowerCase();
  }

  // ---- universal formatting -------------------------------------------------
  // Recognises section words in any language and shows them in English, so
  // every song lays out the same way without hand-formatting. Songs already
  // using {start_of_chorus} are left untouched.
  const SECTION_EN = {
    intro: "Intro", вступ: "Intro", інтро: "Intro",
    verse: "Verse", куплет: "Verse", заспів: "Verse",
    prechorus: "Pre-Chorus", передприспів: "Pre-Chorus",
    chorus: "Chorus", приспів: "Chorus", припев: "Chorus",
    refrain: "Refrain",
    halfchorus: "Half-Chorus", halfverse: "Half-Verse",
    bridge: "Bridge", бридж: "Bridge", брідж: "Bridge",
    instrumental: "Instrumental", програш: "Instrumental", проигрыш: "Instrumental",
    interlude: "Interlude",
    turn: "Turnaround", turnaround: "Turnaround",
    outro: "Outro", ending: "Outro", coda: "Outro",
    фінал: "Outro", кінцівка: "Outro",
    tag: "Tag", vamp: "Vamp", hook: "Hook",
    solo: "Solo", соло: "Solo",
    breakdown: "Breakdown", channel: "Channel",
  };
  const SECTION_KEYS = new Set(Object.keys(SECTION_EN));
  const CHORUS_KEYS = new Set([
    "chorus", "halfchorus", "refrain", "приспів", "припев", "заспів",
  ]);
  function headerKey(line) {
    return line
      .toLowerCase()
      .replace(/[0-9]/g, "")
      .replace(/[xх]\d*/g, "")
      .replace(/[():.\-–—\s]/g, "");
  }
  // Turn a recognised header into its English label, keeping a section number
  // and/or repeat marker (e.g. "Куплет 1" -> "Verse 1", "Приспів x2" -> "Chorus x2").
  function englishLabel(text) {
    const base = SECTION_EN[headerKey(text)];
    if (!base) return text; // unknown / arbitrary note -> leave as written
    let rest = text;
    let rep = "";
    const repM = rest.match(/[xх]\s*\d+|\(\s*\d+\s*[xх]\s*\)/i);
    if (repM) {
      rep = repM[0].trim().replace(/\s+/g, "");
      rest = rest.replace(repM[0], " ");
    }
    const numM = rest.match(/\d+/);
    let label = base;
    if (numM) label += " " + numM[0];
    if (rep) label += " " + rep;
    return label;
  }
  function isHeaderLine(line) {
    const t = line.trim();
    if (!t || t.length > 28) return false;
    if (/[[\]{}|]/.test(t)) return false; // chords, directives, bar lines
    return SECTION_KEYS.has(headerKey(t));
  }
  // Chord lines (intro / instrumental / turnarounds), whether written as bare
  // names ("Em C G") or bracketed with bars ("| [Em] . | [C] . |"), are
  // normalised to clean, transposable chords: bar lines and beat dots are
  // dropped, bare chords get [brackets], repeat markers (x2) are kept.
  const CHORD_RE =
    /^[A-H](?:#|b)?(?:maj|min|sus|add|aug|dim|m|M|\+|°|ø|h|[0-9]|b|#)*(?:\/[A-H](?:#|b)?)?$/;
  const BRACKET_CHORD = /^\[.+\]$/;
  function isChordLine(line) {
    const t = line.trim();
    if (!t || /^\{/.test(t)) return false; // blank or directive
    let chords = 0;
    for (const tok of t.split(/\s+/)) {
      if (BRACKET_CHORD.test(tok) || CHORD_RE.test(tok)) {
        chords++;
        continue;
      }
      if (/^[|:.\-–—/()xх×\d]+$/i.test(tok)) continue; // separators / markers
      return false; // a real word -> it's lyrics, leave it alone
    }
    return chords > 0;
  }
  function cleanChordLine(line) {
    const out = [];
    for (const tok of line.trim().split(/\s+/)) {
      if (BRACKET_CHORD.test(tok)) out.push(tok);
      else if (CHORD_RE.test(tok)) out.push("[" + tok + "]");
      else if (/[xх\d]/i.test(tok)) out.push(tok); // keep markers like x2 / (2x)
      // pure bar lines / dots / dashes are dropped
    }
    return out.join(" ");
  }
  // per-line cleanup applied to non-header lines
  function transformLine(line) {
    if (isChordLine(line)) return cleanChordLine(line);
    // a space right after a chord, before a word, shifts the chord off the
    // word; collapse it (but keep "[G] [C]" gaps on chord-only lines).
    // Only when the chord stands on its own (preceded by start/space), e.g.
    // "me [G] close" -> "me [G]close". When the chord is glued to the previous
    // word ("me[G] close"), the following space is a real word gap — keep it,
    // otherwise the words merge ("meclose").
    return line.replace(/(^|\s)(\[[^\]]*\])\s+(?=[^\s[{])/g, "$1$2");
  }
  // If a line is made up only of bracketed tokens (e.g. "[CHORUS] [x2]" or
  // "[x2]"), return the inner texts; else null. Used to turn bracketed section
  // labels / markers into proper labels instead of rendering them as chords.
  function bracketTokens(t) {
    if (!/^(?:\s*\[[^\][]*\]\s*)+$/.test(t)) return null;
    return [...t.matchAll(/\[([^\][]*)\]/g)]
      .map((m) => m[1].trim())
      .filter(Boolean);
  }

  function standardize(text) {
    const lines = String(text).replace(/\r\n?/g, "\n").split("\n");
    const out = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      const t = line.trim();
      const comm = t.match(/^\{(?:comment|c|ci)\s*:\s*(.+?)\}$/i);
      const bt = bracketTokens(t); // ["CHORUS","x2"] for "[CHORUS] [x2]"
      let isHeader = false,
        isChorus = false,
        emit = line;
      if (isHeaderLine(line)) {
        isHeader = true;
        emit = "{comment: " + englishLabel(t) + "}"; // bare word -> English label
        isChorus = CHORUS_KEYS.has(headerKey(t));
      } else if (comm) {
        isHeader = true; // translate the existing comment to English too
        emit = "{comment: " + englishLabel(comm[1]) + "}";
        isChorus = CHORUS_KEYS.has(headerKey(comm[1]));
      } else if (bt) {
        const hasSection = bt.some((x) => SECTION_KEYS.has(headerKey(x)));
        const hasChord = bt.some((x) => CHORD_RE.test(x));
        if (hasSection) {
          // bracketed label (+ optional marker) -> English {comment:} label
          isHeader = true;
          emit = "{comment: " + englishLabel(bt.join(" ")) + "}";
          isChorus = bt.some((x) => CHORUS_KEYS.has(headerKey(x)));
        } else if (!hasChord) {
          // marker-only line like "[x2]" -> small label, not a chord
          isHeader = true;
          emit = "{comment: " + bt.join(" ") + "}";
        }
        // else: real chords (e.g. "[G] [C]") -> leave for chord-line handling
      }
      if (!isHeader) {
        out.push(transformLine(line));
        i++;
        continue;
      }
      out.push(emit);
      i++;
      if (isChorus && !/^\{(start_of_chorus|soc)\b/i.test((lines[i] || "").trim())) {
        const body = [];
        while (i < lines.length) {
          const l = lines[i];
          if (!l.trim() || isHeaderLine(l) || /^\{/.test(l.trim())) break;
          body.push(transformLine(l));
          i++;
        }
        if (body.length) {
          out.push("{start_of_chorus}", ...body, "{end_of_chorus}");
        }
      }
    }
    return out.join("\n");
  }

  // Accepts either a plain ChordPro STRING (single language) or an OBJECT:
  //   { title?: "...", versions: [ { lang: "Українською", text: `...` }, { lang: "English", text: `...` } ] }
  function normalize(entry) {
    let rawVersions;
    if (typeof entry === "string") {
      rawVersions = [{ lang: "", text: entry }];
    } else {
      rawVersions = (entry.versions || []).map((v) => ({
        lang: v.lang || "",
        text: v.text || v.chordpro || "",
      }));
      if (!rawVersions.length) rawVersions = [{ lang: "", text: "" }];
    }
    const versions = rawVersions.map((v) => {
      let parsed = null,
        title = "",
        key = "";
      try {
        parsed = parser.parse(standardize(v.text));
        title = parsed.title || "";
        key = parsed.key || "";
      } catch (e) {
        console.error("Parse error:", e);
      }
      return { lang: v.lang, raw: v.text, parsed, title, key };
    });
    // bilingual songs: show the English version first
    versions.sort(
      (a, b) =>
        (/eng|англ/i.test(a.lang || "") ? 0 : 1) -
        (/eng|англ/i.test(b.lang || "") ? 0 : 1),
    );
    const title =
      (typeof entry === "object" && entry.title) ||
      versions[0].title ||
      (versions[0].raw.match(/\{title:\s*([^}]+)\}/i) || [])[1] ||
      "Untitled";
    const langs = versions.map((v) => v.lang).filter(Boolean);
    // a language badge for EVERY song (even single-language): use the declared
    // language, else guess it from the lyrics (EN / UK / RU)
    const langAbbrs = [];
    versions.forEach((v) => {
      const a = v.lang ? abbr(v.lang) : detectAbbr(v.raw);
      if (a && !langAbbrs.includes(a)) langAbbrs.push(a);
    });
    const searchText = (
      title +
      " " +
      versions.map((v) => plainText(v.raw)).join(" ")
    ).toLowerCase();
    const tags = (typeof entry === "object" && entry._tags) || [];
    return {
      title,
      key: versions[0].key || "",
      versions,
      langs,
      langAbbrs,
      searchText: searchText + " " + tags.join(" ").toLowerCase(),
      uid: (typeof entry === "object" && entry._uid) || null,
      tags,
    };
  }
  // best-guess language abbreviation from lyrics, for songs with no declared lang
  function detectAbbr(raw) {
    const t = plainText(raw);
    if (/[іїєґ]/i.test(t)) return "UK"; // Ukrainian-specific letters
    if (/[ёъыэ]/i.test(t)) return "RU"; // Russian-specific letters
    if (/[а-я]/i.test(t)) return "UK"; // other Cyrillic -> assume Ukrainian
    return "EN";
  }
  const parseTags = (s) =>
    String(s || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

  // ---- songs added in-app (stored on this device) ----
  function getUserSongs() {
    try {
      const a = JSON.parse(store.get("usersongs", "[]"));
      return Array.isArray(a) ? a : [];
    } catch {
      return [];
    }
  }
  function saveUserSongs(a) {
    store.set("usersongs", JSON.stringify(a));
  }

  // a Supabase row -> a SONGS entry (string data = single language, object = bilingual)
  function rowToEntry(row) {
    const uid = "g:" + (row.num != null ? row.num : row.id);
    const tags = parseTags(row.tags);
    const d = row.data;
    if (d && typeof d === "object")
      return Object.assign({ _uid: uid, _tags: tags }, d, {
        title: row.title || d.title,
      });
    return {
      _uid: uid,
      _tags: tags,
      title: row.title || undefined,
      versions: [{ lang: "", text: String(d || "") }],
    };
  }
  function build() {
    const cache = getGlobalCache();
    // Once the shared catalog has loaded, it is the source of truth; songs.js
    // is only the offline seed for the very first load.
    const base = cache.length ? cache.map(rowToEntry) : window.SONGS || [];
    const userEntries = getUserSongs().map((u) => ({
      _uid: u.id,
      title: u.name || undefined,
      versions: [{ lang: u.lang || "", text: u.chordpro || "" }],
    }));
    songs = [...base, ...userEntries].map(normalize);
    songs.sort((a, b) => a.title.localeCompare(b.title));
  }

  // ---- add / edit a song in-app -------------------------------------------
  let editId = null;
  function buildChordPro(name, key, lang, text, german) {
    // ChordPro only if it has INLINE chords ([G]word) or {directives};
    // bracketed section labels like [Verse 1] must still go through the converter
    const looksCP = /\][^\s\]]/.test(text) || /\{[^}]*\}/.test(text);
    if (looksCP) {
      let t = text;
      if (name)
        t = /\{title:/i.test(t)
          ? t.replace(/\{title:[^}]*\}/i, "{title: " + name + "}")
          : "{title: " + name + "}\n" + t;
      if (key)
        t = /\{key:/i.test(t)
          ? t.replace(/\{key:[^}]*\}/i, "{key: " + key + "}")
          : "{key: " + key + "}\n" + t;
      return t;
    }
    return window.ChordConvert
      ? window.ChordConvert.convert(text, { title: name, key, german })
      : (name ? "{title: " + name + "}\n" : "") + text;
  }
  const keyOf = (t) => ((t || "").match(/\{key:\s*([^}]+)\}/i) || [])[1]?.trim() || "";
  // ChordPro -> friendly "chords above lyrics" sheet (for editing old songs)
  function chordproToSheet(cp) {
    const lines = String(cp).replace(/\r\n?/g, "\n").split("\n");
    let name = "",
      key = "";
    const out = [];
    for (const line of lines) {
      const t = line.trim();
      let m;
      if ((m = t.match(/^\{title:\s*([^}]*)\}$/i))) {
        name = m[1].trim();
        continue;
      }
      if ((m = t.match(/^\{key:\s*([^}]*)\}$/i))) {
        key = m[1].trim();
        continue;
      }
      if (/^\{(start_of_|end_of_|soc|eoc|sov|eov|sob|eob)/i.test(t)) continue;
      if ((m = t.match(/^\{(?:comment|c|ci)\s*:\s*(.+?)\}$/i))) {
        out.push(m[1].trim());
        continue;
      }
      if (line.indexOf("[") < 0) {
        out.push(line);
        continue;
      }
      // split a "[G]word [C]word" line into a chord row + lyric row
      let lyric = "";
      const chords = [];
      for (const p of line.split(/(\[[^\]]*\])/g)) {
        const cm = p.match(/^\[([^\]]*)\]$/);
        if (cm) chords.push({ pos: lyric.length, sym: cm[1] });
        else lyric += p;
      }
      let row = "";
      for (const c of chords) {
        let target = c.pos;
        if (row.length > 0 && target <= row.length) target = row.length + 1;
        if (target > row.length) row += " ".repeat(target - row.length);
        row += c.sym;
      }
      out.push(row.replace(/\s+$/, ""));
      if (lyric.trim() !== "") out.push(lyric.replace(/\s+$/, ""));
    }
    return {
      name,
      key,
      text: out.join("\n").replace(/\n{3,}/g, "\n\n").trim(),
    };
  }
  function fillEditor(f) {
    $("ed-name").value = f.name || "";
    $("ed-tags").value = f.tags || "";
    $("ed-key").value = f.key || "";
    $("ed-lang").value = f.lang || "";
    $("ed-german").checked = !!f.german;
    $("ed-text").value = f.text || "";
    $("ed-biling").checked = !!f.biling;
    $("ed-lang2").value = f.lang2 || "";
    $("ed-key2").value = f.key2 || "";
    $("ed-german2").checked = !!f.german2;
    $("ed-text2").value = f.text2 || "";
    $("ed-block2").classList.toggle("hidden", !f.biling);
  }
  function openEditor(uid) {
    editId = uid || null;
    let f = {};
    if (uid && uid.startsWith("g:")) {
      const g = getGlobalCache().find(
        (x) => "g:" + (x.num != null ? x.num : x.id) === uid,
      );
      if (g && g.src) {
        try {
          f = JSON.parse(g.src);
        } catch {}
      }
      if (g && !f.text) {
        // no saved source -> reverse the ChordPro into the friendly format
        if (typeof g.data === "string") {
          const s = chordproToSheet(g.data);
          f = { name: g.title || s.name, key: s.key, text: s.text };
        } else if (g.data && g.data.versions) {
          const v = g.data.versions;
          const s1 = chordproToSheet(v[0] ? v[0].text : "");
          f = {
            name: g.title || s1.name,
            lang: v[0] ? v[0].lang : "",
            key: s1.key,
            text: s1.text,
          };
          if (v[1]) {
            const s2 = chordproToSheet(v[1].text || "");
            f.biling = true;
            f.lang2 = v[1].lang || "";
            f.text2 = s2.text;
            f.key2 = s2.key;
          }
        }
      }
      if (g && !f.tags) f.tags = parseTags(g.tags).join(", ");
    } else if (uid) {
      const u = getUserSongs().find((s) => s.id === uid);
      if (u) f = { ...u };
    }
    fillEditor(f);
    $("editor-title").textContent = uid ? "Edit song" : "Add a song";
    $("ed-delete").classList.toggle("hidden", !uid);
    const gr =
      uid && uid.startsWith("g:")
        ? getGlobalCache().find(
            (x) => "g:" + (x.num != null ? x.num : x.id) === uid,
          )
        : null;
    $("ed-restore").classList.toggle("hidden", !(gr && gr.prev != null));
    updateAdminUI();
    $("editor").classList.remove("hidden");
    document.documentElement.classList.add("noscroll");
    history.pushState({ ed: 1 }, ""); // back gesture closes the editor, not the song
  }
  function closeEditorUI() {
    $("editor").classList.add("hidden");
    document.documentElement.classList.remove("noscroll");
  }
  // On desktop (mouse/trackpad), an accidental horizontal gesture — e.g. an
  // overscroll while drag-selecting text right-to-left — fires a history back
  // that would close the editor and discard unsaved edits. There we keep the
  // editor open on stray back events and close only via the Close button.
  const editKeepOpen =
    window.matchMedia &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  let editorClosing = false;
  function closeEditor() {
    if (!$("editor").classList.contains("hidden")) {
      editorClosing = true; // an intentional close: let popstate hide the editor
      history.back();
    } else closeEditorUI();
  }
  async function saveEditor() {
    const name = $("ed-name").value.trim();
    const p1 = {
      key: $("ed-key").value.trim(),
      lang: $("ed-lang").value.trim(),
      german: $("ed-german").checked,
      text: $("ed-text").value,
    };
    const p2 = {
      key: $("ed-key2").value.trim(),
      lang: $("ed-lang2").value.trim(),
      german: $("ed-german2").checked,
      text: $("ed-text2").value,
    };
    const biling = $("ed-biling").checked && p2.text.trim();
    if (!name && !p1.text.trim()) {
      closeEditor();
      return;
    }
    const cp1 = buildChordPro(name, p1.key, p1.lang, p1.text, p1.german);
    let data;
    if (biling) {
      const cp2 = buildChordPro(name, p2.key, p2.lang, p2.text, p2.german);
      data = {
        title: name || undefined,
        versions: [
          { lang: p1.lang || "English", text: cp1 },
          { lang: p2.lang || "Other", text: cp2 },
        ],
      };
    } else {
      data = cp1;
    }
    const tags = parseTags($("ed-tags").value).join(", ");
    const src = JSON.stringify({
      name, biling: !!biling, tags,
      key: p1.key, lang: p1.lang, german: p1.german, text: p1.text,
      key2: p2.key, lang2: p2.lang, german2: p2.german, text2: p2.text,
    });

    // is the song being edited the one currently open? (re-render it after save)
    const reopenUid =
      current !== null && songs[current].uid === editId ? editId : null;
    // keep renamed songs in their sets
    const oldTitle = reopenUid ? songs[current].title : null;
    const renamed = () => {
      if (oldTitle && name && name !== oldTitle) renameInSets(oldTitle, name);
    };

    if (sbOn()) {
      const gid = editId && editId.startsWith("g:") ? editId.slice(2) : null;
      const row = { title: name || null, data, src, tags: tags || null };
      // keep the version before this edit, so it can be restored
      if (gid && hasPrevCol) {
        const g = getGlobalCache().find(
          (x) => "g:" + (x.num != null ? x.num : x.id) === editId,
        );
        if (g) row.prev = g.data;
      }
      let res = await sbWrite(row, gid);
      if (res.needLogin) {
        if (!(await promptLogin())) return;
        res = await sbWrite(row, gid);
      }
      if (res.ok) {
        renamed();
        await refreshGlobal();
        closeEditor();
        rerenderOpen(reopenUid);
      } else {
        alert("Couldn't save. Check your connection and that you're an admin.");
      }
      return;
    }
    // device fallback (single language)
    const list = getUserSongs();
    const rec = { name, key: p1.key, lang: p1.lang, german: p1.german, text: p1.text, chordpro: cp1 };
    if (editId) {
      const s = list.find((x) => x.id === editId);
      if (s) Object.assign(s, rec);
    } else {
      list.push({ id: "u" + Date.now().toString(36), ...rec });
    }
    saveUserSongs(list);
    renamed();
    build();
    renderList();
    closeEditor();
    rerenderOpen(reopenUid);
  }
  // re-render the open song in place (after an edit) without leaving the page
  function rerenderOpen(uid) {
    if (current === null) return;
    const want = uid || songs[current].uid;
    let i = want ? songs.findIndex((s) => s.uid === want) : -1;
    if (i < 0) i = current < songs.length ? current : -1;
    if (i < 0) return;
    current = i;
    vi = 0;
    delta = parseInt(store.get(trKey(), "0"), 10) || 0;
    titleEl.textContent = songs[i].title;
    store.set("opensong", songs[i].title);
    renderTabs();
    renderSheet();
    updateSetBtn();
    $("edit-btn").classList.toggle("hidden", !songs[i].uid);
    syncNav();
  }
  async function deleteEditor() {
    if (!editId) return;
    if (!confirm("Delete this song for everyone?")) return;
    const wasOpen = current !== null;
    if (editId.startsWith("g:")) {
      let res = await sbDelete(editId.slice(2));
      if (res.needLogin) {
        if (!(await promptLogin())) return;
        res = await sbDelete(editId.slice(2));
      }
      if (!res.ok) {
        alert("Couldn't delete. Check your connection / admin login.");
        return;
      }
      await refreshGlobal();
    } else {
      saveUserSongs(getUserSongs().filter((x) => x.id !== editId));
      build();
      renderList();
    }
    closeEditorUI();
    history.go(wasOpen ? -2 : -1); // pop the editor (and song) history entries
  }
  // load the previous version INTO the editor so you can see it before applying
  // (then Save commits it; the current version becomes the new "previous")
  function restorePrev() {
    if (!editId || !editId.startsWith("g:")) return;
    const g = getGlobalCache().find(
      (x) => "g:" + (x.num != null ? x.num : x.id) === editId,
    );
    if (!g || g.prev == null) return;
    const d = g.prev;
    const f = { name: $("ed-name").value, tags: $("ed-tags").value };
    if (typeof d === "string") {
      const s = chordproToSheet(d);
      f.name = f.name || s.name;
      f.key = s.key;
      f.text = s.text;
    } else if (d && d.versions) {
      const v = d.versions;
      const s1 = chordproToSheet(v[0] ? v[0].text : "");
      f.lang = v[0] ? v[0].lang : "";
      f.key = s1.key;
      f.text = s1.text;
      if (v[1]) {
        const s2 = chordproToSheet(v[1].text || "");
        f.biling = true;
        f.lang2 = v[1].lang || "";
        f.key2 = s2.key;
        f.text2 = s2.text;
      }
    }
    fillEditor(f);
    alert("Loaded the previous version. Review it, then Save to apply.");
  }

  // ---- named sets (one per service) ---------------------------------------
  // Stored as [{ id, name, songs:[titles] }]; "activeSet" holds the open one.
  let activeSetId = null;
  function uid() {
    return "s" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }
  function getSets() {
    try {
      const a = JSON.parse(store.get("sets", "null"));
      return Array.isArray(a) ? a : null;
    } catch {
      return null;
    }
  }
  function saveSets(arr) {
    store.set("sets", JSON.stringify(arr));
  }
  // a renamed song keeps its place in every set
  function renameInSets(oldT, newT) {
    const sets = getSets() || [];
    let changed = false;
    sets.forEach((s) => {
      s.songs = s.songs.map((t) => {
        if (t === oldT) {
          changed = true;
          return newT;
        }
        return t;
      });
    });
    if (changed) saveSets(sets);
  }
  function initSets() {
    let sets = getSets();
    if (!sets) {
      // migrate the old single "setlist" if present
      let old = [];
      try {
        const o = JSON.parse(store.get("setlist", "[]"));
        if (Array.isArray(o)) old = o;
      } catch {}
      sets = [{ id: uid(), name: "My set", songs: old }];
      saveSets(sets);
    }
    activeSetId = store.get("activeSet", sets[0].id);
    if (!sets.some((s) => s.id === activeSetId)) activeSetId = sets[0].id;
    store.set("activeSet", activeSetId);
  }
  function activeSet() {
    const sets = getSets() || [];
    return sets.find((s) => s.id === activeSetId) || sets[0];
  }
  function getSet() {
    const s = activeSet();
    return s ? s.songs.slice() : [];
  }
  function saveSet(a) {
    const sets = getSets() || [];
    const s = sets.find((x) => x.id === activeSetId);
    if (s) {
      s.songs = a;
      saveSets(sets);
    }
    updateSetCount();
    // if the Set list is the visible view, keep it in sync immediately
    if (current === null && listMode === "set") renderList();
  }
  function setHas(title) {
    return getSet().includes(title);
  }
  function setToggle(title) {
    const a = getSet();
    const i = a.indexOf(title);
    if (i >= 0) a.splice(i, 1);
    else a.push(title);
    saveSet(a);
  }
  function setRemove(title) {
    saveSet(getSet().filter((t) => t !== title));
  }

  // create / switch / rename / delete sets
  function createSet(name) {
    const sets = getSets() || [];
    const s = { id: uid(), name: name || "New set", songs: [] };
    sets.push(s);
    saveSets(sets);
    activeSetId = s.id;
    store.set("activeSet", activeSetId);
    return s;
  }
  function switchSet(id) {
    activeSetId = id;
    store.set("activeSet", id);
    updateSetCount();
    renderSetBar();
    renderList();
  }
  function renameSet(id, name) {
    const sets = getSets() || [];
    const s = sets.find((x) => x.id === id);
    if (s) {
      s.name = name;
      saveSets(sets);
    }
  }
  function deleteSet(id) {
    let sets = (getSets() || []).filter((x) => x.id !== id);
    if (!sets.length) sets = [{ id: uid(), name: "My set", songs: [] }];
    saveSets(sets);
    activeSetId = sets[0].id;
    store.set("activeSet", activeSetId);
  }

  // ---- share / import a set via link --------------------------------------
  function shareSet() {
    const s = activeSet();
    if (!s) return;
    // compact payload: store each global song as its short numeric id (and only
    // fall back to the full title for device-only songs) -> much shorter link/QR
    const uidByTitle = new Map(songs.map((x) => [x.title, x.uid]));
    const v = s.songs.map((t) => {
      const u = uidByTitle.get(t);
      return u && /^g:\d+$/.test(u) ? +u.slice(2) : t;
    });
    const payload = encodeURIComponent(JSON.stringify({ n: s.name, v }));
    const url = location.origin + location.pathname + "#set=" + payload;
    $("share-name").textContent = s.name;
    $("share-link").value = url;
    $("share-qr").src =
      "https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=" +
      encodeURIComponent(url);
    $("share-native").classList.toggle("hidden", !navigator.share);
    $("share").classList.remove("hidden");
    document.documentElement.classList.add("noscroll");
  }
  function closeShare() {
    $("share").classList.add("hidden");
    document.documentElement.classList.remove("noscroll");
  }
  function importFromText(text) {
    let payload = (text || "").trim();
    const idx = payload.indexOf("#set=");
    if (idx >= 0) payload = payload.slice(idx + 5);
    try {
      const obj = JSON.parse(decodeURIComponent(payload));
      let titles;
      if (Array.isArray(obj.v)) {
        // new compact form: numeric ids resolve to titles via the catalog;
        // plain strings are already titles (device-only songs / old links)
        titles = obj.v
          .map((item) => {
            if (typeof item === "number" || /^\d+$/.test(item)) {
              const sg = songs.find((x) => x.uid === "g:" + item);
              return sg ? sg.title : null;
            }
            return item;
          })
          .filter(Boolean);
      } else if (Array.isArray(obj.s)) {
        titles = obj.s; // legacy: array of titles
      } else {
        return null;
      }
      const sets = getSets() || [];
      const s = { id: uid(), name: obj.n || "Imported set", songs: titles };
      sets.push(s);
      saveSets(sets);
      activeSetId = s.id;
      store.set("activeSet", activeSetId);
      return s;
    } catch {
      return null;
    }
  }
  function importSetPrompt() {
    const text = prompt("Paste a shared set link:");
    if (!text) return;
    const s = importFromText(text);
    if (s) {
      const have = s.songs.filter((t) => songs.some((x) => x.title === t)).length;
      setListMode("set");
      renderSetBar();
      alert(
        'Imported "' +
          s.name +
          '" — ' +
          have +
          " of " +
          s.songs.length +
          " songs found in this app.",
      );
    } else {
      alert("Sorry, that link could not be read.");
    }
  }
  // auto-import when the app is opened from a share link
  function checkHashImport() {
    if (!location.hash.startsWith("#set=")) return false;
    const s = importFromText(location.hash);
    history.replaceState(null, "", location.pathname + location.search);
    return !!s;
  }

  function renderSetBar() {
    const sel = $("set-select");
    if (!sel) return;
    const sets = getSets() || [];
    sel.innerHTML = "";
    sets.forEach((s) => {
      const o = document.createElement("option");
      o.value = s.id;
      o.textContent = s.name;
      if (s.id === activeSetId) o.selected = true;
      sel.appendChild(o);
    });
  }

  // ---- drag to reorder set rows ----
  // Shared clone-based core: a floating CLONE follows the pointer while the real
  // row stays in the DOM as a hidden travelling gap (no dashed placeholder, no
  // jumpy outline). Used by the grip handle (pointer) AND press-and-hold (touch).
  function beginCloneDrag(li, startY) {
    const rect = li.getBoundingClientRect();
    const offsetY = startY - rect.top;
    const clone = li.cloneNode(true);
    clone.classList.add("dragging");
    clone.style.cssText =
      "display:flex;position:fixed;margin:0;z-index:999;pointer-events:none;left:" +
      rect.left + "px;width:" + rect.width + "px;top:" + rect.top + "px;";
    listEl.appendChild(clone);
    li.style.visibility = "hidden";
    li.classList.add("drag-source");
    return {
      move(y) {
        clone.style.top = y - offsetY + "px";
        const sibs = [
          ...listEl.querySelectorAll("li:not(.dragging):not(.drag-source)"),
        ];
        let placed = false;
        for (const sib of sibs) {
          const r = sib.getBoundingClientRect();
          if (y < r.top + r.height / 2) {
            listEl.insertBefore(li, sib);
            placed = true;
            break;
          }
        }
        if (!placed) listEl.appendChild(li);
      },
      end() {
        li.style.visibility = "";
        li.classList.remove("drag-source");
        clone.remove();
        const order = [...listEl.querySelectorAll("li")]
          .map((el) => el.dataset.title)
          .filter(Boolean);
        saveSet(order);
      },
    };
  }
  // grip handle drag (mouse + touch on the handle itself).
  // We listen on `window`, NOT the handle, and skip setPointerCapture: the drag
  // hides the row (and the handle inside it), which would drop a captured
  // pointer on Android and freeze the drag. touch-action:none on the handle
  // stops the page scrolling while grabbing.
  function enableDrag(li, handle) {
    handle.style.touchAction = "none";
    handle.addEventListener("click", (e) => e.stopPropagation());
    handle.addEventListener("pointerdown", (e) => {
      if (e.button > 0) return; // ignore right/middle click
      e.preventDefault();
      e.stopPropagation();
      const drag = beginCloneDrag(li, e.clientY);
      const onMove = (ev) => drag.move(ev.clientY);
      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
        drag.end();
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
    });
  }
  // press-and-hold ANYWHERE on the row (touch) to pick it up and reorder.
  // A short tap still opens the song; a quick drag still scrolls the list.
  function enableHoldDrag(li) {
    let timer = null,
      sx = 0,
      sy = 0,
      ly = 0,
      drag = null;
    const clearTimer = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };
    li.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches.length !== 1) {
          clearTimer();
          return;
        }
        // taps on the row's own buttons shouldn't start a drag
        if (e.target.closest(".row-remove, .row-drag, .row-add, .row-fav")) return;
        const t = e.touches[0];
        sx = t.clientX;
        sy = t.clientY;
        ly = t.clientY;
        drag = null;
        clearTimer();
        timer = setTimeout(() => {
          drag = beginCloneDrag(li, ly);
          suppressSwipe = true; // don't let the drag double as a tab swipe
          if (navigator.vibrate) navigator.vibrate(15); // haptic "picked up"
        }, 320);
      },
      { passive: true },
    );
    li.addEventListener(
      "touchmove",
      (e) => {
        const t = e.touches[0];
        if (!t) return;
        ly = t.clientY;
        if (drag) {
          e.preventDefault(); // hijack the page scroll while dragging
          drag.move(t.clientY);
          return;
        }
        if (timer) {
          // still waiting for the hold: swallow tiny jitter so iOS doesn't start
          // scrolling and cancel the touch; a real scroll swipe (big first move)
          // falls through and scrolls normally.
          if (Math.abs(t.clientX - sx) <= 10 && Math.abs(t.clientY - sy) <= 10) {
            e.preventDefault();
          } else {
            clearTimer();
          }
        }
      },
      { passive: false },
    );
    const end = () => {
      clearTimer();
      if (!drag) return;
      drag.end();
      drag = null;
      // swallow the click + tab-swipe that follow this touchend
      li._suppressClick = true;
      setTimeout(() => {
        li._suppressClick = false;
        suppressSwipe = false;
      }, 100);
    };
    li.addEventListener("touchend", end);
    li.addEventListener("touchcancel", end);
  }
  function clearSet() {
    saveSet([]);
  }
  function updateSetCount() {
    const n = getSet().length;
    countEl && (countEl.dataset.set = n);
    const badge = $("set-count");
    if (badge) badge.textContent = n;
    const clear = $("set-clear");
    if (clear) clear.classList.toggle("hidden", n === 0);
  }

  // ---- list ----
  let lastFilter = "";
  let activeTag = "";
  let favOnly = false;
  // ---- favorites (per device) ----
  function getFavs() {
    try {
      const a = JSON.parse(store.get("favs", "[]"));
      return Array.isArray(a) ? a : [];
    } catch {
      return [];
    }
  }
  function favHas(t) {
    return getFavs().includes(t);
  }
  function favToggle(t) {
    const a = getFavs();
    const i = a.indexOf(t);
    if (i >= 0) a.splice(i, 1);
    else a.push(t);
    store.set("favs", JSON.stringify(a));
  }
  function updateFavBtn() {
    if (current === null) return;
    $("fav-btn").classList.toggle("on", favHas(songs[current].title));
  }
  function renderList(filter = lastFilter) {
    lastFilter = filter;
    const q = filter.trim().toLowerCase();

    // base list depends on the active tab
    let base;
    if (listMode === "set") {
      // preserve the order songs were added to the set
      base = getSet()
        .map((t) => songs.find((s) => s.title === t))
        .filter(Boolean);
    } else {
      base = songs;
      if (favOnly) base = base.filter((s) => favHas(s.title));
      if (activeTag)
        base = base.filter((s) =>
          (s.tags || []).some((t) => t.toLowerCase() === activeTag),
        );
    }
    renderTagBar();
    const matches = q ? base.filter((s) => s.searchText.includes(q)) : base;
    currentMatches = matches; // swipe/next-prev follows the current view

    listEl.innerHTML = "";
    countEl.textContent =
      matches.length + (matches.length === 1 ? " song" : " songs");

    if (!matches.length) {
      let msg;
      if (listMode === "set" && !getSet().length) {
        msg =
          "Your set is empty. Open a song and tap <b>+ Set</b> to add it here.";
      } else if (q) {
        msg = "No songs match &ldquo;" + escapeHtml(filter) + "&rdquo;";
      } else {
        msg = "No songs yet.";
      }
      listEl.innerHTML = '<div class="empty">' + msg + "</div>";
      return;
    }

    const frag = document.createDocumentFragment();
    matches.forEach((s) => {
      const li = document.createElement("li");
      // title with a quiet language hint right beneath it
      const main = document.createElement("div");
      main.className = "row-main";
      const t = document.createElement("span");
      t.className = "song-title";
      t.textContent = s.title;
      main.appendChild(t);
      if (s.langAbbrs && s.langAbbrs.length) {
        const lb = document.createElement("span");
        lb.className = "song-langs";
        lb.textContent = s.langAbbrs.join(" \u00B7 ");
        main.appendChild(lb);
      }
      li.appendChild(main);
      if (s.key) {
        const k = document.createElement("span");
        k.className = "song-key";
        k.textContent = s.key;
        li.appendChild(k);
      }
      if (listMode !== "set") {
        const fav = document.createElement("button");
        fav.className = "row-fav" + (favHas(s.title) ? " on" : "");
        fav.innerHTML = ICON_STAR;
        fav.setAttribute("aria-label", "Favorite");
        fav.addEventListener("pointerdown", (e) => e.preventDefault());
        fav.addEventListener("click", (e) => {
          e.stopPropagation();
          favToggle(s.title);
          fav.classList.toggle("on", favHas(s.title));
          renderTagBar();
        });
        li.appendChild(fav);
        const add = document.createElement("button");
        const inSet = setHas(s.title);
        add.className = "row-add" + (inSet ? " in" : "");
        add.innerHTML = inSet ? ICON_CHECK : ICON_PLUS;
        add.setAttribute(
          "aria-label",
          inSet ? "Remove from set" : "Add to set",
        );
        // don't steal focus from the search box (keeps the keyboard open)
        add.addEventListener("pointerdown", (e) => e.preventDefault());
        add.addEventListener("click", (e) => {
          e.stopPropagation();
          setToggle(s.title);
          const now = setHas(s.title);
          add.classList.toggle("in", now);
          add.innerHTML = now ? ICON_CHECK : ICON_PLUS;
          add.setAttribute(
            "aria-label",
            now ? "Remove from set" : "Add to set",
          );
        });
        li.appendChild(add);
      }
      if (listMode === "set") {
        li.dataset.title = s.title;
        const tools = document.createElement("span");
        tools.className = "row-tools";
        const rm = document.createElement("button");
        rm.className = "row-remove";
        rm.innerHTML = "&times;";
        rm.setAttribute("aria-label", "Remove from set");
        rm.addEventListener("click", (e) => {
          e.stopPropagation();
          setRemove(s.title);
          renderList();
        });
        tools.appendChild(rm);
        // reorder — only when unfiltered, so order maps to the whole set.
        // Drag the grip (mouse) OR press-and-hold anywhere on the row (touch).
        if (!q) {
          const drag = document.createElement("button");
          drag.className = "row-drag";
          drag.innerHTML = ICON_GRIP;
          drag.setAttribute("aria-label", "Drag to reorder");
          enableDrag(li, drag);
          enableHoldDrag(li);
          tools.appendChild(drag);
        }
        li.appendChild(tools);
      }
      li.addEventListener("click", () => {
        if (li._suppressClick) return; // just finished a hold-to-reorder
        openSong(s);
      });
      frag.appendChild(li);
    });
    listEl.appendChild(frag);
  }

  // tag filter chips (All view): tap a tag to filter, tap again to clear
  function renderTagBar() {
    const bar = $("tag-bar");
    if (listMode === "set") {
      bar.classList.add("hidden");
      return;
    }
    const all = new Set();
    songs.forEach((s) => (s.tags || []).forEach((t) => all.add(t)));
    const hasFavs = getFavs().length > 0;
    if (!all.size && !hasFavs) {
      bar.classList.add("hidden");
      return;
    }
    bar.classList.remove("hidden");
    bar.innerHTML = "";
    if (hasFavs) {
      const fb = document.createElement("button");
      fb.className = "chip" + (favOnly ? " active" : "");
      fb.textContent = "★ Favorites";
      fb.addEventListener("click", () => {
        favOnly = !favOnly;
        renderList();
      });
      bar.appendChild(fb);
    }
    [...all]
      .sort((a, b) => a.localeCompare(b))
      .forEach((t) => {
        const b = document.createElement("button");
        b.className = "chip" + (activeTag === t.toLowerCase() ? " active" : "");
        b.textContent = t;
        b.addEventListener("click", () => {
          const key = t.toLowerCase();
          activeTag = activeTag === key ? "" : key;
          renderList();
        });
        bar.appendChild(b);
      });
  }

  let listInited = false;
  function setListMode(mode) {
    const changed = listInited && mode !== listMode;
    listInited = true;
    listMode = mode;
    store.set("listmode", mode); // remembered across refresh
    $("tab-all").classList.toggle("active", mode === "all");
    $("tab-set").classList.toggle("active", mode === "set");
    $("set-bar").classList.toggle("hidden", mode !== "set");
    // clear any leftover search so the tab shows its full list (a stale filter
    // could otherwise hide newly-added songs until a reload)
    searchEl.value = "";
    const sc = $("search-clear");
    if (sc) sc.classList.remove("show");
    lastFilter = "";
    activeTag = "";
    favOnly = false;
    if (mode === "set") renderSetBar();
    updateSetCount();
    renderList();
    // slide/fade the list when actually switching tabs (Set = from the right,
    // All = from the left), so tap and swipe both feel directional
    if (changed) {
      const cls = mode === "set" ? "list-anim-next" : "list-anim-prev";
      const anim = [listEl, $("set-bar"), $("tag-bar")].filter(Boolean);
      anim.forEach((el) => {
        if (el.classList.contains("hidden")) return;
        el.classList.remove("list-anim-next", "list-anim-prev");
        void el.offsetWidth; // restart the animation
        el.classList.add(cls);
      });
    }
  }

  function abbr(lang) {
    const map = {
      english: "EN",
      ukrainian: "UK",
      українською: "UK",
      russian: "RU",
      русский: "RU",
    };
    const low = lang.toLowerCase();
    if (map[low]) return map[low];
    return lang.length <= 4 ? lang : lang.slice(0, 2).toUpperCase();
  }

  // ---- song view ----
  const ENH = { Cb: "B", Fb: "E", "B#": "C", "E#": "F" };
  function fixEnharmonic(text) {
    return text.replace(/([A-G])(#|b)?/g, (m, L, acc) => ENH[L + (acc || "")] || m);
  }
  function keyName(baseKey, d) {
    if (!baseKey) return null;
    try {
      return CS.Key.parse(baseKey).transpose(d).toString();
    } catch {
      return null;
    }
  }
  function trKey() {
    return "tr:" + songs[current].title + "|" + vi;
  }

  function renderTabs() {
    const s = songs[current];
    langTabsEl.innerHTML = "";
    if (s.versions.length < 2) {
      langTabsEl.classList.add("hidden");
      return;
    }
    langTabsEl.classList.remove("hidden");
    s.versions.forEach((v, i) => {
      const b = document.createElement("button");
      b.className = "lang-tab" + (i === vi ? " active" : "");
      b.textContent = v.lang || "Version " + (i + 1);
      b.addEventListener("click", () => {
        switchVersion(i);
      });
      langTabsEl.appendChild(b);
    });
  }

  function renderSheet() {
    const v = songs[current].versions[vi];
    let song = v.parsed;
    if (delta !== 0 && song) {
      try {
        song = song.transpose(delta);
      } catch (e) {
        console.error(e);
      }
    }
    sheetEl.innerHTML = song
      ? formatter.format(song)
      : "<p>Could not render this song.</p>";
    // tidy chords: transpose parenthesised chords (ChordSheetJS leaves "(Fm)"
    // literal) and fix impossible enharmonics (Cb->B, Fb->E, B#->C, E#->F)
    closeChordPop(); // a re-render invalidates the tapped chord's index
    let ci = 0; // running index of non-empty chords; must match the order of
    // ChordLyricsPair items in v.parsed (see saveChordEdit)
    sheetEl.querySelectorAll(".chord").forEach((c) => {
      let t = c.textContent;
      const m = t.match(/^\((.+)\)$/);
      if (m && delta) {
        try {
          t = "(" + CS.Chord.parse(m[1]).transpose(delta).toString() + ")";
        } catch {}
      }
      c.textContent = fixEnharmonic(t);
      if (t.trim()) c.dataset.ci = ci++;
    });
    // Preserve inter-word spaces that sit at a chord boundary. ChordSheetJS
    // splits "Hold me[G] close" into columns "Hold me" + " close"; the browser
    // trims the leading/trailing space of each flex column, gluing the words
    // ("Hold meclose"). Convert those edge spaces to non-breaking spaces so the
    // gap survives (interior spaces stay breakable, so long lines still wrap).
    const NBSP = " ";
    sheetEl.querySelectorAll(".lyrics").forEach((l) => {
      const t = l.textContent;
      if (!t || !/^ | $/.test(t)) return;
      l.textContent = t.replace(/^ +| +$/g, (m) => NBSP.repeat(m.length));
    });

    let now = keyName(v.key, delta);
    if (now) now = fixEnharmonic(now);
    keyNowEl.textContent =
      now || (delta === 0 ? "\u2014" : delta > 0 ? "+" + delta : String(delta));
    if (v.key) {
      const offset =
        delta === 0 ? "" : "  (" + (delta > 0 ? "+" + delta : delta) + ")";
      keylineEl.innerHTML =
        "Original key <b>" +
        escapeHtml(v.key) +
        "</b>" +
        (now && now !== v.key
          ? " &nbsp;&middot;&nbsp; now <b>" + escapeHtml(now) + "</b>" + offset
          : "");
    } else {
      keylineEl.innerHTML =
        delta === 0
          ? "No key set"
          : "Transposed " + (delta > 0 ? "+" + delta : delta) + " semitone(s)";
    }
    // show "save key" only when transposed on a saved (DB) song
    $("key-save").classList.toggle(
      "hidden",
      delta === 0 || current === null || !(songs[current].uid || "").startsWith("g:"),
    );
  }

  const ICON_PLAY =
    '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="6 4 20 12 6 20"/></svg>';
  const ICON_PAUSE =
    '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>';
  const ICON_PLUS =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
  const ICON_CHECK =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
  const ICON_STAR =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15 9 22 9.3 17 14 18.5 21 12 17.3 5.5 21 7 14 2 9.3 9 9"/></svg>';
  const ICON_GRIP =
    '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="9" cy="6" r="1.6"/><circle cx="15" cy="6" r="1.6"/><circle cx="9" cy="12" r="1.6"/><circle cx="15" cy="12" r="1.6"/><circle cx="9" cy="18" r="1.6"/><circle cx="15" cy="18" r="1.6"/></svg>';

  function switchVersion(i) {
    vi = i;
    delta = parseInt(store.get(trKey(), "0"), 10) || 0;
    renderTabs();
    renderSheet();
    window.scrollTo(0, 0);
  }

  function restoreOpen() {
    if (current !== null) return;
    const t = store.get("opensong", "");
    if (!t) return;
    const s = songs.find((x) => x.title === t);
    if (s) openSong(s);
  }
  // open from the list: set up the swipe sequence from the current view
  function openSong(song) {
    // push a history entry so the phone's Back gesture returns to the list
    // (instead of leaving the app); popstate closes the song.
    history.pushState({ view: "song" }, "");
    navList = currentMatches.slice();
    navPos = navList.indexOf(song);
    showSong(songs.indexOf(song));
  }
  // swipe / arrow navigation within the current sequence
  function gotoNav(d) {
    if (current === null) return;
    // self-heal: if the sequence got stale (e.g. after a catalog rebuild)
    if (navPos < 0 || navList.indexOf(songs[current]) < 0) syncNav();
    if (navPos < 0) return;
    const np = navPos + d;
    if (np < 0 || np >= navList.length) return;
    const idx = songs.indexOf(navList[np]);
    if (idx < 0) return;
    navPos = np;
    showSong(idx, d);
  }
  // rebuild the swipe sequence around the open song (after a catalog rebuild)
  function syncNav() {
    if (current === null) return;
    navList = currentMatches.slice();
    navPos = navList.indexOf(songs[current]);
  }
  function animateSheet(dir) {
    const name = dir > 0 ? "songNext" : dir < 0 ? "songPrev" : "songIn";
    [titleEl, keylineEl, sheetEl].forEach((el) => {
      el.style.animation = "none";
      void el.offsetWidth; // reflow so the animation re-runs
      el.style.animation = name + " var(--t-med) var(--ease)";
    });
  }
  function showSong(i, dir = 0) {
    if (current === null) listScrollY = window.scrollY;
    current = i;
    store.set("opensong", songs[i].title); // survive a page refresh
    vi = 0;
    stopScroll();
    titleEl.textContent = songs[i].title;
    delta = parseInt(store.get(trKey(), "0"), 10) || 0;
    renderTabs();
    renderSheet();
    updateSetBtn();
    updateFavBtn();
    $("edit-btn").classList.toggle("hidden", !songs[i].uid);
    listView.classList.add("hidden");
    songView.classList.remove("hidden");
    fabWrap.classList.remove("hidden");
    closeControls(); // start with the bubble closed
    requestWakeLock();
    window.scrollTo(0, 0);
    progressEl.classList.remove("hidden");
    updateProgress();
    animateSheet(dir);
  }

  function closeSong() {
    store.set("opensong", "");
    document.documentElement.classList.remove("stage");
    stopScroll();
    releaseWakeLock();
    current = null;
    songView.classList.add("hidden");
    listView.classList.remove("hidden");
    fabWrap.classList.add("hidden");
    closeControls();
    progressEl.classList.add("hidden");
    // reflect set changes made while the song was open, then restore place
    renderList();
    updateSetCount();
    window.scrollTo(0, listScrollY);
  }

  // ---- reading / autoscroll progress bar ----
  const progressEl = $("progress"),
    progressFill = $("progress-fill");
  function updateProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    progressFill.style.width = (pct * 100).toFixed(1) + "%";
  }
  window.addEventListener(
    "scroll",
    () => {
      if (current !== null) updateProgress();
    },
    { passive: true },
  );

  // ---- keep screen awake while a song is open ----
  let wakeLock = null;
  async function requestWakeLock() {
    if (!("wakeLock" in navigator)) return;
    try {
      wakeLock = await navigator.wakeLock.request("screen");
      wakeLock.addEventListener("release", () => {
        wakeLock = null;
      });
    } catch {
      /* denied or unsupported — silently ignore */
    }
  }
  function releaseWakeLock() {
    try {
      if (wakeLock) wakeLock.release();
    } catch {}
    wakeLock = null;
  }
  // re-acquire after the tab/app returns to the foreground
  document.addEventListener("visibilitychange", () => {
    if (
      document.visibilityState === "visible" &&
      current !== null &&
      !wakeLock
    ) {
      requestWakeLock();
    }
  });

  function transpose(step) {
    delta += step;
    if (delta > 11) delta = 11;
    if (delta < -11) delta = -11;
    store.set(trKey(), String(delta));
    renderSheet();
  }
  function resetTranspose() {
    if (delta === 0) return;
    delta = 0;
    store.set(trKey(), "0");
    renderSheet();
  }
  // admin: bake the current transpose into the song as its real key (for everyone)
  async function bakeTranspose() {
    if (current === null || delta === 0) return;
    const song = songs[current];
    if (!song.uid || !song.uid.startsWith("g:") || !sbOn()) return;
    const v = song.versions[vi];
    if (!v.parsed) return;
    if (!confirm("Save the current key for everyone? This rewrites the song's chords."))
      return;
    let cp;
    try {
      cp = new CS.ChordProFormatter().format(v.parsed.transpose(delta));
    } catch {
      alert("Couldn't transpose this song.");
      return;
    }
    const newKey = fixEnharmonic(keyName(v.key, delta) || v.key || "");
    if (newKey)
      cp = /\{key:/i.test(cp)
        ? cp.replace(/\{key:[^}]*\}/i, "{key: " + newKey + "}")
        : "{key: " + newKey + "}\n" + cp;
    const row = getGlobalCache().find(
      (x) => "g:" + (x.num != null ? x.num : x.id) === song.uid,
    );
    if (!row) return;
    let data = row.data;
    if (data && typeof data === "object" && data.versions) {
      data = JSON.parse(JSON.stringify(data));
      if (data.versions[vi]) data.versions[vi].text = cp;
    } else {
      data = cp;
    }
    let res = await sbWrite({ data, src: null }, song.uid.slice(2));
    if (res.needLogin) {
      if (!(await promptLogin())) return;
      res = await sbWrite({ data, src: null }, song.uid.slice(2));
    }
    if (!res.ok) {
      alert("Couldn't save the new key.");
      return;
    }
    store.set(trKey(), "0");
    const uid = song.uid;
    await refreshGlobal();
    delta = 0;
    rerenderOpen(uid);
  }

  // ---- chord popover: tap a chord for its diagram; admins can edit it ----
  let cpCi = -1; // index of the tapped chord among the sheet's non-empty chords
  function canEditChord() {
    if (current === null) return false;
    const uid = songs[current].uid || "";
    if (!uid) return false; // seed songs can't be persisted
    return uid.startsWith("g:") ? loggedIn() : true; // local songs: no login
  }
  function openChordPop(chordEl) {
    const name = chordEl.textContent.trim();
    if (!name) return;
    cpCi = parseInt(chordEl.dataset.ci, 10);
    $("cp-name").textContent = name;
    const dia = window.ChordDiagram ? ChordDiagram.svg(name) : null;
    $("cp-body").innerHTML = dia || '<div class="cp-nodia">No diagram</div>';
    $("cp-edit").classList.toggle("hidden", !canEditChord());
    $("cp-editrow").classList.add("hidden");
    $("cp-err").classList.add("hidden");
    $("chordpop").classList.remove("hidden");
    // anchor near the chord, clamped inside the viewport
    const card = $("cp-card");
    const r = chordEl.getBoundingClientRect();
    card.style.visibility = "hidden";
    requestAnimationFrame(() => {
      const cw = card.offsetWidth,
        ch = card.offsetHeight;
      const x = Math.min(
        Math.max(8, r.left + r.width / 2 - cw / 2),
        window.innerWidth - cw - 8,
      );
      let y = r.bottom + 10;
      if (y + ch > window.innerHeight - 12) y = r.top - ch - 10;
      if (y < 8) y = Math.max(8, (window.innerHeight - ch) / 2);
      card.style.left = x + "px";
      card.style.top = y + "px";
      card.style.visibility = "";
    });
  }
  function closeChordPop() {
    const p = $("chordpop");
    if (p) p.classList.add("hidden");
    cpCi = -1;
  }
  function startChordEdit() {
    $("cp-editrow").classList.remove("hidden");
    const inp = $("cp-input");
    inp.value = $("cp-name").textContent;
    inp.focus();
    inp.select();
  }
  function cpError(msg) {
    const e = $("cp-err");
    e.textContent = msg;
    e.classList.remove("hidden");
  }
  async function saveChordEdit() {
    if (current === null || cpCi < 0) return closeChordPop();
    const song = songs[current];
    const v = song.versions[vi];
    if (!v || !v.parsed) return closeChordPop();
    const val = $("cp-input").value.trim();
    if (!val) return; // empty would silently drop the chord; require a value
    if (val === $("cp-name").textContent) return closeChordPop();
    const parens = /^\(.*\)$/.test(val);
    let core = parens ? val.slice(1, -1) : val;
    // the sheet may be shown transposed: store the chord untransposed so it
    // renders back to what was typed at the current offset
    if (delta !== 0) {
      let ch = null;
      try {
        ch = CS.Chord.parse(core);
      } catch {}
      if (!ch) {
        cpError("Chord not recognised — reset transpose to edit it as-is.");
        return;
      }
      core = fixEnharmonic(ch.transpose(-delta).toString());
    }
    const stored = parens ? "(" + core + ")" : core;
    // find the cpCi-th non-empty chord pair (same order as the rendered sheet)
    let n = 0,
      pair = null;
    v.parsed.lines.forEach((l) =>
      l.items.forEach((it) => {
        if (pair || !(it instanceof CS.ChordLyricsPair)) return;
        if (!(it.chords && it.chords.trim())) return;
        if (n === cpCi) pair = it;
        n++;
      }),
    );
    if (!pair) return closeChordPop();
    const oldChord = pair.chords;
    pair.chords = stored;
    let cp;
    try {
      cp = new CS.ChordProFormatter().format(v.parsed);
    } catch {
      pair.chords = oldChord;
      cpError("Couldn't rewrite the song.");
      return;
    }
    const uid = song.uid;
    if (uid && uid.startsWith("g:") && sbOn()) {
      const row = getGlobalCache().find(
        (x) => "g:" + (x.num != null ? x.num : x.id) === uid,
      );
      if (!row) {
        pair.chords = oldChord;
        return closeChordPop();
      }
      let data = row.data;
      if (data && typeof data === "object" && data.versions) {
        data = JSON.parse(JSON.stringify(data));
        // versions are shown sorted (English first): match by text, then lang
        const dv =
          data.versions.find((x) => (x.text || x.chordpro || "") === v.raw) ||
          data.versions.find((x) => (x.lang || "") === (v.lang || "")) ||
          data.versions[vi];
        if (!dv) {
          pair.chords = oldChord;
          return closeChordPop();
        }
        dv.text = cp;
      } else {
        data = cp;
      }
      const upd = { data, src: null };
      if (hasPrevCol) upd.prev = row.data; // keep "restore previous" working
      let res = await sbWrite(upd, uid.slice(2));
      if (res.needLogin) {
        if (!(await promptLogin())) {
          pair.chords = oldChord;
          return;
        }
        res = await sbWrite(upd, uid.slice(2));
      }
      if (!res.ok) {
        pair.chords = oldChord;
        cpError("Couldn't save. Check your connection / admin login.");
        return;
      }
      closeChordPop();
      await refreshGlobal();
      rerenderOpen(uid);
    } else if (uid && !uid.startsWith("g:")) {
      const list = getUserSongs();
      const s = list.find((x) => x.id === uid);
      if (s) {
        s.chordpro = cp;
        saveUserSongs(list);
      }
      closeChordPop();
      build();
      renderList();
      rerenderOpen(uid);
    } else {
      pair.chords = oldChord;
      closeChordPop();
    }
  }

  // ---- lyrics-only (hide chords) ----
  function applyChords() {
    const on = store.get("chords", "1") !== "0";
    sheetEl.classList.toggle("lyrics-only", !on);
    const btn = $("chords-btn");
    btn.classList.toggle("on", on);
    btn.title = on ? "Chords on" : "Lyrics only";
  }
  function toggleChords() {
    store.set("chords", store.get("chords", "1") !== "0" ? "0" : "1");
    applyChords();
  }

  // ---- add/remove the open song to the set ----
  function updateSetBtn() {
    const btn = $("set-btn");
    if (!btn || current === null) return;
    const inSet = setHas(songs[current].title);
    btn.classList.toggle("on", inSet);
    btn.innerHTML =
      (inSet ? ICON_CHECK : ICON_PLUS) +
      "<span>" +
      (inSet ? "In set" : "Set") +
      "</span>";
    btn.title = inSet ? "In set" : "Add to set";
  }
  function toggleSet() {
    if (current === null) return;
    setToggle(songs[current].title);
    updateSetBtn();
  }

  // ---- floating controls bubble (FAB) ----
  const fabWrap = $("fab-wrap");
  function openControls() {
    fabWrap.classList.add("open");
    $("fab").setAttribute("aria-label", "Close controls");
  }
  function closeControls() {
    fabWrap.classList.remove("open");
    $("fab").setAttribute("aria-label", "Open controls");
  }
  function toggleControls() {
    fabWrap.classList.contains("open") ? closeControls() : openControls();
  }

  // ---- font size ----
  let size = parseFloat(store.get("size", "1.0"));
  function applySize() {
    size = Math.min(2.2, Math.max(0.8, size));
    document.documentElement.style.setProperty(
      "--sheet-size",
      size.toFixed(2) + "rem",
    );
    store.set("size", size.toFixed(2));
    const now = $("size-now");
    if (now) now.textContent = Math.round(size * 100) + "%";
  }
  function resetSize() {
    size = 1.0;
    applySize();
  }

  // ---- pinch-to-zoom the lyrics (two fingers, while a song is open) ----
  let pinchDist = 0,
    pinchSize = 1;
  const twoDist = (t) =>
    Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
  window.addEventListener(
    "touchstart",
    (e) => {
      if (current !== null && e.touches.length === 2) {
        pinchDist = twoDist(e.touches);
        pinchSize = size;
      }
    },
    { passive: true },
  );
  window.addEventListener(
    "touchmove",
    (e) => {
      if (current !== null && e.touches.length === 2 && pinchDist) {
        e.preventDefault();
        size = pinchSize * (twoDist(e.touches) / pinchDist);
        applySize();
      }
    },
    { passive: false },
  );
  window.addEventListener(
    "touchend",
    (e) => {
      if (e.touches.length < 2) pinchDist = 0;
    },
    { passive: true },
  );

  // ---- theme ----
  const ICON_SUN =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  const ICON_MOON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    // tell the browser the page is this scheme so phone "force dark" doesn't
    // override our light theme
    document.documentElement.style.colorScheme = t === "light" ? "light" : "dark";
    // show the icon for what you'll switch TO
    $("theme-btn").innerHTML = t === "light" ? ICON_MOON : ICON_SUN;
    document
      .querySelector('meta[name="theme-color"]')
      .setAttribute("content", t === "light" ? "#f4efe5" : "#0d0e12");
    store.set("theme", t);
  }

  // ---- autoscroll ----
  let scrolling = false,
    rafId = null,
    scrollAcc = 0;
  let scrollSpeed = parseFloat(store.get("scrollspeed", "0.6"));
  const scrollBtn = $("scroll-btn");
  function tick() {
    if (!scrolling) return;
    scrollAcc += scrollSpeed;
    if (scrollAcc >= 1) {
      const px = Math.floor(scrollAcc);
      window.scrollBy(0, px);
      scrollAcc -= px;
    }
    updateProgress();
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
      stopScroll();
      return;
    }
    rafId = requestAnimationFrame(tick);
  }
  function startScroll() {
    if (scrolling) return;
    scrolling = true;
    scrollBtn.classList.add("on");
    scrollBtn.innerHTML = ICON_PAUSE;
    progressEl.classList.add("scrolling");
    rafId = requestAnimationFrame(tick);
  }
  function stopScroll() {
    scrolling = false;
    if (rafId) cancelAnimationFrame(rafId);
    scrollBtn.classList.remove("on");
    scrollBtn.innerHTML = ICON_PLAY;
    progressEl.classList.remove("scrolling");
  }

  // ---- utils ----
  function escapeHtml(s) {
    return String(s).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  }

  // ---- init ----
  function init() {
    document.title = APP_NAME;
    $("brand").textContent = APP_NAME;
    build();
    initSets();
    const imported = checkHashImport();
    // restore the tab you were on (All/Set); a shared link forces the Set tab
    setListMode(imported ? "set" : store.get("listmode", "all"));
    if (!imported) restoreOpen(); // reopen the song that was open before refresh
    refreshGlobal(); // pull the shared catalog (updates the list when it arrives)
    if (!loggedIn()) refreshSession().then((ok) => ok && updateAdminUI()); // remember-me
    const sysLight =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches;
    applyTheme(store.get("theme", sysLight ? "light" : "dark"));
    applySize();
    applyChords();
    updateSetCount();

    // never start a text selection inside the list (press-and-hold reorders)
    listEl.addEventListener("selectstart", (e) => e.preventDefault());

    const searchClear = $("search-clear");
    const updateSearchClear = () =>
      searchClear &&
      searchClear.classList.toggle("show", searchEl.value.length > 0);
    searchEl.addEventListener("input", (e) => {
      updateSearchClear();
      renderList(e.target.value);
    });
    if (searchClear)
      searchClear.addEventListener("click", () => {
        searchEl.value = "";
        updateSearchClear();
        renderList("");
        searchEl.focus();
      });
    $("theme-btn").addEventListener("click", () =>
      applyTheme(
        document.documentElement.getAttribute("data-theme") === "light"
          ? "dark"
          : "light",
      ),
    );
    // the in-app Back button uses history so it stays in sync with the
    // phone's Back gesture (both pop the entry pushed in openSong)
    $("back").addEventListener("click", () => {
      if (current !== null) history.back();
    });
    $("brand").addEventListener("click", () => {
      if (current !== null) history.back();
      else window.scrollTo(0, 0);
    });
    $("key-up").addEventListener("click", () => transpose(1));
    $("key-down").addEventListener("click", () => transpose(-1));
    $("key-reset").addEventListener("click", resetTranspose);
    $("key-save").addEventListener("click", bakeTranspose);
    // chord popover (diagram + admin edit)
    sheetEl.addEventListener("click", (e) => {
      const c = e.target.closest(".chord");
      if (c && c.dataset.ci != null) openChordPop(c);
    });
    $("chordpop").addEventListener("click", (e) => {
      if (e.target === $("chordpop")) closeChordPop();
    });
    $("cp-edit").addEventListener("click", startChordEdit);
    $("cp-save").addEventListener("click", saveChordEdit);
    $("cp-input").addEventListener("keydown", (e) => {
      if (e.key === "Enter") saveChordEdit();
      if (e.key === "Escape") closeChordPop();
    });
    $("size-reset").addEventListener("click", resetSize);
    $("add-btn").addEventListener("click", () => openEditor());
    $("ed-close").addEventListener("click", closeEditor);
    $("ed-save").addEventListener("click", saveEditor);
    $("ed-delete").addEventListener("click", deleteEditor);
    $("ed-biling").addEventListener("change", () =>
      $("ed-block2").classList.toggle("hidden", !$("ed-biling").checked),
    );
    $("ed-login").addEventListener("click", async () => {
      if (await promptLogin()) {
        updateAdminUI();
        refreshGlobal();
      }
    });
    $("ed-logout").addEventListener("click", logoutAdmin);
    $("editor").addEventListener("click", (e) => {
      if (e.target.id === "editor") closeEditor();
    });
    $("pdf-btn").addEventListener("click", () => {
      closeControls();
      setTimeout(() => window.print(), 80);
    });
    $("edit-btn").addEventListener("click", () => {
      if (current !== null && songs[current].uid) {
        closeControls();
        openEditor(songs[current].uid);
      }
    });
    $("stage-btn").addEventListener("click", () => {
      document.documentElement.classList.toggle("stage");
      closeControls();
    });
    $("fav-btn").addEventListener("click", () => {
      if (current === null) return;
      favToggle(songs[current].title);
      updateFavBtn();
    });
    $("ed-restore").addEventListener("click", restorePrev);
    // back-to-top (list view only) — quick custom ease (native "smooth" is slow
    // and scales with distance; this is a fixed, snappy ~260ms)
    const totop = $("totop");
    function scrollToTopFast() {
      const start = window.scrollY;
      if (start <= 0) return;
      const dur = 260;
      const t0 = performance.now();
      const ease = (p) => 1 - Math.pow(1 - p, 3); // easeOutCubic
      const step = (now) => {
        const p = Math.min(1, (now - t0) / dur);
        window.scrollTo(0, Math.round(start * (1 - ease(p))));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
    totop.addEventListener("click", scrollToTopFast);
    window.addEventListener(
      "scroll",
      () => {
        const show = current === null && window.scrollY > 400;
        totop.classList.toggle("hidden", !show);
      },
      { passive: true },
    );
    $("chords-btn").addEventListener("click", toggleChords);
    $("set-btn").addEventListener("click", toggleSet);
    $("fab").addEventListener("click", toggleControls);
    // clicks inside the control panel never close it (a button may swap its own
    // icon mid-click, detaching the target and tricking the outside-check below)
    $("fab-panel").addEventListener("click", (e) => e.stopPropagation());
    // tap outside the bubble (on the song) closes it
    document.addEventListener("click", (e) => {
      if (fabWrap.classList.contains("open") && !fabWrap.contains(e.target)) {
        closeControls();
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeControls();
      if (current === null) return;
      if (e.target.matches && e.target.matches("input, textarea, select")) return;
      if (e.key === "ArrowRight") gotoNav(1);
      if (e.key === "ArrowLeft") gotoNav(-1);
    });
    $("tab-all").addEventListener("click", () => setListMode("all"));
    $("tab-set").addEventListener("click", () => setListMode("set"));
    $("set-clear").addEventListener("click", () => {
      if (!getSet().length) return;
      if (!confirm("Clear all songs from this set?")) return;
      clearSet();
      renderList();
    });
    // named-set controls
    $("set-select").addEventListener("change", (e) => switchSet(e.target.value));
    $("set-new").addEventListener("click", () => {
      const name = prompt("Name this set:", "");
      if (name === null) return;
      createSet(name.trim() || "New set");
      renderSetBar();
      updateSetCount();
      renderList();
    });
    $("set-rename").addEventListener("click", () => {
      const s = activeSet();
      if (!s) return;
      const name = prompt("Rename set:", s.name);
      if (name === null) return;
      renameSet(s.id, name.trim() || s.name);
      renderSetBar();
    });
    $("set-delete").addEventListener("click", () => {
      const s = activeSet();
      if (!s) return;
      if (!confirm('Delete the set "' + s.name + '"?')) return;
      deleteSet(s.id);
      renderSetBar();
      updateSetCount();
      renderList();
    });
    $("set-share").addEventListener("click", shareSet);
    $("share-close").addEventListener("click", closeShare);
    $("share").addEventListener("click", (e) => {
      if (e.target.id === "share") closeShare();
    });
    $("share-copy").addEventListener("click", () => {
      const link = $("share-link").value;
      navigator.clipboard?.writeText(link).then(
        () => ($("share-copy").textContent = "Copied!"),
        () => {},
      );
      setTimeout(() => ($("share-copy").textContent = "Copy link"), 1500);
    });
    $("share-native").addEventListener("click", () => {
      if (navigator.share) navigator.share({ url: $("share-link").value }).catch(() => {});
    });
    $("set-import").addEventListener("click", importSetPrompt);
    // swipe anywhere (while a song is open) to move between songs
    let sx = 0,
      sy = 0,
      swiping = false;
    function swipeStart(x, y, target) {
      swiping = false;
      // never while the editor is open
      if (!$("editor").classList.contains("hidden")) return;
      const inChrome =
        target && target.closest && target.closest("#fab-wrap, #editor");
      if (current === null) {
        // list view: allow a horizontal swipe to switch All <-> Set, but not
        // when it starts on the tabs/toolbar or a reorder grip
        if (listView.classList.contains("hidden")) return;
        if (
          target &&
          target.closest &&
          target.closest(".list-tabs, .set-bar, .tag-bar, .row-drag")
        )
          return;
      } else {
        // song view: no song-switching while the controls bubble is open
        if (fabWrap.classList.contains("open") || inChrome) return;
      }
      sx = x;
      sy = y;
      swiping = true;
    }
    function swipeEnd(x, y) {
      if (!swiping) return;
      swiping = false;
      const dx = x - sx,
        dy = y - sy;
      if (!(Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3)) return;
      if (current === null) {
        if (suppressSwipe) return; // a hold-to-reorder just finished
        // swipe left -> Set, swipe right -> All songs
        setListMode(dx < 0 ? "set" : "all");
      } else {
        gotoNav(dx < 0 ? 1 : -1);
      }
    }
    // touch (phones) — passive so vertical scrolling is unaffected
    window.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches.length !== 1) {
          swiping = false;
          return;
        }
        swipeStart(e.touches[0].clientX, e.touches[0].clientY, e.target);
      },
      { passive: true },
    );
    window.addEventListener(
      "touchend",
      (e) => {
        const t = e.changedTouches[0];
        if (t) swipeEnd(t.clientX, t.clientY);
      },
      { passive: true },
    );
    $("size-up").addEventListener("click", () => {
      size += 0.1;
      applySize();
    });
    $("size-down").addEventListener("click", () => {
      size -= 0.1;
      applySize();
    });
    scrollBtn.addEventListener("click", () =>
      scrolling ? stopScroll() : startScroll(),
    );
    $("scroll-fast").addEventListener("click", () => {
      scrollSpeed = Math.min(6, scrollSpeed + 0.4);
      store.set("scrollspeed", String(scrollSpeed));
    });
    $("scroll-slow").addEventListener("click", () => {
      scrollSpeed = Math.max(0.3, scrollSpeed - 0.4);
      store.set("scrollspeed", String(scrollSpeed));
    });
    window.addEventListener("popstate", () => {
      if (!$("editor").classList.contains("hidden")) {
        if (editorClosing) {
          editorClosing = false;
          closeEditorUI();
          return;
        }
        // desktop: ignore a stray back gesture, keep the editor (and edits) up
        if (editKeepOpen) {
          history.pushState({ ed: 1 }, "");
          return;
        }
        closeEditorUI(); // phones: the back gesture closes the editor
        return;
      }
      if (current !== null) closeSong();
    });
  }
  document.addEventListener("DOMContentLoaded", init);
})();
