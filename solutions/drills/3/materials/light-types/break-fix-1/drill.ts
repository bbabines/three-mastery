export function pointIllumination(power:number,distance:number):number {
 return power/(4*Math.PI*distance*distance);
}
