# Tactile materials: the files and how they were checked

Every material and lighting file comes from Poly Haven (polyhaven.com) or ambientCG (ambientcg.com), both under CC0: free for any use, no credit needed. Every material is made from photographs: each source credits a photographer, or names the method (ambientCG: "height field photogrammetry"). They're committed in `assets/tactile/` so they travel between machines. To fetch them again:

```bash
node electives/tactile/tools/fetch-assets.mjs
```

Add `--vet` to also fetch the 1K normal and height maps the checks below use (into `assets/tactile/vet/`, which isn't committed).

```
assets/tactile/
  materials/<id>/color.jpg    the color map (sRGB)
  materials/<id>/normal.jpg   OpenGL-style normal map (Poly Haven's nor_gl)
  materials/<id>/arm.jpg      packed: red ambient occlusion, green roughness, blue metalness (Poly Haven)
  materials/<id>/roughness.jpg   roughness alone, gray (ambientCG, which has no packed map or AO)
  hdr/<id>_2k.hdr             the lighting files, 2048 × 1024
```

`catalog.ts` lists them with their real-world sizes; `bench.ts` loads them at the files' own resolution. The big scans need their 4K: a 2 m scan at 2K is only 10 px/cm, below what the bench's screen shows on a 24 cm sample, so it looks soft.

**Shapes.** The bench shows each material in a shape it really comes in: upholstery, leather, steel, and stone on a soft- or crisp-edged swatch and a roll; wood on a board and a plank, its grain along the plank (the scan's grain runs down the image, so the plank's UVs are turned); concrete on a slab and a block with chipped edges. A tabletop scan wrapped round a roll shows board grain where real wood shows end grain, and a perfect machined edge on concrete reads as fake.

## How each was checked

Checked Oct 7, 2026 with `tools/vet.ts`, which runs in the browser. A download can look fine as a thumbnail and still be wrong in ways that only show under the right light, so each material was measured:

| Check | What it measures | Clean | Suspect |
| --- | --- | --- | --- |
| Baked light | How strongly the color map's brightness follows the normal map's tilt. A delit scan shouldn't; a photo taken under a lamp does. | under 0.15 | over 0.35 |
| Normal map style | Whether the normal map's green channel rises where the height map does: OpenGL (what three.js expects) or DirectX (green flipped) | over 0.3, same sign as red | near 0, or the opposite sign |
| Seams | The jump across the tile's edge over the average step between neighboring pixels | 0.8 to 1.3 | over 1.5 |
| Values | Color in linear light (real materials sit between about 0.02 and 0.9), roughness, metalness | metalness 0 for anything that isn't metal | |

Every material was then lit by eye on the bench from the side and from above.

## Materials

| Material | Id (source) | Tile size | Baked light | Normal style | Roughness (5–95%) | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Leather | `leather_red_02` (Poly Haven) | 30 cm | 0.17–0.20 at fine scale | OpenGL (0.83, 0.57) | 0.41–0.58 | A trace of light from the right in the grain, fading at coarser scales: acceptable. **Size:** Poly Haven lists both 600 mm and "30x30 cm". Counting bumps in the height map, its pebbles are 8.0 mm apart at 30 cm and 16 mm at 60 cm; three sibling leathers by the same photographer, whose two size fields agree, count 5.9 to 9.1 mm. So 30 cm |
| Suede | `Leather039` (ambientCG) | 25 cm, estimated | 0.13–0.15 | OpenGL (0.90, 0.87) | 0.53–0.67 | A real leather suede. **No size given**; its even nap has no feature of known size, so 25 cm is an estimate, and its evenness hides small errors. **Roughness ×1.5 and a soft tan sheen, picked by eye** against museum photos of suede (a glove and a boot), which show no glossy highlight: at its own roughness the roll looked faintly like plastic. Very even, so it lacks the patchy nap of most real suede |
| Scuba suede | `scuba_suede` (Poly Haven) | 28.5 × 27.9 cm | under 0.05 | OpenGL (0.64, 0.64) | 0.64–0.80 | A neoprene microsuede, not leather suede. **Metalness 0.5–0.8 almost everywhere** in the packed map and the separate Metal map. Suede isn't metal; the bench sets metalness 0. Its sheen is picked by eye |
| Velvet | `velour_velvet` | 28.4 × 27.4 cm | under 0.07 | OpenGL (0.85, 0.78) | 0.62–0.85 | Needs `sheen`, which no map carries |
| Denim | `denim_fabric_06` | 25.4 cm | under 0.04 | OpenGL (0.83, 0.64) | 0.74–0.85 | |
| Varnished wood | `wood_table_001` | 1.5 m | 0.05 | flat | 0.15–0.35 | The normal map is nearly flat (it varies by about 1 step in 255): right for a smooth varnish, so its relief toggle changes little |
| Concrete | `Concrete034` (ambientCG) | 110 × 55 cm | under 0.03 | OpenGL (0.94, 0.95) | 0.50–0.56 | Smooth cast concrete with trowel marks and form-tie holes. Light gray: color 0.49 in linear light |
| Painted steel | `blue_metal_plate` | 2.5 m | 0.11 | red only (0.68) | 0.21–0.37 | Its relief runs almost all one way, so the green test has nothing to measure; looks right lit from both directions |
| Marble | `marble_01` | 1.5 m | 0.10 | OpenGL (0.32, 0.46) | 0.49–0.54 | Honed, not polished |
| Brown leather (flawed) | `brown_leather` | 40 cm | 0.06 | **green 0.04**, red 0.84 | 0.41–0.90 | The normal map's green channel doesn't follow its height map at any scale. On the bench its grain is crisp lit from the side and soft lit from above. Kept at 1K for the "checking a download" lesson only |

Ids without a source in brackets are Poly Haven's. The velvet's sheen is picked by eye too.

Considered and not used:

- `kitchen_wood`, whose two size fields disagree (600 mm and "30x30 cm") with nothing to settle it.
- `brown_leather` as the main leather (above).
- `concrete_floor_02` (Poly Haven), a 2 m mossy, weathered floor. It passed the checks, but on a 24 cm sample it read as speckled granite: a floor scan is made to be seen from standing height. Poly Haven's other concretes are 2 m and up too.

## Lighting files

Measured with `vetHdri` in `tools/vet.ts`, weighting each pixel by how much of the sphere it covers.

| HDRI | Poly Haven id | One-sidedness | Share from the brightest 2% | Tint (red ÷ blue) | Brightest | What it's for |
| --- | --- | --- | --- | --- | --- | --- |
| Softbox studio | `studio_small_09` | 0.17 | 51% | 1.02 | 536 | The default: a clear key, neutral color |
| Hard light | `cyclorama_hard_light` | 0.22 | 33% | 1.12 | 30,789 | One bare lamp: crisp shadows, hot highlights |
| Overcast sky | `overcast_soil_puresky` | 0.27 | 6% | 1.02 | 5 | Even light from the whole sky: relief goes flat |
| Warm lamps | `christmas_photo_studio_01` | 0.77 | 80% | 1.60 | 1,699 | Tungsten lamps: strongly one-sided and orange |
| Cool studio | `blue_photo_studio` | 0.43 | 73% | 0.77 | 747 | Daylight and blue walls: one-sided and cool |

"Brightest" is relative to white paper (1.0). Considered and not used: `brown_photostudio_02`, which looked warm in its thumbnail but measured neutral (1.04).
