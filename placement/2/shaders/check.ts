import type { Answer } from '@harness/drill';
import { Color, Matrix4, Vector2, Vector3 } from 'three';
// Estimate fragment invocations.
export function fragmentEstimate(cssPixels:number,dpr:number,overdraw:number):Answer<number> {
 return null;
}

// Interpolate a varying across an edge.
export function interpolateVarying(a:number,b:number,t:number):Answer<number> {
 return null;
}

// Transform a local vertex into world space.
export function worldPoint(local:Vector3,model:Matrix4):Answer<Vector3> {
 return null;
}

// Convert a Z-up point to right-handed Y-up.
export function zUpToYUp(zUp:Vector3):Answer<Vector3> {
 return null;
}

// Smoothly blend across an edge.
export function softStep(edge0:number,edge1:number,x:number):Answer<number> {
 return null;
}

// Write a GLSL float literal, including .0 for integers.
export function floatLiteral(value:number):Answer<string> {
 return null;
}

// Choose the route that preserves built-in lighting when needed.
export function extensionRoute(keepLighting:boolean):Answer<"onBeforeCompile"|"ShaderMaterial"> {
 return null;
}

// Estimate fwidth from neighboring pixel derivatives.
export function pixelFootprint(dx:number,dy:number):Answer<number> {
 return null;
}

// Convert a fragment coordinate from device to CSS pixels.
export function cssCoord(devicePixel:Vector2,dpr:number):Answer<Vector2> {
 return null;
}

// Whether a UV fragment survives a centered circular mask.
export function insideMask(uv:Vector2,radius:number):Answer<boolean> {
 return null;
}

// Encode a normalized direction as visible RGB.
export function normalDebug(normal:Vector3):Answer<Color> {
 return null;
}
