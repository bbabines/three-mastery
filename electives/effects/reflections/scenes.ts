import { buttonGroup, choiceButtons } from '@harness/lesson';
import type { TslSceneSetup } from '@harness/tsl';
import { ssr } from 'three/addons/tsl/display/SSRNode.js';
import { traa } from 'three/addons/tsl/display/TRAANode.js';
import { metalness, mrt, normalView, output, packNormalToRGB, pass, roughness, sample, unpackRGBToNormal, vec2, vec4, velocity } from 'three/tsl';
import * as THREE from 'three/webgpu';
import { costMeter, effectsStage, type EffectsStage } from '../stage';

type View = 'on' | 'off' | 'only';

// The floor: the bench's matte one, WebGi's polished floor (its saved roughness and metalness),
// and a near mirror.
export const FLOORS = {
  matte: { metalness: 0, roughness: 0.92 },
  polished: { metalness: 0.782, roughness: 0.25 },
  mirror: { metalness: 1, roughness: 0.05 },
} as const;
type Floor = keyof typeof FLOORS;

// Screen-space reflections, the mirror kind (r186's default): each reflective pixel steps along
// its reflected direction through the depth buffer and takes the color it hits. Rough surfaces
// read a blurred copy. Added on top of the picture, as three.js's own example does.
function reflections(stage: EffectsStage) {
  const { scene, camera, renderer } = stage.harness;
  const scenePass = stage.own(pass(scene, camera, { samples: 0 }));
  scenePass.setMRT(
    mrt({ output, normal: packNormalToRGB(normalView), metalrough: vec2(metalness, roughness), velocity }),
  );
  scenePass.getTexture('normal').type = THREE.UnsignedByteType;
  scenePass.getTexture('metalrough').type = THREE.UnsignedByteType;
  const color = scenePass.getTextureNode('output');
  const depth = scenePass.getTextureNode('depth');
  const motion = scenePass.getTextureNode('velocity');
  const normalTexture = scenePass.getTextureNode('normal');
  const normal = sample((uv) => unpackRGBToNormal(normalTexture.sample(uv)));
  const metalRough = scenePass.getTextureNode('metalrough');

  const mirror = stage.own(ssr(color, depth, normal, { metalnessNode: metalRough.r, roughnessNode: metalRough.g, camera }));
  mirror.maxDistance.value = 4; // reach in world units: the watch is about 3 tall
  mirror.thickness.value = 0.03;
  mirror.quality.value = 0.5;

  const views: Record<View, THREE.Node> = {
    on: vec4(color.rgb.add(mirror.rgb), color.a),
    off: color,
    only: vec4(mirror.rgb, 1),
  };
  const pipeline = stage.own(new THREE.RenderPipeline(renderer));
  const smoothed = new Map<View, ReturnType<typeof traa>>();
  // A new pixel ratio needs new TRAA nodes: r186's TRAA keeps its history at the old size.
  const resize = (ratio: number) => {
    for (const node of smoothed.values()) node.dispose();
    smoothed.clear();
    renderer.setPixelRatio(ratio);
  };
  const show = (view: View) => {
    if (!smoothed.has(view)) smoothed.set(view, stage.own(traa(views[view], depth, motion, camera)));
    pipeline.outputNode = smoothed.get(view)!;
    pipeline.needsUpdate = true;
  };
  const floorMaterial = stage.ground.material as THREE.MeshStandardMaterial;
  const setFloor = (floor: Floor) => {
    floorMaterial.metalness = FLOORS[floor].metalness;
    floorMaterial.roughness = FLOORS[floor].roughness;
  };
  stage.draw(() => pipeline.render());
  return { mirror, show, resize, setFloor };
}

const CODE: Record<View, string> = {
  on: 'color + ssr(color, depth, normal, { metalnessNode, roughnessNode })',
  off: 'color  // the environment\'s reflections only',
  only: 'ssr(…) by itself: what it adds',
};

// The opening view, and one tilted down so the top of the watch is off screen. Both look at a spot
// below the floor, so the watch's reflection lands above the controls bar.
const FRAMINGS = {
  whole: { position: [4.1, 7.5, 17.4], target: [-0.4, -0.6, 0.3] },
  cut: { position: [4.1, 5.6, 17.4], target: [-0.4, -2.5, 0.3] },
} as const;

