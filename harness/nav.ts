// The viewer's left navigation: every loop and domain in the curriculum plan, with built pages as
// links and the rest greyed out. Groups collapse, and which ones are open is remembered.
import {
  CORE_DOMAINS,
  CROSS_DRILLS,
  DOMAINS,
  FIRST_PLACEMENT_LOOP,
  LOOP_PLAN,
  LOOPS,
  MODE_LABELS,
  plannedDrillCount,
  type Concept,
  type Domain,
} from '../scripts/lib/domains';

export interface NavDrill {
  folder: string;
  loop?: number; // loop pages and drills
  elective?: string; // elective items: the elective domain's slug, like "vfx"
  kind?: string; // elective items: page, guided, or from-memory
  effect?: string; // effect builds: the effect's slug in domains.ts
  concept: string; // the drill's first concept id, like "math.dot-product"
  concepts: string[]; // every concept id; a shared drill is listed under each
  check?: 'placement' | 'checkpoint';
  domain?: string; // a placement check's domain slug
  title: string;
  done: boolean; // finished at least once, according to the practice log
}

// An effect is built twice, in this order.
const BUILD_KINDS = [
  ['guided', 'guided'],
  ['from-memory', 'from memory'],
] as const;

const STORAGE_KEY = 'drill-viewer:open-groups';

function readOpenGroups(): Set<string> | undefined {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? new Set(JSON.parse(stored) as string[]) : undefined;
  } catch {
    return undefined; // storage blocked or unreadable: fall back to the defaults
  }
}

function saveOpenGroups(nav: HTMLElement) {
  const open = [...nav.querySelectorAll<HTMLDetailsElement>('details[data-group]')]
    .filter((details) => details.open)
    .map((details) => details.dataset.group);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(open));
  } catch {
    // storage blocked: the groups just won't be remembered
  }
}

function group(id: string, className: string, summaryHtml: string, open: boolean) {
  const details = document.createElement('details');
  details.dataset.group = id;
  details.className = className;
  details.open = open;
  details.innerHTML = `<summary>${summaryHtml}</summary>`;
  return details;
}

function note(text: string) {
  const paragraph = document.createElement('p');
  paragraph.className = 'note';
  paragraph.textContent = text;
  return paragraph;
}

function link(drill: NavDrill, text: string, selected: string | null) {
  const anchor = document.createElement('a');
  anchor.className = drill.done ? 'drill done' : 'drill';
  anchor.href = `?drill=${drill.folder}`;
  anchor.textContent = text;
  if (drill.folder === selected) anchor.setAttribute('aria-current', 'page');
  return anchor;
}

const pageLink = (drill: NavDrill, number: number, selected: string | null) => link(drill, `${number}. ${drill.title}`, selected);

function upcoming(text: string, detail?: string) {
  const item = document.createElement('span');
  item.className = 'upcoming';
  item.title = 'Not built yet';
  item.textContent = text;
  if (detail) item.insertAdjacentHTML('beforeend', ` <span class="detail">${detail}</span>`);
  return item;
}

// The drills a loop plans for one concept, in plain words, like "build it, use it".
function plannedModes(concept: Concept, loop: number) {
  const plan = LOOP_PLAN[loop];
  if (!plan || loop === 1) return undefined;
  const modes = (concept.tier === 'core' ? plan.core : plan.light).map((mode) => MODE_LABELS[mode]).join(', ');
  return concept.tier === 'light' && plan.lightShared ? `${modes}, shared` : modes;
}

