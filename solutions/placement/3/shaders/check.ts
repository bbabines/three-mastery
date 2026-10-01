import type { Answer } from '@harness/drill';
import { Color, MathUtils, Matrix4, Vector2, Vector3 } from 'three';
export function fragmentEstimate(cssPixels:number,dpr:number,overdraw:number):Answer<number> {
 return cssPixels*dpr*dpr*overdraw;
}

export function interpolateVarying(a:number,b:number,t:number):Answer<number> {
 return a+(b-a)*t;
}

export function worldPoint(local:Vector3,model:Matrix4):Answer<Vector3> {
 return local.clone().applyMatrix4(model);
}

export function zUpToYUp(zUp:Vector3):Answer<Vector3> {
 return new Vector3(zUp.x,zUp.z,-zUp.y);
}

export function softStep(edge0:number,edge1:number,x:number):Answer<number> {
 return MathUtils.smoothstep(x,edge0,edge1);
}

export function floatLiteral(value:number):Answer<string> {
 return Number.isInteger(value) ? value.toFixed(1) : String(value);
}

export function extensionRoute(keepLighting:boolean):Answer<"onBeforeCompile"|"ShaderMaterial"> {
 return keepLighting ? "onBeforeCompile" : "ShaderMaterial";
}

export function pixelFootprint(dx:number,dy:number):Answer<number> {
 return Math.abs(dx)+Math.abs(dy);
}

export function cssCoord(devicePixel:Vector2,dpr:number):Answer<Vector2> {
 return devicePixel.clone().divideScalar(dpr);
}

export function insideMask(uv:Vector2,radius:number):Answer<boolean> {
 return uv.distanceTo(new Vector2(.5,.5))<=radius;
}

export function normalDebug(normal:Vector3):Answer<Color> {
 const n=normal.clone().normalize(); return new Color((n.x+1)/2,(n.y+1)/2,(n.z+1)/2);
}
