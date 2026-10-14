// What's off? Diagnose and fix: broken scenes that mix the earlier units' mistakes. Each starts from
// a symptom someone would report, breaks two or three settings from different units, and gives the
// controls to fix each one, plus a few that look like fixes and aren't. The broken settings live in
// each scene's own state and are applied again on every change, so picking another material or
// texture keeps them broken, the way it would in real code.
import { overlay } from '@harness/lesson';
import type { Harness, SceneSetup } from '@harness/scene';
import * as THREE from 'three';
import {
  choices,
  createBench,
  faultChecklist,
  hdriButtons,
  keyControls,
  materialButtons,
  panel,
  row,
  toneButtons,
  whenBenchReady,
  type Bench,
  type BenchOptions,
  type Fault,
  type Stage,
} from '../bench';
import { HDRIS, hdri as hdriEntry } from '../catalog';
import { createRingBench, whenRingsReady } from '../metal/rings';
import { ballsInFront } from '../reading-light/meter';
import { keepKeyAt } from '../reading-light/rooms';
import { addFloor, filteringOf, setFiltering, setTileScale } from '../scale/floor';

// The unit that teaches each fault, named in the answer.
const UNITS = {
  before: 'Before you light',
  metal: 'Metal: all light, no maps',
  reading: 'Reading the light',
  key: 'The key light',
  grounding: 'Shadows and grounding',
  maps: 'The maps, and checking a download',
  scale: 'Scale and distance',
  finishes: 'Finishes: sheen, clearcoat, and limits',
};
type Unit = keyof typeof UNITS;

// A fault whose answer ends with the unit (or units) that teach it.
function fault(units: Unit[], fixed: () => boolean, cause: string, fix: string): Fault {
  return { fixed, cause: `${cause} <em>Unit: ${units.map((unit) => UNITS[unit]).join('; ')}.</em>`, fix };
}

// The checklist, plus a line under the answer about a control that looks like a fix and isn't.
function checklist(stage: Stage, parent: HTMLElement, faults: Fault[], notACause?: string) {
  faultChecklist(stage, parent, faults);
  if (!notACause) return;
  const answer = parent.lastElementChild!.querySelector('ol')!;
  const item = document.createElement('li');
  item.style.cssText = 'list-style: none; margin: 6px 0 0 -20px;';
  item.innerHTML = `<strong>Not a cause:</strong> ${notACause}`;
  answer.append(item);
}

function start(harness: Harness, options: BenchOptions, ready: (bench: Bench, readout: HTMLElement, controls: HTMLElement) => void) {
  const bench = createBench(harness, { height: 420, ...options });
  const readout = overlay(harness.container, 'readout');
  const controls = panel(harness.container);
  whenBenchReady(bench, readout, options, () => ready(bench, readout, controls));
}

// A slider that shows a value and follows it when something else changes it.
function setting(stage: Stage, parent: HTMLElement, text: string, range: [number, number, number], get: () => number, set: (v: number) => void) {
  const label = document.createElement('label');
  label.style.cssText = 'display: flex; align-items: center; gap: 6px;';
  label.innerHTML = `${text} <input type="range" min="${range[0]}" max="${range[1]}" step="${range[2]}" style="width: 120px">`;
  const input = label.querySelector('input')!;
  input.value = String(get());
  input.addEventListener('input', () => {
    set(Number(input.value));
    stage.refresh();
  });
  stage.onChange(() => (input.value = String(get())));
  parent.append(label);
}

function checkbox(parent: HTMLElement, text: string, checked: boolean, change: (on: boolean) => void) {
  const label = document.createElement('label');
  label.style.cssText = 'display: flex; align-items: center; gap: 6px;';
  label.innerHTML = `<input type="checkbox"${checked ? ' checked' : ''}> ${text}`;
  const input = label.querySelector('input')!;
  input.addEventListener('change', () => change(input.checked));
  parent.append(label);
  return input;
}

const near = (a: number, b: number, within = 0.06) => Math.abs(a - b) < within;

// ---------------------------------------------------------------------------------------------
// 1. The leather looks plastic. Two settings, and a texture swap that changes nothing.

