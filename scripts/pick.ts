// Loop-aware drill picker and practice log, following the active track.
//
//   npm run pick                 suggest what to do next
//   npm run pick -- start [id]   mark what you're working on (defaults to the suggestion)
//   npm run pick -- done         run its check and log the date you finished
//                                (add --pass for a drill checked on the page or by eye)
//   npm run pick -- status       progress in the current loop
//   npm run pick -- track [slug] show the active track, or switch to rogue, tech-art, look-dev, or all
//
// Nothing is timed. The log records when each drill was finished, never how long it took.
//
// The active track is the latest one chosen here or in the viewer. Suggestions stay inside its
// domains and the foundations they need, and it keeps its own loop: a loop ends for a track once
// the checkpoint questions for its domains have been taken, in any track.
//
// In Loops 2–4, each of the track's domains opens with its placement check. Passing it suggests
// skipping that domain's drills for the loop. Drills are ranked by how long ago their domain, then
// their mode, was practiced; ties go to the concept's teaching order in lib/domains.ts. A drill
// waits until its concepts' prerequisites are covered in the loop, unless nothing else is ready.
// From the track's Loop 3 on, a track with the Procedural & VFX elective also suggests its pages
// and effect builds. After Loop 4, maintenance rotates the track's drills, weighted toward stale
// concepts and domains that failed checkpoint parts. Once another track is finished, a drill from
// it comes up for review whenever none has been practiced for a week. Look dev holds only
// electives: it suggests their scheduled pages in order, and has no loops or review rotation.
import { existsSync } from 'node:fs';
import path from 'node:path';
import {
  checkpointPartsLeft,
  CORE_DOMAINS,
  DOMAINS,
  electivesOnly,
  LOOPS,
  teachingOrder,
  trackConcepts,
  trackCoreDomains,
  trackFromLog,
  trackLoop,
  TRACKS,
  type Track,
} from './lib/domains';
import { appendLog, readLog, type DoneEntry, type StartEntry } from './lib/log';
import { loadCards, loadCheckpoints, loadDrills, loadElectives, loadPlacements, ROOT, type Drill } from './lib/repo';
import { runVitest } from './lib/vitest';
import { electivePrerequisitesMet, scheduledElectives } from './lib/electives';

interface Item {
  kind: 'drill' | 'placement' | 'checkpoint' | 'elective';
  id: string;
  dir: string;
  loop: number;
  domain?: string;
  drill?: Drill;
  concepts?: string[];
  electiveKind?: 'page' | 'guided' | 'from-memory';
  order?: number; // elective items: their place in the elective's plan
}

const HOURS_IF_NEVER = 10_000;
const HOURS_PER_WEEK = 24 * 7;

const drills = loadDrills();
const allCards = loadCards();
const coreDomains = new Set(CORE_DOMAINS.map((domain) => domain.slug));
const cards = new Map(allCards.filter((card) => coreDomains.has(card.domain)).map((card) => [card.id, card]));
const prerequisites = new Map(allCards.map((card) => [card.id, card.prerequisites ?? []]));

// Opted-in electives follow the inventory's plan. VFX keeps its guided/from-memory pairs;
// Product Look Development is shown-code visual practice with individual literacy prerequisites.
const electiveItems: Item[] = scheduledElectives(DOMAINS, loadElectives()).map(planned => ({
  kind:'elective', id:planned.id, dir:planned.dir, loop:0, domain:planned.elective,
  concepts:planned.concepts, electiveKind:planned.kind, order:planned.order,
}));
const vfxItems = electiveItems.filter(item => item.domain === 'vfx');
const vfxEffects = vfxItems.filter((item) => item.electiveKind === 'from-memory');

const items: Item[] = [
  ...drills.map((drill): Item => ({ kind: 'drill', ...drill, drill })),
  ...loadPlacements().map((placement): Item => ({ kind: 'placement', ...placement })),
  ...loadCheckpoints().map((checkpoint): Item => ({ kind: 'checkpoint', ...checkpoint })),
  ...electiveItems,
];
const itemsById = new Map(items.map((item) => [item.id, item]));

const log = readLog();
const doneEntries = log.filter((entry): entry is DoneEntry => entry.type === 'done');
const passedIds = new Set(doneEntries.filter((entry) => entry.passed).map((entry) => entry.id));

// ---- Tracks ----

const viewOf = (track: Track) => ({
  track,
  concepts: trackConcepts(track, prerequisites),
  wholeDomains: new Set(trackCoreDomains(track)),
});
const active = viewOf(trackFromLog(log) ?? TRACKS[0]);

