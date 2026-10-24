"""Generate the decorative hero map from Natural Earth's public-domain GeoJSON.

Usage: python3 scripts/generate-world-map.py /path/to/ne_110m_admin_0_countries.geojson
Source: https://github.com/nvkelso/natural-earth-vector
Natural Earth boundaries are generalized cartographic representations.
"""
import json
import math
import sys
from html import escape
from pathlib import Path


def project(lon, lat):
    return round(48 + (lon + 180) * 3.73, 2), round(42 + (90 - lat) * 3.73, 2)


def outline(geometry):
    polygons = geometry["coordinates"]
    if geometry["type"] == "Polygon":
        polygons = [polygons]
    segments = []
    for polygon in polygons:
        for ring in polygon:
            points = [project(*point[:2]) for point in ring]
            segments.append("M" + "L".join(f"{x},{y}" for x, y in points) + "Z")
    return "".join(segments)


data = json.loads(Path(sys.argv[1]).read_text())
countries = []
pakistan = ""
for feature in data["features"]:
    name = feature["properties"]["ADMIN"]
    path = outline(feature["geometry"])
    countries.append(f'<path d="{path}"><title>{escape(name)}</title></path>')
    if name == "Pakistan":
        pakistan = path

# Dot coordinates are inside each country; labels are offset where needed
# to keep the tightly clustered countries around Pakistan distinguishable.
destinations = [
    ("United States", -101, 39, 0, 18),
    ("Canada", -110, 57, 0, -12),
    ("Brazil", -52, -12, 0, 18),
    ("United Kingdom", -2.5, 54, -34, -16),
    ("France", 2, 46, -26, 18),
    ("Germany", 10.5, 51, 24, -13),
    ("Russia", 100, 61, 0, -14),
    ("China", 105, 35, 15, -12),
    ("India", 79, 22, 12, 20),
    ("Afghanistan", 66, 34.5, -30, -19),
    ("Iran", 54, 32, -24, 19),
    ("Japan", 138, 37, 25, 0),
    ("Australia", 134, -25, 0, 20),
    ("South Africa", 25, -29, 0, 20),
    ("Kenya", 38, 0, 0, 19),
    ("Saudi Arabia", 45, 24, -24, 20),
    ("Indonesia", 114, -2, 15, 21),
    ("Argentina", -65, -35, 0, 19),
    ("Mexico", -103, 24, -20, 19),
]
origin = project(69.5, 30.4)
connections, dots, labels = [], [], []
for i, (name, lon, lat, dx, dy) in enumerate(destinations):
    x, y = project(lon, lat)
    ox, oy = origin
    distance = math.hypot(x - ox, y - oy)
    lift = min(145, max(22, distance * .23))
    cx, cy = (x + ox) / 2, (y + oy) / 2 - lift
    connections.append(
        f'<path d="M{ox},{oy} Q{cx:.2f},{cy:.2f} {x},{y}" marker-end="url(#arrow)" />'
    )
    dots.append(f'<circle cx="{x}" cy="{y}" r="2.8" />')
    labels.append(f'<text x="{x + dx}" y="{y + dy}">{escape(name)}</text>')

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 760">
<title>Pencil-sketched world map with international connections from Pakistan</title>
<desc>Country geography derived from public-domain Natural Earth 1:110m data.
Generalized borders do not express a position on disputed territories.</desc>
<defs>
  <pattern id="graphite" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-27)">
    <path d="M0 0V7M3 1V4" stroke="#72777b" stroke-width=".35" opacity=".22"/>
  </pattern>
  <filter id="pencil" x="-2%" y="-2%" width="104%" height="104%">
    <feTurbulence type="fractalNoise" baseFrequency=".54" numOctaves="3" seed="14" result="grain"/>
    <feDisplacementMap in="SourceGraphic" in2="grain" scale=".65" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
  <marker id="arrow" viewBox="0 0 9 8" refX="8" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path d="M1 1L8 4L1 7" fill="none" stroke="#3b82f6" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/>
  </marker>
</defs>
<g fill="#f5f5f3" stroke="#83888a" stroke-width=".65" stroke-linejoin="round" opacity=".66" filter="url(#pencil)">
  {''.join(countries)}
</g>
<g fill="url(#graphite)" stroke="#969a9d" stroke-width=".25" opacity=".38" filter="url(#pencil)">
  {''.join(countries)}
</g>
<path d="{pakistan}" fill="#ebf1ec" fill-opacity=".7" stroke="#5d7668" stroke-width="1.15" stroke-linejoin="round"/>
<g fill="none" stroke="#3b82f6" stroke-width=".85" stroke-linecap="round" opacity=".48">
  {''.join(connections)}
</g>
<g fill="#3b82f6" stroke="white" stroke-width="1" opacity=".85">{''.join(dots)}</g>
<g fill="#6a7077" font-family="Inter,Arial,sans-serif" font-size="10" font-weight="500" text-anchor="middle" paint-order="stroke" stroke="white" stroke-width="3" stroke-opacity=".85" stroke-linejoin="round">
  {''.join(labels)}
  <text x="{origin[0] + 30}" y="{origin[1] + 1}" fill="#416f52" font-weight="700">Pakistan</text>
  <text x="620" y="595" fill="#92979c" font-size="9" letter-spacing="3">SOUTH ATLANTIC OCEAN</text>
  <text x="1200" y="465" fill="#92979c" font-size="9" letter-spacing="3">PACIFIC OCEAN</text>
</g>
<circle cx="{origin[0]}" cy="{origin[1]}" r="8" fill="#389967" opacity=".12"/>
<circle cx="{origin[0]}" cy="{origin[1]}" r="3.7" fill="#29945c" stroke="white" stroke-width="1.3"/>
</svg>'''
Path("public/world-map-pencil.svg").write_text(svg)
print(f"Generated map: {len(countries)} country outlines, {len(destinations)} international connections.")
