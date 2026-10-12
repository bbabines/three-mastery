// The Tactile materials elective's materials and lighting files, from Poly Haven and ambientCG (all
// CC0), fetched by tools/fetch-assets.mjs into assets/tactile. Each was checked with tools/vet.ts
// before use; the results are in this folder's README.
//
// Sizes are the real-world size of one tile in meters, from the source's measurements unless an
// entry says otherwise. The sample shapes have UVs measured in meters, so
// `texture.repeat = 1 / size` puts every material at its real size.

export interface MaterialEntry {
  id: string;
  name: string;
  size: [number, number]; // one tile's width and height in meters
  sizeNote?: string; // when the size isn't simply the source's own measurement
  resolution: number; // the downloaded files' width in pixels; the bench loads them at this size
  // 'packed': arm.jpg holds ambient occlusion, roughness, and metalness (Poly Haven).
  // 'separate': roughness.jpg on its own, and no ambient occlusion or metalness (ambientCG).
  layout: 'packed' | 'separate';
  roughness: number; // the middle roughness it renders with (tools/vet.ts), for when the map is switched off
  roughnessScale?: number; // multiplies the roughness map when it's judged too glossy; three.js caps the result at 1
  kind: 'leather' | 'suede' | 'velvet' | 'woven' | 'wood' | 'concrete' | 'painted metal' | 'stone';
  trustMetal: boolean; // whether the packed map's blue channel (metalness) is right for three.js
  // MeshPhysicalMaterial extras the scan's maps can't carry
  sheen?: { amount: number; color: number; roughness: number };
  note: string; // what to look for under raking light
  caution?: string; // what the checks found wrong; such a material is only for "what's off" scenes
}

export const MATERIALS: MaterialEntry[] = [
  {
    id: 'leather_red_02',
    roughness: 0.51,
    name: 'Leather',
    size: [0.3, 0.3],
    sizeNote:
      'Poly Haven lists both 600 mm and "30x30 cm". Counted the same way, its pebbles are 8.0 mm apart at 30 cm and 16 mm at 60 cm; three sibling scans by the same photographer, whose two size fields agree, measure 5.9 to 9.1 mm. So 30 cm.',
    resolution: 2048,
    layout: 'packed',
    kind: 'leather',
    trustMetal: true,
    note: 'fine pebbled grain and soft creases; semi-gloss, roughness 0.41 to 0.58',
  },
  {
    id: 'Leather039',
    roughness: 0.88, // the map's middle (0.59) times roughnessScale
    name: 'Suede',
    size: [0.25, 0.25],
    sizeNote:
      "ambientCG doesn't give a size, so 25 cm is an estimate. Suede's even nap has no feature of a known size; the faint brushing streaks are a few centimeters apart, which fits.",
    resolution: 2048,
    layout: 'separate',
    kind: 'suede',
    trustMetal: true,
    // Picked by eye against museum photos of suede (a glove and a boot under studio light), which
    // show no glossy highlight at all: at the scan's own roughness, about 0.59, the roll showed a
    // faint plastic-looking one. 1.5 times the map brings it to about 0.88, and a soft tan sheen adds
    // the gentle lightening where the nap turns away.
    roughnessScale: 1.5,
    sheen: { amount: 0.6, color: 0xe8b98a, roughness: 0.9 },
    note: 'a light tan leather suede: an even nap, brushed in faint streaks; matte',
  },
  {
    id: 'scuba_suede',
    roughness: 0.71,
    name: 'Scuba suede',
    size: [0.285, 0.279],
    resolution: 2048,
    layout: 'packed',
    kind: 'suede',
    trustMetal: false,
    sheen: { amount: 0.6, color: 0x7fd6d2, roughness: 0.6 },
    note: 'a neoprene microsuede, as used for wetsuit-style apparel: smoother and more even than leather suede; matte, roughness 0.64 to 0.80',
    caution: "its packed map says metalness 0.5 to 0.8 almost everywhere; suede isn't metal, so metalness stays 0",
  },
  {
    id: 'velour_velvet',
    roughness: 0.72,
    name: 'Velvet',
    size: [0.284, 0.274],
    resolution: 2048,
    layout: 'packed',
    kind: 'velvet',
    trustMetal: true,
    sheen: { amount: 1, color: 0xff6f8a, roughness: 0.45 },
    note: 'plush pile with patchy highlights; needs sheen, which no map carries',
  },
  {
    id: 'denim_fabric_06',
    roughness: 0.82,
    name: 'Denim',
    size: [0.254, 0.254],
    resolution: 2048,
    layout: 'packed',
    kind: 'woven',
    trustMetal: true,
    note: 'a diagonal twill weave; matte, roughness 0.74 to 0.85',
  },
  {
    id: 'wood_table_001',
    roughness: 0.26,
    name: 'Varnished wood',
    size: [1.5, 1.5],
    resolution: 4096,
    layout: 'packed',
    kind: 'wood',
    trustMetal: true,
    note: 'stained grain under a smooth varnish: its normal map is nearly flat, and the gloss does the work',
  },
  {
    id: 'Concrete034',
    roughness: 0.51,
    name: 'Concrete',
    size: [1.1, 0.55],
    resolution: 4096,
    layout: 'separate',
    kind: 'concrete',
    trustMetal: true,
    note: 'smooth cast concrete: trowel marks and round form-tie holes; light gray, roughness 0.50 to 0.56',
  },
  {
    id: 'blue_metal_plate',
    roughness: 0.28,
    name: 'Painted steel',
    size: [2.5, 2.5],
    resolution: 4096,
    layout: 'packed',
    kind: 'painted metal',
    trustMetal: true,
    note: 'semi-gloss paint with fine scratches; paint is not metal, so metalness 0',
  },
  {
    id: 'marble_01',
    roughness: 0.5,
    name: 'Marble',
    size: [1.5, 1.5],
    resolution: 4096,
    layout: 'packed',
    kind: 'stone',
    trustMetal: true,
    note: 'honed cream marble with soft veins; low sheen, roughness about 0.5',
  },
  {
    id: 'brown_leather',
    roughness: 0.67,
    name: 'Brown leather (flawed)',
    size: [0.4, 0.4],
    resolution: 1024,
    layout: 'packed',
    kind: 'leather',
    trustMetal: true,
    note: 'wrinkled vintage leather',
    caution: "its normal map's green channel doesn't follow its own height map, so its grain is crisp under light from the side but soft and mushy under light from above",
  },
];