export const adds: TslSceneSetup = (harness) => {
  effectsStage(harness, (stage) => {
    const { show, setFloor } = reflections(stage);
    const { scene, camera, controls } = stage.harness;
    controls.maxDistance = 20; // far enough to fit the watch and its reflection together
    const studio = scene.environmentIntensity;
    let view: View = 'on';
    let floor: Floor = 'mirror';
    let light = studio;
    const frame = (framing: keyof typeof FRAMINGS) => {
      camera.position.fromArray(FRAMINGS[framing].position);
      controls.target.fromArray(FRAMINGS[framing].target);
      controls.update();
    };
    const floors = buttonGroup(stage.ui, 'floor');
    choiceButtons(floors, [
      { html: 'mirror', select: () => setFloor((floor = 'mirror')) },
      { html: 'polished', select: () => setFloor((floor = 'polished')) },
      { html: 'matte', select: () => setFloor((floor = 'matte')) },
    ]);
    const environment = buttonGroup(stage.ui, 'studio');
    choiceButtons(environment, [
      { html: 'dim', select: () => (scene.environmentIntensity = light = 0.15) },
      { html: 'on', select: () => (scene.environmentIntensity = light = studio) },
      { html: 'dark', select: () => (scene.environmentIntensity = light = 0) },
    ]);
    const framing = buttonGroup(stage.ui, 'view');
    choiceButtons(framing, [
      { html: 'whole watch', select: () => frame('whole') },
      { html: 'top cut off', select: () => frame('cut') },
    ]);
    const views = buttonGroup(stage.ui, 'show');
    choiceButtons(views, [
      { html: 'reflections on', select: () => show((view = 'on')) },
      { html: 'reflections off', select: () => show((view = 'off')) },
      { html: 'just the reflections', select: () => show((view = 'only')) },
    ]);
    stage.harness.onFrame(() => {
      const { metalness: m, roughness: r } = FLOORS[floor];
      stage.readout.textContent = [
        CODE[view],
        `floor: metalness ${m}, roughness ${r}${light === studio ? '' : `; scene.environmentIntensity = ${light}`}`,
      ].join('\n');
    });
  });
};

const QUALITIES = { low: 0.25, medium: 0.5, high: 1 } as const;
type Quality = keyof typeof QUALITIES;

export const costs: TslSceneSetup = (harness) => {
  effectsStage(harness, (stage) => {
    const { mirror, show, resize, setFloor } = reflections(stage);
    let on = true;
    let quality: Quality = 'medium';
    let floor: Floor = 'polished';
    let half = false;
    let reach = 4;
    let ratio = 1;
    const label = () => (on ? `${quality}, ${floor}, reach ${reach}${half ? ', half' : ''}` : `off, ${floor}`);
    const apply = () => {
      mirror.quality.value = QUALITIES[quality];
      mirror.maxDistance.value = reach;
      mirror.resolutionScale = half ? 0.5 : 1;
      setFloor(floor);
      if (stage.harness.renderer.getPixelRatio() !== ratio) resize(ratio);
      show(on ? 'on' : 'off');
    };
    const qualities = buttonGroup(stage.ui, 'quality');
    choiceButtons(qualities, [
      { html: 'medium', select: () => ((quality = 'medium'), (on = true), apply()) },
      { html: 'low', select: () => ((quality = 'low'), (on = true), apply()) },
      { html: 'high', select: () => ((quality = 'high'), (on = true), apply()) },
      { html: 'off', select: () => ((on = false), apply()) },
    ]);
    const floors = buttonGroup(stage.ui, 'floor');
    choiceButtons(floors, [
      { html: 'polished', select: () => ((floor = 'polished'), apply()) },
      { html: 'matte', select: () => ((floor = 'matte'), apply()) },
    ]);
    const reaches = buttonGroup(stage.ui, 'reach');
    choiceButtons(reaches, [
      { html: '4', select: () => ((reach = 4), apply()) },
      { html: '1', select: () => ((reach = 1), apply()) },
    ]);
    const resolution = buttonGroup(stage.ui, 'traced at');
    choiceButtons(resolution, [
      { html: 'full size', select: () => ((half = false), apply()) },
      { html: 'half size', select: () => ((half = true), apply()) },
    ]);
    const pixels = buttonGroup(stage.ui, 'pixel ratio');
    choiceButtons(pixels, [
      { html: '1', select: () => ((ratio = 1), apply()) },
      { html: '2', select: () => ((ratio = 2), apply()) },
    ]);
    const meter = costMeter(stage, pixels, label);
    stage.harness.onFrame(() => {
      stage.readout.textContent = [
        on
          ? `ssr.quality.value = ${QUALITIES[quality]}; ssr.maxDistance.value = ${reach}; ssr.resolutionScale = ${half ? 0.5 : 1}`
          : 'reflections off',
        ...meter.lines(),
      ].join('\n');
    });
  });
};
