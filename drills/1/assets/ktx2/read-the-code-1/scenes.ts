// Scenes for the KTX2 and Basis textures page. The README places each one with <div data-scene="name">.
import { choiceButtons, collectResources, COLORS, formatBytes, label, overlay } from '@harness/lesson';
import { loadModel, MODELS } from '@harness/models';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const { getByteLength } = THREE.TextureUtils;
const withMipmaps = (bytes: number) => Math.round((bytes * 4) / 3); // the smaller copies add a third

// A bar standing on the floor, with its height set later through scale.y.
function bar(color: string, x: number) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.34, 1, 0.34).translate(0, 0.5, 0), new THREE.MeshStandardMaterial({ color }));
  mesh.position.set(x, 0.05, 0);
  return mesh;
}

// The compressed texture formats this browser's GPU can read, found the same way KTX2Loader's
// detectSupport looks for them.
function gpuFormats(renderer: THREE.WebGLRenderer) {
  const formats = [
    ['EXT_texture_compression_bptc', 'BC7'],
    ['WEBGL_compressed_texture_astc', 'ASTC'],
    ['WEBGL_compressed_texture_etc', 'ETC2'],
    ['WEBGL_compressed_texture_s3tc', 'BC1–BC3'],
  ].filter(([extension]) => renderer.extensions.has(extension));
  return formats.length ? formats.map(([, name]) => name).join(', ') : 'none of them';
}

export const formats: SceneSetup = ({ scene, camera, controls, container, renderer }) => {
  camera.position.set(0, 1.2, 4.3);
  controls.target.set(0, 0.95, 0);
  scene.children.find((child) => child instanceof THREE.AxesHelper)!.visible = false; // it would stand among the bars

  const readout = overlay(container, 'readout');
  readout.textContent = 'loading jcups.glb…';
  const here = gpuFormats(renderer);

  loadModel(MODELS.jcups).then((gltf) => {
    // The sticker: the J-cups file's one texture, a 512 × 512 PNG.
    const sticker = [...collectResources(gltf.scene).textures][0];
    const { width, height } = sticker.image as { width: number; height: number };
    const fileBytes = gltf.parser.json.bufferViews[gltf.parser.json.images[0].bufferView].byteLength;

    // glTF textures are stored top row first, so flip the plane's UVs to show it the right way up.
    const plane = new THREE.PlaneGeometry(1.3, 1.3);
    const uv = plane.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setY(i, 1 - uv.getY(i));
    const picture = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({ map: sticker, transparent: true, side: THREE.DoubleSide }));
    picture.position.set(-1.25, 0.9, 0);
    const pictureTag = label('the sticker', COLORS.white);
    pictureTag.position.set(-1.25, 0.1, 0);

    const raw = withMipmaps(getByteLength(width, height, THREE.RGBAFormat, THREE.UnsignedByteType));
    const block = withMipmaps(getByteLength(width, height, THREE.RGBA_BPTC_Format, THREE.UnsignedByteType));
    const scale = 1.3 / raw;
    const bars = {
      file: bar(COLORS.blue, 0.1),
      raw: bar(COLORS.orange, 0.7),
      block: bar(COLORS.green, 1.3),
    };
    bars.file.scale.y = fileBytes * scale;
    bars.raw.scale.y = raw * scale;
    bars.block.scale.y = block * scale;
    const tags = [
      ['file', bars.file, COLORS.blue],
      ['RGBA', bars.raw, COLORS.orange],
      ['compressed', bars.block, COLORS.green],
    ] as const;
    for (const [text, mesh, color] of tags) {
      const tag = label(text, color);
      tag.position.set(mesh.position.x, mesh.position.y + mesh.scale.y + 0.2, 0);
      scene.add(tag);
    }
    scene.add(picture, pictureTag, bars.file, bars.raw, bars.block);

    const dim = new THREE.Color(COLORS.gray);
    const lit = (which: 'raw' | 'block') => {
      (bars.raw.material as THREE.MeshStandardMaterial).color.set(which === 'raw' ? COLORS.orange : dim);
      (bars.block.material as THREE.MeshStandardMaterial).color.set(which === 'block' ? COLORS.green : dim);
    };

    const show = (which: 'raw' | 'block', first: string, formatName: string, format: THREE.AnyPixelFormat | THREE.CompressedPixelFormat) => {
      lit(which);
      const top = getByteLength(width, height, format, THREE.UnsignedByteType);
      const total = withMipmaps(top);
      readout.textContent = [
        `the sticker: ${width} × ${height}, a ${formatBytes(fileBytes)} PNG in the file`,
        first,
        `getByteLength(${width}, ${height}, ${formatName}, UnsignedByteType) → ${formatBytes(top)}`,
        `plus a third for mipmaps: ${formatBytes(total)} on the GPU, ${Math.round(total / fileBytes)} × the file`,
        `this browser's GPU reads: ${here}`,
      ].join('\n');
    };

    choiceButtons(overlay(container, 'controls'), [
      { html: 'PNG, as loaded', select: () => show('raw', 'decoded to raw pixels: 4 bytes each', 'RGBAFormat', THREE.RGBAFormat) },
      {
        html: 'KTX2 on a desktop GPU',
        select: () =>
          show('block', 'transcoded to BC7, which desktop GPUs usually read: 1 byte a pixel', 'RGBA_BPTC_Format', THREE.RGBA_BPTC_Format),
      },
      {
        html: 'KTX2 on a phone',
        select: () =>
          show('block', 'transcoded to ASTC, which most phones read: 1 byte a pixel', 'RGBA_ASTC_4x4_Format', THREE.RGBA_ASTC_4x4_Format),
      },
      {
        html: 'KTX2, no GPU format',
        select: () => show('raw', 'no compressed format the GPU reads: KTX2Loader falls back to RGBA', 'RGBAFormat', THREE.RGBAFormat),
      },
    ]);
  });
};