export const offPlastic: SceneSetup = (harness) => {
  start(harness, { material: 'leather_red_02', key: { around: -65, above: 22 } }, (bench, readout, controls) => {
    // Broken: roughness 0.5 on top of the map (maps), and a glossy clear coat (finishes).
    const broken = { roughness: 0.5, clearcoat: 1 };
    bench.material.clearcoatRoughness = 0.04;
    bench.onChange(() => {
      bench.material.roughness = broken.roughness;
      bench.material.clearcoat = broken.clearcoat;
    });
    choices(controls, 'texture', [
      { label: 'this leather download', select: () => void bench.setMaterial('leather_red_02') },
      { label: 'another leather download', select: () => void bench.setMaterial('brown_leather') },
    ]);
    const sliders = row(controls, '');
    setting(bench, sliders, 'roughness', [0, 2, 0.05], () => broken.roughness, (v) => (broken.roughness = v));
    setting(bench, sliders, 'clearcoat', [0, 1, 0.05], () => broken.clearcoat, (v) => (broken.clearcoat = v));
    keyControls(bench, controls);
    checklist(
      bench,
      controls,
      [
        fault(
          ['maps'],
          () => near(bench.material.roughness, 1),
          'roughness was 0.5. three.js multiplies the roughness map by it, so every value halved and the matte leather turned glossy. The map holds the scan\'s real values: start at 1.',
          'material.roughness = 1;',
        ),
        fault(
          ['finishes'],
          () => bench.material.clearcoat === 0,
          'A clear coat added a second, sharp reflection on top: patent leather, a different material. Plain leather has no coat.',
          'material.clearcoat = 0;',
        ),
      ],
      'the texture. Both settings stay on the material whichever maps you load, so another download looks just as plastic. Fix the settings before blaming the scan.',
    );
    bench.refresh();
    readout.textContent = "The leather looks like shiny plastic.\nSomeone tried another leather download: it looked just as plastic.";
  });
};

// ---------------------------------------------------------------------------------------------
// 2. The velvet looks like faded felt.

type SheenColor = 'black' | 'own' | 'white';

export const offFelt: SceneSetup = (harness) => {
  start(harness, { material: 'velour_velvet', key: { around: -60, above: 25 } }, (bench, readout, controls) => {
    const { renderer } = harness;
    // Broken: sheenColor left black (finishes), and AgX tone mapping (before you light).
    let color: SheenColor = 'black';
    bench.onChange(() => {
      const own = bench.entry.sheen?.color ?? 0xffffff;
      bench.material.sheenColor.set(color === 'black' ? 0x000000 : color === 'white' ? 0xffffff : own);
    });
    materialButtons(bench, controls, ['velour_velvet', 'Leather039', 'scuba_suede']);
    choices(
      controls,
      'sheenColor',
      [
        { label: "the fabric's own, lighter", select: () => ((color = 'own'), bench.refresh()) },
        { label: 'black (the default)', select: () => ((color = 'black'), bench.refresh()) },
        { label: 'white', select: () => ((color = 'white'), bench.refresh()) },
      ],
      1,
    );
    toneButtons(bench, controls, THREE.AgXToneMapping);
    keyControls(bench, controls);
    checklist(bench, controls, [
      fault(
        ['finishes'],
        () => color === 'own',
        'sheen was 1, but sheenColor was left black, its default, and three.js multiplies the sheen by its color: no soft glow where the pile turns away. Tint it a lighter shade of the fabric; white looks dusty.',
        'material.sheenColor.set(0xff6f8a);',
      ),
      fault(
        ['before'],
        () => renderer.toneMapping === THREE.NeutralToneMapping,
        'AgX tone mapping fades strong colors toward white the most, so the red went chalky. ACES drains it too. Neutral keeps a product\'s colors.',
        'renderer.toneMapping = THREE.NeutralToneMapping;',
      ),
    ]);
    bench.refresh();
    readout.textContent = 'The velvet looks like faded felt: dull, chalky red,\nwith no soft glow where it curves away. Its sheen is already 1.';
  });
};