export const material = (id: string) => MATERIALS.find((entry) => entry.id === id)!;

// The good materials, for pickers; the flawed one appears only where a page means to show its flaw.
export const SOUND_MATERIALS = MATERIALS.filter((entry) => !entry.caution || entry.id === 'scuba_suede');

export interface HdriEntry {
  id: string;
  name: string;
  file?: string; // an .exr from elsewhere in the repo; otherwise assets/tactile/hdr/<id>_2k.hdr
  // Measured by tools/vet.ts: see this folder's README.
  directionality: number; // 0: light from everywhere; toward 1: from one side
  keyShare: number; // the share of all light from the brightest 2% of the sphere
  tint: number; // average red over blue: above 1 warm, below 1 cool
  note: string;
}

export const HDRIS: HdriEntry[] = [
  { id: 'studio_small_09', name: 'Softbox studio', directionality: 0.17, keyShare: 0.51, tint: 1.02, note: 'a small studio with a big softbox: a clear key, neutral color' },
  { id: 'cyclorama_hard_light', name: 'Hard light', directionality: 0.22, keyShare: 0.33, tint: 1.12, note: 'one bare lamp, 30,000 times brighter than white paper: crisp shadows and hot highlights' },
  { id: 'overcast_soil_puresky', name: 'Overcast sky', directionality: 0.27, keyShare: 0.06, tint: 1.02, note: 'light from the whole sky: even and soft, so relief goes flat' },
  { id: 'christmas_photo_studio_01', name: 'Warm lamps', directionality: 0.77, keyShare: 0.8, tint: 1.6, note: 'tungsten lamps in a dark room: strongly one-sided and orange' },
  { id: 'blue_photo_studio', name: 'Cool studio', directionality: 0.43, keyShare: 0.73, tint: 0.77, note: 'a daylight studio with blue walls: one-sided and cool' },
  {
    id: 'ijewel_metal',
    name: 'Jewelry studio (iJewel)',
    file: '/assets/reference/ijewel/hdr/env_metal_011_172e446a13.exr',
    directionality: 0.18,
    keyShare: 0.21,
    tint: 1.0,
    note: "iJewel's fake studio for metal: a bright gray room with big softboxes and black panels, for study only (the jewelry elective)",
  },
];

// The HDRIs for the material pages; the ring page adds the jewelry studio.
export const MATERIAL_HDRIS = HDRIS.filter((entry) => !entry.file).map((entry) => entry.id);

export interface MetalEntry {
  id: string;
  name: string;
  color: [number, number, number] | number; // linear RGB, or an sRGB hex
  source: string;
}

// Four ring metals, all with metalness 1 and the same polished roughness, so only the light differs.
// Measured colors (linear, the color a metal reflects head-on) from physicallybased.info; rose gold
// is an alloy with no single measured value, so it's iJewel's preset.
export const RING_METALS: MetalEntry[] = [
  { id: 'gold', name: 'Yellow gold', color: [1, 0.773, 0.307], source: 'physicallybased.info, gold (red 1.059 capped at 1)' },
  { id: 'silver', name: 'Silver', color: [0.991, 0.985, 0.974], source: 'physicallybased.info, silver' },
  { id: 'platinum', name: 'Platinum', color: [0.765, 0.73, 0.676], source: 'physicallybased.info, platinum' },
  { id: 'rose', name: 'Rose gold', color: 0xf2af83, source: "iJewel's rose gold preset (sRGB hex)" },
];
export const RING_ROUGHNESS = 0.03; // polished: a near mirror

export const hdri = (id: string) => HDRIS.find((entry) => entry.id === id)!;