export function renderNav(container: HTMLElement, drills: NavDrill[], selected: string | null) {
  const stored = readOpenGroups();
  const current = drills.find((drill) => drill.folder === selected);
  const currentGroups = !current
    ? []
    : current.elective
      ? [`elective/${current.elective}`]
      : [`loop-${current.loop}`, `loop-${current.loop}/${current.domain ?? current.concept.split('.')[0]}`];
  // The current page's groups always open. Otherwise the remembered state wins over the default.
  const isOpen = (id: string, byDefault: boolean) => currentGroups.includes(id) || (stored ? stored.has(id) : byDefault);

  // One collapsible domain listing every concept in teaching order, with what the loop plans for it.
  const domainGroup = (id: string, domain: Domain, loop: number, byDefault: boolean) => {
    const loopDrills = drills.filter(
      (drill) => drill.loop === loop && !drill.check && drill.concepts.some((id) => id.startsWith(`${domain.slug}.`)),
    );
    const placement = drills.find((drill) => drill.loop === loop && drill.check === 'placement' && drill.domain === domain.slug);
    const total = LOOP_PLAN[loop] ? plannedDrillCount(domain, loop) : domain.concepts.length;
    const doneCount = loopDrills.filter((drill) => drill.done).length;
    const details = group(
      id,
      'domain',
      `<span>${domain.n}. ${domain.name}</span><span class="count">${doneCount ? `<span class="done">✓ ${doneCount}</span> · ` : ''}${loopDrills.length}/${total}</span>`,
      isOpen(id, byDefault),
    );
    if (placement) details.append(link(placement, 'Placement check', selected));
    else if (loop >= FIRST_PLACEMENT_LOOP) details.append(upcoming('Placement check'));
    domain.concepts.forEach((concept, index) => {
      const built = loopDrills.filter((drill) => drill.concepts.includes(`${domain.slug}.${concept.slug}`));
      if (built.length === 0) details.append(upcoming(`${index + 1}. ${concept.name}`, plannedModes(concept, loop)));
      for (const drill of built) details.append(pageLink(drill, index + 1, selected));
    });
    return details;
  };

  // An elective lists its concept pages in teaching order, then its effects, each built guided and
  // then from memory.
  const electiveGroup = (domain: Domain) => {
    const id = `elective/${domain.slug}`;
    const items = drills.filter((drill) => drill.elective === domain.slug);
    const total = domain.concepts.length + (domain.effects?.length ?? 0) * BUILD_KINDS.length;
    const doneCount = items.filter((drill) => drill.done).length;
    const details = group(
      id,
      'domain elective',
      `<span>Elective · ${domain.name}</span><span class="count">${doneCount ? `<span class="done">✓ ${doneCount}</span> · ` : ''}${items.length}/${total}</span>`,
      isOpen(id, false),
    );
    if (domain.note) details.append(note(domain.note));
    domain.concepts.forEach((concept, index) => {
      const page = items.find((drill) => drill.kind === 'page' && drill.concept === `${domain.slug}.${concept.slug}`);
      details.append(page ? pageLink(page, index + 1, selected) : upcoming(`${index + 1}. ${concept.name}`));
    });
    if (!domain.effects) return details;
    details.append(note('Effects, built into the product viewer:'));
    domain.effects.forEach((effect, index) => {
      const heading = document.createElement('span');
      heading.className = 'effect';
      heading.textContent = `${index + 1}. ${effect.name}`;
      const names = effect.concepts.map((slug) => domain.concepts.find((concept) => concept.slug === slug)?.name ?? slug);
      heading.title = `Combines: ${names.join('; ')}`;
      details.append(heading);
      for (const [kind, text] of BUILD_KINDS) {
        const build = items.find((drill) => drill.effect === effect.slug && drill.kind === kind);
        const entry = build ? link(build, text, selected) : upcoming(text);
        entry.classList.add('build');
        details.append(entry);
      }
    });
    return details;
  };

  const tools = document.createElement('div');
  tools.className = 'nav-tools';
  for (const [text, open] of [['Expand all', true], ['Collapse all', false]] as const) {
    const button = document.createElement('button');
    button.textContent = text;
    button.addEventListener('click', () => {
      for (const details of container.querySelectorAll('details')) details.open = open;
      saveOpenGroups(container);
    });
    tools.append(button);
  }
  container.append(tools);

  for (const loop of LOOPS) {
    const loopId = `loop-${loop.n}`;
    const loopGroup = group(loopId, 'loop', `<span>Loop ${loop.n} · ${loop.name}</span>`, isOpen(loopId, loop.n === 1));
    loopGroup.append(note(`${loop.proves}.`));

    if (LOOP_PLAN[loop.n]) {
      if (LOOP_PLAN[loop.n].lightShared) loopGroup.append(note('Light concepts share a drill in pairs.'));
      if (loop.n === 3) loopGroup.append(note('Also misconception traps, and proof experiments in the GPU domain.'));
      for (const domain of DOMAINS.filter((item) => !item.elective)) {
        loopGroup.append(domainGroup(`${loopId}/${domain.slug}`, domain, loop.n, loop.n === 1 && domain.n === 1));
      }
      const checkpoint = drills.find((drill) => drill.loop === loop.n && drill.check === 'checkpoint');
      const entry = checkpoint ? link(checkpoint, `Loop ${loop.n} checkpoint`, selected) : upcoming(`Loop ${loop.n} checkpoint`);
      entry.classList.add('checkpoint');
      loopGroup.append(entry);
    } else {
      // Loop 4 is still only a plan: nothing here links to built drills yet. When the first
      // cross-domain drill is built, match it by title and link it like the loops above.
      const cross = group(
        `${loopId}/cross`,
        'domain',
        `<span>Cross-domain drills</span><span class="count">0/${CROSS_DRILLS.length}</span>`,
        isOpen(`${loopId}/cross`, false),
      );
      CROSS_DRILLS.forEach((drill, index) =>
        cross.append(upcoming(`${index + 1}. ${drill.title}`, `domains ${drill.domains.join(', ')}`)),
      );
      loopGroup.append(
        cross,
        upcoming('AI review', 'find the flaw in generated code'),
        upcoming('Teach-back', 'explain a concept in five plain sentences'),
      );
    }
    container.append(loopGroup);
  }

  for (const elective of DOMAINS.filter((domain) => domain.elective)) container.append(electiveGroup(elective));

  // `toggle` doesn't bubble, so listen during the capture phase.
  container.addEventListener('toggle', () => saveOpenGroups(container), true);
}

