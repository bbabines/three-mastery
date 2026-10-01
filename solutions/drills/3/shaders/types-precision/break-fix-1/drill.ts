export function glslFloat(value:number):string {
 return Number.isInteger(value)?value.toFixed(1):String(value);
}
