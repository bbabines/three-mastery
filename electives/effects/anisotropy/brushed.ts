// Brushed metal for the watch and a test disc. three.js stretches a highlight with `anisotropy`
// (0 to 1) along a direction across the surface: the tangent, turned by `anisotropyRotation`, or
// a per-pixel direction from `anisotropyMap` (red and green: the direction, blue: the strength).
// The tangent comes from the mesh's `tangent` attribute when it has one, and otherwise from how its
// UVs run across each pixel.
import * as THREE from 'three/webgpu';

const TEXTURES = '/assets/reference/classic-watch/textures';

// WebGi saves the cover's brushing as a direction map, and the dial's as a gray angle map (black
// to white for a full turn). three.js takes direction maps, so the angles are turned into one.
export function angleMapToDirectionMap(image: HTMLImageElement | ImageBitmap, strength = 1) {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext('2d', { willReadFrequently: true })!;
  context.drawImage(image, 0, 0);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < pixels.data.length; i += 4) {
    const angle = (pixels.data[i] / 255) * Math.PI * 2;
    pixels.data[i] = Math.round((Math.cos(angle) * 0.5 + 0.5) * 255);
    pixels.data[i + 1] = Math.round((Math.sin(angle) * 0.5 + 0.5) * 255);
    pixels.data[i + 2] = Math.round(strength * 255);
  }
  context.putImageData(pixels, 0, 0);
  return canvas;
}

function dataMap(source: TexImageSource | HTMLCanvasElement) {
  const texture = source instanceof HTMLCanvasElement ? new THREE.CanvasTexture(source) : new THREE.Texture(source as HTMLImageElement);
  texture.colorSpace = THREE.NoColorSpace; // directions, not colors: never sRGB
  texture.flipY = false; // the watch's maps follow glTF's UV convention
  texture.needsUpdate = true;
  return texture;
}

export interface WatchBrushing {
  set(on: boolean): void;
  materials: THREE.MeshPhysicalMaterial[];
  dispose(): void;
}

// Puts back the brushing the file saves on the cover and dial (WebGi's own extension, which
// GLTFLoader keeps as data but doesn't apply). Strengths are WebGi's 0.84 and 1.5; three.js
// stops at 1.
export async function restoreWatchBrushing(watch: THREE.Object3D): Promise<WatchBrushing> {
  const loader = new THREE.ImageLoader();
  const [coverImage, dialImage] = await Promise.all([
    loader.loadAsync(`${TEXTURES}/embedded-3.jpg`),
    loader.loadAsync(`${TEXTURES}/embedded-4.jpg`),
  ]);
  const coverMap = dataMap(coverImage);
  const dialMap = dataMap(angleMapToDirectionMap(dialImage));
  const saved = new Map<THREE.MeshPhysicalMaterial, { strength: number; map: THREE.Texture }>();
  watch.traverse((object) => {
    if (!(object instanceof THREE.Mesh) || !(object.material instanceof THREE.MeshPhysicalMaterial)) return;
    const extension = object.material.userData.gltfExtensions?.WEBGI_materials_anisotropy;
    if (!extension) return;
    const map = object.material.name === 'clockface' ? dialMap : coverMap;
    saved.set(object.material, { strength: Math.min(1, extension.anisotropyFactor), map });
  });
  return {
    materials: [...saved.keys()],
    set: (on) => {
      for (const [material, { strength, map }] of saved) {
        material.anisotropy = on ? strength : 0;
        material.anisotropyMap = on ? map : null;
        material.needsUpdate = true;
      }
    },
    dispose: () => {
      coverMap.dispose();
      dialMap.dispose();
    },
  };
}

// A direction map for a round finish. The highlight stretches along the direction, across the
// grooves. `radial` true: out from the center, for a spun finish, whose grooves circle the center
// like a record's. false: around the center, for a sunburst, whose grooves run out from it.
export function circularDirectionMap(size = 512, radial = false) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const context = canvas.getContext('2d')!;
  const pixels = context.createImageData(size, size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x + 0.5 - size / 2;
      const dy = y + 0.5 - size / 2;
      const length = Math.hypot(dx, dy) || 1;
      // Around the center (tangent to the circle), or out from it.
      const ux = radial ? dx / length : -dy / length;
      const uy = radial ? dy / length : dx / length;
      const i = (y * size + x) * 4;
      pixels.data[i] = Math.round((ux * 0.5 + 0.5) * 255);
      pixels.data[i + 1] = Math.round((-uy * 0.5 + 0.5) * 255); // canvas y runs down, UV v runs up
      pixels.data[i + 2] = 255;
      pixels.data[i + 3] = 255;
    }
  }
  context.putImageData(pixels, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.NoColorSpace;
  return texture;
}

// Fine streaks painted into a color map: what a "brushed" texture from a photo or a generator
// looks like. On its own it only paints lines; the highlight stays round.
export function streakColorMap(size = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const context = canvas.getContext('2d')!;
  context.fillStyle = '#c8c8c8';
  context.fillRect(0, 0, size, size);
  for (let y = 0; y < size; y++) {
    const shade = 170 + Math.round(Math.random() * 70);
    context.fillStyle = `rgb(${shade},${shade},${shade})`;
    context.fillRect(0, y, size, 1);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
