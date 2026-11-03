"""Build the VFX plates for the car -> speedboat transformation.

1. Grabs the freeze frame (frame 705 = 23.5s) from public/velfire.mp4
2. Cuts out the Velfire with rembg (isnet-general-use)
3. Inpaints the car away to make a clean background plate

Outputs public/vfx/{freeze.jpg, car-cutout.png, clean-plate.jpg}
Usage: python3 scripts/make_vfx_plates.py [frame]
"""
import os
import subprocess
import sys
import tempfile

import cv2
import numpy as np
from PIL import Image
from rembg import new_session, remove

ROOT = os.path.join(os.path.dirname(__file__), "..")
SRC = os.path.join(ROOT, "public", "velfire.mp4")
OUT = os.path.join(ROOT, "public", "vfx")
FRAME = int(sys.argv[1]) if len(sys.argv) > 1 else 705
CAR_BOX = (330, 780, 1080, 1480)  # x0, y0, x1, y1 around the car in that frame

os.makedirs(OUT, exist_ok=True)
with tempfile.TemporaryDirectory() as td:
    png = os.path.join(td, "f.png")
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-i", SRC, "-vf", f"select=eq(n\\,{FRAME})", "-frames:v", "1", png],
        check=True,
    )
    frame = Image.open(png).convert("RGB")

frame.save(os.path.join(OUT, "freeze.jpg"), quality=95)

crop = frame.crop(CAR_BOX)
cut = remove(crop, session=new_session("isnet-general-use"))
full = Image.new("RGBA", frame.size, (0, 0, 0, 0))
full.paste(cut, CAR_BOX[:2], cut)
full.save(os.path.join(OUT, "car-cutout.png"), optimize=True)

alpha = np.array(full)[:, :, 3]
mask = (alpha > 20).astype(np.uint8) * 255
mask = cv2.dilate(mask, np.ones((25, 25), np.uint8))
bgr = cv2.cvtColor(np.array(frame), cv2.COLOR_RGB2BGR)
clean = cv2.inpaint(bgr, mask, 9, cv2.INPAINT_TELEA)
# soften the inpainted area so the smear reads as depth-of-field
blur = cv2.GaussianBlur(clean, (0, 0), 6)
m = cv2.GaussianBlur(mask, (0, 0), 8).astype(np.float32)[..., None] / 255
clean = (clean * (1 - m) + blur * m).astype(np.uint8)
cv2.imwrite(os.path.join(OUT, "clean-plate.jpg"), clean, [cv2.IMWRITE_JPEG_QUALITY, 95])
ys, xs = np.where(alpha > 20)
print("car bbox:", xs.min(), ys.min(), xs.max(), ys.max())
