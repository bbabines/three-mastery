// Focused runtime regressions. Test-only HTML imports production modules; no learner writes.
// With no URL, owns a temporary Vite child. Do not run alongside another GPU verifier.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';

const output = '.pick/product-state-validation';
const base = process.argv[2] ?? 'http://127.0.0.1:5197';
const report = [];
let server, browser, threeModuleUrl, interceptedWrites = 0;
await mkdir(output, {recursive: true});

const fixture = `<!doctype html><meta charset="utf-8"><title>Product state acceptance</title>
<style>body{margin:0;font:14px system-ui}.scene{position:relative;width:760px;max-width:100%;height:620px}.controls{position:absolute;bottom:10px;left:10px;right:10px;background:#fff;padding:8px}.readout{position:absolute;top:10px;left:10px;background:#fff;padding:8px;pointer-events:none}label{display:inline-block;margin:3px}button{margin:3px}</style>
<details open><summary>Experiment</summary><div class="scene"></div></details>
<script type="module">
import * as THREE from '__HARNESS_THREE_MODULE__';
import {createHarness} from '/harness/scene.ts';
import {watchLab} from '/electives/product/lab.ts';
const mode = new URL(location.href).searchParams.get('mode');
const harness = createHarness(document.querySelector('.scene'));
window.caseHarness = harness; window.caseThree = THREE; window.caseContextEvents = [];
for (const type of ['webglcontextlost','webglcontextrestored']) harness.renderer.domElement.addEventListener(type, () => window.caseContextEvents.push(type));
if (mode === 'reflection') {
  const {directions} = await import('/electives/product/reflection-design/scenes.ts');
  directions(harness);
} else if (mode === 'finishing') {
  const {finish} = await import('/electives/product/camera-finishing/scenes.ts');
  finish(harness);
} else watchLab(harness, lab => {
  window.caseLab = lab;
  if (mode === 'orbit') {harness.controls.autoRotate = true; harness.controls.autoRotateSpeed = .6;}
  lab.addSlider('test exposure', .5, 2, .1, 1, value => {harness.renderer.toneMappingExposure = value;});
  lab.addButton('test capture orbit', () => lab.captureOrbit());
});
</script>`;