// A domain drill is in a track when it touches one of the track's concepts, and a cross-domain
// drill when it uses only the track's concepts. Placement checks cover whole domains.
function inTrack(item: Item, view = active) {
  if (item.kind === 'checkpoint') return true;
  if (item.kind === 'placement') return view.wholeDomains.has(item.domain ?? '');
  if (item.kind === 'elective') return view.track.domains.includes(item.domain ?? '');
  const ids = item.drill?.concepts ?? [];
  return item.dir.startsWith('cross/') ? ids.every((id) => view.concepts.has(id)) : ids.some((id) => view.concepts.has(id));
}

// Look dev never finishes in this sense: it has no loops.
const unfinishedTracks = () => TRACKS.filter((track) => !electivesOnly(track) && trackLoop(track, log) !== 'maintenance');

// ---- Loop state ----

// A checkpoint is a self-check, not a gate: taking it moves the track to its next loop, whatever the score.
const currentLoop = () => trackLoop(active.track, log);

// The first attempt counts, so a failed placement can't be retaken until it passes.
function placementResult(loop: number, domain: string) {
  return doneEntries.find((entry) => entry.id === `${loop}.${domain}.placement`);
}

function domainSkipped(loop: number, domain: string) {
  return placementResult(loop, domain)?.passed === true;
}

// A prerequisite is covered in a loop once one of its drills there has passed, its domain's
// placement passed, or it has no drills in that loop at all (a concept whose page isn't built yet).
function conceptCovered(conceptId: string, loop: number) {
  const conceptDrills = drills.filter((drill) => drill.loop === loop && drill.concepts.includes(conceptId));
  if (conceptDrills.length === 0) return true;
  if (domainSkipped(loop, conceptId.split('.')[0])) return true;
  return conceptDrills.some((drill) => passedIds.has(drill.id));
}

// A prerequisite the drill covers itself, as a light pair often does, doesn't hold it back, and
// one outside the track counts as covered, since the track never suggests its drills.
function prerequisitesMet(drill: Drill) {
  const needed = drill.concepts.flatMap((id) => cards.get(id)?.prerequisites ?? []);
  return needed.every((id) => drill.concepts.includes(id) || !active.concepts.has(id) || conceptCovered(id, drill.loop));
}

// ---- Ranking ----

function hoursSinceLast(match: (item: Item) => boolean) {
  let latest: number | undefined;
  for (const entry of doneEntries) {
    const item = itemsById.get(entry.id);
    if (!item || !match(item)) continue;
    latest = Math.max(latest ?? 0, Date.parse(entry.at));
  }
  return latest === undefined ? HOURS_IF_NEVER : (Date.now() - latest) / 3_600_000;
}

function loopScore(item: Item) {
  const domainHours = hoursSinceLast((other) => other.domain === item.domain);
  const modeHours = item.drill ? hoursSinceLast((other) => other.drill?.mode === item.drill?.mode) : 0;
  return 2 * domainHours + modeHours;
}

function itemOrder(item: Item) {
  return item.order ?? teachingOrder(item.drill?.concepts[0] ?? '');
}

function maintenanceScore(item: Item) {
  const concepts = item.drill?.concepts ?? item.concepts ?? [];
  const conceptHours = hoursSinceLast((other) => (other.drill?.concepts ?? other.concepts ?? []).some((id) => concepts.includes(id)));
  const checkpointFailures = doneEntries.filter(
    (entry) => entry.id.endsWith('.checkpoint') && entry.failedParts?.includes(item.domain ?? ''),
  ).length;
  return conceptHours + checkpointFailures * HOURS_PER_WEEK;
}

const byMaintenance = (a: Item, b: Item) => maintenanceScore(b) - maintenanceScore(a);

// Prerequisites order a loop's drills; they never keep one from it. Shared drills can wait on each
// other in a circle, so when nothing is ready, the waiting drills are suggested anyway.
function loopCandidates(loop: number): Item[] {
  const inLoop = items.filter((item) => item.loop === loop && item.domain && coreDomains.has(item.domain) && inTrack(item));
  const domains = [...new Set(inLoop.map((item) => item.domain as string))];

  const open = domains.flatMap((domain) => {
    const placement = inLoop.find((item) => item.kind === 'placement' && item.domain === domain);
    if (placement && !placementResult(loop, domain)) return [placement];
    if (domainSkipped(loop, domain)) return [];
    return inLoop.filter((item) => item.domain === domain && item.drill && !passedIds.has(item.id));
  });
  const ready = open.filter((item) => !item.drill || prerequisitesMet(item.drill));
  return ready.length > 0 ? ready : open;
}

