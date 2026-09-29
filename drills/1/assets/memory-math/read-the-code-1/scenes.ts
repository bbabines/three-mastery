// Scenes for the runtime memory math page. The README places each one with <div data-scene="name">.
import { choiceButtons, collectResources, COLORS, fitModel, formatBytes, formatNumber, geometryBytes, label, overlay, slider } from '@harness/lesson';
import { loadModel, MODELS } from '@harness/models';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const { getByteLength } = THREE.TextureUtils;

// A texture's GPU bytes: the full-size image, plus a third when it has mipmaps.
function textureBytes(texture: THREE.Texture) {
  const { width, height } = texture.image as { width: number; height: number };
  const full = getByteLength(width, height, texture.format, texture.type);
  return texture.generateMipmaps ? Math.round((full * 4) / 3) : full;
}

// A bar standing on the floor; its height is set through scale.y.
function bar(color: string) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.34, 1, 0.34).translate(0, 0.5, 0), new THREE.MeshStandardMaterial({ color }));
  mesh.position.y = 0.05;
  return mesh;
}

const MODEL_LIST = [
  { button: 'J-cups', url: MODELS.jcups, name: 'jcups.glb' },
  { button: 'rack parts', url: MODELS.rackParts, name: 'rack-parts.glb' },
];
const TALLEST_BAR = 1.7; // the bigger model's GPU total

export const footprint: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0.9, 1.6, 4.4);
  controls.target.set(0.6, 1.05, 0);
  scene.children.find((child) => child instanceof THREE.AxesHelper)!.visible = false; // it would poke through the models

  const readout = overlay(container, 'readout');
  readout.textContent = 'loading both models…';

  // Bars to the right of the model: the file, then GPU memory as geometry with textures on top.
  const fileBar = bar(COLORS.blue);
  fileBar.position.x = 1.5;
  const geometryBar = bar(COLORS.orange);
  geometryBar.position.x = 2.05;
  const textureBar = bar(COLORS.green);
  textureBar.position.x = 2.05;
  const fileTag = label('file', COLORS.blue);
  const gpuTag = label('GPU', COLORS.orange);
  scene.add(fileBar, geometryBar, textureBar, fileTag, gpuTag);

  Promise.all(MODEL_LIST.map((item) => loadModel(item.url))).then((loaded) => {
    const models = loaded.map((gltf, i) => {
      const { geometries, textures } = collectResources(gltf.scene);
      let geometry = 0;
      let vertices = 0;
      for (const item of geometries) {
        geometry += geometryBytes(item);
        vertices += item.attributes.position.count;
      }
      let texture = 0;
      for (const item of textures) texture += textureBytes(item);
      const jcups = MODEL_LIST[i].button === 'J-cups';
      // The four J-cups sit far apart in the file; stand them side by side so they're big enough to see.
      if (jcups) gltf.scene.children.forEach((cup, n) => (cup.position.x = n * 0.16));
      const holder = fitModel(gltf.scene, jcups ? 1.5 : 1.8, new THREE.Vector3(-0.35, 0.05, 0));
      holder.visible = false;
      scene.add(holder);
      // A .glb's header records the whole file's length.
      const file: number = gltf.parser.extensions.KHR_binary_glTF.header.length;
      return { holder, geometry, texture, vertices, textures: [...textures], file, ...MODEL_LIST[i] };
    });
    const scale = TALLEST_BAR / Math.max(...models.map((model) => model.geometry + model.texture));

    const show = (i: number) => {
      const model = models[i];
      for (const other of models) other.holder.visible = other === model;
      const total = model.geometry + model.texture;
      fileBar.scale.y = model.file * scale;
      geometryBar.scale.y = model.geometry * scale;
      textureBar.scale.y = Math.max(model.texture * scale, 0.001);
      textureBar.position.y = geometryBar.position.y + geometryBar.scale.y;
      fileTag.position.set(fileBar.position.x, fileBar.position.y + fileBar.scale.y + 0.2, 0);
      gpuTag.position.set(geometryBar.position.x, geometryBar.position.y + total * scale + 0.2, 0);

      const pictures = model.textures
        .map((texture) => `${(texture.image as { width: number }).width} × ${(texture.image as { height: number }).height}`)
        .join(', ');
      readout.innerHTML = [
        `<span style="color:${COLORS.blue}">${model.name}</span>   ${formatBytes(model.file)} file`,
        `<span style="color:${COLORS.orange}">geometry</span>   ${model.vertices.toLocaleString('en-US')} vertices and their indices   ${formatBytes(model.geometry)}`,
        `<span style="color:${COLORS.green}">textures</span>   ${model.textures.length} (${pictures}), 4 bytes a pixel + mipmaps   ${formatBytes(model.texture)}`,
        `on the GPU   ${formatBytes(total)}, ${formatNumber(total / model.file, 1)} × the file`,
      ].join('\n');
    };

    choiceButtons(
      overlay(container, 'controls'),
      models.map((model, i) => ({ html: model.button, select: () => show(i) })),
    );
  });
};

