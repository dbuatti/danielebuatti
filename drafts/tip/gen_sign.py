from pathlib import Path

from reportlab.lib.pagesizes import A6
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader

BASE = Path("/Users/danielebuatti/dyad-apps/daniele buatti")
OUT = BASE / "drafts/tip/tip-sign-a6.pdf"
OUT_PRINT = BASE / "drafts/tip/Tip Sign A6 - print ready.pdf"
OUT_BLEED = BASE / "drafts/tip/Tip Sign A6 - officeworks bleed.pdf"
QR = BASE / "drafts/tip/tip-qr.png"
WORDMARK = BASE / "public/logo-white-trans-45.png"
SYMBOL = BASE / "public/logo-pinkwhite.png"

NAVY = HexColor("#00022D")
WHITE = HexColor("#FFFFFF")
LIGHT = HexColor("#A8B4D8")
QR_EDGE = HexColor("#DB4CA3")
BLEED = 5 * mm


FONT_DIR = BASE / "drafts/tip/fonts"


def register_site_fonts():
    """Register the same families the website uses: Fraunces display, Inter text.

    The site ships variable woff2 files via @fontsource-variable. Static TTF
    instances are kept in drafts/tip/fonts/ so ReportLab can embed them.
    """
    mapping = {
        "Fraunces": FONT_DIR / "Fraunces-SemiBold.ttf",
        "Inter": FONT_DIR / "Inter-Regular.ttf",
        "Inter-Bold": FONT_DIR / "Inter-SemiBold.ttf",
    }
    for name, path in mapping.items():
        if path.exists():
            pdfmetrics.registerFont(TTFont(name, str(path)))
    return (
        "Fraunces" if (FONT_DIR / "Fraunces-SemiBold.ttf").exists() else "Helvetica-Bold",
        "Inter" if (FONT_DIR / "Inter-Regular.ttf").exists() else "Helvetica",
        "Inter-Bold" if (FONT_DIR / "Inter-SemiBold.ttf").exists() else "Helvetica-Bold",
    )


DISPLAY, FONT, FONT_BOLD = register_site_fonts()


def draw_sign(c, w, h, with_bleed=False):
    # Deep brand navy running to every edge
    c.setFillColor(NAVY)
    if with_bleed:
        c.rect(-BLEED, -BLEED, w + 2 * BLEED, h + 2 * BLEED, fill=1, stroke=0)
    else:
        c.rect(0, 0, w, h, fill=1, stroke=0)

    # Brand mark in the top-left corner
    sym = 10 * mm
    c.drawImage(ImageReader(str(SYMBOL)), 6 * mm, h - sym - 6 * mm,
                width=sym, height=sym, preserveAspectRatio=True, mask="auto")

    # Title in the site's Fraunces display face
    c.setFillColor(WHITE)
    c.setFont(DISPLAY, 18)
    c.drawCentredString(w / 2, h - 24 * mm, "Enjoying the music?")

    # Subtitle
    c.setFillColor(LIGHT)
    c.setFont(FONT, 10.5)
    c.drawCentredString(w / 2, h - 32 * mm, "Tap or scan to leave a tip")

    # White QR card with the single pink accent
    card = 76 * mm
    cx = (w - card) / 2
    cy = 36 * mm
    c.setFillColor(WHITE)
    c.setStrokeColor(QR_EDGE)
    c.setLineWidth(0.9)
    c.roundRect(cx, cy, card, card, 3 * mm, fill=1, stroke=1)

    qr = 70 * mm
    c.drawImage(ImageReader(str(QR)), (w - qr) / 2, cy + 3 * mm,
                width=qr, height=qr, preserveAspectRatio=True)

    # White wordmark
    mark_w = 56 * mm
    mark_h = mark_w * 659 / 2016
    c.drawImage(ImageReader(str(WORDMARK)), (w - mark_w) / 2, 15 * mm,
                width=mark_w, height=mark_h, preserveAspectRatio=True, mask="auto")

    # Permanent short URL
    c.setFillColor(LIGHT)
    c.setFont(FONT, 8)
    c.drawCentredString(w / 2, 7 * mm, "danielebuatti.com/tip")


def build(path, with_bleed):
    w, h = A6
    size = (w + 2 * BLEED, h + 2 * BLEED) if with_bleed else (w, h)
    c = canvas.Canvas(str(path), pagesize=size)
    c.saveState()
    if with_bleed:
        c.translate(BLEED, BLEED)
    draw_sign(c, w, h, with_bleed)
    c.restoreState()
    c.showPage()
    c.save()
    print("saved", path, "font", FONT, "bleed", with_bleed)


build(OUT, False)
build(OUT_PRINT, False)
build(OUT_BLEED, True)
