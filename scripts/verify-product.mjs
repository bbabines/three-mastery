// Real viewer/control/download checks. All learner-progress writes are intercepted.
// With no URL, owns a temporary Vite child and stops it at the end.
import {spawn} from 'node:child_process';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
const output='.pick/product-validation';
await mkdir(output,{recursive:true});
const slugs=['reference-color','geometry-fidelity','tactile-materials','light-form','reflection-design','shadows-grounding','indirect-context','orbit-coverage','camera-finishing','delivery-validation','capstone'];
const selected=process.env.PRODUCT_UNITS?.split(',')??slugs;
const base=process.argv[2]??'http://127.0.0.1:5196';
let server;
let browser;
const failures=[];
const report=[];
let browserWrites=0;
// Playwright's bundled Chromium (software GL), or system Chrome when it isn't downloaded.
// PRODUCT_HEADED=1 opens a visible window: headless Chrome can stall animation frames.
async function launchBrowser() {
  const headless=process.env.PRODUCT_HEADED!=='1';
  try {return await chromium.launch({headless,args:['--use-gl=angle','--use-angle=swiftshader']});}
  catch(error) {
    if(!/Executable doesn't exist|install/i.test(error.message))throw error;
    console.log(`Bundled Chromium missing; using system Chrome (${headless?'headless':'headed'}).`);
    return chromium.launch({channel:'chrome',headless});
  }
}
async function waitForServer() {
  for(let attempt=0;attempt<120;attempt++) {
    try {if((await fetch(base)).ok) return;} catch {}
    await new Promise(resolve=>setTimeout(resolve,500));
  }
  throw new Error(`Dev server did not start: ${base}`);
}
try {
  if(!process.argv[2]) server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port','5196','--strictPort'],{stdio:'ignore'});
  await waitForServer();
  browser=await launchBrowser();
  for(const slug of selected) {
    const page=await browser.newPage({viewport:{width:1180,height:900},acceptDownloads:true});
    const errors=[];
    page.setDefaultTimeout(60000);
    const downloads=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
    await page.addInitScript(() => document.addEventListener('webglcontextlost', () => console.error('Product preview lost its WebGL context'), true));
    page.on('download',download=>downloads.push(download));
    await page.route('**/api/track',route=>route.request().method()==='POST'?(browserWrites++,route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({at:new Date().toISOString()})})):route.continue());
    await page.route('**/api/progress',route=>route.request().method()==='POST'?(browserWrites++,route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({at:new Date().toISOString()})})):route.continue());
    try {
      await page.goto(`${base}/harness/?drill=electives/product/${slug}&track=look-dev`,{waitUntil:'domcontentloaded'});
      await page.locator('article h1').waitFor({timeout:60000});
      const source=await readFile(`electives/product/${slug}/README.md`,'utf8');
      const expected=(source.match(/data-scene=/g)??[]).length;
      await page.waitForFunction(count=>document.querySelectorAll('[data-product-state="ready"]').length===count||document.querySelector('[data-product-state="error"]'),expected,{timeout:90000});
      const problems=await page.locator('[data-product-state="error"]').allTextContents();
      if(problems.length) throw new Error(problems.join(' | '));
      const scenes=page.locator('article .scene');
      if(await scenes.count()!==expected||expected<2)throw new Error(`Expected at least two scenes; found ${await scenes.count()}/${expected}`);
      // Freeze both live previews before batches of comparisons. This uses a visible learner
      // control and keeps software-GPU frame queues from obscuring control/download evidence.
      for(const scene of await scenes.all())await scene.getByRole('button',{name:'Pause live preview',exact:true}).click();
      for(let i=0;i<expected;i++) {
        const scene=scenes.nth(i);
        await scene.scrollIntoViewIfNeeded();
        // Use the product's real evidence path: a synchronous render followed by canvas
        // readback. Browser-compositor screenshots can stall with software WebGL.
        const pending=page.waitForEvent('download',{timeout:60000});
        pending.catch(()=>{}); // page closure after an earlier click failure must not hide the report
        await scene.getByRole('button',{name:'Save comparison PNG',exact:true}).click();
        const image=await pending;
        const filename=`${output}/${slug}-${i}.png`;
        await image.saveAs(filename);
        const encoded=(await readFile(filename)).toString('base64');
        const colors=await page.evaluate(async encoded=>{
          const image=await createImageBitmap(await(await fetch(`data:image/png;base64,${encoded}`)).blob());
          const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;
          const context=canvas.getContext('2d');context.drawImage(image,0,0);image.close();
          const pixels=context.getImageData(0,0,canvas.width,canvas.height).data;
          const palette=new Set();for(let j=0;j<pixels.length;j+=128)palette.add(`${pixels[j]},${pixels[j+1]},${pixels[j+2]}`);
          return palette.size;
        },encoded);
        if(colors<16)throw new Error(`Scene ${i} exported a blank/uninformative frame (${colors} sampled colors)`);
        for(const select of await scene.locator('select').all()) {
          const initial=await select.inputValue();
          for(const option of await select.locator('option').all())await select.selectOption(await option.getAttribute('value')??await option.textContent());
          await select.selectOption(initial);
        }
        for(const slider of await scene.locator('input[type="range"]').all()) {
          const initial=await slider.inputValue();
          for(const value of [await slider.getAttribute('min'),await slider.getAttribute('max'),initial]) {
            await slider.evaluate((input,value)=>{input.value=value;input.dispatchEvent(new Event('input',{bubbles:true}));},value);
          }
        }
        for(const button of await scene.locator('button').all()) {
          const name=await button.innerText();
          if(/save|capture|export|sheet|snapshot|record.*matrix|view.*matrix|live preview/i.test(name))continue;
          await button.click();
        }
      }
      if(slug==='capstone') {
        const scene=scenes.first();
        await scene.scrollIntoViewIfNeeded();
        await scene.getByRole('button',{name:'Save comparison PNG',exact:true}).click();
        await scene.getByRole('button',{name:'Save settings JSON',exact:true}).click();
        const orbit=scene.getByRole('button').filter({hasText:/orbit.*sheet|capture.*orbit|12.*3|contact.*sheet/i}).first();
        if(await orbit.count())await orbit.click();
        await page.waitForTimeout(500);
        for(const [index,download]of downloads.entries()) {
          const target=`${output}/export-${index}-${download.suggestedFilename()}`;
          await download.saveAs(target);
          const bytes=await readFile(target);
          if(bytes.length<40)throw new Error(`Empty export: ${target}`);
          if(target.endsWith('.json'))JSON.parse(bytes.toString());
        }
        if(!downloads.some(d=>d.suggestedFilename()==='watch-comparison.png')||!downloads.some(d=>d.suggestedFilename()==='watch-settings.json'))throw new Error('Missing evidence exports');
        await page.setViewportSize({width:390,height:844});
        await scene.scrollIntoViewIfNeeded();
        await page.waitForTimeout(200);
        const mobile=page.waitForEvent('download',{timeout:60000});
        await scene.getByRole('button',{name:'Save comparison PNG',exact:true}).click();
        await(await mobile).saveAs(`${output}/capstone-mobile.png`);
        const layout=await page.evaluate(()=>({viewport:innerWidth,width:document.documentElement.scrollWidth}));
        if(layout.width>layout.viewport+2)throw new Error(`Mobile horizontal overflow: ${layout.width}/${layout.viewport}`);
      }
      const title=await page.locator('article h1').innerText();
      report.push({slug,title,scenes:expected,errors:[...new Set(errors)],exports:downloads.map(d=>d.suggestedFilename())});
      if(errors.length)failures.push(`${slug}: ${[...new Set(errors)].join(' | ')}`);
      console.log(`${errors.length?'FAIL':'OK'} ${slug}: ${expected} scenes, controls exercised`);
    } catch(error) {failures.push(`${slug}: ${error.message}`);console.error(failures.at(-1));}
    finally {await page.close();}
  }
} finally {await browser?.close();server?.kill();}
await writeFile(`${output}/report.json`,JSON.stringify({report,failures,interceptedProgressWrites:browserWrites},null,2)+'\n');
if(failures.length) {console.error(failures.join('\n'));process.exitCode=1;}
else console.log(`All ${report.length} product pages passed. Learner progress writes intercepted: ${browserWrites}.`);
