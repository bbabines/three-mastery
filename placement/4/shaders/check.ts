// No docs. Write each small judgment check, then run npm run pick -- done once.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// vertex-vs-fragment: Choose the stage that runs for each covered fragment.
export function stageForPixelColor(perPixel: boolean): Answer<'fragment' | 'vertex'> {
  return null;
}

// attributes-uniforms-varyings: Change a uniform shared across a draw.
export function setUniform(material: THREE.ShaderMaterial, name: string, value: number): Answer<number> {
  return null;
}

// built-in-matrices: Use the model matrix to put a vertex in world space.
export function worldPointFromModel(local: THREE.Vector3, model: THREE.Matrix4): Answer<THREE.Vector3> {
  return null;
}

// swizzling: Reorder a vector's channels without changing its input.
export function blueRedGreen(color: THREE.Vector3): Answer<THREE.Vector3> {
  return null;
}

// built-in-functions: Clamp a lighting dot product to zero.
export function clampedLighting(normal: THREE.Vector3, light: THREE.Vector3): Answer<number> {
  return null;
}

// types-precision: Choose shader precision for a large world position.
export function precisionForWorldPosition(largeWorld: boolean): Answer<'highp' | 'mediump'> {
  return null;
}

// extending-materials: Mark a material for recompilation after a shader edit.
export function markShaderChange(material: THREE.Material): Answer<number> {
  return null;
}

// derivatives: Estimate an fwidth-style screen-space change.
export function edgeWidth(dx: number, dy: number): Answer<number> {
  return null;
}

// fragment-coordinates: Map a fragment position into zero-to-one screen coordinates.
export function fragmentUv(x: number, y: number, width: number, height: number): Answer<THREE.Vector2> {
  return null;
}

// branching-discard: Decide whether a fragment survives alpha cutout.
export function keepFragment(alpha: number, cutoff: number): Answer<boolean> {
  return null;
}

// debug-output: Encode a normalized direction into raw RGB for a debug view.
export function normalDebugColor(normal: THREE.Vector3): Answer<THREE.Color> {
  return null;
}
