// A soft ground shadow baked once, for WebGPURenderer (it runs on the WebGL 2 fallback too). Each
// step moves one shadow-casting light to a new random direction above the model, draws where its
// shadow falls on the ground, and blends that into a running average. After a few hundred steps the
// average is a soft shadow that's darkest where the model touches the ground. The viewer then sees
// one black square whose opacity is that average: two triangles a frame, and no shadow map.
import { texture, uniform, uv, vec3, vec4 } from 'three/tsl';
import * as THREE from 'three/webgpu';

export interface SoftShadowOptions {
  size?: number; // the ground square's side, in scene units
  resolution?: number; // the baked picture's side, in pixels
  frames?: number; // how many light directions to average
  toward?: THREE.Vector3; // the middle of the soft light, as a direction from the model
  cone?: number; // how far from `toward` the directions reach, in degrees: the light's size
  darkness?: number; // the overlay's opacity where every direction is blocked
}

export interface SoftGroundShadow {
  overlay: THREE.Mesh; // add it to the scene, just above the ground
  readonly frames: number; // directions baked so far
  readonly total: number;
  readonly done: boolean;
  step(count?: number): void; // bakes `count` more directions, until `total`
  restart(): void; // after the model moves or changes: starts the average over where it is now
  dispose(): void;
}

