export function maskFragmentRuns(coveredPixels:number,overdraw:number,discardedFraction:number):number {
 return coveredPixels*(1-discardedFraction);
}
