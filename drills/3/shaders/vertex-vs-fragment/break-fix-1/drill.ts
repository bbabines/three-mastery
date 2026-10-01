export function shaderRuns(vertices:number,cssPixels:number,dpr:number,overdraw:number,passes:number):{vertex:number;fragment:number} {
 return {vertex:vertices*passes,fragment:cssPixels*dpr*dpr*passes};
}