// ---------------------------------------------------------------------------------------------
// 3. The wood looks huge.

const WOOD_TILES = [0.3, 1.5, 3]; // meters; the scan covers 1.5 m

export const offWood: SceneSetup = (harness) => {
  // 2K maps: the lesson is the tile's size and the coat, not sharpness, and the 4K scan would take
  // 250 MB of GPU memory more.
  start(harness, { material: 'wood_table_001', key: { around: -55, above: 30 }, maxTextureSize: 2048 }, (bench, readout, controls) => {
    // Broken: the 1.5 m tabletop squeezed into 30 cm (scale), and a clear coat over a scan that was
    // photographed varnished (finishes).
    let tile = 0.3;
    bench.material.clearcoat = 1;
    bench.material.clearcoatRoughness = 0.05;
    bench.onChange(() => setTileScale(bench, tile / bench.entry.size[0]));
    // A view from the right, with the studio turned so the coat's reflection lies along the plank.
    // With the softbox square in the swatch instead (turned 270°), or a lower camera, even the
    // fixed, uncoated varnish reflects the room as silvery streaks along the grain.
    const { camera, controls: orbit, scene } = harness;
    camera.position.set(0.3, 0.24, 0.68);
    orbit.target.set(0, 0.07, 0.03);
    orbit.update();
    scene.environmentRotation.y = scene.backgroundRotation.y = THREE.MathUtils.degToRad(180);
    choices(
      controls,
      'one tile covers',
      WOOD_TILES.map((meters) => ({ label: meters < 1 ? `${meters * 100} cm` : `${meters} m`, select: () => ((tile = meters), bench.refresh()) })),
      0,
    );
    setting(bench, row(controls, ''), 'clearcoat', [0, 1, 0.05], () => bench.material.clearcoat, (v) => (bench.material.clearcoat = v));
    keyControls(bench, controls);
    checklist(bench, controls, [
      fault(
        ['scale'],
        () => tile === 1.5,
        "The tile was set to 30 cm, but the scan is a 1.5 m tabletop. Squeezed five times, a whole tabletop's grain landed on a 30 cm plank, five times too fine, so the plank reads as a giant beam seen from far off.",
        'texture.repeat.set(1 / 1.5, 1 / 1.5);',
      ),
      fault(
        ['finishes'],
        () => bench.material.clearcoat === 0,
        "This scan was photographed varnished, so its gloss is already in the roughness map. A clear coat on top doubled it: glass, not wood. Leave the coat off, or make the wood under it satin first.",
        'material.clearcoat = 0;',
      ),
    ]);
    bench.refresh();
    readout.textContent = "The plank looks like a huge beam seen from far away,\nand the wood shines like glass. The scan's page gives its size as 1.5 m.";
  });
};

// ---------------------------------------------------------------------------------------------
// 4. The product floats. Each fix alone leaves it floating.