// Texture formats for the pyramid: bytes per pixel sets each layer's thickness.
const FORMATS = [
  { button: 'color, 8-bit', code: 'RGBAFormat, UnsignedByteType', format: THREE.RGBAFormat, type: THREE.UnsignedByteType, color: COLORS.orange },
  { button: 'HDR, half float', code: 'RGBAFormat, HalfFloatType', format: THREE.RGBAFormat, type: THREE.HalfFloatType, color: COLORS.red },
  {
    button: 'compressed, BC7',
    code: 'RGBA_BPTC_Format, UnsignedByteType',
    format: THREE.RGBA_BPTC_Format,
    type: THREE.UnsignedByteType,
    color: COLORS.green,
  },
] as const;
const WIDEST = 3; // a 4096-pixel texture's base, in scene units
const THICKNESS_PER_BYTE = 0.03; // a layer's thickness for each byte per pixel

export const mipPyramid: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(3.3, 2.7, 4.3);
  controls.target.set(0, 0.35, 0);
  scene.children.find((child) => child instanceof THREE.AxesHelper)!.visible = false; // it would stand inside the layers

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const layers = new THREE.Group();
  scene.add(layers);
  const material = new THREE.MeshStandardMaterial({ color: COLORS.orange });
  const cube = new THREE.BoxGeometry(1, 1, 1);
  let size = 2048;
  let pick: (typeof FORMATS)[number] = FORMATS[0];

  const update = () => {
    material.color.set(pick.color);
    layers.clear();
    // One layer per mip level: each half the width of the one below, so a quarter of the pixels.
    const bytesPerPixel = getByteLength(4, 4, pick.format, pick.type) / 16;
    const thickness = bytesPerPixel * THICKNESS_PER_BYTE;
    let width = size;
    let y = 0.05;
    let levels = 0;
    while (width >= 1) {
      const layer = new THREE.Mesh(cube, material);
      const side = (width / 4096) * WIDEST;
      layer.scale.set(side, thickness, side);
      layer.position.y = y + thickness / 2;
      layers.add(layer);
      y += thickness;
      width /= 2;
      levels++;
    }
    const full = getByteLength(size, size, pick.format, pick.type);
    readout.textContent = [
      `TextureUtils.getByteLength(${size}, ${size}, ${pick.code})`,
      `→ ${formatBytes(full)} for the full-size image, the bottom layer: ${formatNumber(bytesPerPixel)} byte${bytesPerPixel === 1 ? '' : 's'} a pixel`,
      `the ${levels - 1} mip levels above it add a third: ${formatBytes((full * 4) / 3)} in all`,
    ].join('\n');
  };

  choiceButtons(
    controlsBar,
    FORMATS.map((format) => ({
      html: format.button,
      select: () => {
        pick = format;
        update();
      },
    })),
  );
  slider(controlsBar, 'texture size', { min: 8, max: 12, step: 1, value: 11 }, (value) => {
    size = 2 ** value;
    update();
  });
};
