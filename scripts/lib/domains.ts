// Domains, their concepts, and loops, from docs/concept-inventory.md. Each domain's concepts are
// listed in teaching order: pick.ts and the drill viewer both follow this order. A concept's id
// is `<domain slug>.<concept slug>`, matching its card in /concepts once the card exists.
export interface Concept {
  slug: string;
  name: string;
  tier?: 'core' | 'light'; // tiers don't apply to the elective domains
}

// An effect an elective builds into a scene, combining several of its concepts. Each is built
// twice: guided, then from memory.
export interface Effect {
  slug: string;
  name: string;
  concepts: string[]; // concept slugs in the same domain
}

export interface Domain {
  n: number;
  slug: string;
  name: string;
  elective?: boolean;
  note?: string; // for an elective: when it runs and how, shown under its heading in the sidebar
  concepts: Concept[];
  effects?: Effect[]; // for an elective with effect builds, in the inventory's order
}

export const DOMAINS: Domain[] = [
  {
    n: 1,
    slug: 'math',
    name: '3D Math Primitives',
    concepts: [
      { slug: 'point-vs-direction', name: 'Point vs direction', tier: 'core' },
      { slug: 'length', name: 'Length and lengthSq', tier: 'light' },
      { slug: 'normalize', name: 'Normalize', tier: 'light' },
      { slug: 'dot-product', name: 'Dot product', tier: 'core' },
      { slug: 'cross-product', name: 'Cross product', tier: 'core' },
      { slug: 'projection-rejection', name: 'Projection and rejection', tier: 'core' },
      { slug: 'reflection', name: 'Reflection', tier: 'light' },
      { slug: 'lerp', name: 'Lerp', tier: 'light' },
      { slug: 'angle-between', name: 'Angle between and signed angle', tier: 'core' },
      { slug: 'spherical-coords', name: 'Spherical coordinates', tier: 'light' },
      { slug: 'triple-product', name: 'Scalar triple product', tier: 'light' },
      { slug: 'float-tolerance', name: 'Floating-point tolerance', tier: 'core' },
    ],
  },
  {
    n: 2,
    slug: 'transforms',
    name: 'Coordinate Spaces & Transforms',
    concepts: [
      { slug: 'object3d-tour', name: 'Tour: the Object3D API', tier: 'light' },
      { slug: 'local-vs-world', name: 'Local vs world space', tier: 'core' },
      { slug: 'matrix-vs-matrixworld', name: 'matrix vs matrixWorld', tier: 'core' },
      { slug: 'update-timing', name: 'Update timing', tier: 'core' },
      { slug: 'trs-order', name: 'TRS order', tier: 'core' },
      { slug: 'compose-decompose', name: 'compose and decompose', tier: 'light' },
      { slug: 'points-vs-directions', name: 'Points vs directions', tier: 'core' },
      { slug: 'inverse-matrices', name: 'Inverse matrices', tier: 'core' },
      { slug: 'add-vs-attach', name: 'add vs attach', tier: 'light' },
      { slug: 'pivots', name: 'Pivots and offset groups', tier: 'light' },
      { slug: 'normal-matrix', name: 'Normal matrix', tier: 'core' },
      { slug: 'negative-scale', name: 'Negative scale and determinant', tier: 'light' },
    ],
  },
  {
    n: 3,
    slug: 'rotation',
    name: 'Rotation',
    concepts: [
      { slug: 'euler-order', name: 'Euler angles and order', tier: 'core' },
      { slug: 'gimbal-lock', name: 'Gimbal lock', tier: 'light' },
      { slug: 'axis-angle', name: 'Axis-angle', tier: 'light' },
      { slug: 'quaternions', name: 'Quaternions', tier: 'core' },
      { slug: 'slerp', name: 'Slerp', tier: 'light' },
      { slug: 'rotation-basis', name: 'Rotation matrix as a basis', tier: 'core' },
      { slug: 'lookat-up', name: 'lookAt and the up vector', tier: 'core' },
      { slug: 'rotate-around-point', name: 'Rotating around a point', tier: 'light' },
      { slug: 'converting', name: 'Converting representations', tier: 'light' },
    ],
  },
  {
    n: 4,
    slug: 'camera',
    name: 'Camera & Projection',
    concepts: [
      { slug: 'view-matrix', name: 'View matrix', tier: 'core' },
      { slug: 'projection-matrix', name: 'Projection matrix', tier: 'core' },
      { slug: 'clip-ndc-screen', name: 'Clip space, NDC, screen', tier: 'core' },
      { slug: 'project-unproject', name: 'project and unproject', tier: 'core' },
      { slug: 'depth-precision', name: 'Depth precision', tier: 'core' },
      { slug: 'frustum', name: 'Frustum', tier: 'light' },
      { slug: 'aspect-resize', name: 'Aspect and resize', tier: 'light' },
      { slug: 'fit-to-bounds', name: 'Fit to bounds', tier: 'light' },
      { slug: 'world-size-per-pixel', name: 'World size per pixel', tier: 'light' },
      { slug: 'camera-relative', name: 'Camera-relative directions', tier: 'light' },
    ],
  },
  {
    n: 5,
    slug: 'geometry',
    name: 'Geometry & Buffer Data',
    concepts: [
      { slug: 'object-types-tour', name: 'Tour: object types', tier: 'light' },
      { slug: 'buffer-attribute', name: 'BufferAttribute and itemSize', tier: 'core' },
      { slug: 'interleaved', name: 'Interleaved attributes', tier: 'light' },
      { slug: 'indexed', name: 'Indexed vs non-indexed', tier: 'core' },
      { slug: 'winding-order', name: 'Winding order', tier: 'core' },
      { slug: 'face-normals', name: 'Face normals', tier: 'core' },
      { slug: 'vertex-normals', name: 'Vertex normals', tier: 'core' },
      { slug: 'uvs', name: 'UVs', tier: 'light' },
      { slug: 'bounding-volumes', name: 'Bounding box and sphere', tier: 'light' },
      { slug: 'updating-buffers', name: 'Updating buffers', tier: 'light' },
      { slug: 'groups', name: 'Groups and multi-material', tier: 'light' },
      { slug: 'instanced-mesh', name: 'InstancedMesh', tier: 'light' },
      { slug: 'tangent-space', name: 'Tangent space and normal maps', tier: 'core' },
    ],
  },
  {
    n: 6,
    slug: 'assets',
    name: 'Assets & Runtime Delivery',
    concepts: [
      { slug: 'loaders-tour', name: 'Tour: loaders and textures', tier: 'light' },
      { slug: 'gltf-structure', name: 'glTF structure', tier: 'core' },
      { slug: 'load-lifecycle', name: 'Load lifecycle', tier: 'light' },
      { slug: 'decode-upload-compile', name: 'Decode, upload, compile', tier: 'core' },
      { slug: 'draco-meshopt', name: 'Draco vs Meshopt', tier: 'light' },
      { slug: 'ktx2', name: 'KTX2 and Basis textures', tier: 'light' },
      { slug: 'memory-math', name: 'Runtime memory math', tier: 'core' },
      { slug: 'reuse-caching', name: 'Reuse and caching', tier: 'light' },
      { slug: 'disposal', name: 'Disposal ownership', tier: 'core' },
      { slug: 'preload-lazy', name: 'Preload vs lazy load', tier: 'light' },
    ],
  },
  {
    n: 7,
    slug: 'scene-graph',
    name: 'Scene Graph Traversal & Inspection',
    concepts: [
      { slug: 'traverse', name: 'Traverse variants', tier: 'core' },
      { slug: 'finding-objects', name: 'Finding objects', tier: 'light' },
      { slug: 'safe-mutation', name: 'Safe mutation', tier: 'light' },
      { slug: 'world-bounds', name: 'World-space bounds', tier: 'core' },
      { slug: 'scene-stats', name: 'Scene statistics', tier: 'light' },
      { slug: 'visibility-layers', name: 'Visibility, removal, layers', tier: 'light' },
      { slug: 'user-data', name: 'userData and metadata', tier: 'light' },
      { slug: 'material-override', name: 'Material override and restore', tier: 'light' },
      { slug: 'clone-semantics', name: 'Clone semantics', tier: 'core' },
    ],
  },
  {
    n: 8,
    slug: 'queries',
    name: 'Spatial Queries',
    concepts: [
      { slug: 'ray', name: 'Ray', tier: 'light' },
      { slug: 'ray-from-pointer', name: 'Ray from pointer', tier: 'core' },
      { slug: 'intersection-anatomy', name: 'Intersection anatomy', tier: 'core' },
      { slug: 'filtering', name: 'Filtering', tier: 'light' },
      { slug: 'ray-plane', name: 'Ray–plane', tier: 'core' },
      { slug: 'ray-sphere', name: 'Ray–sphere', tier: 'light' },
      { slug: 'ray-triangle', name: 'Ray–triangle', tier: 'core' },
      { slug: 'ray-aabb', name: 'Ray–AABB', tier: 'light' },
      { slug: 'bounds-primitives', name: 'Bounds primitives', tier: 'light' },
      { slug: 'aabb-vs-obb', name: 'AABB vs OBB', tier: 'light' },
      { slug: 'closest-point', name: 'Closest-point queries', tier: 'light' },
      { slug: 'bvh', name: 'BVH', tier: 'core' },
    ],
  },
  {
    n: 9,
    slug: 'interaction',
    name: 'Interaction & Manipulation',
    concepts: [
      { slug: 'controls-tour', name: 'Tour: controls', tier: 'light' },
      { slug: 'pointer-events', name: 'Pointer events', tier: 'light' },
      { slug: 'click-vs-drag', name: 'Click vs drag', tier: 'light' },
      { slug: 'hover-selection', name: 'Hover and selection state', tier: 'light' },
      { slug: 'orbit-pan-dolly', name: 'Orbit, pan, dolly', tier: 'light' },
      { slug: 'drag-on-plane', name: 'Drag on a plane', tier: 'core' },
      { slug: 'axis-drag', name: 'Axis-constrained drag', tier: 'core' },
      { slug: 'local-world-manipulation', name: 'Local vs world manipulation', tier: 'core' },
      { slug: 'controls-coexistence', name: 'Controls coexistence', tier: 'light' },
      { slug: 'focus-on-object', name: 'Focus on object', tier: 'light' },
      { slug: 'anchoring', name: '3D-to-2D anchoring', tier: 'core' },
      { slug: 'frame-rate-independence', name: 'Frame-rate-independent motion', tier: 'core' },
      { slug: 'interpolation-toolbox', name: 'Interpolation toolbox', tier: 'light' },
    ],
  },
  {
    n: 10,
    slug: 'gpu',
    name: 'GPU Pipeline & Bottleneck Diagnosis',
    concepts: [
      { slug: 'renderer-tour', name: 'Tour: renderer settings', tier: 'light' },
      { slug: 'pipeline-stages', name: 'Pipeline stages', tier: 'core' },
      { slug: 'draw-call-anatomy', name: 'Draw call anatomy', tier: 'core' },
      { slug: 'state-sorting', name: 'State changes and sorting', tier: 'light' },
      { slug: 'depth-early-z', name: 'Depth buffer and early-z', tier: 'core' },
      { slug: 'stencil', name: 'Stencil buffer', tier: 'light' },
      { slug: 'blending', name: 'Blending and transparency', tier: 'core' },
      { slug: 'render-targets', name: 'Render targets', tier: 'core' },
      { slug: 'multi-pass', name: 'Multi-pass and post-processing', tier: 'core' },
      { slug: 'multisampling', name: 'Multisampling', tier: 'light' },
      { slug: 'readback', name: 'Readback', tier: 'light' },
      { slug: 'frame-budget', name: 'Frame budget', tier: 'core' },
      { slug: 'measurement', name: 'Measurement tools', tier: 'core' },
    ],
  },
  {
    n: 11,
    slug: 'materials',
    name: 'Materials, Lighting & Color',
    concepts: [
      { slug: 'materials-tour', name: 'Tour: materials', tier: 'light' },
      { slug: 'lights-tour', name: 'Tour: lights', tier: 'light' },
      { slug: 'color-spaces', name: 'Color spaces', tier: 'core' },
      { slug: 'tone-mapping', name: 'Tone mapping and exposure', tier: 'core' },
      { slug: 'lambert', name: 'Diffuse (Lambert)', tier: 'core' },
      { slug: 'specular', name: 'Specular and half vector', tier: 'light' },
      { slug: 'pbr', name: 'PBR metal and roughness', tier: 'core' },
      { slug: 'light-types', name: 'Light types and falloff', tier: 'light' },
      { slug: 'environment-maps', name: 'Environment maps and IBL', tier: 'core' },
      { slug: 'shadows', name: 'Shadows', tier: 'light' },
      { slug: 'baked-lighting', name: 'Baked lighting', tier: 'light' },
      { slug: 'texture-sampling', name: 'Texture sampling', tier: 'light' },
      { slug: 'channel-packing', name: 'Channel packing', tier: 'light' },
      { slug: 'material-flags', name: 'Pipeline-facing material flags', tier: 'light' },
    ],
  },
  {
    n: 12,
    slug: 'shaders',
    name: 'Shaders',
    concepts: [
      { slug: 'vertex-vs-fragment', name: 'Vertex vs fragment', tier: 'core' },
      { slug: 'attributes-uniforms-varyings', name: 'Attributes, uniforms, varyings', tier: 'core' },
      { slug: 'built-in-matrices', name: 'Built-in matrices and spaces', tier: 'core' },
      { slug: 'swizzling', name: 'Swizzling', tier: 'light' },
      { slug: 'built-in-functions', name: 'Built-in functions', tier: 'core' },
      { slug: 'types-precision', name: 'Types and precision', tier: 'light' },
      { slug: 'extending-materials', name: 'Extending materials', tier: 'light' },
      { slug: 'derivatives', name: 'Derivatives', tier: 'light' },
      { slug: 'fragment-coordinates', name: 'Fragment coordinates', tier: 'light' },
      { slug: 'branching-discard', name: 'Branching and discard', tier: 'light' },
      { slug: 'debug-output', name: 'Debug output', tier: 'core' },
    ],
  },
  {
    n: 13,
    slug: 'debugging',
    name: 'Debugging & Visualization',
    concepts: [
      { slug: 'triage', name: 'Triage', tier: 'core' },
      { slug: 'nothing-renders', name: 'Nothing-renders checklist', tier: 'light' },
      { slug: 'helpers', name: 'Helpers', tier: 'light' },
      { slug: 'visualizing-vectors', name: 'Visualizing vectors', tier: 'light' },
      { slug: 'reading-matrices', name: 'Reading matrices', tier: 'core' },
      { slug: 'nan-degenerate', name: 'NaN and degenerate cases', tier: 'light' },
      { slug: 'isolation', name: 'Isolation', tier: 'core' },
      { slug: 'frame-capture', name: 'Frame capture', tier: 'core' },
      { slug: 'shader-errors', name: 'Shader errors', tier: 'light' },
      { slug: 'debug-views', name: 'Debug views', tier: 'light' },
    ],
  },
  {
    n: 14,
    slug: 'optimization',
    name: 'Optimization & Memory',
    concepts: [
      { slug: 'draw-call-reduction', name: 'Draw call reduction', tier: 'core' },
      { slug: 'resolution-dpr', name: 'Resolution and DPR', tier: 'core' },
      { slug: 'render-on-demand', name: 'Render on demand', tier: 'light' },
      { slug: 'allocation-hygiene', name: 'Allocation hygiene', tier: 'core' },
      { slug: 'culling-lod', name: 'Culling and LOD', tier: 'light' },
      { slug: 'overdraw', name: 'Overdraw reduction', tier: 'light' },
      { slug: 'shader-cost', name: 'Shader and material cost', tier: 'light' },
      { slug: 'texture-budget', name: 'Texture budget', tier: 'core' },
      { slug: 'hitch-avoidance', name: 'Hitch avoidance', tier: 'light' },
      { slug: 'leak-detection', name: 'Leak detection', tier: 'core' },
      { slug: 'adaptive-quality', name: 'Adaptive quality', tier: 'light' },
    ],
  },
  {
    n: 15,
    slug: 'vfx',
    name: 'Procedural & VFX',
    elective: true,
    note: 'In TSL, after Loop 2: a page and a coding exercise per concept, then six effects built into a scene, guided and then from memory.',
    concepts: [
      { slug: 'sdf', name: 'Signed distance fields' },
      { slug: 'value-noise', name: 'Value and gradient noise' },
      { slug: 'cellular-noise', name: 'Cellular noise' },
      { slug: 'fbm', name: 'fBm' },
      { slug: 'domain-warping', name: 'Domain warping and curl noise' },
      { slug: 'mask-compositing', name: 'Mask remapping and compositing' },
      { slug: 'uv-animation', name: 'UV animation' },
      { slug: 'flipbooks', name: 'Flipbooks' },
      { slug: 'particles', name: 'Particle fundamentals' },
      { slug: 'integration-forces', name: 'Integration and forces' },
      { slug: 'sprite-facing', name: 'Sprite facing' },
      { slug: 'depth-effects', name: 'Depth-based effects' },
      { slug: 'blending-modes', name: 'Additive vs alpha blending' },
    ],
    effects: [
      { slug: 'dissolve', name: 'Dissolve a part away', concepts: ['value-noise', 'fbm', 'mask-compositing'] },
      { slug: 'selection-ring', name: 'Selection ring under a clicked part', concepts: ['sdf', 'uv-animation', 'blending-modes'] },
      { slug: 'sparks', name: 'Sparks when a part snaps in', concepts: ['particles', 'integration-forces', 'sprite-facing'] },
      { slug: 'smoke', name: 'Smoke puffs', concepts: ['flipbooks', 'depth-effects', 'blending-modes'] },
      { slug: 'shield', name: 'Shield or highlight shell', concepts: ['cellular-noise', 'uv-animation', 'depth-effects'] },
      { slug: 'portal', name: 'Swirling portal or energy', concepts: ['domain-warping'] },
    ],
  },
  {
    n: 16,
    slug: 'blank-file',
    name: 'Blank-file scenes',
    elective: true,
    note: 'After Loop 4: a working scene from an empty file. The loops teach each piece\'s syntax first.',
    concepts: [
      { slug: 'renderer-setup', name: 'Renderer and canvas' },
      { slug: 'scene-camera', name: 'Scene, camera, and a first mesh' },
      { slug: 'frame-loop', name: 'Frame loop' },
      { slug: 'resize', name: 'Resize' },
      { slug: 'load-and-frame', name: 'Load and frame a model' },
      { slug: 'teardown', name: 'Disposal and teardown' },
    ],
  },
];