export const offFloat: SceneSetup = (harness) => {
  start(harness, { material: 'leather_red_02', key: { around: -70, above: 22 }, balls: true }, (bench, readout, controls) => {
    const { scene } = harness;
    ballsInFront(bench.balls);
    keepKeyAt(bench);
    // Broken: a shadow pushed 2.5 cm off its contact (grounding), and the HDRI turned up while the
    // key was turned down (the key light), so what shadow there is goes pale.
    const shadow = bench.key.shadow;
    shadow.normalBias = 0.025;
    scene.environmentIntensity = 2;
    bench.key.intensity = 0.8;
    const sliders = row(controls, '');
    setting(bench, sliders, 'normalBias', [0, 0.03, 0.0005], () => shadow.normalBias, (v) => (shadow.normalBias = v));
    setting(bench, sliders, 'shadow.radius', [0, 10, 0.5], () => shadow.radius, (v) => (shadow.radius = v));
    const light = row(controls, '');
    setting(bench, light, 'key brightness', [0, 8, 0.1], () => bench.key.intensity, (v) => (bench.key.intensity = v));
    setting(bench, light, 'HDRI brightness', [0, 3, 0.05], () => scene.environmentIntensity, (v) => (scene.environmentIntensity = v));
    materialButtons(bench, controls, ['leather_red_02', 'denim_fabric_06', 'velour_velvet', 'Leather039']);
    checklist(
      bench,
      controls,
      [
        fault(
          ['grounding'],
          () => shadow.normalBias <= 0.006,
          'normalBias was 2.5 cm, so every shadow started that far from where things touch: a gap under the roll. A couple of millimeters stops acne without it.',
          'key.shadow.normalBias = 0.002;',
        ),
        fault(
          ['key', 'reading'],
          () => scene.environmentIntensity <= 1.2,
          'The HDRI was turned up to 2 to brighten the product. Its light reaches the floor under the roll too, since an HDRI casts no shadows, so it filled the shadow in.',
          'scene.environmentIntensity = 1;',
        ),
        fault(
          ['key'],
          () => bench.key.intensity >= 1.8,
          'The key was turned down to 0.8, too weak to cast a shadow you can see against that room. The gray ball barely has a dark side. Balance them: key about 2.5, HDRI 1.',
          'key.intensity = 2.5;',
        ),
      ],
      'shadow.radius. Softer or harder edges don\'t close a gap or darken a pale shadow.',
    );
    bench.refresh();
    readout.textContent = 'The roll seems to float above the floor: its shadow is faint\nand starts a little away from it. Softening the shadow did nothing.';
  });
};

// ---------------------------------------------------------------------------------------------
// 5. Everything is too flat. Gray clay shows it's the light, not the maps.

export const offFlat: SceneSetup = (harness) => {
  start(harness, { material: 'leather_red_02', hdri: 'overcast_soil_puresky', key: { around: 0, above: 20 }, balls: true }, (bench, readout, controls) => {
    ballsInFront(bench.balls);
    keepKeyAt(bench);
    // Broken: the key from the front (the key light), an overcast sky (reading the light), and the
    // harness's sky light left on (before you light).
    bench.fill.visible = true;
    choices(controls, 'surface', [
      { label: 'the material', select: () => bench.useClay(false) },
      { label: 'gray clay', select: () => bench.useClay(true) },
    ]);
    materialButtons(bench, controls, ['leather_red_02', 'denim_fabric_06', 'Leather039', 'velour_velvet']);
    keyControls(bench, controls);
    hdriButtons(bench, controls);
    choices(
      controls,
      'fill light',
      [
        { label: 'off', select: () => ((bench.fill.visible = false), bench.refresh()) },
        { label: 'HemisphereLight', select: () => ((bench.fill.visible = true), bench.refresh()) },
      ],
      1,
    );
    checklist(
      bench,
      controls,
      [
        fault(
          ['key'],
          () => bench.keyAboveSwatch() >= 5 && bench.keyAboveSwatch() <= 35,
          'The key came from the front, so every bump faced it equally and none fell into shade. Bring it low across the surface: 15 to 30° above it. That usually means from the side; the swatch leans back, so light from straight above skims it too.',
          'key.position.set(-1, 0.3, 0.2); // low, from the side',
        ),
        fault(
          ['reading'],
          // One strong side, and neutral: the warm lamps and the cool studio tint every material.
          () => hdriEntry(bench.hdriId!).keyShare >= 0.3 && Math.abs(hdriEntry(bench.hdriId!).tint - 1) < 0.05,
          'An overcast sky lights from everywhere, so the shade side of every bump is lit too. Pick a neutral room with one strong side: the warm lamps and the cool studio are one-sided, but tint every material.',
          'scene.environment = softboxStudio;',
        ),
        fault(
          ['before'],
          () => !bench.fill.visible,
          'A HemisphereLight added the same light everywhere, lifting every shadow toward gray, so the relief became a smaller part of the picture. Let the HDRI light the shade side.',
          'scene.remove(hemisphereLight);',
        ),
      ],
      'the material. Gray clay looks just as flat, so the maps aren\'t the problem: the light is.',
    );
    bench.refresh();
    readout.textContent = 'Everything looks flat, every material alike,\nand the gray ball is lit almost evenly all round.';
  });
};

// ---------------------------------------------------------------------------------------------
// 6. The suede looks metallic. Fixing the metalness shows the next problem.