async function warmHarnessDependencies() {
  let lastProblem = 'Harness transform unavailable';
  for (let attempt = 0; attempt < 120; attempt++) {
    try {
      // Trigger the normal Vite transform/optimizer rather than assume a populated cache.
      const source = await fetch(new URL('/harness/scene.ts', base));
      if (!source.ok) throw new Error(`Harness transform HTTP ${source.status}`);
      const transformed = await source.text();
      const resolved = transformed.match(/from\s*['"]([^'"]*\/three\.js(?:\?[^'"]*)?)['"]/)?.[1];
      if (!resolved) throw new Error('Harness transform did not resolve its Three import');
      // Vite can temporarily return 504 while an optimized dependency is being replaced.
      const dependency = await fetch(new URL(resolved, base));
      if (!dependency.ok || !/javascript|ecmascript/.test(dependency.headers.get('content-type') ?? '')) {
        throw new Error(`Three dependency unavailable: HTTP ${dependency.status}`);
      }
      await dependency.text();
      threeModuleUrl = resolved; // Include Vite's version query so both imports share a module.
      return;
    } catch (error) {lastProblem = error.message;}
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  throw new Error(`Vite dependencies did not become ready: ${lastProblem}`);
}

function closeVector(actual, expected, message) {
  assert.equal(actual.length, expected.length, message);
  actual.forEach((value, index) => assert.ok(Number.isFinite(value) && Math.abs(value - expected[index]) < 1e-8, `${message}: component ${index}, ${value}/${expected[index]}`));
}
function reflectedDirection(position, point, normal) {
  const incident = point.map((value, index) => value - position[index]);
  const length = Math.hypot(...incident);
  const unit = incident.map(value => value / length);
  const dot = unit.reduce((sum, value, index) => sum + value * normal[index], 0);
  return unit.map((value, index) => value - 2 * dot * normal[index]);
}
async function diagnostics(page) {
  return page.evaluate(() => {
    const h = window.caseHarness;
    if (!h) return {mounted: false};
    return {contextLost: h.renderer.getContext().isContextLost(), contextEvents: window.caseContextEvents,
      aspect: h.camera.aspect, projection: h.camera.projectionMatrix.toArray(),
      canvas: [h.renderer.domElement.width, h.renderer.domElement.height],
      container: [h.container.clientWidth, h.container.clientHeight],
      visible: h.container.checkVisibility(), detailsOpen: h.container.closest('details')?.open,
      state: h.container.dataset.productState,
      frame: h.container.dataset.productFrame, camera: h.camera.position.toArray(), target: h.controls.target.toArray(),
      autoRotate: h.controls.autoRotate, damping: h.controls.enableDamping};
  });
}
async function download(page, label, filename) {
  const pending = page.waitForEvent('download', {predicate: item => item.suggestedFilename() === filename});
  pending.catch(() => {});
  await page.getByRole('button', {name: label, exact: true}).click();
  return pending;
}
async function settings(page) {
  const item = await download(page, 'Save settings JSON', 'watch-settings.json');
  return JSON.parse(await readFile(await item.path(), 'utf8'));
}
async function png(page, name, orbit = false, item) {
  item ??= await download(page, 'Save comparison PNG', 'watch-comparison.png');
  const path = `${output}/${name}.png`;
  await item.saveAs(path);
  const encoded = (await readFile(path)).toString('base64');
  const stats = await page.evaluate(async ({encoded, orbit}) => {
    const image = await createImageBitmap(await (await fetch(`data:image/png;base64,${encoded}`)).blob());
    const canvas = document.createElement('canvas'); canvas.width = image.width; canvas.height = image.height;
    const context = canvas.getContext('2d'); context.drawImage(image, 0, 0); image.close();
    const cells = [];
    for (let row = 0; row < (orbit ? 3 : 1); row++) for (let column = 0; column < (orbit ? 12 : 1); column++) {
      // Exclude orbit captions: text alone must not make a blank watch tile pass.
      const pixels = context.getImageData(orbit ? column * 240 : 0, orbit ? row * 230 : 0, orbit ? 240 : canvas.width, orbit ? 208 : canvas.height).data;
      const colors = new Set(); let visible = 0;
      for (let index = 0; index < pixels.length; index += 16) {
        colors.add(`${pixels[index]},${pixels[index+1]},${pixels[index+2]},${pixels[index+3]}`);
        if (pixels[index+3]) visible++;
      }
      cells.push({colors: colors.size, visible});
    }
    return {width: canvas.width, height: canvas.height, cells};
  }, {encoded, orbit});
  if (orbit) assert.deepEqual([stats.width, stats.height], [2880, 690]);
  assert.ok(stats.cells.every(cell => cell.colors >= 16 && cell.visible > 0), `${name}: blank image/tile ${JSON.stringify(stats)}`);
  assert.equal((await diagnostics(page)).contextLost, false, `${name}: context lost`);
  return stats;
}
async function ready(page) {
  await page.waitForFunction(() => ['ready','error'].includes(document.querySelector('.scene')?.dataset.productState));
  assert.equal(await page.locator('.scene').getAttribute('data-product-state'), 'ready', await page.locator('.readout').textContent());
}
async function runCase(name, action) {
  const page = await browser.newPage({viewport: {width: 900, height: 800}, acceptDownloads: true});
  page.setDefaultTimeout(90000);
  const errors = [], warnings = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
    if (message.type() === 'warning' || /context.*lost|context.*restored/i.test(message.text())) warnings.push(message.text());
  });
  await page.route('**/__product-state-fixture*', route => route.fulfill({status: 200, contentType: 'text/html', body: fixture.replace('__HARNESS_THREE_MODULE__', threeModuleUrl)}));
  for (const endpoint of ['track','progress']) await page.route(`**/api/${endpoint}`, route => {
    if (route.request().method() !== 'POST') return route.continue();
    interceptedWrites++;
    return route.fulfill({status: 200, contentType: 'application/json', body: JSON.stringify({at: new Date().toISOString()})});
  });
  try {
    await action(page);
    assert.deepEqual(errors, [], 'Browser errors');
    assert.deepEqual((await diagnostics(page)).contextEvents, [], 'Unexpected context loss/restoration');
    report.push({name, passed: true, warnings, diagnostics: await diagnostics(page)});
    console.log(`OK ${name}`);
  } catch (error) {
    report.push({name, passed: false, error: error.message, errors, warnings, diagnostics: await diagnostics(page).catch(() => undefined)});
    console.error(`FAIL ${name}: ${error.message}`);
  } finally {await page.close();}
}

