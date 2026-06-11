/* convert-core.js — turns a "chords above lyrics" sheet into ChordPro.
   Pure functions, no DOM. Used by converter.html and by the test harness. */
(function (root) {
  "use strict";

  // ---- chord detection ----
  // root note A-H (H = German/Slavic B), optional accidental, chord body, optional /bass
  const CHORD_RE = /^[A-H](?:#|b)?(?:maj|min|sus|add|dim|aug|m|M|\+|°|ø|h|[0-9]|b|#)*(?:\/[A-H](?:#|b)?)?$/;
  // decoration tokens on a chord line: bars, strum slashes, repeat marks, "x2", "(2x)"
  const DECO_RE = /^[|/().x\d\-–—:]+$/i;

  function isChord(tok) {
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
  const HEADERS = new Set([
    "intro", "verse", "prechorus", "prechorus", "chorus", "bridge", "tag", "instrumental",
    "interlude", "refrain", "turn", "turnaround", "outro", "ending", "vamp", "hook", "coda",
    // ukrainian / russian
    "інтро", "вступ", "куплет", "приспів", "передприспів", "заспів", "програш",
    "бридж", "брідж", "фінал", "кінцівка", "проигрыш", "припев", "куплет"
  ]);
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
  // drop surrounding [ ] from a header label so "[VERSE]" -> "VERSE"
  function headerLabel(line) {
    return line.trim().replace(/^\[\s*|\s*\]$/g, "").trim();
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
    return line.replace(/\S+/g, (t) => (isChord(t) ? "[" + mapChord(t, german) + "]" : t));
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

  const api = { convert, isChord, isChordLine, isHeader, mergeLines, deGerman };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.ChordConvert = api;
})(typeof window !== "undefined" ? window : globalThis);
