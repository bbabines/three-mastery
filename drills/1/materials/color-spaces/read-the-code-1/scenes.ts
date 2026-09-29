// Scenes for the color spaces page. The README places each one with <div data-scene="name">.
import { buttonGroup, choiceButtons, COLORS, formatNumber, overlay, sunlight } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

// A product label painted with the 2D canvas, whose colors are sRGB like every canvas's.
function paintLabel() {
  const canvas = document.createElement('canvas');
  canvas.width = 320;
  canvas.height = 200;
  const context = canvas.getContext('2d')!;
  context.fillStyle = '#1e3a8a';
  context.fillRect(0, 0, 320, 200);
  context.fillStyle = '#e4572e';
  context.fillRect(0, 0, 320, 70);
  context.fillStyle = '#ffffff';
  context.font = '700 44px system-ui, sans-serif';
  context.fillText('ACME', 20, 52);
  for (let i = 0; i < 8; i++) {
    const shade = Math.round((i / 7) * 255);
    context.fillStyle = `rgb(${shade}, ${shade}, ${shade})`; // a gray ramp from black to white
    context.fillRect(20 + i * 35, 110, 35, 60);
  }
  return canvas;
}

// A plate of round studs as a normal map: +Y (OpenGL style), made from a height at every pixel.
function studNormals() {
  const [width, height, cell, radius] = [256, 192, 64, 22];
  const heightAt = (x: number, y: number) => {
    const d = Math.hypot((x % cell) - cell / 2, (y % cell) - cell / 2) / radius;
    return d < 1 ? Math.cos((d * Math.PI) / 2) ** 2 : 0;
  };
  const data = new Uint8Array(width * height * 4);
  const direction = new THREE.Vector3();
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const slopeX = (heightAt(x + 1, y) - heightAt(x - 1 + width, y)) / 2;
      const slopeY = (heightAt(x, y + 1) - heightAt(x, y - 1 + height)) / 2;
      direction.set(-slopeX * 8, -slopeY * 8, 1).normalize();
      const i = (y * width + x) * 4;
      data[i] = Math.round((direction.x * 0.5 + 0.5) * 255);
      data[i + 1] = Math.round((direction.y * 0.5 + 0.5) * 255);
      data[i + 2] = Math.round((direction.z * 0.5 + 0.5) * 255);
      data[i + 3] = 255;
    }
  }
  const texture = new THREE.DataTexture(data, width, height); // colorSpace starts at NoColorSpace
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

export const maps: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 1.2, 2.7);
  controls.target.set(0, 1.1, 0);
  const sun = sunlight(scene, new THREE.Vector3(-2, 3, 3), 0.3, 3);
  sun.target.position.set(1, 1.1, 0);
  scene.add(sun.target);

  const labelCanvas = paintLabel();
  const labelMap = new THREE.CanvasTexture(labelCanvas);
  const panel = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1), new THREE.MeshBasicMaterial({ map: labelMap }));
  panel.position.set(-0.95, 1.1, 0);
  const normalMap = studNormals();
  const plate = new THREE.Mesh(
    new THREE.PlaneGeometry(1.6, 1.2),
    new THREE.MeshStandardMaterial({ color: COLORS.gray, roughness: 0.5, metalness: 0.1, normalMap }),
  );
  plate.position.set(0.95, 1.1, 0);
  scene.add(panel, plate);

  // The label as the canvas painted it, for comparison, shown by the browser as a plain image.
  const painted = new Image();
  painted.src = labelCanvas.toDataURL();
  painted.style.cssText = 'position: absolute; right: 10px; top: 10px; width: 112px; border: 1px solid #555;';
  container.append(painted);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const state: Record<'label' | 'normal', THREE.ColorSpace> = { label: THREE.SRGBColorSpace, normal: THREE.NoColorSpace };
  const names: Record<string, string> = { [THREE.SRGBColorSpace]: 'SRGBColorSpace', [THREE.NoColorSpace]: 'NoColorSpace' };

  const update = () => {
    labelMap.colorSpace = state.label;
    labelMap.needsUpdate = true; // the color space decides how it's sent to the GPU
    normalMap.colorSpace = state.normal;
    normalMap.needsUpdate = true;
    readout.textContent = [
      `labelMap.colorSpace = ${names[state.label]}   ${state.label === THREE.SRGBColorSpace ? 'colors as painted' : 'every color paler, as if washed out'}`,
      `normalMap.colorSpace = ${names[state.normal]}   ${state.normal === THREE.NoColorSpace ? 'studs lit from the light’s side' : 'every direction bent: the whole plate tilts'}`,
    ].join('\n');
  };

  const choose = (key: 'label' | 'normal', text: string, order: THREE.ColorSpace[]) =>
    choiceButtons(
      buttonGroup(controlsBar, text),
      order.map((space) => ({
        html: `<code>${names[space]}</code>`,
        select: () => {
          state[key] = space;
          update();
        },
      })),
    );
  choose('label', 'label map:', [THREE.SRGBColorSpace, THREE.NoColorSpace]);
  choose('normal', 'normal map:', [THREE.NoColorSpace, THREE.SRGBColorSpace]);
};

const PICKER = '#e4572e';

export const picker: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 1.15, 1.9);
  controls.target.set(0, 1.1, 0);

  const material = new THREE.MeshBasicMaterial();
  const swatch = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.1), material);
  swatch.position.set(0, 1.1, 0);
  scene.add(swatch);

  const readout = overlay(container, 'readout');
  const lines = [
    { code: `material.color.set('${PICKER}')`, run: () => material.color.set(PICKER) },
    { code: 'material.color.setRGB(228 / 255, 87 / 255, 46 / 255)', run: () => material.color.setRGB(228 / 255, 87 / 255, 46 / 255) },
    {
      code: 'material.color.setRGB(0.894, 0.341, 0.18, SRGBColorSpace)',
      run: () => material.color.setRGB(0.894, 0.341, 0.18, THREE.SRGBColorSpace),
    },
  ];

  choiceButtons(
    overlay(container, 'controls'),
    lines.map((line) => ({
      html: `<code>${line.code.replace('material.color.', '')}</code>`,
      select: () => {
        line.run();
        const hex = material.color.getHexString();
        const color = material.color;
        readout.innerHTML = [
          line.code,
          `stored, linear:  r ${formatNumber(color.r, 3)}  g ${formatNumber(color.g, 3)}  b ${formatNumber(color.b, 3)}`,
          `on screen, sRGB: #${hex}   ${hex === PICKER.slice(1) ? 'matches the picker' : 'too light: the picker numbers were read as linear'}`,
          `the picker:      <span style="display:inline-block;width:2.2em;height:0.9em;vertical-align:middle;background:${PICKER}"></span> CSS ${PICKER}`,
        ].join('\n');
      },
    })),
  );
};
