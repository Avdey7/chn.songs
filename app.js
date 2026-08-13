/* ============================================================================
   New Hope Band songbook - app logic. You normally won't need to touch this
   file - add songs in songs.js. Edit the app name on the next line if you like.

   Author: Avdey Axonov
   License: MIT (see LICENSE) - Copyright (c) 2026 Avdey Axonov
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
    // admin write controls are hidden from signed-out readers: a guitarist
    // should never see + / Edit only to discover Save fails. Reflect the
    // session instantly (called on login, logout, and refresh-session resolve).
    // ONE source of truth for admin chrome: a class on <html>, which the
    // pre-paint script in <head> already set from localStorage. CSS keys the +
    // and the padlock off it, so the first painted frame is correct and nothing
    // flashes in either direction.
    document.documentElement.classList.toggle("is-admin", inn);
    const editBtn = $("edit-btn");
    if (editBtn) editBtn.classList.toggle("hidden", !inn);
    const si = $("fab-signin");
    if (si) {
      // Label only -- the signed-in email is deliberately NOT rendered here. It
      // is noise in a controls panel; the aria-label below still carries the
      // identity for assistive tech.
      $("fab-signin-label").textContent = inn ? "Sign out" : "Sign in";
      $("fab-auth-btn").setAttribute(
        "aria-label",
        inn ? "Sign out" : "Sign in as an administrator",
      );
    }
    // list-header padlock: accented + relabelled while signed in, so the session
    // is visible from the screen the app opens on
    const la = $("list-auth-btn");
    if (la) {
      // The open/closed shackle is chosen by CSS off html.is-admin (set before
      // first paint), so there is nothing to swap here.
      const lbl = inn
        ? "Signed in as " + store.get("sb_email", "admin") + " - tap to sign out"
        : "Sign in to edit songs";
      la.setAttribute("aria-label", lbl);
      la.title = lbl;
    }
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
      const newStr = JSON.stringify(await r.json());
      const oldStr = store.get("globalsongs", "");
      store.set("globalsongs", newStr);
      // catalog unchanged since the cache the list was built from -> nothing to
      // rebuild; skip the re-normalize + full list re-render (avoids a flash on
      // every launch). songs.length guard: only skip once the list is built.
      if (newStr === oldStr && songs && songs.length) return;
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
  // Supabase ROTATES refresh tokens: each one is single-use. Two overlapping
  // refreshes (boot restore + an ensureAuth from a save) meant the second sent
  // an already-spent token, got a 400, and the handler below cleared
  // sb_refresh -- silently ending a "remember me" session for good. Every
  // caller now shares one in-flight request.
  let refreshInFlight = null;
  function refreshSession() {
    if (refreshInFlight) return refreshInFlight;
    refreshInFlight = doRefreshSession().finally(() => {
      refreshInFlight = null;
    });
    return refreshInFlight;
  }
  async function doRefreshSession() {
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
  // disabled/loading state for the login submit while the request is in flight
  // (prevents a double submit on a slow network). 44px target preserved.
  function setLoginBusy(busy) {
    const btn = $("login-go");
    if (!btn) return;
    btn.disabled = busy;
    btn.textContent = busy ? "Signing in\u2026" : "Log in";
    $("login-pass").disabled = busy;
    $("login-email").disabled = busy;
  }
  // masked login dialog -> resolves true if signed in
  function promptLogin() {
    return new Promise((resolve) => {
      const ov = $("login");
      $("login-email").value = store.get("sb_email", "");
      $("login-pass").value = "";
      const err = $("login-err");
      err.hidden = true;
      err.textContent = "";
      setLoginBusy(false);
      ov.classList.remove("hidden");
      document.documentElement.classList.add("noscroll");
      setTimeout(() => $("login-email").focus(), 0); // autofocus email field
      const finish = (ok) => {
        setLoginBusy(false);
        ov.classList.add("hidden");
        document.documentElement.classList.remove("noscroll");
        $("login-go").removeEventListener("click", go);
        $("login-cancel").removeEventListener("click", cancel);
        ov.removeEventListener("keydown", onKey);
        const pw = $("login-toggle");
        if (pw) pw.removeEventListener("click", togglePw);
        resolve(ok);
      };
      const fail = () => {
        err.hidden = false;
        err.textContent =
          "Sign-in failed. Check your email and password, and that you are online.";
        setLoginBusy(false);
      };
      const go = async () => {
        if ($("login-go").disabled) return; // already in flight - no double submit
        setLoginBusy(true);
        err.hidden = true;
        const ok = await adminLogin(
          $("login-email").value.trim(),
          $("login-pass").value,
          $("login-remember").checked,
        );
        if (!ok) return fail();
        updateAdminUI(); // reveal admin controls the moment the session lands
        finish(true);
      };
      const togglePw = () => {
        const inp = $("login-pass");
        const show = inp.type === "password";
        inp.type = show ? "text" : "password";
        $("login-toggle").setAttribute("aria-pressed", String(show));
        $("login-toggle").setAttribute(
          "aria-label",
          show ? "Hide password" : "Show password",
        );
      };
      const cancel = () => finish(false);
      const onKey = (e) => {
        if (e.key === "Enter") go();
        if (e.key === "Escape") cancel();
      };
      $("login-go").addEventListener("click", go);
      $("login-cancel").addEventListener("click", cancel);
      ov.addEventListener("keydown", onKey);
      $("login-toggle").addEventListener("click", togglePw);
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
  // strip diacritics so search is accent-insensitive: "gloria" finds "Glória",
  // "cafe" finds "Café" (and Cyrillic combining marks like й→и, ї→і normalize).
  // Distinct Cyrillic letters (и vs і) are left alone. Applied to both the
  // stored search text and the query.
  function deaccent(s) {
    return s.normalize("NFD").replace(/[̀-ͯ]/g, "");
  }
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
    preverse: "Pre-Verse", передкуплет: "Pre-Verse", передзаспів: "Pre-Verse",
    prebridge: "Pre-Bridge", передбридж: "Pre-Bridge",
    chorus: "Chorus", приспів: "Chorus", припев: "Chorus",
    altchorus: "Alt Chorus", alternatechorus: "Alt Chorus", alternativechorus: "Alt Chorus",
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
    "altchorus", "alternatechorus", "alternativechorus",
  ]);
  // repeat marker in any order/notation -> canonical "xN" (2x, х2, (2x) -> x2)
  function normRepeat(s) {
    const m = String(s).match(/(\d+)\s*[xх]|[xх]\s*(\d+)/i);
    return m ? "x" + (m[1] || m[2]) : s;
  }
  // "no chord" marker, shown in the chord row like a chord: N.C. / NC / (N.C.)
  const NC_RE = /^\(?\s*(?:n\.?\s*c\.?|no\s*chord)\s*\)?$/i;
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
    const repM = rest.match(/\(?\s*(?:\d+[xх]|[xх]\s*\d+)\s*\)?/i);
    if (repM) {
      rep = normRepeat(repM[0]); // 2x / (2x) / х2 -> x2
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
      if (BRACKET_CHORD.test(tok) || CHORD_RE.test(tok) || NC_RE.test(tok)) {
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
      else if (NC_RE.test(tok)) out.push("[N.C.]"); // no-chord marker as a chord
      else if (CHORD_RE.test(tok)) out.push("[" + tok + "]");
      else if (/[xх]\s*\d|\d\s*[xх]/i.test(tok)) out.push(normRepeat(tok)); // x2 / (2x) -> x2
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
    // word ("me[G] close"), the following space is a real word gap - keep it,
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
      // a standalone note/annotation line ("*...") not attached to a header
      if (t.startsWith("*")) {
        out.push("{comment: " + t + "}");
        i++;
        continue;
      }
      // split a trailing "*note" off a header line ("Verse 1 *somethin")
      let headText = t,
        inlineNote = "";
      const hn = t.match(/^(.+?)\s+(\*.+)$/);
      if (hn && (isHeaderLine(hn[1]) || bracketTokens(hn[1]))) {
        headText = hn[1].trim();
        inlineNote = hn[2].trim();
      }
      const comm = headText.match(/^\{(?:comment|c|ci)\s*:\s*(.+?)\}$/i);
      const bt = bracketTokens(headText); // ["CHORUS","x2"] for "[CHORUS] [x2]"
      let isHeader = false,
        isChorus = false,
        labelStr = "";
      if (isHeaderLine(headText)) {
        isHeader = true;
        labelStr = englishLabel(headText); // bare word -> English label
        isChorus = CHORUS_KEYS.has(headerKey(headText));
      } else if (comm) {
        isHeader = true; // translate the existing comment to English too
        labelStr = englishLabel(comm[1]);
        isChorus = CHORUS_KEYS.has(headerKey(comm[1]));
      } else if (bt) {
        const hasSection = bt.some((x) => SECTION_KEYS.has(headerKey(x)));
        const hasChord = bt.some((x) => CHORD_RE.test(x));
        if (hasSection) {
          isHeader = true;
          labelStr = englishLabel(bt.join(" "));
          isChorus = bt.some((x) => CHORUS_KEYS.has(headerKey(x)));
        } else if (!hasChord) {
          isHeader = true; // marker-only line like "[x2]" -> small label
          labelStr = bt.join(" ");
        }
        // else: real chords (e.g. "[G] [C]") -> leave for chord-line handling
      }
      if (!isHeader) {
        out.push(transformLine(line));
        i++;
        continue;
      }
      i++;
      // a section's notes render INLINE with its label: the inline "*note" plus
      // any "*..." lines that immediately follow the header. Combined into the
      // one {comment:} so renderSheet can style the note part inline.
      const notes = [];
      if (inlineNote) notes.push(inlineNote.replace(/^\*+\s*/, ""));
      while (i < lines.length && lines[i].trim().startsWith("*")) {
        notes.push(lines[i].trim().replace(/^\*+\s*/, ""));
        i++;
      }
      out.push("{comment: " + labelStr + notes.map((n) => " *" + n).join("") + "}");

      if (isChorus && !/^\{(start_of_chorus|soc)\b/i.test((lines[i] || "").trim())) {
        const body = [];
        while (i < lines.length) {
          const l = lines[i];
          if (isHeaderLine(l) || /^\{/.test(l.trim())) break; // next section ends it
          if (l.trim().startsWith("*")) body.push("{comment: " + l.trim() + "}");
          else if (l.trim()) body.push(transformLine(l)); // skip stray blanks inside
          i++;
        }
        if (body.length) {
          out.push("{start_of_chorus}", ...body, "{end_of_chorus}");
        }
      }
    }
    // blank lines only BETWEEN sections (never inside a verse/chorus/bridge):
    // drop every blank, then re-insert exactly one before each section header.
    const tidy = [];
    for (const ln of out) {
      if (!ln.trim()) continue;
      const s = ln.trim();
      // section labels get a blank before them; notes ({comment: *...}) hug
      // the section, so they don't
      const isComment = /^\{(?:comment|c|ci)\s*:\s*(?!\*)/i.test(s);
      const isSoc = /^\{(?:start_of_chorus|soc)\b/i.test(s);
      const prevComment =
        tidy.length && /^\{(?:comment|c|ci)\s*:/i.test(tidy[tidy.length - 1].trim());
      if ((isComment || (isSoc && !prevComment)) && tidy.length) tidy.push("");
      tidy.push(ln);
    }
    return tidy.join("\n");
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
      // Lazy parse: the list only needs the title/key, which we read cheaply by
      // regex (verified identical to ChordSheetJS across the whole catalog).
      // The expensive ChordSheetJS parse is deferred to ensureParsed(), run
      // when a song is actually opened - saves parsing every song on load and
      // on every refreshGlobal.
      const mt = v.text.match(/\{(?:title|t)\s*:\s*([^}]*)\}/i);
      const mk = v.text.match(/\{(?:key|k)\s*:\s*([^}]*)\}/i);
      return {
        lang: v.lang,
        raw: v.text,
        parsed: null,
        parsedDone: false,
        title: mt ? mt[1].trim() : "",
        key: mk ? mk[1].trim() : "",
      };
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
    // tempo (BPM) is a song-level {tempo: N} directive in any version's text
    let bpm = 0;
    for (const v of versions) {
      const bm = v.raw.match(/\{(?:tempo|bpm)\s*:\s*(\d{2,3})\b/i);
      if (bm) { bpm = parseInt(bm[1], 10); break; }
    }
    return {
      title,
      key: versions[0].key || "",
      bpm,
      versions,
      langs,
      langAbbrs,
      searchText: deaccent(searchText + " " + tags.join(" ").toLowerCase()),
      uid: (typeof entry === "object" && entry._uid) || null,
      tags,
    };
  }
  // Parse a version's ChordPro on demand (see normalize's lazy parse). Returns
  // the ChordSheetJS Song or null; caches the result on the version object.
  function ensureParsed(v) {
    if (!v || v.parsedDone) return v ? v.parsed : null;
    v.parsedDone = true;
    try {
      v.parsed = parser.parse(standardize(v.raw));
    } catch (e) {
      console.error("Parse error:", e);
      v.parsed = null;
    }
    return v.parsed;
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
  function buildChordPro(name, key, lang, text, german, bpm) {
    const tempo = bpm ? String(bpm).replace(/\D/g, "") : "";
    const withTempo = (t) => {
      if (!tempo) return t;
      return /\{tempo:/i.test(t)
        ? t.replace(/\{tempo:[^}]*\}/i, "{tempo: " + tempo + "}")
        : "{tempo: " + tempo + "}\n" + t;
    };
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
      return withTempo(t);
    }
    return withTempo(
      window.ChordConvert
        ? window.ChordConvert.convert(text, { title: name, key, german })
        : (name ? "{title: " + name + "}\n" : "") + text,
    );
  }
  const keyOf = (t) => ((t || "").match(/\{key:\s*([^}]+)\}/i) || [])[1]?.trim() || "";
  // ChordPro -> friendly "chords above lyrics" sheet (for editing old songs)
  function chordproToSheet(cp) {
    const lines = String(cp).replace(/\r\n?/g, "\n").split("\n");
    let name = "",
      key = "",
      bpm = "";
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
      if ((m = t.match(/^\{(?:tempo|bpm):\s*(\d{2,3})\}$/i))) {
        bpm = m[1];
        continue;
      }
      if (/^\{(start_of_|end_of_|soc|eoc|sov|eov|sob|eob)/i.test(t)) continue;
      if ((m = t.match(/^\{(?:comment|c|ci)\s*:\s*(.+?)\}$/i))) {
        // one blank line before each section label (never within a section)
        if (out.length && out[out.length - 1].trim() !== "") out.push("");
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
      let chordRow = "", lyricRow = "", prev = 0;
      for (const c of chords) {
        lyricRow += lyric.slice(prev, c.pos);
        prev = c.pos;
        const minChordCol = chordRow.length ? chordRow.length + 1 : 0; // keep >=1 space between chords
        let col = Math.max(lyricRow.length, minChordCol);
        // ONLY stretch the lyric at a WORD BOUNDARY - never split a word
        const atWordStart = c.pos === 0 || /\s/.test(lyric[c.pos - 1] || "");
        if (col > lyricRow.length && atWordStart) lyricRow += " ".repeat(col - lyricRow.length);
        if (col > chordRow.length) chordRow += " ".repeat(col - chordRow.length);
        chordRow += c.sym;
      }
      lyricRow += lyric.slice(prev);
      out.push(chordRow.replace(/\s+$/, ""));
      if (lyric.trim() !== "") out.push(lyricRow.replace(/\s+$/, ""));
    }
    return {
      name,
      key,
      bpm,
      text: out.join("\n").replace(/\n{3,}/g, "\n\n").trim(),
    };
  }
  // The song view always shows the English version first (see the sort in
  // normalize()). The editor used to populate from the raw stored order, which
  // for 9 of 10 bilingual songs put the NON-English text in the top box while
  // the view showed English first - an easy way to paste a correction into the
  // wrong language. Same predicate as normalize() so the two cannot drift.
  const isEnglishLang = (l) => /eng|англ/i.test(l || "");
  function englishFirst(f) {
    if (!f || !f.biling) return f;
    if (isEnglishLang(f.lang) || !isEnglishLang(f.lang2)) return f;
    return {
      ...f,
      lang: f.lang2, key: f.key2, german: !!f.german2, text: f.text2,
      lang2: f.lang, key2: f.key, german2: !!f.german, text2: f.text,
    };
  }
  // Each lyrics box says which language it holds. Box 1 is always the language
  // the song view shows first (see englishFirst), so the two surfaces agree.
  function syncLangLabels() {
    const a = $("ed-lang").value.trim();
    const b = $("ed-lang2").value.trim();
    $("ed-label1").textContent = a || "First language";
    $("ed-label2").textContent = b || "Second language";
  }
  function fillEditor(f) {
    // Normalise here, not at the call sites: build 98 fixed one caller and a
    // second (restorePrev) silently reintroduced the bug. Box 1 must always be
    // the language the song view shows first, whoever is filling the editor.
    f = englishFirst(f || {});
    $("ed-name").value = f.name || "";
    $("ed-tags").value = f.tags || "";
    $("ed-bpm").value = f.bpm || "";
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
    syncLangLabels();
  }
  // ---------- draft autosave: survive an incoming call / tab eviction ----------
  // One draft per session: key "eddraft" holds { uid, t, f:{...field values} }.
  // Saved on a 600ms debounce and flushed synchronously on visibilitychange-hidden,
  // because the debounce timer does NOT survive the tab being backgrounded.
  const DRAFT_KEY = "eddraft";
  let draftTimer = null;
  function snapshotFields() {
    return {
      name: $("ed-name").value, key: $("ed-key").value, lang: $("ed-lang").value,
      text: $("ed-text").value, tags: $("ed-tags").value,
      key2: $("ed-key2").value, lang2: $("ed-lang2").value, text2: $("ed-text2").value,
      german: $("ed-german").checked, biling: $("ed-biling").checked, german2: $("ed-german2").checked,
    };
  }
  function draftEmpty(f) {
    return !(f.name || f.text || f.tags || f.text2 || f.key || f.lang || f.key2 || f.lang2);
  }
  function saveDraftNow() {
    const f = snapshotFields();
    if (draftEmpty(f)) return; // nothing typed yet
    store.set(DRAFT_KEY, JSON.stringify({ uid: editId || "new", t: Date.now(), f }));
  }
  function scheduleDraft() {
    clearTimeout(draftTimer);
    draftTimer = setTimeout(saveDraftNow, 600);
  }
  function clearDraft() {
    clearTimeout(draftTimer);
    store.set(DRAFT_KEY, "");
  }
  function relTime(t) {
    const d = Math.floor((Date.now() - t) / 86400000);
    if (d >= 1) return d === 1 ? "yesterday" : d + " days ago";
    const m = Math.max(1, Math.floor((Date.now() - t) / 60000));
    if (m === 1) return "1 minute ago";
    if (m < 60) return m + " minutes ago";
    return Math.floor(m / 60) + " hours ago";
  }
  function fieldsEqual(a, b) {
    return a.name === b.name && a.key === b.key && a.lang === b.lang && a.text === b.text &&
      a.tags === b.tags && a.key2 === b.key2 && a.lang2 === b.lang2 && a.text2 === b.text2 &&
      !!a.german === !!b.german && !!a.biling === !!b.biling && !!a.german2 === !!b.german2;
  }
  function showDraftBar(uid) {
    const bar = $("ed-draft-bar");
    let d = null;
    try {
      d = JSON.parse(store.get(DRAFT_KEY, "null")) || null;
    } catch {
      d = null;
    }
    if (!d || d.uid !== (uid || "new") || fieldsEqual(d.f, snapshotFields())) {
      bar.classList.add("hidden");
      return;
    }
    $("ed-draft-text").textContent = "Unsaved draft from " + relTime(d.t);
    bar.classList.remove("hidden");
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
          f = { name: g.title || s.name, key: s.key, bpm: s.bpm, text: s.text };
        } else if (g.data && g.data.versions) {
          const v = g.data.versions;
          const s1 = chordproToSheet(v[0] ? v[0].text : "");
          f = {
            name: g.title || s1.name,
            lang: v[0] ? v[0].lang : "",
            key: s1.key,
            bpm: s1.bpm,
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
    edError("");
    showDraftBar(uid);
  }
  function closeEditorUI() {
    $("editor").classList.add("hidden");
    document.documentElement.classList.remove("noscroll");
  }
  // On desktop (mouse/trackpad), an accidental horizontal gesture - e.g. an
  // overscroll while drag-selecting text right-to-left - fires a history back
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
  // Inline editor error, same pattern as #login-err: a failed save must not
  // hide the text the user is trying to rescue behind a modal.
  function edError(msg) {
    const e = $("ed-err");
    if (!e) return;
    e.textContent = msg || "";
    e.hidden = !msg;
    if (msg) e.scrollIntoView({ block: "nearest" });
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
    const bpm = ($("ed-bpm").value || "").replace(/\D/g, "");
    const cp1 = buildChordPro(name, p1.key, p1.lang, p1.text, p1.german, bpm);
    let data;
    if (biling) {
      const cp2 = buildChordPro(name, p2.key, p2.lang, p2.text, p2.german, bpm);
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
      name, biling: !!biling, tags, bpm,
      key: p1.key, lang: p1.lang, german: p1.german, text: p1.text,
      key2: p2.key, lang2: p2.lang, german2: p2.german, text2: p2.text,
    });

    // is the song being edited the one currently open? (re-render it after save)
    const reopenUid =
      current !== null && songs[current].uid === editId ? editId : null;
    // keep renamed songs in their sets AND favorites
    const oldTitle = reopenUid ? songs[current].title : null;
    const renamed = () => {
      if (oldTitle && name && name !== oldTitle) {
        renameInSets(oldTitle, name);
        renameInFavs(oldTitle, name);
      }
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
        clearDraft();
      } else {
        edError("Couldn't save. Check your connection and that you're still signed in as an admin.");
      }
      return;
    }
    // device fallback (single language)
    const list = getUserSongs();
    const rec = { name, key: p1.key, lang: p1.lang, german: p1.german, text: p1.text, bpm, chordpro: cp1 };
    if (editId) {
      const s = list.find((x) => x.id === editId);
      if (s) Object.assign(s, rec);
    } else {
      list.push({ id: "u" + Date.now().toString(36), ...rec });
    }
    saveUserSongs(list);
    clearDraft();
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
    // BOTH conditions: the song must be saved (uid) AND the viewer must be an
    // admin. This ran after updateAdminUI() and used to re-show Edit to signed-out
    // readers every time a song was opened, silently undoing the auth gate.
    $("edit-btn").classList.toggle("hidden", !songs[i].uid || !loggedIn());
    syncNav();
  }
  // In-app replacement for native confirm()/prompt(): one dialog, promise-based.
  // Resolves true / the input string on OK, and false / null on cancel.
  function ask(opts) {
    return new Promise((resolve) => {
      const o = opts || {};
      const prevFocus = document.activeElement;
      const box = $("ask"), inp = $("ask-input"), ok = $("ask-ok"), cancel = $("ask-cancel"), x = $("ask-close");
      $("ask-title").textContent = o.title || "";
      $("ask-msg").textContent = o.message || "";
      $("ask-msg").classList.toggle("hidden", !o.message);
      inp.classList.toggle("hidden", !o.input);
      inp.value = o.input ? (o.value || "") : "";
      ok.textContent = o.okLabel || "OK";
      ok.classList.toggle("danger", !!o.danger);
      cancel.classList.toggle("hidden", !!o.notice);
      box.classList.remove("hidden");
      document.documentElement.classList.add("noscroll");
      const done = (val) => {
        box.classList.add("hidden");
        document.documentElement.classList.remove("noscroll");
        ok.removeEventListener("click", onOk);
        cancel.removeEventListener("click", onCancel);
        x.removeEventListener("click", onCancel);
        document.removeEventListener("keydown", onKey);
        // hand focus back to whatever opened the dialog
        if (prevFocus && typeof prevFocus.focus === "function") prevFocus.focus();
        resolve(val);
      };
      const onOk = () => done(o.input ? inp.value : true);
      const onCancel = () => done(o.input ? null : false);
      const onKey = (e) => {
        if (e.key === "Escape") { e.preventDefault(); onCancel(); return; }
        if (e.key === "Enter" && (document.activeElement === inp || document.activeElement === ok)) { e.preventDefault(); onOk(); return; }
        if (e.key !== "Tab") return;
        // aria-modal promises the rest of the page is inert; keep Tab inside
        const f = [x, inp, cancel, ok].filter(
          (el) => el && !el.classList.contains("hidden") && el.getBoundingClientRect().width > 0,
        );
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      };
      ok.addEventListener("click", onOk);
      cancel.addEventListener("click", onCancel);
      x.addEventListener("click", onCancel);
      document.addEventListener("keydown", onKey);
      setTimeout(() => (o.input ? inp : ok).focus(), 30);
    });
  }
  function askConfirm(title, message, opts) {
    return ask(Object.assign({ title, message }, opts || {}));
  }
  function askPrompt(title, message, value) {
    return ask({ title, message, input: true, value });
  }
  function askNotice(title, message) {
    return ask({ title, message, notice: true });
  }
  async function deleteEditor() {
    if (!editId) return;
    if (!(await askConfirm("Delete song", "Delete this song for everyone?", { okLabel: "Delete", danger: true }))) return;
    const wasOpen = current !== null;
    if (editId.startsWith("g:")) {
      let res = await sbDelete(editId.slice(2));
      if (res.needLogin) {
        if (!(await promptLogin())) return;
        res = await sbDelete(editId.slice(2));
      }
      if (!res.ok) {
        edError("Couldn't delete. Check your connection and that you're still signed in as an admin.");
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
  async function restorePrev() {
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
    await askNotice("Previous version loaded", "Review it, then Save to apply.");
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
    // Generated locally (vendor/qrcode.min.js) rather than fetched from a QR web
    // service: the app is offline-first, and a set is most often shared in a
    // building with poor wifi. It also keeps the set off a third-party server.
    try {
      const qr = qrcode(0, "M"); // type 0 = auto-size, M = ~15% error correction
      qr.addData(url);
      qr.make();
      $("share-qr").src =
        "data:image/svg+xml;charset=utf-8," +
        encodeURIComponent(qr.createSvgTag({ cellSize: 4, scalable: true }));
    } catch (e) {
      $("share-qr").removeAttribute("src"); // link + Copy link still work
    }
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
      let missing = 0; // numeric song ids not in this device's catalog
      let shared = 0; // total song count in the shared set
      if (Array.isArray(obj.v)) {
        shared = obj.v.length;
        // new compact form: numeric ids resolve to titles via the catalog;
        // plain strings are already titles (device-only songs / old links)
        titles = obj.v
          .map((item) => {
            if (typeof item === "number" || /^\d+$/.test(item)) {
              const sg = songs.find((x) => x.uid === "g:" + item);
              if (!sg) { missing++; return null; } // not in this device's catalog
              return sg.title;
            }
            return item;
          })
          .filter(Boolean);
      } else if (Array.isArray(obj.s)) {
        shared = obj.s.length;
        titles = obj.s; // legacy: array of titles
      } else {
        return null;
      }
      const name = obj.n || "Imported set";
      const sets = getSets() || [];
      // don't duplicate: if a set with the same name AND the same song list
      // (order included) already exists, just switch to it instead of adding
      // another copy (re-scanning a QR / reopening a link used to pile up dupes)
      const sameSongs = (a, b) =>
        a.length === b.length && a.every((t, i) => t === b[i]);
      const existing = sets.find(
        (x) => x.name === name && sameSongs(x.songs || [], titles),
      );
      if (existing) {
        activeSetId = existing.id;
        store.set("activeSet", activeSetId);
        return { set: existing, dup: true, shared, missing };
      }
      const s = { id: uid(), name, songs: titles };
      sets.push(s);
      saveSets(sets);
      activeSetId = s.id;
      store.set("activeSet", activeSetId);
      return { set: s, dup: false, shared, missing };
    } catch {
      return null;
    }
  }
  async function importSetPrompt() {
    const text = await askPrompt("Import a set", "Paste a shared set link.", "");
    if (!text) return;
    const r = importFromText(text);
    if (r) {
      const s = r.set;
      setListMode("set");
      renderSetBar();
      if (r.dup) {
        await askNotice("Already imported", 'You already have "' + s.name + '" - switched to it.');
      } else {
        // count titles this device cannot resolve too (device-only / legacy links),
        // on top of the ids importFromText already could not resolve
        const unknown =
          s.songs.filter((t) => !songs.some((x) => x.title === t)).length + (r.missing || 0);
        const total = r.shared || s.songs.length;
        await askNotice(
          "Set imported",
          unknown
            ? 'Imported "' + s.name + '" with ' + (total - unknown) + " of " + total +
              " songs. " + unknown + " are not in your songbook yet - reconnect and reopen the app to sync, then import again."
            : 'Imported "' + s.name + '" - all ' + total + " songs found.",
        );
      }
    } else {
      await askNotice("Could not read that link", "Check that you copied the whole link, then try again.");
    }
  }
  // auto-import when the app is opened from a share link
  function checkHashImport() {
    if (!location.hash.startsWith("#set=")) return false;
    const r = importFromText(location.hash); // dedupes; switches to it if a dup
    history.replaceState(null, "", location.pathname + location.search);
    return !!r;
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
        renumberSetRows(); // DOM order changed -> refresh the running-order numbers
      },
    };
  }
  // renumber the running-order position numbers from current DOM order (only
  // present in Set view). Called after a drag-reorder; remove re-renders list.
  function renumberSetRows() {
    const rows = listEl.querySelectorAll(".row-pos");
    rows.forEach((el, i) => {
      el.textContent = i + 1;
      el.setAttribute("aria-label", "Position " + (i + 1) + " in the set");
    });
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
    if (clear) {
      const empty = n === 0;
      // reserve the space so the tabs row height is identical empty vs
      // populated (the old display:none shifted #list down ~10px on the first
      // add); hide it from view, interaction AND assistive tech when empty.
      clear.classList.toggle("empty", empty);
      if (empty) {
        clear.setAttribute("aria-hidden", "true");
        clear.tabIndex = -1;
      } else {
        clear.removeAttribute("aria-hidden");
        clear.tabIndex = 0;
      }
    }
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
  // a renamed song keeps its favorite star (favorites are matched by title,
  // same as sets - see renameInSets)
  function renameInFavs(oldT, newT) {
    const a = getFavs();
    const i = a.indexOf(oldT);
    if (i < 0) return;
    a[i] = newT;
    store.set("favs", JSON.stringify(a));
  }
  function updateFavBtn() {
    if (current === null) return;
    $("fav-btn").classList.toggle("on", favHas(songs[current].title));
  }
  // circle-of-fifths hue for a key: C=0, G=30, D=60 ... F=330. Minor keys take
  // the hue of their RELATIVE MAJOR (Am -> C) so they read as siblings - which
  // is musically true. Unknown/absent keys return null (neutral tile fallback).
  const SEMITONE = { "Cb": 11, C: 0, "C#": 1, Db: 1, D: 2, "D#": 3, Eb: 3, E: 4, Fb: 4, "F#": 6, Gb: 6, F: 5, "F#": 6, G: 7, "G#": 8, Ab: 8, A: 9, "A#": 10, Bb: 10, B: 11 };
  const HUE_BY_SEMITONE = [0, 210, 60, 270, 120, 330, 180, 30, 240, 90, 300, 150];
  function keyHue(key) {
    const m = /^([A-Ga-g])([#♯b♭]?)(m|min|minor)?/.exec(String(key || "").trim());
    if (!m) return null;
    const letter = m[1].toUpperCase();
    const acc = { "♯": "#", "♭": "b" }[m[2]] || m[2];
    const minor = /m/.test(m[3] || "");
    let st = SEMITONE[letter + acc];
    if (st === undefined) st = SEMITONE[letter];
    if (st === undefined) return null;
    if (minor) st = (st + 3) % 12; // relative major
    return HUE_BY_SEMITONE[st];
  }
  // split a bilingual title "Pri / Sub" into its two display lines, else null
  function splitTitle(title) {
    const parts = String(title || "").split(" / ");
    if (parts.length > 1 && parts[1].trim()) return { a: parts[0].trim(), b: parts[1].trim() };
    return null;
  }

  // persistent swipe affordance: shown whenever the All view has rows (hidden
  // in Set view, and >=641px where real buttons exist - both handled in CSS).
  // Intentionally NOT one-time: a team that already swiped should still be
  // reminded, so there is no "retired" gate and no stored key to read.
  // One hint element, two gestures: the All view teaches swipe-for-actions, the
  // Set view teaches press-and-hold-to-reorder (the visible drag grip is hidden
  // under 641px, so on a phone that gesture has no other affordance at all).
  function syncSwipeHint(show, inSet) {
    const el = $("swipe-hint");
    if (!el) return;
    el.textContent = inSet
      ? "Press and hold a song to reorder"
      : "Swipe left or right for set & favourite";
    el.classList.toggle("hidden", !show);
  }

  // reveal-style row swipe: slide the row's content to expose a shade action on
  // the opposite edge. Only engages on a dominant horizontal drag so vertical
  // scrolling is never hijacked. Release mid-way springs back; past the
  // threshold it stays revealed (non-instant commit) until the action is tapped.
  function enableRowSwipe(li, actions) {
    const content = li.querySelector(".row-content");
    li.style.touchAction = "pan-y";
    const SHADE = 72;
    let sx = 0,
      sy = 0,
      engaged = false;
    li.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches.length !== 1) return;
        if (e.target.closest(".row-shade, .row-desktop-actions")) return;
        sx = e.touches[0].clientX;
        sy = e.touches[0].clientY;
        engaged = false;
        li.classList.remove("swiping");
      },
      { passive: true },
    );
    li.addEventListener(
      "touchmove",
      (e) => {
        const t = e.touches[0];
        if (!t) return;
        const dx = t.clientX - sx;
        const dy = t.clientY - sy;
        if (!engaged) {
          if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return; // still a tap
          if (Math.abs(dx) > Math.abs(dy)) {
            engaged = true; // horizontal wins
            li.classList.add("swiping");
          } else return; // vertical -> let the list scroll
        }
        e.preventDefault();
        let x = Math.max(-SHADE, Math.min(SHADE, dx));
        content.style.transform = "translateX(" + x + "px)";
        // Light ONLY the side being uncovered. .row-content is transparent, so a lit
        // shade on the covered side shows straight through it -- you'd see the star
        // and the plus at once, on a row swiped one way.
        li.classList.toggle("reveal-right", x < 0);
        li.classList.toggle("reveal-left", x > 0);
      },
      { passive: false },
    );
    const end = (e) => {
      li.classList.remove("swiping");
      if (!engaged) return;
      const t = e.changedTouches[0];
      const dx = t ? t.clientX - sx : 0;
      const commit = Math.abs(dx) > 44; // SWIPE ALONE commits - no second tap
      if (!commit) {
        content.style.transform = "translateX(0)"; // below threshold: spring back
        li.classList.remove("swiped", "reveal-left", "reveal-right");
        return;
      }
      const dir = dx > 0 ? 1 : -1; // right = favourite, left = add/remove from set
      // commit the action immediately, then show the revealed (now updated)
      // shade for a beat so the user sees what happened before it springs back
      suppressSwipe = true; // never let a row swipe become a (now-removed) tab switch
      li._suppressClick = true; // and never let it open the song
      li.classList.add("swiped");
      content.style.transform = "translateX(" + dir * SHADE + "px)";
      if (dx > 0) actions.fav();
      else actions.add();
      setTimeout(() => {
        content.style.transform = "translateX(0)"; // spring home
        li.classList.remove("swiped", "reveal-left", "reveal-right");
        li._suppressClick = false;
        suppressSwipe = false;
      }, 260);
    };
    li.addEventListener("touchend", end);
    li.addEventListener("touchcancel", () => {
      content.style.transform = "translateX(0)";
      li.classList.remove("swiped", "reveal-left", "reveal-right");
    });
  }

  function renderList(filter = lastFilter) {
    lastFilter = filter;
    const q = deaccent(filter.trim().toLowerCase());

    // base list depends on the active tab. Universal search: a query searches
    // the whole catalog even from the Set tab; with no query the Set tab shows
    // just the set (in add-order, reorderable).
    const setView = listMode === "set" && !q;
    let base;
    if (setView) {
      // preserve the order songs were added to the set
      base = getSet()
        .map((t) => songs.find((s) => s.title === t))
        .filter(Boolean);
    } else {
      base = songs;
      if (listMode === "all") {
        if (favOnly) base = base.filter((s) => favHas(s.title));
        if (activeTag)
          base = base.filter((s) =>
            (s.tags || []).some((t) => t.toLowerCase() === activeTag),
          );
      }
    }
    renderTagBar();
    const matches = q ? base.filter((s) => s.searchText.includes(q)) : base;
    currentMatches = matches; // swipe/next-prev follows the current view


    listEl.innerHTML = "";
    countEl.textContent = setView
      ? matches.length + (matches.length === 1 ? " song in this set" : " songs in this set")
      : matches.length + (matches.length === 1 ? " song" : " songs");
    // only where the gesture exists: All view (Set rows use remove/drag instead)
    // Set view only offers reordering when the list is unfiltered -- a filtered
    // order does not map onto the stored set -- so do not teach it during a search.
    syncSwipeHint(matches.length > 0 && (!setView || !q), setView);

    if (!matches.length) {
      let msg;
      if (setView && !getSet().length) {
        msg =
          "<strong>No songs in this set yet</strong><span>Open any song and tap <b>Set</b> to add it to your running order.</span>";
      } else if (q) {
        msg =
          "<strong>Nothing found for &ldquo;" + escapeHtml(filter) +
          "&rdquo;</strong><span>Try part of a title, or a line from the lyrics.</span>";
      } else {
        msg =
          "<strong>Your songbook is empty</strong><span>Tap <b>+</b> in the header to add your first song.</span>";
      }
      listEl.innerHTML = '<div class="empty">' + msg + "</div>";
      return;
    }

    const frag = document.createDocumentFragment();
    matches.forEach((s, idx) => {
      const li = document.createElement("li");
      // key letter tile as the row's visual anchor (circle-of-fifths hue)
      const content = document.createElement("div");
      content.className = "row-content";
      const tile = document.createElement("span");
      tile.className = "row-key-tile";
      const hue = s.key ? keyHue(s.key) : null;
      if (hue !== null) {
        tile.style.setProperty("--tile-hue", hue + "deg");
        tile.textContent = s.key;
      } else {
        tile.classList.add("neutral"); // unknown/absent key -> quiet grey tile
        tile.textContent = (s.key || "·").slice(0, 3);
      }
      content.appendChild(tile);
      // title split into primary + secondary (bilingual) lines
      const main = document.createElement("div");
      main.className = "row-main";
      const split = splitTitle(s.title);
      const t = document.createElement("span");
      t.className = "song-title song-primary";
      t.textContent = split ? split.a : s.title;
      main.appendChild(t);
      // declared in the OUTER scope: the language-abbr block below appends to t2
      // when a secondary line exists, and a block-scoped const here threw
      // ReferenceError on every row, silently emptying the whole list.
      let t2 = null;
      if (split) {
        t2 = document.createElement("span");
        t2.className = "song-title song-secondary";
        t2.textContent = split.b;
        main.appendChild(t2);
      }
      // Meta line: language badges plus a persistent favourite star. The star
      // matters because the only other favourite affordances are the desktop
      // buttons (hidden under 641px) and the swipe shade (which springs away) --
      // so on a phone a swipe-to-favourite produced NO lasting visible change.
      const meta = document.createElement("div");
      meta.className = "row-meta";
      if (s.langAbbrs && s.langAbbrs.length) {
        const lb = document.createElement("span");
        lb.className = "song-langs";
        lb.textContent = s.langAbbrs.join(" \u00B7 ");
        meta.appendChild(lb);
      }
      if (favHas(s.title)) {
        const fm = document.createElement("span");
        fm.className = "row-fav-mark";
        fm.textContent = "\u2605";
        fm.setAttribute("aria-label", "Favourite");
        meta.appendChild(fm);
      }
      if (meta.childNodes.length) main.appendChild(meta);
      content.appendChild(main);
      if (!setView) {
        // reveal layers revealed by swiping the content left/right
        const shadeL = document.createElement("div");
        shadeL.className = "row-shade row-shade-left";
        const ab = document.createElement("button");
        ab.className = "row-shade-btn fav";
        ab.innerHTML = ICON_STAR;
        ab.setAttribute("aria-label", "Favorite");
        shadeL.appendChild(ab);
        const shadeR = document.createElement("div");
        shadeR.className = "row-shade row-shade-right";
        const ab2 = document.createElement("button");
        ab2.className = "row-shade-btn add";
        ab2.innerHTML = setHas(s.title) ? ICON_CHECK : ICON_PLUS;
        ab2.setAttribute("aria-label", setHas(s.title) ? "Remove from set" : "Add to set");
        shadeR.appendChild(ab2);
        li.appendChild(shadeL);
        li.appendChild(shadeR);
        // desktop/wide-layout fallback: identical actions always visible, so
        // the features are reachable without any gesture (a11y requirement)
        const dActions = document.createElement("div");
        dActions.className = "row-desktop-actions";
        const fav = document.createElement("button");
        fav.className = "row-fav" + (favHas(s.title) ? " on" : "");
        fav.innerHTML = ICON_STAR;
        fav.setAttribute("aria-label", "Favorite");
        fav.addEventListener("click", (e) => {
          e.stopPropagation();
          favToggle(s.title);
          fav.classList.toggle("on", favHas(s.title));
          renderTagBar();
        });
        dActions.appendChild(fav);
        const add = document.createElement("button");
        const inSet = setHas(s.title);
        add.className = "row-add" + (inSet ? " in" : "");
        add.innerHTML = inSet ? ICON_CHECK : ICON_PLUS;
        add.setAttribute("aria-label", inSet ? "Remove from set" : "Add to set");
        add.addEventListener("click", (e) => {
          e.stopPropagation();
          setToggle(s.title);
          const now = setHas(s.title);
          add.classList.toggle("in", now);
          add.innerHTML = now ? ICON_CHECK : ICON_PLUS;
          add.setAttribute("aria-label", now ? "Remove from set" : "Add to set");
        });
        dActions.appendChild(add);
        content.appendChild(dActions);
      }
      if (setView) {
        li.dataset.title = s.title;
        // 1-based position in the running order, leading the row (read as an
        // ordinal, not data). Quiet mono, subordinate to the title. Renumbered
        // on remove (re-render) and after a drag (see renumberSetRows).
        const pos = document.createElement("span");
        pos.className = "row-pos";
        pos.textContent = idx + 1;
        pos.setAttribute("aria-label", "Position " + (idx + 1) + " in the set");
        content.insertBefore(pos, content.firstChild);
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
        // reorder - only when unfiltered, so order maps to the whole set.
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
        content.appendChild(tools);
      }
      li.appendChild(content);
      li.addEventListener("click", () => {
        if (li._suppressClick) return; // just finished a hold-to-reorder/swipe
        openSong(s);
      });
      if (!setView) {
        // swipe actions: right = favourite, left = add/remove from set. Fired by
        // the swipe itself (one step); the shade buttons stay as the visible
        // feedback layer and a tap fallback for any residual reveal. The desktop
        // .row-desktop-actions buttons are the real keyboard/screen-reader path.
        const rightBtn = li.querySelector(".row-shade-right .row-shade-btn");
        const leftBtn = li.querySelector(".row-shade-left .row-shade-btn");
        const doAdd = () => {
          setToggle(s.title);
          const now = setHas(s.title);
          rightBtn.classList.toggle("in", now);
          rightBtn.innerHTML = now ? ICON_CHECK : ICON_PLUS;
          rightBtn.setAttribute("aria-label", now ? "Remove from set" : "Add to set");
        };
        const doFav = () => {
          favToggle(s.title);
          const on = favHas(s.title);
          leftBtn.classList.toggle("on", on);
          // update THIS row's star now -- the swipe springs back immediately and
          // without this the only feedback lives on controls a phone never shows
          const m = li.querySelector(".row-meta");
          let mark = li.querySelector(".row-fav-mark");
          if (on && !mark && m) {
            mark = document.createElement("span");
            mark.className = "row-fav-mark";
            mark.textContent = "★";
            mark.setAttribute("aria-label", "Favourite");
            m.appendChild(mark);
          } else if (!on && mark) {
            mark.remove();
          }
          renderTagBar();
          // While the Favourites filter is active, un-favouriting must actually
          // remove the row -- otherwise the list keeps showing a song that no
          // longer matches the filter. Deferred past the spring-back so the
          // rebuild never yanks the row out mid-animation.
          if (favOnly && !on)
            setTimeout(() => {
              // removing the LAST favourite would leave an empty filtered list
              // staring back at you -- drop the filter and land on All songs
              if (!songs.some((x) => favHas(x.title))) favOnly = false;
              renderList();
              // longer than the spring-back on purpose: the row should be seen
              // to un-star before it disappears, not vanish under your thumb
            }, 650);
        };
        rightBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          doAdd();
          li.classList.remove("swiped", "reveal-left", "reveal-right");
          const rc = li.querySelector(".row-content");
          if (rc) rc.style.transform = "translateX(0)";
        });
        leftBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          doFav();
          li.classList.remove("swiped", "reveal-left", "reveal-right");
          const rc = li.querySelector(".row-content");
          if (rc) rc.style.transform = "translateX(0)";
        });
        enableRowSwipe(li, { fav: doFav, add: doAdd });
      }
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
    // "All": always first, the clear-any-filter control. Highlighted (and the
    // only highlighted chip) precisely when nothing else is selected.
    const ab = document.createElement("button");
    ab.className = "chip" + (!activeTag && !favOnly ? " active" : "");
    ab.textContent = "All";
    ab.addEventListener("click", () => {
      activeTag = "";
      favOnly = false;
      renderList();
    });
    bar.appendChild(ab);
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
  // ChordSheetJS's HtmlDivFormatter abbreviates a major-7 quality on render
  // ("Amaj7" -> "Ama7"); restore the conventional "maj" for display only (the
  // stored ChordPro keeps "maj7"). The "ma" it emits is always followed by a
  // digit, so this can't touch minor ("m7") or other qualities.
  function fixMaj(text) {
    return text.replace(/([A-G][#b]?)ma(?=\d)/g, "$1maj");
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
    // h1 shows ONLY the active-language version's title (the #lang-tabs already
    // carry the other languages), clamped to one line - never both joined, so
    // the header height is uniform across single and bilingual songs.
    const cs = songs[current];
    const cv = cs.versions[vi];
    // Per-version titles do not exist in the data (a bilingual song stores ONE
    // "English / Ukrainian" string), so the version-title branch always fell back
    // to the joined form and the one-line clamp just ellipsised it -- showing
    // neither title in full. Split the stored title on " / " and take the half
    // matching the active version, exactly as the list rows already do.
    const halves = cs.versions.length > 1 ? splitTitle(cs.title) : null;
    const vTitle = cv && cv.title ? String(cv.title).trim() : "";
    // A version title that merely REPEATS the combined string is not a per-version
    // title -- both versions' ChordPro carry the same {title:}, which is why the
    // naive "use cv.title" check always produced the joined form.
    const distinct = vTitle && vTitle !== String(cs.title || "").trim();
    titleEl.textContent = distinct
      ? vTitle
      : halves
        ? vi === 0
          ? halves.a
          : halves.b
        : cs.title;
    const v = cs.versions[vi];
    let song = ensureParsed(v);
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
      c.textContent = fixMaj(fixEnharmonic(t));
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
    // notes/annotations: "*..." inside a {comment:}. If it starts the comment
    // it's a standalone note (small italic block); if it follows a label
    // ("Chorus x4 *3rd accapella") the note renders INLINE next to the label.
    sheetEl.querySelectorAll(".comment").forEach((c) => {
      const txt = c.textContent;
      const star = txt.indexOf("*");
      if (star === 0) {
        c.classList.add("note");
        c.textContent = txt.replace(/^\s*\*\s*/, "");
      } else if (star > 0) {
        const label = txt.slice(0, star).replace(/\s+$/, "");
        const parts = txt.slice(star).split("*").map((s) => s.trim()).filter(Boolean);
        c.textContent = label;
        parts.forEach((n) => {
          c.appendChild(document.createTextNode(" "));
          const span = document.createElement("span");
          span.className = "note-inline";
          span.textContent = n;
          c.appendChild(span);
        });
      }
    });

    let now = keyName(v.key, delta);
    if (now) now = fixEnharmonic(now);
    const keyLbl =
      now || (delta === 0 ? "\u2014" : delta > 0 ? "+" + delta : String(delta));
    keyNowEl.textContent = keyLbl;
    // quick-transpose bar (song header)
    $("qt-key").textContent = keyLbl;
    // the whole transpose state lives in the pill: the reset control becomes a
    // +/- badge when transposed, and its tooltip/a11y label carry the original
    // key so it is never lost. Fixed 44x44 (a .qbtn) = constant height.
    const resetBtn = $("qt-reset");
    const transposed = delta !== 0;
    resetBtn.classList.toggle("hidden", !transposed);
    if (transposed) {
      resetBtn.innerHTML = (delta > 0 ? "+" : "") + delta;
      const orig = v && v.key ? " (" + v.key + ")" : "";
      resetBtn.setAttribute("aria-label", "Reset to original key" + orig);
      resetBtn.title = "Reset to original key" + orig;
    }
    updateBpmDisplay(false);
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
      // the keyline is removed from layout (display:none); this flag toggle is
      // inert but kept so the element never leaks back into flow by accident.
      keylineEl.classList.toggle("hidden", delta === 0);
    } else {
      keylineEl.innerHTML =
        delta === 0
          ? "No key set"
          : "Transposed " + (delta > 0 ? "+" + delta : delta) + " semitone(s)";
      keylineEl.classList.remove("hidden");
    }
    // show "save key" only when transposed on a saved (DB) song
    $("key-save").classList.toggle(
      "hidden",
      delta === 0 || current === null || !(songs[current].uid || "").startsWith("g:"),
    );
    scheduleFitColumns();
    // Tag each section paragraph with its family so the sheet can style it
    // (chorus card, dashed lead-in, dotted instrumental). Match on the START of
    // each section's label comment, case-insensitive and order-sensitive so eg.
    // "Pre-Chorus" hits the lead rule before the chorus rule.
    const secFamily = [
      [/^pre-/, "sec-lead"],
      [/^(chorus|alt chorus|half-chorus|refrain)/, "sec-chorus"],
      [/^(verse|half-verse)/, "sec-verse"],
      [/^(bridge|channel|breakdown)/, "sec-bridge"],
      [/^(intro|instrumental|interlude|solo|turnaround|outro|tag|vamp|hook)/, "sec-instr"],
    ];
    sheetEl.querySelectorAll(".paragraph").forEach((p) => {
      const label = p.querySelector(".comment");
      if (!label || label.classList.contains("note")) return;
      const txt = label.textContent.trim().toLowerCase();
      for (const [re, cls] of secFamily) {
        if (re.test(txt)) {
          p.classList.add(cls);
          break;
        }
      }
    });
  }

  // ---- two-column landscape spread (see the html.fit2col CSS note) ----
  // Two columns halve the page height, but only help when the result then fits
  // on screen entirely. If it does not, the reader scrolls a whole column down
  // and must scroll all the way back UP for column two - worse than one column.
  // So measure per song: switch columns on, keep them only if nothing scrolls.
  // Add + measure + revert all happen inside one rAF callback, before paint, so
  // a rejected two-column layout is never shown.
  let fitRaf = 0;
  function fitColumns() {
    const root = document.documentElement;
    const cs = current !== null && sheetEl ? sheetEl.querySelector(".chord-sheet") : null;
    if (!cs) {
      root.classList.remove("fit2col");
      return;
    }
    root.classList.add("fit2col");
    // the media query (landscape, >=600x600) is the hard floor; if it did not
    // match, columnCount stays "auto" and there is nothing to decide
    if (getComputedStyle(cs).columnCount !== "2") {
      root.classList.remove("fit2col");
      return;
    }
    // Measure with LAYOUT offsets. Two earlier attempts were wrong:
    // document.scrollHeight lags a shrink while the page is scrolled down (so
    // mid-song re-measures always rejected), and getBoundingClientRect().top is
    // displaced by the song-open transform animation (animateSheet), which made
    // the result a race against that animation. offsetTop/offsetHeight ignore
    // both transforms and scroll position.
    let need = cs.offsetHeight;
    for (let el = cs; el; el = el.offsetParent) need += el.offsetTop;
    if (need > window.innerHeight) root.classList.remove("fit2col");
  }
  function scheduleFitColumns() {
    cancelAnimationFrame(fitRaf);
    fitRaf = requestAnimationFrame(fitColumns);
  }
  // text size, stage mode and rotation all change whether the sheet still fits
  window.addEventListener("resize", scheduleFitColumns);
  window.addEventListener("orientationchange", scheduleFitColumns);

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

  let resumedOnce = false;
  function restoreOpen() {
    // Resume to the LIST, not the song. Auto-opening the last song at launch
    // put the app in the song view backed by a history entry created during
    // page load - which Android Chrome voids, so the first Back gesture exited
    // the app (worked only after a few seconds / an interaction). Landing on
    // the list keeps Back predictable. To preserve the resume feel we scroll
    // the remembered song into view and briefly highlight it (one-tap reopen).
    if (resumedOnce || current !== null) return;
    const t = store.get("opensong", "");
    if (!t) return;
    const idx = currentMatches.findIndex((s) => s.title === t);
    if (idx < 0) return; // not in the current tab/list yet; a later refresh retries
    const row = listEl.children[idx];
    if (!row) return;
    resumedOnce = true;
    row.classList.add("just-open");
    row.scrollIntoView({ block: "center" });
    setTimeout(() => row.classList.remove("just-open"), 2400);
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
    // BOTH conditions: the song must be saved (uid) AND the viewer must be an
    // admin. This ran after updateAdminUI() and used to re-show Edit to signed-out
    // readers every time a song was opened, silently undoing the auth gate.
    $("edit-btn").classList.toggle("hidden", !songs[i].uid || !loggedIn());
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
    scheduleFitColumns(); // drop html.fit2col; the list is never two-column
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
      /* denied or unsupported - silently ignore */
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
  // ---- tempo / tap-tempo (song header) ----
  function injectTempo(cp, bpm) {
    const t = String(cp);
    if (!bpm) return t.replace(/\{tempo:[^}]*\}\s*\n?/i, "");
    return /\{tempo:/i.test(t)
      ? t.replace(/\{tempo:[^}]*\}/i, "{tempo: " + bpm + "}")
      : "{tempo: " + bpm + "}\n" + t;
  }
  function updateBpmDisplay(listening) {
    const el = $("qt-bpm");
    if (!el) return;
    const bpm = current !== null ? songs[current].bpm : 0;
    el.classList.toggle("tapping", !!listening);
    el.classList.toggle("has-bpm", !!bpm);
    // Idle with no tempo it is just a labelled control; once there IS a number
    // that number is the whole point, so show it big and nothing else.
    el.classList.toggle("big", !!bpm);
    el.textContent = bpm ? String(bpm) : listening ? "…" : "BPM";
  }
  let hdrTaps = [],
    bpmTimer = null;
  function qtTap() {
    if (current === null) return;
    const now = performance.now();
    if (hdrTaps.length && now - hdrTaps[hdrTaps.length - 1] > 2000) hdrTaps = [];
    hdrTaps.push(now);
    if (hdrTaps.length > 8) hdrTaps.shift();
    if (hdrTaps.length < 2) {
      updateBpmDisplay(true);
      return;
    }
    let sum = 0;
    for (let i = 1; i < hdrTaps.length; i++) sum += hdrTaps[i] - hdrTaps[i - 1];
    const bpm = Math.round(60000 / (sum / (hdrTaps.length - 1)));
    if (bpm < 30 || bpm > 300) return;
    songs[current].bpm = bpm; // live: autoscroll uses it immediately
    updateBpmDisplay(true);
    // persist a short moment after the last tap (admins/local; else session-only)
    clearTimeout(bpmTimer);
    bpmTimer = setTimeout(() => {
      updateBpmDisplay(false);
      persistBpm(bpm);
    }, 1600);
  }
  async function persistBpm(bpm) {
    if (current === null) return;
    const song = songs[current];
    const uid = song.uid || "";
    if (uid.startsWith("g:") && sbOn()) {
      const row = getGlobalCache().find(
        (x) => "g:" + (x.num != null ? x.num : x.id) === uid,
      );
      if (!row) return;
      let data = row.data;
      if (data && typeof data === "object" && data.versions) {
        data = JSON.parse(JSON.stringify(data));
        data.versions.forEach((v) => {
          v.text = injectTempo(v.text || v.chordpro || "", bpm);
        });
      } else {
        data = injectTempo(String(data), bpm);
      }
      const res = await sbWrite({ data, src: null }, uid.slice(2));
      if (res.ok) await refreshGlobal(); // not an admin -> stays session-only, no nag
    } else if (uid && !uid.startsWith("g:")) {
      const list = getUserSongs();
      const s = list.find((x) => x.id === uid);
      if (s) {
        s.chordpro = injectTempo(s.chordpro || "", bpm);
        s.bpm = String(bpm);
        saveUserSongs(list);
      }
    }
  }
  // admin: bake the current transpose into the song as its real key (for everyone)
  async function bakeTranspose() {
    if (current === null || delta === 0) return;
    const song = songs[current];
    if (!song.uid || !song.uid.startsWith("g:") || !sbOn()) return;
    const v = song.versions[vi];
    if (!ensureParsed(v)) return;
    if (!(await askConfirm("Save key for everyone", "This rewrites the song's chords.", { okLabel: "Save key" })))
      return;
    let cp;
    try {
      cp = new CS.ChordProFormatter().format(v.parsed.transpose(delta));
    } catch {
      await askNotice("Couldn't transpose", "This song could not be transposed.");
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
      await askNotice("Couldn't save the key", "Check your connection and that you're still signed in.");
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
    if (!v || !ensureParsed(v)) return closeChordPop();
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
        cpError("Chord not recognised - reset transpose to edit it as-is.");
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
    scheduleFitColumns();
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
    scheduleFitColumns();
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
    // The icon for "what you'll switch TO" is chosen by CSS off data-theme (set
    // before first paint). Swapping innerHTML here painted the markup's glyph
    // first and replaced it a frame later -- that was the theme-button flash.
    document
      .querySelector('meta[name="theme-color"]')
      .setAttribute("content", t === "light" ? "#f4efe5" : "#0d0e12");
    store.set("theme", t);
  }

  // ---- autoscroll ----
  let scrolling = false,
    rafId = null,
    scrollAcc = 0;
  let scrollMult = parseFloat(store.get("scrollmult", "1")) || 1;
  let scrollLastTs = 0;
  const scrollBtn = $("scroll-btn");
  // effective auto-scroll speed in px/sec: BPM-derived when the song has a
  // tempo (faster songs scroll faster), else a sensible default; scaled by the
  // current text size and the user's slow/fast trim (scrollMult).
  function scrollPPS() {
    const bpm = current !== null ? songs[current].bpm : 0;
    const base = bpm ? bpm * 0.25 : 34; // px per second (gentle; slow/fast trims)
    return Math.max(6, base * (size || 1) * scrollMult);
  }
  function tick(ts) {
    if (!scrolling) return;
    if (!scrollLastTs) scrollLastTs = ts;
    const dt = Math.min(80, ts - scrollLastTs); // clamp big gaps (tab away)
    scrollLastTs = ts;
    scrollAcc += (scrollPPS() * dt) / 1000;
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
    scrollLastTs = 0;
    scrollAcc = 0;
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
    updateAdminUI(); // reflect session on first paint (hides + / Edit for readers)
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
    // quick transpose in the song header (mirrors the FAB key controls)
    $("qt-up").addEventListener("click", () => transpose(1));
    $("qt-down").addEventListener("click", () => transpose(-1));
    $("qt-reset").addEventListener("click", resetTranspose);
    $("qt-bpm").addEventListener("click", qtTap);
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
    // "Format pasted text": convert whatever is in a text field (chords-above-
    // lyrics, ChordPro, or the mangled per-line copy) into the tidy
    // chords-OVER-lyrics layout the editor uses (same as editing an existing
    // song), moving a detected title/key into their fields. On save,
    // buildChordPro turns that layout back into ChordPro for storage.
    function formatEditorField(textId, nameId, keyId, germanId) {
      const ta = $(textId);
      const raw = ta.value;
      if (!raw.trim() || !window.ChordConvert) return;
      const cp = window.ChordConvert.smartImport(raw, {
        german: $(germanId).checked,
        title: nameId ? $(nameId).value.trim() : "",
        key: keyId ? $(keyId).value.trim() : "",
      });
      const sheet = chordproToSheet(cp); // ChordPro -> chords-over-lyrics
      ta.value = sheet.text;
      if (nameId && sheet.name && !$(nameId).value.trim()) $(nameId).value = sheet.name;
      if (keyId && sheet.key && !$(keyId).value.trim()) $(keyId).value = sheet.key;
    }
    $("ed-format").addEventListener("click", () =>
      formatEditorField("ed-text", "ed-name", "ed-key", "ed-german"),
    );
    $("ed-format2").addEventListener("click", () =>
      formatEditorField("ed-text2", null, "ed-key2", "ed-german2"),
    );
    $("ed-biling").addEventListener("change", () =>
      $("ed-block2").classList.toggle("hidden", !$("ed-biling").checked),
    );
    $("ed-lang").addEventListener("input", syncLangLabels);
    $("ed-lang2").addEventListener("input", syncLangLabels);
    // --- draft autosave: one delegated listener, 600ms debounce, flush on hide
    const edDraftCard = $("editor").querySelector(".editor-card");
    edDraftCard.addEventListener("input", scheduleDraft);
    edDraftCard.addEventListener("change", scheduleDraft);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        clearTimeout(draftTimer);
        saveDraftNow();
      }
    });
    $("ed-draft-restore").addEventListener("click", () => {
      const d = JSON.parse(store.get(DRAFT_KEY, "null") || "null");
      if (d && d.f) fillEditor(d.f); // fills every field incl. toggling ed-block2
      $("ed-draft-bar").classList.add("hidden");
    });
    $("ed-draft-discard").addEventListener("click", () => {
      clearDraft();
      $("ed-draft-bar").classList.add("hidden");
    });
    $("ed-login").addEventListener("click", async () => {
      if (await promptLogin()) {
        updateAdminUI();
        refreshGlobal();
      }
    });
    $("ed-logout").addEventListener("click", logoutAdmin);
    // NB: no click-outside-to-close on the editor backdrop - a text selection
    // that ends on the dimmed backdrop would fire a click there and discard
    // unsaved edits. The editor closes only via the Close button (or Save).
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
      scheduleFitColumns(); // stage mode scales the sheet 1.5x
    });
    $("fab-auth-btn").addEventListener("click", async () => {
      closeControls();
      if (loggedIn()) {
        logoutAdmin();
      } else {
        await promptLogin();
      }
    });
    // the same door from the LIST header -- an admin lands on the list, not on a
    // song, and should not have to open one just to sign in
    $("list-auth-btn").addEventListener("click", async () => {
      if (loggedIn()) {
        logoutAdmin();
      } else {
        await promptLogin();
      }
    });
    $("fav-btn").addEventListener("click", () => {
      if (current === null) return;
      favToggle(songs[current].title);
      updateFavBtn();
    });
    $("ed-restore").addEventListener("click", restorePrev);
    // back-to-top (list view only) - quick custom ease (native "smooth" is slow
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

    // Swipe the docked tab bar itself to switch All <-> Set. Deliberately bound
    // to .list-tabs and NOT to the list container: build 71 removed a
    // list-container swipe because it fought the per-row favourite/set swipe.
    // The tab bar carries no row gestures, so there is nothing to collide with.
    const tabsEl = document.querySelector(".list-tabs");
    if (tabsEl) {
      let tx = 0, ty = 0, tActive = false;
      tabsEl.addEventListener("touchstart", (e) => {
        if (e.touches.length !== 1) { tActive = false; return; }
        tx = e.touches[0].clientX; ty = e.touches[0].clientY; tActive = true;
      }, { passive: true });
      tabsEl.addEventListener("touchend", (e) => {
        if (!tActive) return;
        tActive = false;
        const t = e.changedTouches[0];
        const dx = t.clientX - tx, dy = t.clientY - ty;
        // horizontal-dominant, and far enough to be intentional
        if (Math.abs(dx) < 45 || Math.abs(dx) <= Math.abs(dy)) return;
        const next = dx < 0 ? "set" : "all";
        if (next !== listMode) setListMode(next);
      }, { passive: true });
    }
    $("set-clear").addEventListener("click", async () => {
      if (!getSet().length) return;
      if (!(await askConfirm("Clear set", "Remove every song from this set?", { okLabel: "Clear", danger: true }))) return;
      clearSet();
      renderList();
    });
    // named-set controls
    $("set-select").addEventListener("change", (e) => switchSet(e.target.value));
    $("set-new").addEventListener("click", async () => {
      const name = await askPrompt("Name this set", "", "");
      if (name === null) return;
      createSet(name.trim() || "New set");
      renderSetBar();
      updateSetCount();
      renderList();
    });
    $("set-rename").addEventListener("click", async () => {
      const s = activeSet();
      if (!s) return;
      const name = await askPrompt("Rename set", "", s.name);
      if (name === null) return;
      renameSet(s.id, name.trim() || s.name);
      renderSetBar();
    });
    $("set-delete").addEventListener("click", async () => {
      const s = activeSet();
      if (!s) return;
      if (!(await askConfirm("Delete set", 'Delete the set "' + s.name + '"?', { okLabel: "Delete", danger: true }))) return;
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
    // swipe anywhere (while a song is open) to move between songs. The list
    // view has NO horizontal-swipe gesture anymore: switching All <-> Set is
    // the bottom tabs only, so a list swipe can never fight the row actions.
    let sx = 0,
      sy = 0,
      swiping = false;
    function swipeStart(x, y, target) {
      swiping = false;
      // never while the editor is open
      if (!$("editor").classList.contains("hidden")) return;
      if (current === null) return; // list view: no swipe gesture
      // song view: no song-switching while the controls bubble is open
      const inChrome =
        target && target.closest && target.closest("#fab-wrap, #editor");
      if (fabWrap.classList.contains("open") || inChrome) return;
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
      if (current === null) return; // list view: no tab switch
      gotoNav(dx < 0 ? 1 : -1);
    }
    // touch (phones) - passive so vertical scrolling is unaffected
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
      scrollMult = Math.min(4, scrollMult * 1.15);
      store.set("scrollmult", String(scrollMult));
    });
    $("scroll-slow").addEventListener("click", () => {
      scrollMult = Math.max(0.3, scrollMult / 1.15);
      store.set("scrollmult", String(scrollMult));
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