export const offMetallic: SceneSetup = (harness) => {
  start(harness, { material: 'scuba_suede', hdri: 'cyclorama_hard_light', key: { around: -60, above: 25 }, balls: true }, (bench, readout, controls) => {
    const { scene, camera, controls: orbit } = harness;
    ballsInFront(bench.balls);
    keepKeyAt(bench);
    camera.position.set(0.0, 0.34, 0.8); // close enough to see the glints, with the balls in view
    orbit.target.set(0.09, 0.12, 0.1);
    orbit.update();
    // Broken: the packed map's metalness trusted and roughness "tuned" to 0.5 (maps), and an
    // AmbientLight added to brighten the result (metal, then before you light).
    const ambient = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambient);
    const m = bench.material;
    const broken = { roughness: 0.5 };
    bench.onChange(() => (m.roughness = broken.roughness));
    const setMetal = (fromMap: boolean) => {
      m.metalness = fromMap ? 1 : 0;
      m.metalnessMap = fromMap ? bench.maps!.arm : null; // reads blue
      m.needsUpdate = true; // adding or removing a map builds a different shader
      bench.refresh();
    };
    setMetal(true);
    choices(
      controls,
      'metalness',
      [
        { label: "1 × the packed map's blue", select: () => setMetal(true) },
        { label: '0', select: () => setMetal(false) },
      ],
      0,
    );
    setting(bench, row(controls, ''), 'roughness', [0, 2, 0.05], () => broken.roughness, (v) => (broken.roughness = v));
    choices(controls, 'extra light', [
      { label: 'AmbientLight', select: () => ((ambient.visible = true), bench.refresh()) },
      { label: 'none', select: () => ((ambient.visible = false), bench.refresh()) },
    ]);
    hdriButtons(bench, controls);
    checklist(bench, controls, [
      fault(
        ['maps'],
        () => m.metalness === 0,
        "The packed map's blue says metalness 0.5 to 0.8, and it was trusted. Suede isn't metal: its color turned into a darker, tinted reflection of the room.",
        'material.metalness = 0; material.metalnessMap = null;',
      ),
      fault(
        ['maps'],
        () => near(m.roughness, 1),
        'roughness was 0.5, halving the map, so the matte nap turned glossy and every lamp glinted off it like brushed steel.',
        'material.roughness = 1;',
      ),
      fault(
        ['metal', 'before'],
        () => !ambient.visible,
        'An AmbientLight was added because the "metal" looked dark. It only lights the diffuse part, which metal mostly lacks, so it barely helped. Once the metalness is fixed it lifts everything, and the suede goes pale and flat.',
        'scene.remove(ambientLight);',
      ),
    ]);
    bench.refresh();
    readout.textContent = 'The suede glints like brushed metal.\nSomeone added an AmbientLight to brighten it: it barely changed.';
  });
};

// ---------------------------------------------------------------------------------------------
// 7. The gold ring looks like pale plastic. The ring bench: untextured metal.

const ALL_HDRIS = HDRIS.map((entry) => entry.id);

export const offRings: SceneSetup = (harness) => {
  const bench = createRingBench(harness, 420);
  const readout = overlay(harness.container, 'readout');
  const controls = panel(harness.container);
  whenRingsReady(bench, readout, 'overcast_soil_puresky', () => {
    const { renderer, scene } = harness;
    // Broken: an even sky (metal), turned up to make the rings shine (reading the light), and tone
    // mapping off (before you light).
    scene.environmentIntensity = 3;
    hdriButtons(bench, controls, ALL_HDRIS);
    setting(bench, row(controls, ''), 'HDRI brightness', [0.25, 4, 0.05], () => scene.environmentIntensity, (v) => (scene.environmentIntensity = v));
    toneButtons(bench, controls, THREE.NoToneMapping);
    checklist(bench, controls, [
      fault(
        ['metal'],
        () => ['ijewel_metal', 'studio_small_09'].includes(bench.hdriId ?? ''),
        'Polished metal is a tinted mirror, and an overcast sky has nothing dark in it to reflect: an even gray, like plastic. Use a studio with bright panels and dark areas.',
        'scene.environment = studio; // the jewelry studio or the softbox studio',
      ),
      fault(
        ['reading'],
        () => scene.environmentIntensity <= 1.2,
        'The environment was turned up to 3 to make the rings shine. Everything got brighter by the same amount, so nothing new showed, and the reflections went pale.',
        'scene.environmentIntensity = 1;',
      ),
      fault(
        ['before', 'metal'],
        () => renderer.toneMapping === THREE.NeutralToneMapping,
        "Tone mapping was off, so every reflection brighter than white clipped to flat white. ACES and AgX roll it off but drain the gold's color; Neutral keeps it.",
        'renderer.toneMapping = THREE.NeutralToneMapping;',
      ),
    ]);
    bench.refresh();
    readout.textContent = 'The rings look like pale, chalky plastic, the gold barely gold.\nSomeone turned the environment up to make them shine.';
  });
};