// An elective page waits for the elective pages it builds on; a guided effect waits for its
// concepts' pages, and a from-memory effect for its guided build. Look dev borrows no core pages,
// so there a page never waits on one.
function electiveReady(item: Item) {
  const concepts = item.concepts ?? [];
  if (item.electiveKind === 'page') {
    return electivePrerequisitesMet(item.domain ?? '', concepts, prerequisites, id => passedIds.has(id), id => electivesOnly(active.track) || conceptCovered(id, 1));
  }
  if (item.electiveKind === 'guided') return concepts.every((id) => passedIds.has(`${id}.page`));
  return passedIds.has(item.id.replace(/from-memory$/, 'guided'));
}

// Each scheduled elective names its own entry rule in the inventory.
function electiveCandidates(loop: number | 'maintenance') {
  return electiveItems.filter(item => {
    const after = DOMAINS.find(domain => domain.slug === item.domain)?.afterLoop ?? Infinity;
    return (loop === 'maintenance' || loop > after) && inTrack(item) && !passedIds.has(item.id) && electiveReady(item);
  });
}

// Once another track is finished, its drills outside this track come back for review when none
// of them has been practiced for a week.
function dueReview(): Item | undefined {
  if (electivesOnly(active.track)) return undefined;
  const finished = TRACKS.filter((track) => track !== active.track && !electivesOnly(track) && trackLoop(track, log) === 'maintenance').map(viewOf);
  const pool = items.filter((item) => item.kind === 'drill' && !inTrack(item) && finished.some((view) => inTrack(item, view)));
  if (pool.length === 0) return undefined;
  const ids = new Set(pool.map((item) => item.id));
  if (hoursSinceLast((item) => ids.has(item.id)) < HOURS_PER_WEEK) return undefined;
  return pool.sort(byMaintenance)[0];
}

function trackSuggestions(): { items: Item[]; note?: string } {
  const loop = currentLoop();
  if (electivesOnly(active.track)) {
    const fresh = electiveCandidates('maintenance').sort((a, b) => itemOrder(a) - itemOrder(b));
    return { items: fresh, note: 'Every page pick schedules in this track is done. Tactile and Jewelry pages open from the viewer.' };
  }
  if (loop === 'maintenance') {
    const fresh = electiveCandidates(loop);
    if (fresh.length > 0) return { items: fresh.sort((a, b) => itemOrder(a) - itemOrder(b)) };
    const electiveDone = vfxEffects.every((item) => passedIds.has(item.id));
    const pool = items.filter(
      (item) => inTrack(item) && (item.kind === 'drill' || (electiveDone && item.kind === 'elective' && item.electiveKind === 'from-memory') || (item.id === 'product.capstone.page' && passedIds.has(item.id))),
    );
    return { items: pool.sort(byMaintenance) };
  }

  const candidates = [...loopCandidates(loop), ...electiveCandidates(loop)];
  if (candidates.length > 0) {
    return {
      items: candidates.sort(
        (a, b) => loopScore(b) - loopScore(a) || itemOrder(a) - itemOrder(b) || a.id.localeCompare(b.id),
      ),
    };
  }

  const checkpoint = itemsById.get(`${loop}.checkpoint`);
  if (checkpoint) return { items: [checkpoint] };
  return { items: [], note: `Every built drill in Loop ${loop} is done. Its checkpoint isn't built yet.` };
}

// A review that's due goes first.
function rankedSuggestions() {
  const review = dueReview();
  const { items: ranked, note } = trackSuggestions();
  return { items: review ? [review, ...ranked] : ranked, note, review };
}

// ---- Commands ----

function inProgress(): StartEntry | undefined {
  let current: StartEntry | undefined;
  for (const entry of log) {
    if (entry.type === 'start') current = entry;
    else if (entry.type === 'done' && entry.id === current?.id) current = undefined;
  }
  return current;
}

function describe(item: Item) {
  const label = item.drill
    ? `${item.drill.mode}, ${item.drill.context.split('/')[1]}`
    : item.kind === 'elective'
      ? `${DOMAINS.find(domain => domain.slug === item.domain)?.name ?? item.domain} ${item.electiveKind === 'page' ? 'page' : item.electiveKind === 'guided' ? 'guided build' : 'from memory'}`
      : item.kind;
  return `${item.id}  (${label})\n    ${item.dir}/README.md`;
}