export const CORE_DOMAINS = DOMAINS.filter((domain) => !domain.elective);

// A track narrows the plan to whole domains, worked through in order: Rogue, then Tech art, then
// Everything. Debugging and Optimization are only in Everything; they draw on every other domain.
export interface Track {
  slug: string;
  name: string;
  domains: string[];
}

export const TRACKS: Track[] = [
  { slug: 'all', name: 'Everything', domains: DOMAINS.map((domain) => domain.slug) },
  { slug: 'rogue', name: 'Rogue', domains: ['math', 'transforms', 'rotation', 'camera', 'geometry', 'scene-graph', 'assets', 'queries', 'interaction'] },
  { slug: 'tech-art', name: 'Tech art', domains: ['geometry', 'gpu', 'materials', 'shaders', 'vfx'] },
];

// Every concept id a track shows: its domains' concepts, plus the foundations they need from other
// domains, followed through each card's prerequisites (concept id → that card's list).
export function trackConcepts(track: Track, prerequisites: Map<string, string[]>) {
  const concepts = new Set(
    DOMAINS.filter((domain) => track.domains.includes(domain.slug)).flatMap((domain) =>
      domain.concepts.map((concept) => `${domain.slug}.${concept.slug}`),
    ),
  );
  const queue = [...concepts];
  for (const id of queue) {
    for (const needed of prerequisites.get(id) ?? []) {
      if (concepts.has(needed)) continue;
      concepts.add(needed);
      queue.push(needed);
    }
  }
  return concepts;
}

