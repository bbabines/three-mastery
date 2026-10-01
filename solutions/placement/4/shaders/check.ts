import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function stageForPixelColor(perPixel: boolean): Answer<'fragment' | 'vertex'> {
  return perPixel?'fragment':'vertex';
}

export function setUniform(material: THREE.ShaderMaterial, name: string, value: number): Answer<number> {
  if (material.uniforms[name]) material.uniforms[name].value=value;
  else material.uniforms[name]={value};
  return value;
}

export function worldPointFromModel(local: THREE.Vector3, model: THREE.Matrix4): Answer<THREE.Vector3> {
  return local.clone().applyMatrix4(model);
}

export function blueRedGreen(color: THREE.Vector3): Answer<THREE.Vector3> {
  return new THREE.Vector3(color.z,color.x,color.y);
}

export function clampedLighting(normal: THREE.Vector3, light: THREE.Vector3): Answer<number> {
  return Math.max(0,normal.clone().normalize().dot(light.clone().normalize()));
}

export function precisionForWorldPosition(largeWorld: boolean): Answer<'highp' | 'mediump'> {
  return largeWorld?'highp':'mediump';
}

export function markShaderChange(material: THREE.Material): Answer<number> {
  material.needsUpdate=true; return material.version;
}

export function edgeWidth(dx: number, dy: number): Answer<number> {
  return Math.abs(dx)+Math.abs(dy);
}

export function fragmentUv(x: number, y: number, width: number, height: number): Answer<THREE.Vector2> {
  return new THREE.Vector2(x/width,y/height);
}

export function keepFragment(alpha: number, cutoff: number): Answer<boolean> {
  return alpha>=cutoff;
}

export function normalDebugColor(normal: THREE.Vector3): Answer<THREE.Color> {
  const n=normal.clone().normalize(); return new THREE.Color().setRGB(n.x*0.5+0.5,n.y*0.5+0.5,n.z*0.5+0.5,THREE.LinearSRGBColorSpace);
}
