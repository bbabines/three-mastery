// Two broken downloads made from the leather scan for this page, and a view that shows one map or
// one channel on the samples, unlit, the way you'd inspect a download before trusting it.
//
// - DirectX: the leather's normal map with its green channel flipped, which is exactly how a
//   DirectX-style map differs from the OpenGL style three.js expects.
// - Baked light: the leather's color map with light from the upper left painted into every pebble,
//   the way a photo taken under a lamp comes out when nobody removed the light ("delit" it).
import { onLeave } from '@harness/teardown';
import * as THREE from 'three';
import type { Bench } from '../bench';

type Source = HTMLImageElement | HTMLCanvasElement;

function pixelsOf(image: Source, width = image.width, height = image.height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d', { willReadFrequently: true })!;
  context.drawImage(image, 0, 0, width, height);
  return { canvas, context, image: context.getImageData(0, 0, width, height) };
}

// A new texture on `canvas` with the same tiling, filtering, and color space as `like`. (clone()
// would share the image with the original, so changing it would change both.)
function textureLike(like: THREE.Texture, canvas: HTMLCanvasElement) {
  const texture = new THREE.Texture(canvas);
  texture.wrapS = like.wrapS;
  texture.wrapT = like.wrapT;
  texture.repeat.copy(like.repeat);
  texture.anisotropy = like.anisotropy;
  texture.colorSpace = like.colorSpace;
  texture.needsUpdate = true;
  return texture;
}

export function directXNormalMap(normalMap: THREE.Texture) {
  const { canvas, context, image } = pixelsOf(normalMap.image as Source);
  const data = image.data;
  for (let i = 0; i < data.length; i += 4) data[i + 1] = 255 - data[i + 1]; // green: up becomes down
  context.putImageData(image, 0, 0);
  return textureLike(normalMap, canvas);
}

export function bakedLightColorMap(colorMap: THREE.Texture, normalMap: THREE.Texture) {
  const color = colorMap.image as Source;
  const { canvas, context, image } = pixelsOf(color);
  const normal = pixelsOf(normalMap.image as Source, color.width, color.height).image.data;
  const data = image.data;
  const toLinear = new Float32Array(256).map((_, i) => {
    const c = i / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const toSrgb = new Uint8ClampedArray(4096).map((_, i) => {
    const c = i / 4095;
    return Math.round(255 * (c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055));
  });
  const light = new THREE.Vector3(-0.55, 0.55, 0.63).normalize(); // from the upper left, in the map's own directions
  const n = new THREE.Vector3();
  for (let i = 0; i < data.length; i += 4) {
    // The pebble's tilt, exaggerated the way a low lamp exaggerates it.
    n.set((normal[i] / 255) * 2 - 1, (normal[i + 1] / 255) * 2 - 1, (normal[i + 2] / 255) * 2 - 1);
    n.x *= 3;
    n.y *= 3;
    n.normalize();
    const shade = 0.3 + (0.7 * Math.max(n.dot(light), 0)) / light.z; // a flat spot keeps its brightness
    for (let k = 0; k < 3; k++) data[i + k] = toSrgb[Math.min(4095, Math.round(toLinear[data[i + k]] * shade * 4095))];
  }
  context.putImageData(image, 0, 0);
  return textureLike(colorMap, canvas);
}

// What the inspect view shows on the samples.
export type View = 'lit' | 'color' | 'roughness' | 'metalness' | 'normalRed' | 'normalGreen';

// A material that shows one channel of a data map as gray, unlit and without color conversion, so
// 0.5 shows as the middle gray it is in the file.
function channelMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: { map: { value: null }, uvTransform: { value: new THREE.Matrix3() }, channel: { value: 1 } },
    vertexShader: /* glsl */ `
      uniform mat3 uvTransform;
      varying vec2 vUv;
      void main() {
        vUv = (uvTransform * vec3(uv, 1.0)).xy;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D map;
      uniform int channel;
      varying vec2 vUv;
      void main() {
        vec4 texel = texture2D(map, vUv);
        float value = channel == 0 ? texel.r : channel == 1 ? texel.g : channel == 2 ? texel.b : 0.0;
        gl_FragColor = vec4(vec3(value), 1.0);
      }`,
  });
}

// Puts a view on the bench's samples. Returns a function that switches it.
export function inspector(bench: Bench) {
  const colorView = new THREE.MeshBasicMaterial({ toneMapped: false });
  const channelView = channelMaterial();
  onLeave(bench.harness.container, () => {
    colorView.dispose();
    channelView.dispose();
  });
  const meshes = [bench.swatch, bench.roll, bench.plank, bench.block];
  return (view: View) => {
    const { material, entry } = bench;
    let shown: THREE.Material = material;
    if (view === 'color') {
      colorView.map = material.map;
      colorView.needsUpdate = true;
      shown = colorView;
    } else if (view !== 'lit') {
      // The packed map holds roughness in green and metalness in blue; a separate roughness map is
      // gray, with no metalness at all. The normal map's red is its left-right tilt, green its up-down.
      const normal = view === 'normalRed' || view === 'normalGreen';
      const texture = normal ? material.normalMap : view === 'metalness' && entry.layout !== 'packed' ? null : bench.maps!.arm;
      channelView.uniforms.map.value = texture;
      channelView.uniforms.channel.value = !texture ? 3 : view === 'normalRed' ? 0 : view === 'metalness' ? 2 : 1;
      if (texture) {
        texture.updateMatrix();
        channelView.uniforms.uvTransform.value.copy(texture.matrix);
      }
      shown = channelView;
    }
    for (const mesh of meshes) mesh.material = shown;
  };
}