export function softGroundShadow(
  renderer: THREE.WebGPURenderer,
  model: THREE.Object3D,
  { size = 8, resolution = 1024, frames = 400, toward = new THREE.Vector3(0, 1, 0), cone = 30, darkness = 0.85 }: SoftShadowOptions = {},
): SoftGroundShadow {
  model.updateWorldMatrix(true, true);
  const box = new THREE.Box3().setFromObject(model, true);
  const center = box.getCenter(new THREE.Vector3()).setY(0);

  // A scene of its own for the bake: a copy of the model that only casts (it shares the model's
  // geometry, so no new GPU memory), a ground that only shows shadow, and one light.
  const bake = new THREE.Scene();
  const castOnly = new THREE.MeshBasicNodeMaterial({ colorWrite: false, depthWrite: false });
  const caster = model.clone(true);
  caster.matrixAutoUpdate = false;
  caster.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    // See-through parts (glass) cast no shadow here either.
    child.castShadow = !materials.some((material) => material.transparent || (material as THREE.MeshPhysicalMaterial).transmission > 0);
    child.receiveShadow = false;
    child.material = castOnly;
  });
  const groundGeometry = new THREE.PlaneGeometry(size, size).rotateX(-Math.PI / 2);
  const catcher = new THREE.ShadowNodeMaterial({ opacity: 1 }); // alpha = how shadowed
  const bakeGround = new THREE.Mesh(groundGeometry, catcher);
  bakeGround.position.copy(center);
  bakeGround.receiveShadow = true;

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.castShadow = true;
  light.shadow.mapSize.set(1024, 1024);
  const shadowCamera = light.shadow.camera;
  shadowCamera.left = shadowCamera.bottom = -size / 2;
  shadowCamera.right = shadowCamera.top = size / 2;
  shadowCamera.near = 0.1;
  shadowCamera.far = 40;
  light.target.position.copy(center);
  bake.add(caster, bakeGround, light, light.target);

  // Looks straight down at the ground, so its picture lines up with the overlay's UVs: +X to the
  // right, −Z up. It sees only a thin slab around the ground, so the cast-only copy isn't drawn.
  const top = new THREE.OrthographicCamera(-size / 2, size / 2, size / 2, -size / 2, 99.9, 100.1);
  top.up.set(0, 0, -1);
  top.position.copy(center).add(new THREE.Vector3(0, 100, 0));
  top.lookAt(center);

  const sample = new THREE.RenderTarget(resolution, resolution, { type: THREE.HalfFloatType });
  const average = new THREE.RenderTarget(resolution, resolution, { type: THREE.HalfFloatType, depthBuffer: false });

  // Starts the average empty, so the overlay can be drawn before the first step.
  {
    const previous = renderer.getRenderTarget();
    renderer.setRenderTarget(average);
    renderer.clear();
    renderer.setRenderTarget(previous);
  }

  // Blends each new picture in with weight 1/n, a running average: after n pictures, each counts 1/n.
  const weight = uniform(1);
  const blend = new THREE.NodeMaterial();
  blend.fragmentNode = vec4(vec3(texture(sample.texture).a), weight);
  blend.transparent = true; // normal blending: new × weight + old × (1 − weight)
  blend.depthTest = false;
  blend.depthWrite = false;
  const quad = new THREE.QuadMesh(blend);

  // What the viewer sees: a black square whose opacity is the averaged shadow.
  const overlayMaterial = new THREE.MeshBasicNodeMaterial({ color: 0x000000, transparent: true, depthWrite: false });
  overlayMaterial.opacityNode = texture(average.texture, uv().flipY()).r.mul(darkness);
  const overlay = new THREE.Mesh(groundGeometry, overlayMaterial);
  overlay.position.copy(center);
  overlay.position.y += 0.004; // just above the floor, so it doesn't fight it for depth
  overlay.renderOrder = -1; // before other see-through parts, so glass sees it behind

  let baked = 0;
  const direction = new THREE.Vector3();
  const axis = toward.clone().normalize();
  const side = new THREE.Vector3(0, 0, 1).cross(axis).normalize();
  if (side.lengthSq() < 0.5) side.set(1, 0, 0);
  const across = axis.clone().cross(side).normalize();
  const clearColor = new THREE.Color();
  const placeCaster = () => {
    model.updateWorldMatrix(true, true);
    caster.matrix.copy(model.matrixWorld);
    caster.updateMatrixWorld(true);
  };
  placeCaster();

  const step = (count = 1) => {
    if (baked >= frames || count <= 0) return;
    const previousTarget = renderer.getRenderTarget();
    renderer.getClearColor(clearColor);
    const clearAlpha = renderer.getClearAlpha();
    const autoClear = renderer.autoClear;
    for (let i = 0; i < count && baked < frames; i++) {
      // A random direction in a cone around `toward`, spread evenly over the cone's area: one big
      // soft light, like a softbox.
      const cosMax = Math.cos(THREE.MathUtils.degToRad(cone));
      const cosTheta = 1 - Math.random() * (1 - cosMax);
      const sinTheta = Math.sqrt(1 - cosTheta * cosTheta);
      const phi = Math.random() * Math.PI * 2;
      direction
        .copy(axis)
        .multiplyScalar(cosTheta)
        .addScaledVector(side, Math.cos(phi) * sinTheta)
        .addScaledVector(across, Math.sin(phi) * sinTheta);
      light.position.copy(center).addScaledVector(direction, 20);

      renderer.setClearColor(0x000000, 0);
      renderer.autoClear = true;
      renderer.setRenderTarget(sample);
      renderer.render(bake, top); // where this direction's shadow falls

      weight.value = 1 / ++baked;
      renderer.autoClear = false;
      renderer.setRenderTarget(average);
      quad.render(renderer); // blended into the average
    }
    renderer.autoClear = autoClear;
    renderer.setClearColor(clearColor, clearAlpha);
    renderer.setRenderTarget(previousTarget);
  };

  return {
    overlay,
    get frames() {
      return baked;
    },
    total: frames,
    get done() {
      return baked >= frames;
    },
    step,
    restart: () => {
      baked = 0; // the next step's weight is 1, which replaces the old average
      placeCaster();
    },
    dispose: () => {
      sample.dispose();
      average.dispose();
      groundGeometry.dispose();
      castOnly.dispose();
      catcher.dispose();
      blend.dispose();
      overlayMaterial.dispose();
      light.shadow.dispose();
    },
  };
}
