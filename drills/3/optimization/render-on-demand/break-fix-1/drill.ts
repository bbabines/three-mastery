export type FramePlan={render:boolean;dpr:number};
export function planFrame(dirty:boolean,visible:boolean,currentDpr:number,slowFrames:number,fastFrames:number):FramePlan {
 let dpr=currentDpr;
 if(slowFrames>=3)dpr=Math.max(1,currentDpr-0.25);
 else if(fastFrames>=8)dpr=Math.min(2,currentDpr+0.25);
 return {render:visible,dpr};
}
