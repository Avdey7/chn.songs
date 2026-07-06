/* Guitar chord diagrams (offline, no dependencies).
   window.ChordDiagram.svg("Am7") -> SVG markup string, or null when the
   chord's quality isn't in the shape tables (the popover then shows only
   the name). Open shapes are preferred; otherwise a movable (barre) shape
   is placed from the root note. Slash-chord basses are ignored for the
   shape but kept in the displayed name. */
(function () {
  "use strict";

  // note -> semitone (also German H, and impossible spellings already
  // handled by the app's fixEnharmonic, but be lenient anyway)
  const SEMI = {
    C: 0, "C#": 1, Db: 1, D: 2, "D#": 3, Eb: 3, E: 4, Fb: 4, "E#": 5,
    F: 5, "F#": 6, Gb: 6, G: 7, "G#": 8, Ab: 8, A: 9, "A#": 10, Bb: 10,
    B: 11, H: 11, Cb: 11, "B#": 0,
  };

  // quality aliases -> canonical key used in the shape tables
  function normQual(q) {
    q = (q || "").trim();
    if (q === "" || q === "maj" || q === "M") return "maj";
    if (q === "m" || q === "min" || q === "-") return "min";
    if (q === "7") return "7";
    if (q === "m7" || q === "min7" || q === "-7") return "m7";
    if (q === "maj7" || q === "M7" || q === "ma7" || q === "Δ" || q === "Δ7") return "maj7";
    if (q === "sus" || q === "sus4") return "sus4";
    if (q === "sus2") return "sus2";
    if (q === "7sus4" || q === "7sus") return "7sus4";
    if (q === "6") return "6";
    if (q === "m6" || q === "min6") return "m6";
    if (q === "add9" || q === "2") return "add9";
    if (q === "m7b5" || q === "m7♭5" || q === "ø" || q === "ø7" || q === "h7" || q === "h") return "m7b5";
    if (q === "dim" || q === "°" || q === "o") return "dim7"; // played as dim7
    if (q === "dim7" || q === "°7" || q === "o7") return "dim7";
    if (q === "aug" || q === "+" || q === "+5" || q === "#5") return "aug";
    return null; // 9/11/13/alt... -> no diagram
  }

  // open-position shapes, keyed "semi|qual"; frets low-E..high-e, -1 = mute
  const OPEN = {
    "0|maj": [-1, 3, 2, 0, 1, 0], "0|maj7": [-1, 3, 2, 0, 0, 0],
    "0|7": [-1, 3, 2, 3, 1, 0], "0|add9": [-1, 3, 2, 0, 3, 3],
    "9|maj": [-1, 0, 2, 2, 2, 0], "9|min": [-1, 0, 2, 2, 1, 0],
    "9|7": [-1, 0, 2, 0, 2, 0], "9|m7": [-1, 0, 2, 0, 1, 0],
    "9|maj7": [-1, 0, 2, 1, 2, 0], "9|sus2": [-1, 0, 2, 2, 0, 0],
    "9|sus4": [-1, 0, 2, 2, 3, 0], "9|7sus4": [-1, 0, 2, 0, 3, 0],
    "9|6": [-1, 0, 2, 2, 2, 2], "9|m6": [-1, 0, 2, 2, 1, 2],
    "7|maj": [3, 2, 0, 0, 0, 3], "7|7": [3, 2, 0, 0, 0, 1],
    "7|6": [3, 2, 0, 0, 0, 0],
    "4|maj": [0, 2, 2, 1, 0, 0], "4|min": [0, 2, 2, 0, 0, 0],
    "4|7": [0, 2, 0, 1, 0, 0], "4|m7": [0, 2, 0, 0, 0, 0],
    "4|maj7": [0, 2, 1, 1, 0, 0], "4|sus4": [0, 2, 2, 2, 0, 0],
    "4|7sus4": [0, 2, 0, 2, 0, 0],
    "2|maj": [-1, -1, 0, 2, 3, 2], "2|min": [-1, -1, 0, 2, 3, 1],
    "2|7": [-1, -1, 0, 2, 1, 2], "2|m7": [-1, -1, 0, 2, 1, 1],
    "2|maj7": [-1, -1, 0, 2, 2, 2], "2|sus2": [-1, -1, 0, 2, 3, 0],
    "2|sus4": [-1, -1, 0, 2, 3, 3], "2|6": [-1, -1, 0, 2, 0, 2],
    "2|m6": [-1, -1, 0, 2, 0, 1], "2|dim7": [-1, -1, 0, 1, 0, 1],
    "11|7": [-1, 2, 1, 2, 0, 2],
  };

  // movable shapes: rel frets (rootRel = root's rel fret on rootString),
  // rootString 6 = low E, 5 = A; barre -> bar across at the base fret
  const MOVABLE = {
    maj: [
      { str: 6, rel: [0, 2, 2, 1, 0, 0], rootRel: 0, barre: true },
      { str: 5, rel: [-9, 0, 2, 2, 2, 0], rootRel: 0, barre: true },
    ],
    min: [
      { str: 6, rel: [0, 2, 2, 0, 0, 0], rootRel: 0, barre: true },
      { str: 5, rel: [-9, 0, 2, 2, 1, 0], rootRel: 0, barre: true },
    ],
    7: [
      { str: 6, rel: [0, 2, 0, 1, 0, 0], rootRel: 0, barre: true },
      { str: 5, rel: [-9, 0, 2, 0, 2, 0], rootRel: 0, barre: true },
    ],
    m7: [
      { str: 6, rel: [0, 2, 0, 0, 0, 0], rootRel: 0, barre: true },
      { str: 5, rel: [-9, 0, 2, 0, 1, 0], rootRel: 0, barre: true },
    ],
    maj7: [
      { str: 5, rel: [-9, 0, 2, 1, 2, 0], rootRel: 0, barre: true },
      { str: 6, rel: [0, -9, 1, 1, 0, -9], rootRel: 0, barre: false },
    ],
    sus2: [{ str: 5, rel: [-9, 0, 2, 2, 0, 0], rootRel: 0, barre: true }],
    sus4: [
      { str: 6, rel: [0, 2, 2, 2, 0, 0], rootRel: 0, barre: true },
      { str: 5, rel: [-9, 0, 2, 2, 3, 0], rootRel: 0, barre: true },
    ],
    "7sus4": [
      { str: 6, rel: [0, 2, 0, 2, 0, 0], rootRel: 0, barre: true },
      { str: 5, rel: [-9, 0, 2, 0, 3, 0], rootRel: 0, barre: true },
    ],
    6: [{ str: 5, rel: [-9, 0, 2, 2, 2, 2], rootRel: 0, barre: true }],
    m6: [{ str: 5, rel: [-9, 0, 2, 0, 2, 0], rootRel: 0, barre: false }],
    m7b5: [{ str: 5, rel: [-9, 0, 1, 0, 1, -9], rootRel: 0, barre: false }],
    dim7: [{ str: 5, rel: [-9, 1, 2, 0, 2, -9], rootRel: 1, barre: false }],
    aug: [{ str: 5, rel: [-9, 2, 1, 0, 0, -9], rootRel: 2, barre: false }],
    add9: [], // open C only (movable add9 shapes are awkward)
  };

  function parse(name) {
    const m = String(name || "")
      .trim()
      .replace(/^\((.*)\)$/, "$1")
      .match(/^([A-H][#b]?)([^/]*)(?:\/([A-H][#b]?))?$/);
    if (!m) return null;
    const semi = SEMI[m[1]];
    if (semi == null) return null;
    return { semi, qual: normQual(m[2]) };
  }

  // pick a shape and return {frets(abs), base, barre:{fret,from}|null}
  function shape(semi, qual) {
    const open = OPEN[semi + "|" + qual];
    if (open) return { frets: open, base: 1, barre: null };
    let best = null;
    for (const s of MOVABLE[qual] || []) {
      const openSemi = s.str === 6 ? 4 : 9; // E or A string
      let root = (semi - openSemi + 12) % 12;
      if (root === 0) root = 12;
      const base = root - s.rootRel;
      if (base < 1 || base > 11) continue;
      if (!best || base < best.base) {
        const frets = s.rel.map((r) => (r === -9 ? -1 : r + base));
        best = {
          frets,
          base,
          barre: s.barre
            ? { fret: base, from: frets.findIndex((f) => f >= 0) }
            : null,
        };
      }
    }
    return best;
  }

  // ---- SVG ----
  const NS = "http://www.w3.org/2000/svg";
  const L = 26, T = 30, SW = 20, FH = 24, NSTR = 6, NFRET = 5;
  function el(tag, attrs, inner) {
    let s = "<" + tag;
    for (const k in attrs) s += " " + k + '="' + attrs[k] + '"';
    return s + (inner != null ? ">" + inner + "</" + tag + ">" : "/>");
  }
  function svg(name) {
    const p = parse(name);
    if (!p || !p.qual) return null;
    const sh = shape(p.semi, p.qual);
    if (!sh) return null;
    const W = L + SW * (NSTR - 1) + 14;
    const H = T + FH * NFRET + 10;
    let out = "";
    // strings + frets
    for (let i = 0; i < NSTR; i++)
      out += el("line", { x1: L + i * SW, y1: T, x2: L + i * SW, y2: T + FH * NFRET, stroke: "currentColor", "stroke-width": 1, opacity: 0.55 });
    for (let f = 0; f <= NFRET; f++)
      out += el("line", { x1: L, y1: T + f * FH, x2: L + (NSTR - 1) * SW, y2: T + f * FH, stroke: "currentColor", "stroke-width": 1, opacity: 0.55 });
    // nut or fret-number label
    if (sh.base === 1)
      out += el("line", { x1: L - 1, y1: T, x2: L + (NSTR - 1) * SW + 1, y2: T, stroke: "currentColor", "stroke-width": 4, "stroke-linecap": "round" });
    else
      out += el("text", { x: L - 8, y: T + FH * 0.66, "text-anchor": "end", "font-size": 11, fill: "currentColor", opacity: 0.8 }, sh.base + "fr");
    // barre
    if (sh.barre) {
      const x1 = L + sh.barre.from * SW;
      const y = T + (sh.barre.fret - sh.base + 0.5) * FH;
      out += el("rect", { x: x1 - 7, y: y - 6, width: (NSTR - 1 - sh.barre.from) * SW + 14, height: 12, rx: 6, fill: "currentColor", opacity: 0.9 });
    }
    // dots + open/mute markers
    sh.frets.forEach((f, i) => {
      const x = L + i * SW;
      if (f < 0) {
        out += el("text", { x, y: T - 9, "text-anchor": "middle", "font-size": 11, fill: "currentColor", opacity: 0.65 }, "×");
      } else if (f === 0) {
        out += el("circle", { cx: x, cy: T - 12, r: 4, fill: "none", stroke: "currentColor", "stroke-width": 1.4, opacity: 0.8 });
      } else if (!(sh.barre && f === sh.barre.fret)) {
        const y = T + (f - sh.base + 0.5) * FH;
        out += el("circle", { cx: x, cy: y, r: 7, fill: "currentColor" });
      }
    });
    return (
      '<svg xmlns="' + NS + '" viewBox="0 0 ' + W + " " + H +
      '" width="' + W + '" height="' + H + '" aria-hidden="true">' + out + "</svg>"
    );
  }

  window.ChordDiagram = { svg };
})();