const DAY = 24 * 60 * 60 * 1000;
const localDay = (date: Date) => date.toLocaleDateString('en-CA'); // YYYY-MM-DD in local time

// When the current Loop 1 domain and all of Loop 1 would be done at one page a day, starting
// today, or tomorrow if one is already done today. `finished` maps drill ids, like
// "1.math.dot-product.read-the-code.1", to when they were done.
export function renderPace(container: HTMLElement, finished: Map<string, string>) {
  const today = new Date();
  // Only loop pages count toward the pace; elective items (ids like "vfx.sdf.page") don't.
  const doneToday = [...finished].some(([id, at]) => /^\d+\./.test(id) && localDay(new Date(at)) === localDay(today));
  // Pages only: a checkpoint or placement check isn't one of the loop's pages.
  const doneCount = (prefix: string) =>
    [...finished.keys()].filter((id) => id.startsWith(prefix) && !/\.(checkpoint|placement)$/.test(id)).length;
  const doneIn = (left: number) => {
    const end = new Date(today.getTime() + (left - (doneToday ? 0 : 1)) * DAY);
    const date = end.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    return `${left} ${left === 1 ? 'day' : 'days'} · ${date}`;
  };
  // The current domain is the first in teaching order with Loop 1 pages left.
  const current = CORE_DOMAINS.find((domain) => doneCount(`1.${domain.slug}.`) < plannedDrillCount(domain, 1));
  const loopLeft = LOOPS[0].estimate - doneCount('1.');
  container.innerHTML = current
    ? `<p class="pace-title">At one page a day</p>
      <p><span title="${current.name}">Domain ${current.n}</span><span>${doneIn(plannedDrillCount(current, 1) - doneCount(`1.${current.slug}.`))}</span></p>
      <p><span>Loop 1</span><span>${doneIn(loopLeft)}</span></p>`
    : `<p class="pace-title">Loop 1 is done</p>`;
}
