import {mkdir,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
const root='assets/reference/classic-watch';
await mkdir(root,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader']});
try {
  const page=await browser.newPage({viewport:{width:1440,height:1050}});
  const assets=[];
  page.on('response',response=>{if(/\.glb|\.exr|leather/i.test(response.url())) assets.push({url:response.url(),status:response.status()});});
  await page.goto('https://webgi.dev/',{waitUntil:'networkidle'});
  await page.getByText('Loading',{exact:true}).waitFor({state:'hidden',timeout:45000});
  await page.locator('canvas').screenshot({path:`${root}/reference-webgi.png`});
  await writeFile(`${root}/reference-capture.json`,JSON.stringify({source:'https://webgi.dev/',capturedAt:new Date().toISOString(),viewport:{width:1440,height:1050},assets},null,2)+'\n');
  console.log(`Captured original WebGi rendering; ${assets.length} reference requests observed.`);
} finally {await browser.close();}
