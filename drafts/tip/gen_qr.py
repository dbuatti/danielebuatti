import qrcode
from qrcode.image.svg import SvgImage
from PIL import Image

URL = "https://danielebuatti.com/tip"
OUT = "/Users/danielebuatti/dyad-apps/daniele buatti/drafts/tip"

# SVG
qr_svg = qrcode.make(URL, image_factory=SvgImage, box_size=10, border=4, error_correction=qrcode.constants.ERROR_CORRECT_H)
qr_svg.save(f"{OUT}/tip-qr.svg")

# PNG 1200px
# Determine box size to get ~1200px: (modules + 2*border) * box_size
import qrcode as qr
q = qr.QRCode(error_correction=qr.constants.ERROR_CORRECT_H, box_size=1, border=4)
q.add_data(URL)
q.make(fit=True)
modules = q.modules_count
box = max(1, 1200 // (modules + 8))
q.box_size = box
q.border = 4
img = q.make_image(fill_color="black", back_color="white")
w, h = img.size
if w != 1200:
    img = img.resize((1200, 1200), Image.NEAREST)
img = img.convert("RGB")
img.save(f"{OUT}/tip-qr.png")
print("modules", modules, "box", box, "size", img.size)
print("done")