// A concept's 1-based position in its domain's teaching order, or Infinity if it isn't listed.
export function teachingOrder(conceptId: string) {
  const [domainSlug, conceptSlug] = conceptId.split('.');
  const domain = DOMAINS.find((item) => item.slug === domainSlug);
  const index = domain?.concepts.findIndex((concept) => concept.slug === conceptSlug) ?? -1;
  return index === -1 ? Infinity : index + 1;
}

export const LOOPS = [
  { n: 1, name: 'Literacy', proves: 'I understand it and can read it in code', estimate: 159 },
  { n: 2, name: 'Fluency', proves: 'I can write it', estimate: 191 },
  { n: 3, name: 'Diagnosis', proves: "I can find what's wrong and prove it", estimate: 119 },
  { n: 4, name: 'Judgment', proves: 'I can evaluate and direct', estimate: 45 },
];

// Every core concept needs one drill per mode. Light concepts skip implement.
export const CORE_MODES = ['read-the-code', 'implement', 'apply', 'break-and-fix'];
export const LIGHT_MODES = ['read-the-code', 'apply', 'break-and-fix'];

// Plain-language names for drill modes, as the viewer shows them.
export const MODE_LABELS: Record<string, string> = {
  'read-the-code': 'read the code',
  implement: 'build it',
  apply: 'use it',
  'break-and-fix': 'fix the bug',
};

