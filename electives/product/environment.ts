import * as THREE from 'three';
import type { PanelSettings } from './lab';

// Radiance by direction, authored in linear light. This is a virtual reflection studio,
// not a photograph, a simulation of bounce light, or a roughness adjustment.
export function panelPanorama(settings: PanelSettings) {
  const width = 512;
  const height = 256;
  const pixels = new Float32Array(width * height * 4);
  for (let y = 0; y < height; y++) {
    const elevation = Math.PI * (0.5 - (y + 0.5) / height);
    for (let x = 0; x < width; x++) {
      const azimuth = 2 * Math.PI * (x + 0.5) / width;
      let light = settings.background;
      for (let panel = 0; panel < settings.count; panel++) {
        const center = (panel + 0.5) * 2 * Math.PI / settings.count;
        const separation = Math.abs(Math.atan2(Math.sin(azimuth - center), Math.cos(azimuth - center)));
        const horizontal = separation / settings.width;
        const vertical = Math.abs(elevation - 0.25) / 0.8;
        const edge = Math.max(horizontal, vertical);
        const feather = Math.max(0.001, settings.softness);
        const weight = 1 - THREE.MathUtils.smoothstep(edge, 1 - feather, 1);
        light += 8 * weight;
      }
      const i = (y * width + x) * 4;
      pixels[i] = pixels[i + 1] = pixels[i + 2] = light;
      pixels[i + 3] = 1;
    }
  }
  const image = new THREE.DataTexture(pixels, width, height, THREE.RGBAFormat, THREE.FloatType);
  image.colorSpace = THREE.LinearSRGBColorSpace;
  image.mapping = THREE.EquirectangularReflectionMapping;
  image.needsUpdate = true;
  return image;
}
