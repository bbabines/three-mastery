import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DOMAINS, TRACKS, trackConcepts} from './domains';
import {electivePrerequisitesMet, scheduledElectives} from './electives';
import {loadCards, loadElectives} from './repo';

test('the full product path is built and discoverable in Tech art, not Rogue',()=>{
  const built = loadElectives();
  const plan = scheduledElectives(DOMAINS,built);
  const product = plan.filter(item=>item.elective==='product');
  assert.equal(product.length,11);
  assert.equal(product[0].id,'product.reference-color.page');
  assert.equal(product.at(-1)?.id,'product.capstone.page');
  assert.ok(product.every(item=>item.afterLoop===0));
  assert.ok(TRACKS.find(track=>track.slug==='tech-art')!.domains.includes('product'));
  assert.ok(!TRACKS.find(track=>track.slug==='rogue')!.domains.includes('product'));
  assert.ok(!plan.some(item=>item.elective==='jewelry'),'preserve its existing manual study access');
});

test('missing pages are never dispatched and VFX retains its ordered build pairs',()=>{
  const built=loadElectives();
  const removed=built.filter(item=>item.id!=='product.reference-color.page');
  assert.ok(!scheduledElectives(DOMAINS,removed).some(item=>item.id==='product.reference-color.page'));
  const vfx=scheduledElectives(DOMAINS,built).filter(item=>item.elective==='vfx');
  assert.equal(vfx.length,25);
  assert.ok(vfx.every(item=>item.afterLoop===2));
  assert.equal(vfx.at(-2)?.kind,'guided');
  assert.equal(vfx.at(-1)?.kind,'from-memory');
});

test('product prerequisites distinguish prior elective practice from foundational literacy',()=>{
  const prerequisites=new Map([['product.tactile-materials',['product.geometry-fidelity','geometry.tangent-space']]]);
  const ready=(page:boolean,core:boolean)=>electivePrerequisitesMet('product',['product.tactile-materials'],prerequisites,
    id=>page&&id==='product.geometry-fidelity.page',id=>core&&id==='geometry.tangent-space');
  assert.equal(ready(false,true),false);
  assert.equal(ready(true,false),false);
  assert.equal(ready(true,true),true);
});

test('Tech art follows the product cards into required camera/assets foundations',()=>{
  const prerequisites=new Map(loadCards().map(card=>[card.id,card.prerequisites]));
  const concepts=trackConcepts(TRACKS.find(track=>track.slug==='tech-art')!,prerequisites);
  assert.ok(concepts.has('product.capstone'));
  assert.ok(concepts.has('camera.projection-matrix'));
  const known=new Set(loadCards().map(card=>card.id));
  for(const card of loadCards().filter(card=>card.domain==='product')) {
    for(const prerequisite of card.prerequisites) assert.ok(known.has(prerequisite),`${card.id}: unknown ${prerequisite}`);
  }
});
