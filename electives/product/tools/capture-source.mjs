// Captures the live WebGi watch as the quality target, on the real GPU through the installed
// Chrome (no Playwright browser download). Light mode, interaction prompt off, hands at the
// GLB's rest pose, and only after progressive accumulation settles. Records the camera and
// model bounds in WebGi's world, which matches the GLB's own units (WebGi's autoScale is ≈1).
import {mkdir,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';

const root='assets/reference/classic-watch';
const headless=!process.argv.includes('--headed');
await mkdir(root,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless,args:['--ignore-gpu-blocklist','--enable-gpu']});
try {
  const page=await browser.newPage({viewport:{width:1440,height:1050},deviceScaleFactor:1,colorScheme:'light'});
  const assets=[];
  page.on('response',response=>{if(/\.glb|\.exr|leather/i.test(response.url())) assets.push({url:response.url(),status:response.status()});});
  await page.goto('https://webgi.dev/',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>window.threeViewers?.[0]?.scene?.modelRoot?.children?.length>0,null,{timeout:60000});
  await page.getByText('Loading',{exact:true}).waitFor({state:'hidden',timeout:60000});

  const setup=await page.evaluate(()=>{
    const v=window.threeViewers[0];
    document.documentElement.classList.remove('dark');
    window.handleDarkModeChange?.();
    const prompt=v.getPlugin('InteractionPromptPlugin');
    prompt?.stopAnimation?.(); if(prompt) prompt.enabled=false;
    const hands=v.getPlugin('WatchHandsPlugin');
    if(hands){hands.enabled=false; for(const hand of hands.hands??[]){const r=hand.object.userData.initRotation; if(r) hand.object.rotation.fromArray(r);}}
    // webgi.dev toggles effects as doc sections scroll into view; pin its top-of-page showcase
    // state ("basic rendering" on, depth of field off) so the capture doesn't depend on layout.
    for(const name of ['SSAAPlugin','TemporalAAPlugin','BloomPlugin']){const p=v.getPlugin(name);if(p)p.enabled=true;}
    for(const name of ['SSReflectionPlugin','SSAOPlugin']){const p=v.getPlugin(name);if(p?.pass)p.pass.split=0.01;}
    const dof=v.getPlugin('DepthOfFieldPlugin');if(dof)dof.enabled=false;
    v.fitToView(undefined,1.5);
    v.renderManager.resetShadows?.(); v.setDirty();
    const gl=v.renderManager.renderer.getContext();
    const info=gl.getExtension('WEBGL_debug_renderer_info');
    return {gpu:info?gl.getParameter(info.UNMASKED_RENDERER_WEBGL):'unknown'};
  });
  if(/swiftshader|llvmpipe|software/i.test(setup.gpu)) throw new Error(`Software renderer (${setup.gpu}). Rerun with --headed.`);

  // Progressive accumulation (TAA/SSAA jitter, SSR, AO) restarts on every change; wait for it.
  const settle=async()=>{
    const start=await page.evaluate(()=>window.threeViewers[0].renderManager.totalFrameCount);
    await page.waitForFunction(s=>{
      const v=window.threeViewers[0];
      return v.renderManager.totalFrameCount-s>=40&&v.getPlugin('ProgressivePlugin').isConverged();
    },start,{timeout:120000,polling:250});
  };

  const views={};
  const pin=()=>page.evaluate(()=>{
    const v=window.threeViewers[0];
    for(const name of ['SSAAPlugin','TemporalAAPlugin','BloomPlugin']){const p=v.getPlugin(name);if(p)p.enabled=true;}
    for(const name of ['SSReflectionPlugin','SSAOPlugin']){const p=v.getPlugin(name);if(p?.pass)p.pass.split=0.01;}
    const dof=v.getPlugin('DepthOfFieldPlugin');if(dof)dof.enabled=false;
    v.setDirty();
  });
  const effects=()=>page.evaluate(()=>{const v=window.threeViewers[0];
    return Object.fromEntries(['SSAAPlugin','TemporalAAPlugin','ProgressivePlugin','SSAOPlugin','SSReflectionPlugin','SSGIPlugin','BloomPlugin','DepthOfFieldPlugin'].map(n=>[n,v.getPlugin(n)?.enabled??null]));});
  async function capture(name,file,place){
    const state=await page.evaluate(place);
    await pin();
    await page.waitForTimeout(500);
    const enabledAtCapture=await effects();
    // Wait and capture in one step: the accumulation can restart, so take the first full frame.
    const {url,frames}=await page.evaluate(async()=>{
      const v=window.threeViewers[0],p=v.getPlugin('ProgressivePlugin'),start=performance.now();
      while(!(v.renderManager.frameCount>=p.maxFrameCount&&p.isConverged())){
        if(performance.now()-start>120000) throw new Error('Progressive accumulation never converged');
        await new Promise(r=>requestAnimationFrame(r));
      }
      return {url:await v.getScreenshotDataUrl('image/png'),frames:v.renderManager.frameCount};
    });
    state.frames=frames;
    await writeFile(`${root}/${file}`,Buffer.from(url.split(',')[1],'base64'));
    views[name]={file,...state,enabledAtCapture};
  }
  const readState=`(()=>{const v=window.threeViewers[0],c=v.scene.mainCamera,r=v.renderManager.renderer;
    const Box3=v.scene.modelRoot.children[0].geometry?.boundingBox?.constructor;
    let min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
    v.scene.modelRoot.updateMatrixWorld(true);
    v.scene.modelRoot.traverse(o=>{if(!o.isMesh)return;o.geometry.computeBoundingBox();const b=o.geometry.boundingBox;
      for(const x of [b.min.x,b.max.x])for(const y of [b.min.y,b.max.y])for(const z of [b.min.z,b.max.z]){
        const p=o.position.clone().set(x,y,z).applyMatrix4(o.matrixWorld);
        min=[Math.min(min[0],p.x),Math.min(min[1],p.y),Math.min(min[2],p.z)];max=[Math.max(max[0],p.x),Math.max(max[1],p.y),Math.max(max[2],p.z)];}});
    return {camera:{position:c.position.toArray(),target:c.target.toArray(),fov:c.fov},
      canvas:{css:[v.canvas.clientWidth,v.canvas.clientHeight],buffer:[r.domElement.width,r.domElement.height]},
      modelBox:{min,max},frames:v.renderManager.frameCount};})()`;

  await capture('default','reference-webgi.png',`(()=>{window.threeViewers[0].setDirty();return ${readState};})()`);
  // Same distance and elevation, swung to face the dial straight on.
  await capture('front','reference-webgi-front.png',`(()=>{const v=window.threeViewers[0],c=v.scene.mainCamera,t=c.target;
    const d=c.position.clone().sub(t),h=Math.hypot(d.x,d.z);c.position.set(t.x,t.y+d.y,t.z+h);c.setDirty();v.setDirty();return ${readState};})()`);

  const settings=await page.evaluate(()=>{
    const v=window.threeViewers[0],s=v.scene,P=n=>v.getPlugin(n);
    const light=[];s.traverse(o=>{if(o.isLight)light.push({name:o.name,intensity:o.intensity,castShadow:o.castShadow,visible:o.visible,shadowRadius:o.shadow?.radius});});
    const g=P('ContactShadowGroundPlugin');
    return {environmentIntensity:s.environmentIntensity??s.envMapIntensity,environmentRotation:s.environmentRotation?.toArray?.(),
      background:s.backgroundColor?.getHexString?.(),lights:light,
      ground:g&&{size:g.size,color:g.material?.color?.getHexString(),roughness:g.material?.roughness,metalness:g.material?.metalness,contactShadows:g.contactShadows,shadowHeight:g.shadowHeight,blurAmount:g.blurAmount},
      tonemap:(t=>t&&{toneMapping:t.toneMapping,exposure:t.exposure,contrast:t.contrast,saturation:t.saturation})(P('Tonemap')),
      enabled:Object.fromEntries(['SSAAPlugin','TemporalAAPlugin','ProgressivePlugin','SSAOPlugin','SSReflectionPlugin','SSGIPlugin','BloomPlugin','DepthOfFieldPlugin','ContactShadowGroundPlugin','WatchHandsPlugin','InteractionPromptPlugin'].map(n=>[n,P(n)?.enabled??null])),
      renderScale:v.renderManager.renderScale,maxHDRIntensity:v.renderManager.maxHDRIntensity,three:window.__THREE__};
  });
  await writeFile(`${root}/reference-capture.json`,JSON.stringify({source:'https://webgi.dev/',capturedAt:new Date().toISOString(),
    browser:`Chrome via Playwright (${headless?'headless':'headed'})`,gpu:setup.gpu,viewport:{width:1440,height:1050},
    note:'Light mode, interaction prompt off, watch hands at the GLB rest pose, showcase effects pinned (SSAA, TAA, SSR, SSAO, bloom on; SSGI, DOF off), captured with getScreenshotDataUrl once progressive accumulation converged. Camera and bounds are in WebGi world units (≈ the GLB units).',
    views,settings,assets},null,2)+'\n');
  console.log(`Captured on ${setup.gpu}: ${Object.keys(views).join(', ')}`);
} finally {await browser.close();}