// The drills each loop plans per concept, from the inventory's loop table. In Loops 2 and 3,
// light concepts share a drill in pairs. Loop 4 is planned by CROSS_DRILLS and the judgment
// drill types instead.
export const LOOP_PLAN: Record<number, { core: string[]; light: string[]; lightShared: boolean }> = {
  1: { core: ['read-the-code'], light: ['read-the-code'], lightShared: false },
  2: { core: ['implement', 'apply'], light: ['apply'], lightShared: true },
  3: { core: ['break-and-fix'], light: ['break-and-fix'], lightShared: true },
};

export function plannedDrillCount(domain: Domain, loop: number) {
  const plan = LOOP_PLAN[loop];
  if (!plan) return 0;
  const core = domain.concepts.filter((concept) => concept.tier === 'core').length;
  const light = domain.concepts.length - core;
  const lightDrills = plan.lightShared ? Math.ceil(light / 2) : light;
  return core * plan.core.length + lightDrills * plan.light.length;
}

// Loop 4's cross-domain drills, from the inventory. `domains` are domain numbers.
export const CROSS_DRILLS = [
  { title: 'Drag a part across the floor with a grab offset', domains: [1, 8, 9] },
  { title: 'Slide a part along a rotated rail', domains: [1, 2, 9] },
  { title: 'Place a marker flush on a clicked surface', domains: [2, 5, 8] },
  { title: 'GPU picking vs raycasting on a million-triangle model', domains: [8, 10, 14] },
  { title: 'Raycast cost: deep hierarchy vs high triangle count', domains: [7, 8, 10] },
  { title: 'Constant-size labels that hide when occluded', domains: [4, 8, 9] },
  { title: 'Focus on a clicked part with damped motion', domains: [4, 7, 9] },
  { title: 'Mirrored variant renders inside-out after baking', domains: [2, 5, 11] },
  { title: 'Chrome finish looks black on mobile', domains: [6, 11, 13] },
  { title: 'Roughness looks wrong on a packed map', domains: [6, 11, 12] },
  { title: 'Frame drops only on phones', domains: [10, 14] },
  { title: 'Hitch on the first variant switch', domains: [6, 10, 14] },
  { title: 'Selection outline: stencil vs post pass', domains: [10, 11, 12] },
  { title: 'Verify a transform bug with normals as color', domains: [2, 12, 13] },
  { title: 'Memory climbs after 20 variant swaps', domains: [6, 7, 14] },
];

// Loop 1 teaches instead of testing, so placement checks open Loops 2–4 only.
export const FIRST_PLACEMENT_LOOP = 2;