// Everything comes last in the plan, after Rogue and Tech art.
function trackHint() {
  const next = unfinishedTracks()
    .filter((track) => track !== active.track)
    .sort((a, b) => Number(a.slug === 'all') - Number(b.slug === 'all'));
  if (next.length > 0) console.log(`\nStill to finish: ${next.map((track) => track.name).join(', ')}. Switch with: npm run pick -- track ${next[0].slug}`);
}

function suggest() {
  const current = inProgress();
  if (current) {
    console.log(`In progress: ${current.id}`);
    console.log('Finish with: npm run pick -- done');
    return;
  }

  const loop = currentLoop();
  const stage = electivesOnly(active.track) ? 'Electives' : loop === 'maintenance' ? 'Maintenance rotation' : `Loop ${loop}: ${LOOPS[loop - 1].name}`;
  console.log(`${active.track.name} track · ${stage}`);
  const { items: ranked, note, review } = rankedSuggestions();
  if (ranked.length === 0) {
    console.log(note ?? 'Nothing to suggest.');
    return;
  }

  const heading = review ? 'Next, a review from a finished track (none practiced for a week)' : 'Next';
  console.log(`\n${heading}:\n  ${describe(ranked[0])}`);
  if (ranked.length > 1) {
    console.log(`\nAlso available:\n${ranked.slice(1, 3).map((item) => `  ${describe(item)}`).join('\n')}`);
  }
  console.log('\nStart it with: npm run pick -- start');
  if (loop === 'maintenance' && !electivesOnly(active.track)) trackHint();
}

function start(id: string | undefined) {
  const item = id ? itemsById.get(id) : rankedSuggestions().items[0];
  if (!item) {
    console.log(id ? `No item with id ${id}.` : 'Nothing to start.');
    process.exitCode = 1;
    return;
  }

  appendLog({ type: 'start', id: item.id, at: new Date().toISOString() });
  console.log(`Working on ${item.id}.\n`);
  console.log(`  Open:  http://localhost:5173/harness/?drill=${item.dir}  (needs npm run dev)`);
  if (item.kind === 'elective' && item.electiveKind === 'page') {
    console.log(item.domain === 'vfx' ? '\nThe page logs it when your exercise matches the reference.' : '\nComplete the visual exercises, save the evidence, then use the page\'s Mark done button or: npm run pick -- done --pass');
  } else if (item.kind === 'elective') {
    console.log('\nMatch the reference by eye. The page can log it, or finish with: npm run pick -- done --pass');
  } else if (item.kind !== 'drill' && !existsSync(path.join(ROOT, item.dir, 'check.test.ts'))) {
    console.log('\nNo docs for this one. The page logs it when you answer its last question.');
  } else if (item.kind !== 'drill') {
    console.log('\nNo docs for this one.');
    console.log('When finished: npm run pick -- done');
  } else if (item.drill?.mode === 'read-the-code') {
    console.log('\nThe page logs it as done when you answer its last question.');
  } else {
    console.log(`  Watch: npm run drill -- ${item.dir}`);
    console.log('\nDocs and three.js source are fine; AI tools and /solutions are not.');
    console.log('When finished: npm run pick -- done');
  }
}

// Drills checked on the page or by eye instead of by a test are confirmed with `done --pass`.
function acceptanceCheckPasses(item: Item, flag: string | undefined) {
  const hasTest = ['drill.test.ts', 'drill.browser.test.ts'].some((file) => existsSync(path.join(ROOT, item.dir, file)));
  if (!hasTest) return flag === '--pass';
  const results = runVitest([item.dir]);
  return results.length > 0 && results.every((result) => result.passed);
}

function finishDrill(item: Item, flag: string | undefined) {
  if (!acceptanceCheckPasses(item, flag)) {
    const hint = item.drill?.mode === 'read-the-code' ? ' Finish the page, then run: npm run pick -- done --pass' : '';
    console.log(`\nThe acceptance check still fails. It's still marked as in progress.${hint}`);
    process.exitCode = 1;
    return;
  }

  appendLog({ type: 'done', id: item.id, at: new Date().toISOString(), passed: true });
  console.log(`\nLogged ${item.id} as done.`);
}

