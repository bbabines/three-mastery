// Scenes for the measurement tools page. The README places each one with <div data-scene="name">.
import { cameraView, choiceButtons, COLORS, drawYourself, overlay, showCamera, slider, sunlight } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const STEPS = [0, 50, 150, 400, 800];

export const queue: SceneSetup = (harness) => {
  const { camera, controls, container, renderer, onFrame } = harness;
  camera.position.set(0, 1.2, 3.4);
  controls.target.set(0, 1, 0);
  // This scene calls render() itself, so it can ask the GPU a question right after it returns.
  const world = drawYourself(harness);
  sunlight(world, new THREE.Vector3(2, 4, 3), 0.8, 2);
  const gl = renderer.getContext() as WebGL2RenderingContext;

  const product = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.4, 0.14, 128, 16),
    new THREE.MeshStandardMaterial({ color: COLORS.orange }),
  );
  product.position.y = 1;
  // A backdrop whose fragment shader loops `steps` times for every pixel it covers: extra GPU work
  // that the CPU never sees.
  const backdrop = new THREE.Mesh(
    new THREE.PlaneGeometry(14, 8),
    new THREE.ShaderMaterial({
      uniforms: { steps: { value: 0 } },
      vertexShader: 'void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: `
        uniform int steps;
        void main() {
          float shade = 0.0;
          for (int i = 0; i < steps; i++) shade += sin(gl_FragCoord.x * 0.01 + float(i)) * 0.0001;
          gl_FragColor = vec4(vec3(0.09 + shade), 1.0);
          #include <colorspace_fragment>
        }`,
    }),
  );
  backdrop.position.set(0, 1, -2.5);
  world.add(product, backdrop);

  let steps = 0;
  slider(overlay(container, 'controls'), 'work per pixel', { min: 0, max: STEPS.length - 1, step: 1, value: 0 }, (value) => {
    steps = STEPS[value];
    (backdrop.material as THREE.ShaderMaterial).uniforms.steps.value = steps;
  });

  const pending: { sync: WebGLSync; frame: number }[] = [];
  let frame = 0;
  let doneRightAway = false;
  let framesLater = 0;
  const readout = overlay(container, 'readout');
  onFrame((delta) => {
    frame += 1;
    product.rotation.y += delta * 0.5;
    // Fences from earlier frames: has the GPU finished those frames yet?
    for (const item of [...pending]) {
      if (gl.getSyncParameter(item.sync, gl.SYNC_STATUS) !== gl.SIGNALED) continue;
      framesLater = frame - item.frame;
      gl.deleteSync(item.sync);
      pending.splice(pending.indexOf(item), 1);
    }

    renderer.render(world, camera);
    // A fence: the GPU marks it done once it has finished every command sent before it.
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0)!;
    gl.flush();
    doneRightAway = gl.getSyncParameter(sync, gl.SYNC_STATUS) === gl.SIGNALED;
    if (pending.length < 10) pending.push({ sync, frame });
    else gl.deleteSync(sync);

    readout.textContent = [
      'renderer.render(scene, camera)   has returned',
      `checked straight after: is the GPU done drawing it? ${doneRightAway ? 'yes' : 'no, its work is still queued'}`,
      `the GPU reported it done ${framesLater} frame${framesLater === 1 ? '' : 's'} later`,
      `backdrop: ${steps} loop steps in the fragment shader, for every pixel it covers`,
    ].join('\n');
  });
};

export const counts: SceneSetup = (harness) => {
  const { scene, camera, controls, container, renderer, onFrame } = harness;
  camera.position.set(1.9, 1.9, 3.3);
  controls.target.set(0.1, 0.65, 0);

  // Counted before the picture in the corner is rendered, so this callback sees a whole frame.
  let manual = false;
  let renderCalls = 0;
  let lastRenderCalls = 0;
  const readout = overlay(container, 'readout');
  onFrame(() => {
    const { render, memory } = renderer.info;
    readout.textContent = [
      manual ? 'renderer.info.autoReset = false;   renderer.info.reset() once per frame' : 'renderer.info.autoReset = true   // the default',
      `renderer.info.render.calls  ${render.calls}   triangles ${render.triangles.toLocaleString('en-US')}`,
      `render() calls last frame: ${lastRenderCalls}   (${manual ? 'all counted' : 'only the last one counted: the main view'})`,
      `renderer.info.memory: ${memory.geometries} geometries, ${memory.textures} textures   programs: ${renderer.info.programs?.length ?? 0}`,
    ].join('\n');
    lastRenderCalls = renderCalls;
    renderCalls = 0;
    if (manual) renderer.info.reset();
  });
  const render = renderer.render.bind(renderer);
  renderer.render = (target, cam) => {
    renderCalls += 1;
    render(target, cam);
  };

  const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.06, 0.6), new THREE.MeshStandardMaterial({ color: COLORS.gray }));
  shelf.position.set(0, 0.5, 0);
  const products = [COLORS.orange, COLORS.blue, COLORS.green].map((color, i) => {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 16), new THREE.MeshStandardMaterial({ color }));
    mesh.position.set((i - 1) * 0.5, 0.73, 0);
    return mesh;
  });
  scene.add(shelf, ...products);

  // A second camera, whose picture in the corner is a second render() call every frame.
  const eye = new THREE.PerspectiveCamera(40, 1.5, 0.3, 10);
  eye.position.set(-0.4, 1.2, 2.2);
  eye.lookAt(0, 0.6, 0);
  const helper = showCamera(eye);
  scene.add(eye, helper);
  cameraView(harness, eye, [helper]);

  choiceButtons(overlay(container, 'controls'), [
    { html: '<code>autoReset = true</code>', select: () => ((manual = false), (renderer.info.autoReset = true)) },
    { html: '<code>autoReset = false</code> + <code>reset()</code> each frame', select: () => ((manual = true), (renderer.info.autoReset = false)) },
  ]);
};
