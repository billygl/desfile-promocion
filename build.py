"""Build index.html: embeds mapa.jpg, banner.jpg and escudo.png into src/desfile.html so the page works offline.

python build.py                 -> only builds index.html
python build.py --home          -> also copies it to the greens2037.website repo, looked up in
                                   ../../lhs_directory/home-site, ../greens2037-home or ../home-site
python build.py --home <path>   -> same, with the home-site repo somewhere else
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
    i = sys.argv.index("--home")
    # either the path given, or the usual places: this computer's layout, or both repos side by side (e.g. _wks/)
    candidates = [pathlib.Path(sys.argv[i + 1])] if len(sys.argv) > i + 1 else [
        root.parent.parent / "lhs_directory" / "home-site",
        root.parent / "greens2037-home",
        root.parent / "home-site",
    ]
    site = next((c for c in candidates if (c / ".git").exists()), candidates[0])
    if not (site / ".git").exists():
        sys.exit(f"No encuentro el repo del sitio en {site.resolve()}.\n"
                 f"Clónalo ahí:  git clone https://github.com/billygl/greens2037-home.git \"{site.resolve()}\"\n"
                 f"o indica dónde está:  python build.py --home <ruta-a-home-site>")
    (site / "desfile").mkdir(exist_ok=True)
    shutil.copy(root / "index.html", site / "desfile" / "index.html")
    print("copied to", site / "desfile")
