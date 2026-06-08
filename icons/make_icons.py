#!/usr/bin/env python3
"""Generate New Hope app icons (recreation of the navy circle logo).

Navy circle, a white offset cross, "NEW" in bold caps and "Hope" in script.
Run from the repo root:  python3 icons/make_icons.py
(If you have the real logo PNG, just drop it in as icon-512.png etc. instead.)
"""
import os
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = "/mnt/skills/examples/canvas-design/canvas-fonts"
F_SCRIPT = os.path.join(FONTS, "NothingYouCouldDo-Regular.ttf")
F_BOLD = os.path.join(FONTS, "Outfit-Bold.ttf")

NAVY = (21, 55, 95)
WHITE = (255, 255, 255)


def bar(d, x0, y0, x1, y1, fill):
    r = min(abs(x1 - x0), abs(y1 - y0)) / 2
    d.rounded_rectangle([x0, y0, x1, y1], radius=r, fill=fill)


def draw_logo(size, content_scale=1.0):
    SS = 3
    S = size * SS
    img = Image.new("RGBA", (S, S), WHITE + (255,))
    d = ImageDraw.Draw(img)
    cx = cy = S / 2
    cs = content_scale

    # navy circle
    r = 0.485 * S * cs
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=NAVY + (255,))

    # white offset cross (vertical bar left of centre + horizontal bar)
    vw = 0.05 * S * cs
    vx = cx - 0.05 * S * cs
    bar(d, vx - vw / 2, cy - 0.36 * S * cs, vx + vw / 2, cy + 0.36 * S * cs, WHITE)
    hy = cy - 0.07 * S * cs
    bar(d, cx - 0.34 * S * cs, hy - vw / 2, cx + 0.30 * S * cs, hy + vw / 2, WHITE)

    # "NEW" — bold caps, upper-right quadrant
    fnew = ImageFont.truetype(F_BOLD, int(0.10 * S * cs))
    txt = "NEW"
    sp = int(0.012 * S * cs)
    widths = [d.textlength(c, font=fnew) for c in txt]
    total = sum(widths) + sp * (len(txt) - 1)
    x = cx + 0.05 * S * cs
    ty = cy - 0.19 * S * cs
    for c, w in zip(txt, widths):
        d.text((x, ty), c, font=fnew, fill=WHITE + (255,))
        x += w + sp

    # "Hope" — script, large, lower-centre (overlaps the cross like the logo)
    fhope = ImageFont.truetype(F_SCRIPT, int(0.45 * S * cs))
    hb = d.textbbox((0, 0), "Hope", font=fhope)
    hw = hb[2] - hb[0]
    hh = hb[3] - hb[1]
    d.text(
        (cx - hw / 2 - hb[0] - 0.02 * S * cs, cy + 0.16 * S * cs - hb[1] - hh / 2),
        "Hope",
        font=fhope,
        fill=WHITE + (255,),
    )

    return img.resize((size, size), Image.LANCZOS)


def main():
    draw_logo(192).save(os.path.join(HERE, "icon-192.png"))
    draw_logo(512).save(os.path.join(HERE, "icon-512.png"))
    draw_logo(180).save(os.path.join(HERE, "icon-180.png"))
    draw_logo(512, content_scale=0.8).save(
        os.path.join(HERE, "icon-maskable-512.png"))
    print("icons written")


if __name__ == "__main__":
    main()
