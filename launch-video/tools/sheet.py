"""Contact sheet: python -P sheet.py DIR OUT.png COLS THUMB_W [names...] (labels each tile with its file name)."""
import os, sys
from PIL import Image, ImageDraw

d, out, cols, tw = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
names = sys.argv[5:] or sorted(f[:-4] for f in os.listdir(d) if f.endswith('.png'))
ims = [Image.open(os.path.join(d, n + '.png')).convert('RGB') for n in names]
th = int(ims[0].height * tw / ims[0].width)
rows = (len(ims) + cols - 1) // cols
sheet = Image.new('RGB', (cols * tw + (cols + 1) * 8, rows * (th + 26) + 8), (40, 40, 40))
dr = ImageDraw.Draw(sheet)
for i, (n, im) in enumerate(zip(names, ims)):
    x, y = 8 + (i % cols) * (tw + 8), 8 + (i // cols) * (th + 26)
    sheet.paste(im.resize((tw, th), Image.LANCZOS), (x, y + 18))
    dr.text((x + 2, y + 2), n, fill=(255, 255, 255))
sheet.save(out)
print(out, sheet.size)