try {
  if (!process.argv[2]) server = spawn(process.execPath, ['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port','5197','--strictPort'], {stdio: 'ignore'});
  let available = false;
  for (let attempt = 0; attempt < 120; attempt++) {
    try {if ((await fetch(base)).ok) {available = true; break;}} catch {}
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  if (!available) throw new Error(`Dev server did not start: ${base}`);
  await warmHarnessDependencies();
  browser = await chromium.launch({headless: true, args: ['--use-gl=angle','--use-angle=swiftshader']});

  await runCase('paused-reflection', async page => {
    await page.goto(`${base}/__product-state-fixture?mode=reflection`);
    await ready(page);
    await page.getByRole('button', {name: 'Pause live preview', exact: true}).click();
    const frozenFrame = (await diagnostics(page)).frame;
    // Find a real projected triangle rather than hard-code a screen coordinate.
    const picked = await page.evaluate(() => {
      const h = window.caseHarness, THREE = window.caseThree;
      const ray = new THREE.Raycaster(), bounds = h.renderer.domElement.getBoundingClientRect();
      const model = h.scene.children.find(object => object.type === 'Group');
      if (!model) return false;
      for (const y of [0,.15,-.15,.3,-.3]) for (const x of [0,.1,-.1,.2,-.2]) {
        ray.setFromCamera(new THREE.Vector2(x,y), h.camera);
        if (!ray.intersectObject(model, true).some(hit => hit.face)) continue;
        h.renderer.domElement.dispatchEvent(new MouseEvent('click', {clientX: bounds.left + (x+1)*bounds.width/2, clientY: bounds.top + (1-y)*bounds.height/2}));
        return true;
      }
      return false;
    });
    assert.equal(picked, true, 'No watch surface found');
    for (const orbit of [false, true]) {
      if (orbit) await page.evaluate(() => {
        const h = window.caseHarness;
        h.camera.position.applyAxisAngle(new window.caseThree.Vector3(0,1,0), .2); h.controls.update();
      });
      const saved = await settings(page), experiment = saved.experiments[0];
      assert.equal(experiment.selected, true);
      const expected = reflectedDirection(saved.camera.position, experiment.worldPoint, experiment.geometricNormal);
      closeVector(experiment.environmentDirection, expected, 'Evidence reflection direction');
      const arrows = await page.evaluate(() => window.caseHarness.scene.children.filter(object => object.isArrowHelper || object.type === 'ArrowHelper').map(arrow => ({position: arrow.position.toArray(), direction: new window.caseThree.Vector3(0,1,0).applyQuaternion(arrow.quaternion).toArray()})));
      assert.equal(arrows.length, 3);
      for (const arrow of arrows) closeVector(arrow.position, experiment.worldPoint, 'Arrow follows selected surface');
      closeVector(arrows[2].direction, expected, 'Reflection arrow matches evidence');
      assert.ok((await page.locator('.readout').textContent()).includes(experiment.part), 'Picked surface readout is stale');
      assert.equal((await diagnostics(page)).frame, frozenFrame, 'Preview resumed unexpectedly');
    }
    await png(page, 'paused-reflection');
  });

  await runCase('paused-auto-orbit-and-restoration', async page => {
    await page.goto(`${base}/__product-state-fixture?mode=orbit`);
    await ready(page);
    await page.getByRole('button', {name: 'Pause live preview', exact: true}).click();
    const before = await diagnostics(page), savedBefore = await settings(page);
    assert.equal(before.autoRotate, true);
    await png(page, 'paused-orbit-before');
    await page.getByRole('slider', {name: 'test exposure', exact: true}).evaluate(input => {input.value = '1.2'; input.dispatchEvent(new Event('input'));});
    await png(page, 'paused-orbit-after');
    const pendingSheet = page.waitForEvent('download', {predicate: item => item.suggestedFilename() === 'watch-orbit-12x3.png'});
    const pendingJson = page.waitForEvent('download', {predicate: item => item.suggestedFilename() === 'watch-orbit-settings.json'});
    pendingSheet.catch(() => {}); pendingJson.catch(() => {});
    await page.getByRole('button', {name: 'test capture orbit', exact: true}).click();
    await png(page, 'paused-orbit-sheet', true, await pendingSheet);
    const orbit = JSON.parse(await readFile(await (await pendingJson).path(), 'utf8'));
    assert.deepEqual(orbit.orbit.elevations, [15,35,65]); assert.equal(orbit.orbit.azimuthStepDegrees, 30);
    const savedAfter = await settings(page), after = await diagnostics(page);
    for (const camera of [savedBefore.camera, orbit.camera, savedAfter.camera]) {
      closeVector(camera.position, before.camera, 'Capture preserves camera');
      closeVector(camera.target, before.target, 'Capture preserves orbit target');
    }
    assert.equal(after.autoRotate, before.autoRotate); assert.equal(after.damping, before.damping);
    assert.equal(after.frame, before.frame);
    await page.getByRole('button', {name: 'Resume live preview', exact: true}).click();
    await page.waitForFunction(frame => Number(window.caseHarness.container.dataset.productFrame) > Number(frame)+1, before.frame);
    assert.ok((await diagnostics(page)).camera.some((value,index) => Math.abs(value-before.camera[index]) > 1e-5), 'Auto-orbit did not resume');
  });

  await runCase('paused-composer-capture', async page => {
    await page.goto(`${base}/__product-state-fixture?mode=finishing`);
    await ready(page);
    await page.getByRole('button', {name: 'toggle continuous orbit', exact: true}).click();
    await page.getByRole('button', {name: 'Pause live preview', exact: true}).click();
    const before = await settings(page);
    await page.getByRole('combobox', {name: 'resolution', exact: true}).selectOption({label: 'DPR 1.5'});
    await page.getByRole('combobox', {name: 'bloom', exact: true}).selectOption({label: 'restrained'});
    const image = await png(page, 'paused-composer');
    assert.deepEqual([image.width,image.height], [1140,930]);
    const after = await settings(page);
    closeVector(after.camera.position, before.camera.position, 'Composer controls/capture preserve paused camera');
    assert.equal(after.experiments[0].moving, true); assert.equal(after.experiments[0].bloom.enabled, true);
    assert.equal((await diagnostics(page)).autoRotate, true);
  });

  await runCase('hidden-during-loading', async page => {
    let release;
    const held = new Promise(resolve => {release = resolve;});
    await page.route('**/classic-watch.glb', async route => {await held; await route.continue();});
    try {
      await page.goto(`${base}/__product-state-fixture?mode=hidden`);
      await page.waitForFunction(() => document.querySelector('.scene')?.dataset.productState === 'loading');
      await page.locator('summary').click();
      release();
      await page.waitForFunction(() => !!window.caseLab);
      const hidden = await diagnostics(page);
      assert.equal(hidden.detailsOpen, false); assert.equal(hidden.visible, false);
      assert.equal(hidden.state, 'loading');
      assert.ok(Number.isFinite(hidden.aspect) && hidden.projection.every(Number.isFinite), 'Hidden load invalidated projection');
      await page.locator('.scene').evaluate(container => {container.style.display = 'none';});
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const zeroSized = await diagnostics(page);
      assert.deepEqual(zeroSized.container, [0,0]); assert.equal(zeroSized.visible, false);
      assert.equal(zeroSized.state, 'loading');
      assert.ok(Number.isFinite(zeroSized.aspect) && zeroSized.projection.every(Number.isFinite), 'Zero-size container invalidated projection');
      await page.locator('.scene').evaluate(container => {container.style.display = '';});
      await page.locator('summary').click();
      await ready(page);
      await page.getByRole('button', {name: 'Pause live preview', exact: true}).click();
      const reopened = await settings(page);
      assert.ok(Number.isFinite(reopened.camera.aspect) && reopened.camera.aspect > 0);
      await png(page, 'reopened-after-hidden-load');
    } finally {release();}
  });
} finally {
  await browser?.close(); server?.kill();
  await writeFile(`${output}/report.json`, JSON.stringify({report, interceptedWrites, threeModuleUrl}, null, 2)+'\n');
}
if (report.some(item => !item.passed)) process.exitCode = 1;
else console.log(`All ${report.length} product state regressions passed; learner writes stubbed.`);
