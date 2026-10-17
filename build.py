"""Build index.html: embeds mapa.jpg into src/desfile.html so the page works offline and from file://."""
import base64
import pathlib

root = pathlib.Path(__file__).parent
img = base64.b64encode((root / "mapa.jpg").read_bytes()).decode()
html = (root / "src" / "desfile.html").read_text(encoding="utf-8")
(root / "index.html").write_text(html.replace("__MAP__", "data:image/jpeg;base64," + img), encoding="utf-8")
print("index.html built")