// Placement checks and checkpoints: the result is logged either way, with the parts that missed.
function finishCheck(item: Item) {
  // A quiz checkpoint is logged by its page, with the domains it covered and the ones with misses.
  if (!existsSync(path.join(ROOT, item.dir, 'check.test.ts'))) {
    const logged = doneEntries.some((entry) => entry.id === item.id);
    console.log(logged ? `\n${item.id} is already logged from its page.` : '\nThis one logs itself when you answer its last question on the page.');
    return;
  }
  const results = runVitest([item.dir]);
  const failedParts = [...new Set(results.flatMap((result) => result.failedSuites))];
  const passed = results.length > 0 && results.every((result) => result.passed);
  appendLog({ type: 'done', id: item.id, at: new Date().toISOString(), passed, failedParts });

  console.log(`\n${item.id}: ${passed ? 'passed' : 'not passed'}.`);
  if (failedParts.length > 0) console.log(`Missed: ${failedParts.join(', ')}`);
  if (item.kind === 'placement') {
    console.log(
      passed
        ? `You can skip the ${item.domain} drills for Loop ${item.loop}.`
        : `The ${item.domain} drills for Loop ${item.loop} are worth doing.`,
    );
  }
}

function done(flag: string | undefined) {
  const started = inProgress();
  const item = started && itemsById.get(started.id);
  if (!started || !item) {
    console.log('Nothing in progress. Start something with: npm run pick -- start');
    process.exitCode = 1;
    return;
  }
  if (item.kind === 'drill' || item.kind === 'elective') finishDrill(item, flag);
  else finishCheck(item);
}

function status() {
  const loop = currentLoop();
  if (electivesOnly(active.track)) {
    console.log(`${active.track.name} track · electives\n`);
    for (const domain of DOMAINS.filter((item) => active.track.domains.includes(item.slug))) {
      const pages = domain.concepts.map((concept) => `${domain.slug}.${concept.slug}.page`);
      console.log(`  ${domain.name.padEnd(28)} pages ${pages.filter((id) => passedIds.has(id)).length}/${pages.length}`);
    }
    return;
  }
  if (loop === 'maintenance') {
    console.log(`${active.track.name} track · maintenance rotation. ${doneEntries.length} completions logged.`);
    trackHint();
    return;
  }

  console.log(`${active.track.name} track · Loop ${loop}: ${LOOPS[loop - 1].name}\n`);
  for (const domain of CORE_DOMAINS) {
    const domainDrills = items.filter((item) => item.kind === 'drill' && item.loop === loop && item.domain === domain.slug && inTrack(item));
    const whole = active.wholeDomains.has(domain.slug);
    const placement = whole ? itemsById.get(`${loop}.${domain.slug}.placement`) : undefined;
    if (domainDrills.length === 0 && !placement) continue;

    const result = placementResult(loop, domain.slug);
    const placementText = !whole
      ? 'foundations'
      : !placement ? 'no placement' : !result ? 'placement not taken' : result.passed ? 'placement passed' : 'placement missed';
    const passed = domainDrills.filter((item) => passedIds.has(item.id)).length;
    console.log(`  ${domain.slug.padEnd(14)} ${placementText.padEnd(20)} drills ${passed}/${domainDrills.length}`);
  }

  const checkpoint = itemsById.get(`${loop}.checkpoint`);
  const total = active.wholeDomains.size;
  const taken = total - checkpointPartsLeft(loop, active.track, log).length;
  console.log(`\nCheckpoint: ${!checkpoint ? 'not built yet' : `${taken}/${total} domains taken`}`);
}

function track(slug: string | undefined) {
  const slugs = TRACKS.map((item) => item.slug).join(', ');
  if (slug === undefined) {
    console.log(`Active track: ${active.track.name} (${active.track.slug}). Switch with: npm run pick -- track <${slugs}>`);
    return;
  }
  const chosen = TRACKS.find((item) => item.slug === slug);
  if (!chosen) {
    console.log(`No track ${slug}. Use one of: ${slugs}.`);
    process.exitCode = 1;
    return;
  }
  appendLog({ type: 'track', track: chosen.slug, at: new Date().toISOString() });
  console.log(`Switched to ${chosen.name}. The viewer follows it when it next loads a page without ?track=.`);
}

const [command, argument] = process.argv.slice(2);
if (command === undefined) suggest();
else if (command === 'start') start(argument);
else if (command === 'done') done(argument);
else if (command === 'status') status();
else if (command === 'track') track(argument);
else {
  console.log(`Unknown command: ${command}. Use start, done, status, or track.`);
  process.exitCode = 1;
}