// ---------------------------------------------------------------------------------------------
// 8. The floor crawls when the camera moves.

export const offCrawl: SceneSetup = (harness) => {
  // The key low, ahead and to the right: a glossy floor glints under it, a matte one doesn't. Straight
  // ahead, even the fixed, matte concrete glared pale. 1K maps: from standing height the concrete
  // never shows more (the scale unit's What's off).
  const options: BenchOptions = { material: 'Concrete034', key: { around: 130, above: 22, intensity: 2 }, maxTextureSize: 1024 };
  start(harness, options, (bench, readout, controls) => {
    const { camera, controls: orbit } = harness;
    addFloor(bench, 60, 40);
    camera.position.set(0.4, 1.6, 1.2); // eye height, at the floor's near end
    orbit.target.set(0, 0, -6);
    orbit.update();
    // Broken: mipmaps off (scale), roughness 0.3 on top of the map (maps), and the color map read as
    // plain numbers (before you light).
    const broken = { mipmaps: false, roughness: 0.3 };
    bench.setColorSpace('map', THREE.NoColorSpace);
    bench.onChange(() => {
      setFiltering(bench, { mipmaps: broken.mipmaps, anisotropic: true });
      bench.material.roughness = broken.roughness;
    });
    const group = row(controls, 'texture');
    checkbox(group, 'generateMipmaps', false, (on) => ((broken.mipmaps = on), bench.refresh()));
    choices(
      controls,
      'color map',
      [
        { label: 'sRGB', select: () => bench.setColorSpace('map', THREE.SRGBColorSpace) },
        { label: 'none (NoColorSpace)', select: () => bench.setColorSpace('map', THREE.NoColorSpace) },
      ],
      1,
    );
    setting(bench, row(controls, ''), 'roughness', [0, 2, 0.05], () => broken.roughness, (v) => (broken.roughness = v));
    const move = row(controls, '');
    checkbox(move, 'move the camera slowly', false, (on) => {
      orbit.autoRotate = on;
      orbit.autoRotateSpeed = 0.4;
    });
    checklist(bench, controls, [
      fault(
        ['scale'],
        () => filteringOf(bench).mipmaps,
        'Mipmaps were off, so each far pixel picked one texel out of dozens, a different one each time the camera moved: crawling and sparkle.',
        'texture.generateMipmaps = true; texture.minFilter = THREE.LinearMipmapLinearFilter;',
      ),
      fault(
        ['maps'],
        () => near(bench.material.roughness, 1),
        'roughness was 0.3, multiplying the map, so the matte concrete turned glossy: a sheen across the floor, glinting off every bump. Start at 1.',
        'material.roughness = 1;',
      ),
      fault(
        ['before'],
        () => bench.maps!.map.colorSpace === THREE.SRGBColorSpace,
        'The color map was read as plain numbers instead of sRGB, so the concrete came out pale and washed out.',
        'map.colorSpace = THREE.SRGBColorSpace;',
      ),
    ]);
    bench.refresh();
    readout.textContent = "Tick 'move the camera slowly': the concrete floor crawls and sparkles.\nIt also looks glossy, and paler than concrete.";
  });
};
