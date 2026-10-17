"""Build index.html: embeds mapa.jpg into src/desfile.html so the page works offline and from file://.

With --home it also copies the page to greens2037.website/desfile (the home-site repo).
"""
import base64
import pathlib
import shutil
import sys

root = pathlib.Path(__file__).parent
img = base64.b64encode((root / "mapa.jpg").read_bytes()).decode()
html = (root / "src" / "desfile.html").read_text(encoding="utf-8")
for ph, f, mime in [("__BANNER__", "banner.jpg", "image/jpeg"), ("__ESCUDO__", "escudo.png", "image/png")]:
    html = html.replace(ph, f"data:{mime};base64," + base64.b64encode((root / f).read_bytes()).decode())
(root / "index.html").write_text(html.replace("__MAP__", "data:image/jpeg;base64," + img), encoding="utf-8")
print("index.html built")

if "--home" in sys.argv:
    home = root.parent.parent / "lhs_directory" / "home-site" / "desfile"
    home.mkdir(exist_ok=True)
    shutil.copy(root / "index.html", home / "index.html")
    print("copied to", home)
