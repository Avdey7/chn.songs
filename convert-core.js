/* convert-core.js - turns a "chords above lyrics" sheet into ChordPro.
   Pure functions, no DOM. Used by converter.html and by the test harness. */
(function (root) {
  "use strict";

  // ---- chord detection ----
  // root note A-H (H = German/Slavic B), optional accidental, chord body, optional /bass
  const CHORD_RE = /^[A-H](?:#|b)?(?:maj|min|sus|add|dim|aug|m|M|\+|°|ø|h|[0-9]|b|#|\([^)]*\))*(?:\/[A-H](?:#|b)?(?:[0-9]|\([^)]*\))*)?$/;
  // decoration tokens on a chord line: bars, strum slashes, repeat marks, "x2", "(2x)"
  const DECO_RE = /^[|/().x\d\-–—:]+$/i;

  // "no chord" marker, shown in the chord row like a chord (N.C. / NC / (N.C.))
  const NC_RE = /^\(?\s*(?:n\.?\s*c\.?|no\s*chord)\s*\)?$/i;
  // any repeat marker -> canonical "xN" (2x, х2, (2x) -> x2)
  function normRepeat(s) {
    const m = String(s).match(/(\d+)\s*[xх]|[xх]\s*(\d+)/i);
    return m ? "x" + (m[1] || m[2]) : s;
  }
  function isChord(tok) {
    if (NC_RE.test(tok)) return true;
    const m = tok.match(/^\((.+)\)$/); // (Fm) optional/passing chord
    return CHORD_RE.test(m ? m[1] : tok);
  }
  function isDeco(tok) { return DECO_RE.test(tok); }

  function isChordLine(line) {
    const toks = line.trim().split(/\s+/).filter(Boolean);
    if (!toks.length) return false;
    let real = 0;
    for (const t of toks) {
      if (isChord(t)) { real++; continue; }
      if (isDeco(t)) continue;
      return false; // a non-chord, non-decoration token means it's lyrics
    }
    return real > 0;
  }

  // ---- section headers ----
  // section word (any language) -> universal English label (mirrors app.js)
  const SECTION = {
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
    tag: "Tag", vamp: "Vamp", hook: "Hook", solo: "Solo", соло: "Solo",
    breakdown: "Breakdown", channel: "Channel",
  };
  const HEADERS = new Set(Object.keys(SECTION));
  function headerKey(line) {
    return line.toLowerCase()
      .replace(/[0-9]/g, "")
      .replace(/[xх]\d*/g, "")          // x2 / х4 (latin + cyrillic x)
      .replace(/[[\]():.\-–—\s]/g, ""); // also strip [ ] so "[VERSE]" is a header
  }
  function isHeader(line) {
    const t = line.trim();
    if (!t || t.length > 28) return false;
    if (isChordLine(t)) return false;   // chord lines aren't headers
    return HEADERS.has(headerKey(t));
  }
  // "[VERSE]" / "Куплет 1" / "Приспів 2x" -> universal English label with a
  // kept section number and normalised repeat marker ("Verse 1", "Chorus x2")
  function headerLabel(line) {
    const raw = line.trim().replace(/^\[\s*|\s*\]$/g, "").replace(/\s*:\s*$/, "").trim();
    const base = SECTION[headerKey(raw)];
    if (!base) return raw;
    let rest = raw, rep = "";
    const repM = rest.match(/\(?\s*(?:\d+[xх]|[xх]\s*\d+)\s*\)?/i);
    if (repM) { rep = normRepeat(repM[0]); rest = rest.replace(repM[0], " "); }
    const numM = rest.match(/\d+/);
    return base + (numM ? " " + numM[0] : "") + (rep ? " " + rep : "");
  }

  // ---- German/Slavic note conversion (H->B natural, B->Bb) ----
  function convNote(part) {
    const m = part.match(/^([A-H])(b|#)?(.*)$/);
    if (!m) return part;
    let L = m[1], acc = m[2] || "", rest = m[3] || "";
    if (L === "H") { L = "B"; acc = ""; }
    else if (L === "B" && acc === "") { acc = "b"; }   // bare B -> Bb
    return L + acc + rest;
  }
  function deGerman(sym) { return sym.split("/").map(convNote).join("/"); }

  function mapChord(sym, german) {
    if (NC_RE.test(sym)) return "N.C.";
    const m = sym.match(/^\((.+)\)$/);
    if (m) return "(" + (german ? deGerman(m[1]) : m[1]) + ")";
    return german ? deGerman(sym) : sym;
  }

  // ---- merge a chord line onto the lyric line beneath it ----
  function mergeLines(chordLine, lyricLine, german) {
    const chords = [];
    const re = /\S+/g; let m;
    while ((m = re.exec(chordLine))) {
      if (isChord(m[0])) chords.push({ col: m.index, sym: mapChord(m[0], german) });
    }
    let out = lyricLine.replace(/\s+$/, "");
    // insert right-to-left so earlier indices stay valid
    chords.sort((a, b) => b.col - a.col);
    for (const c of chords) {
      let col = c.col;
      if (col > out.length) { out = out.padEnd(col, " "); }
      out = out.slice(0, col) + "[" + c.sym + "]" + out.slice(col);
    }
    return out;
  }

  // ---- chord-only line (intro, turnaround) -> bracket the chords, keep bars ----
  function bracketChordOnly(line, german) {
    return line.replace(/\S+/g, (t) =>
      isChord(t) ? "[" + mapChord(t, german) + "]" : normRepeat(t));
  }

  // ---- main ----
  function convert(text, opts) {
    opts = opts || {};
    const german = !!opts.german;
    const lines = text.replace(/\r\n?/g, "\n").split("\n");
    const out = [];

    if (opts.title) out.push("{title: " + opts.title.trim() + "}");
    if (opts.key) out.push("{key: " + opts.key.trim() + "}");
    if (opts.title || opts.key) out.push("");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) { if (out.length && out[out.length - 1] !== "") out.push(""); continue; }

      if (isHeader(line)) { out.push("{comment: " + headerLabel(line) + "}"); continue; }

      if (isChordLine(line)) {
        const next = lines[i + 1];
        if (next !== undefined && next.trim() && !isChordLine(next) && !isHeader(next)) {
          out.push(mergeLines(line, next, german)); // chords + lyric beneath
          i++;
        } else {
          out.push(bracketChordOnly(line, german)); // chord-only line
        }
        continue;
      }

      out.push(line.trimEnd()); // plain lyric line
    }

    // collapse trailing blanks
    while (out.length && out[out.length - 1] === "") out.pop();
    return out.join("\n");
  }

  // ---- cleanup of pasted text (nbsp, tabs, fences, zero-width, blank runs) ----
  function clean(text) {
    return String(text)
      .replace(/\r\n?/g, "\n")
      .replace(/^```.*$/gm, "")            // drop ``` code fences
      .replace(/[   ]/g, " ") // non-breaking spaces -> space
      .replace(/[​-‍﻿]/g, "") // zero-width chars
      .replace(/\t/g, "    ")
      .replace(/[ \t]+$/gm, "")            // trailing spaces per line
      .replace(/\n{3,}/g, "\n\n");         // collapse big blank runs
  }
  // blank lines only BEFORE a section header, never within a section
  function tidyBlanks(cp) {
    const out = [];
    for (const ln of cp.split("\n")) {
      if (!ln.trim()) continue;
      if (/^\{(?:comment|c|ci)\s*:/i.test(ln.trim()) && out.length) out.push("");
      out.push(ln);
    }
    return out.join("\n");
  }
  const isChordProText = (t) =>
    /\[[A-H][^\]]{0,12}\]/.test(t) || /\{\s*(title|t|key|k|c|comment|start_of|end_of)\b/i.test(t);

  // a line that is ONLY chords/decorations with exactly one real chord token
  function isSingleChordLine(line) {
    const toks = line.trim().split(/\s+/).filter(Boolean);
    if (!toks.length) return false;
    let chords = 0;
    for (const t of toks) {
      if (isChord(t)) { chords++; continue; }
      if (isDeco(t)) continue;
      return false;
    }
    return chords === 1;
  }
  // Heuristic: is this the "mangled website copy" where each chord and each
  // lyric fragment sits on its own line (chords never aligned over lyrics)?
  function looksInterleaved(lines) {
    let single = 0, chordLines = 0, nonEmpty = 0;
    for (const l of lines) {
      if (!l.trim()) continue;
      nonEmpty++;
      if (isChordLine(l)) { chordLines++; if (isSingleChordLine(l)) single++; }
    }
    // lots of single-chord lines, and (almost) every chord line is a lone chord
    return chordLines >= 3 && single / chordLines >= 0.7 && single / nonEmpty >= 0.25;
  }

  // Rebuild interleaved paste into inline ChordPro. Lyric fragments are
  // concatenated verbatim (they carry their own spacing); each lone chord is
  // inserted inline at that point; a new lyric line starts when a fragment
  // begins with a capital letter (line starts are capitalised, mid-line
  // continuations after a chord are lower-case).
  function reconstructInterleaved(text, german) {
    const lines = clean(text).split("\n");
    const out = [];
    let buf = "", hasLyric = false, pending = [];
    // place any held chords into the current line, then reset them
    const placePending = () => {
      for (const sym of pending) {
        if (buf && !/[\s]$/.test(buf) && !/\]$/.test(buf)) buf += " ";
        buf += "[" + sym + "]";
      }
      pending = [];
    };
    const flush = () => {
      placePending();                    // trailing chords stay on this line
      const s = buf.replace(/\s+$/, "");
      if (s) out.push(s);
      buf = ""; hasLyric = false;
    };
    const blankOut = () => { if (out.length && out[out.length - 1] !== "") out.push(""); };
    for (const raw of lines) {
      const line = raw.trim().replace(/\|/g, " | "); // unglue bars from chords
      if (!line.trim()) { flush(); blankOut(); continue; }
      if (isHeader(line.trim())) { flush(); blankOut(); out.push("{comment: " + headerLabel(line.trim()) + "}"); continue; }
      if (isChordLine(line)) {
        const toks = line.split(/\s+/).filter(Boolean);
        const chords = toks.filter(isChord).length;
        // a full chord-only / bar line (Intro, turnaround): keep as its own line
        if (chords >= 2 || /\|/.test(line)) { flush(); out.push(bracketChordOnly(line, german).replace(/ {2,}/g, " ").trim()); continue; }
        for (const t of toks) if (isChord(t)) pending.push(mapChord(t, german)); // hold for the next word
        continue;
      }
      // lyric fragment: a capitalised start begins a new line
      const frag = line.trim();
      if (hasLyric && /^[A-ZА-ЯЁЇІЄҐ]/.test(frag)) {
        // held chords lead the NEW line (a line usually starts on a chord),
        // rather than trailing the previous one
        const s = buf.replace(/\s+$/, ""); if (s) out.push(s); buf = ""; hasLyric = false;
      }
      placePending();                    // held chords attach to THIS word (chord over the syllable)
      if (buf && !/[\s]$/.test(buf) && !/\]$/.test(buf)) buf += " ";
      buf += frag;
      hasLyric = true;
    }
    flush();
    while (out.length && out[out.length - 1] === "") out.pop();
    return out.join("\n");
  }

  // Guess a key from the first chord (root only), for pre-filling the editor.
  function guessKey(text, german) {
    const m = clean(text).match(/(?:^|\s|\|)([A-H](?:#|b)?(?:m|min)?)(?=\s|\/|\||$|[0-9(])/m);
    if (!m) return "";
    let k = german ? deGerman(m[1]) : m[1];
    return k;
  }

  // ---- one entry point: paste anything, get clean ChordPro ----
  // opts: {title, key, german}. Auto-detects ChordPro vs aligned vs interleaved.
  function smartImport(text, opts) {
    opts = opts || {};
    const german = !!opts.german;
    let body;
    const cleaned = clean(text);
    if (isChordProText(cleaned)) {
      body = cleaned.replace(/\n{3,}/g, "\n\n").replace(/^\n+|\n+$/g, "");
    } else if (looksInterleaved(cleaned.split("\n"))) {
      body = reconstructInterleaved(cleaned, german);
    } else {
      body = convert(cleaned, { german }); // aligned "chords above lyrics"
    }
    const head = [];
    if (opts.title) head.push("{title: " + String(opts.title).trim() + "}");
    const key = opts.key || guessKey(cleaned, german);
    if (key) head.push("{key: " + String(key).trim() + "}");
    // don't duplicate a {title}/{key} the body already carries
    const bodyHasTitle = /\{\s*(title|t)\s*:/i.test(body);
    const bodyHasKey = /\{\s*(key|k)\s*:/i.test(body);
    const heads = head.filter((h) =>
      !(bodyHasTitle && /^\{title/i.test(h)) && !(bodyHasKey && /^\{key/i.test(h)));
    return tidyBlanks((heads.length ? heads.join("\n") + "\n" : "") + body);
  }

  const api = { convert, smartImport, guessKey, isChord, isChordLine, isHeader, mergeLines, deGerman };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.ChordConvert = api;
})(typeof window !== "undefined" ? window : globalThis);
