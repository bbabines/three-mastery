// The viewer's left navigation: every loop and domain in the active track's plan, with built pages
// as links and the rest greyed out. Groups collapse, and which ones are open is remembered.
import {
  CORE_DOMAINS,
  CORE_MODES,
  CROSS_DRILLS,
  DOMAINS,
  FIRST_PLACEMENT_LOOP,
  LOOP_PLAN,
  LOOPS,
  MODE_LABELS,
  plannedDrillCount,
  TRACKS,
  type Concept,
  type Domain,
  type Track,
} from '../scripts/lib/domains';

// The active track and every concept id it shows, foundations included (trackConcepts).
export interface TrackView {
  track: Track;
  concepts: Set<string>;
}

const TRACK_KEY = 'drill-viewer:track';

// The track named in the URL, which is then remembered, or else the remembered one.
export function readTrack(): Track {
  const asked = TRACKS.find((track) => track.slug === new URLSearchParams(location.search).get('track'));
  try {
    if (asked) localStorage.setItem(TRACK_KEY, asked.slug);
    return asked ?? TRACKS.find((track) => track.slug === localStorage.getItem(TRACK_KEY)) ?? TRACKS[0];
  } catch {
    return asked ?? TRACKS[0]; // storage blocked: the track lasts only while it's in the URL
  }
}

// A domain's concepts that the track shows, in teaching order, as a domain the planners can count.
export const shownPart = (domain: Domain, view: TrackView): Domain => ({
  ...domain,
  concepts: domain.concepts.filter((concept) => view.concepts.has(`${domain.slug}.${concept.slug}`)),
});

export interface NavDrill {
  folder: string;
  loop?: number; // loop pages and drills
  elective?: string; // elective items: the elective domain's slug, like "vfx"
  kind?: string; // elective items: page, guided, or from-memory
  effect?: string; // effect builds: the effect's slug in domains.ts
  concept: string; // the drill's first concept id, like "math.dot-product"
  concepts: string[]; // every concept id; a shared drill is listed under each
  mode?: string; // read-the-code, implement, apply, or break-and-fix
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

// The nav is drawn again on every page change, so its listeners are single functions that
// addEventListener adds only once.
const saveOnToggle = (event: Event) => saveOpenGroups(event.currentTarget as HTMLElement);

// Opening a group closes the groups beside it, so one loop and one domain are open at a time.
const closeSiblings = (event: Event) => {
  const details = (event.target as Element).closest('summary')?.parentElement;
  if (!(details instanceof HTMLDetailsElement) || details.open) return; // a click that closes it
  for (const sibling of details.parentElement?.children ?? []) {
    if (sibling !== details && sibling instanceof HTMLDetailsElement) sibling.open = false;
  }
};

// Your progress through a group: pages done out of its total, ticked once all are done.
function progress(done: number, total: number) {
  const complete = total > 0 && done === total;
  return `<span class="count${complete ? ' done' : ''}" data-done="${done}" data-total="${total}">${complete ? '✓ ' : ''}${done}/${total}</span>`;
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

export function renderNav(container: HTMLElement, drills: NavDrill[], selected: string | null, view: TrackView) {
  const stored = readOpenGroups();
  const wholeDomain = (slug: string) => view.track.domains.includes(slug);
  const firstDomain = CORE_DOMAINS.find((domain) => shownPart(domain, view).concepts.length > 0);
  const current = drills.find((drill) => drill.folder === selected);
  const currentGroups = !current
    ? []
    : current.elective
      ? [`elective/${current.elective}`]
      : current.loop === 4
        ? [`loop-4`, current.check === 'placement' ? 'loop-4/placement' : current.folder.startsWith('cross/') ? 'loop-4/cross' : `loop-4/${current.mode}`]
        : [`loop-${current.loop}`, `loop-${current.loop}/${current.domain ?? current.concept.split('.')[0]}`];
  // The current page's groups always open. Otherwise the remembered state wins over the default.
  const isOpen = (id: string, byDefault: boolean) => currentGroups.includes(id) || (stored ? stored.has(id) : byDefault);

  // One collapsible domain listing every concept in teaching order, with what the loop plans for it.
  // A domain the track only borrows foundations from lists just those, and has no placement check,
  // since the check covers the whole domain.
  const domainGroup = (id: string, domain: Domain, loop: number, byDefault: boolean) => {
    const shown = shownPart(domain, view);
    const whole = wholeDomain(domain.slug);
    const loopDrills = drills.filter(
      (drill) =>
        drill.loop === loop && !drill.check && drill.concepts.some((id) => id.startsWith(`${domain.slug}.`) && view.concepts.has(id)),
    );
    const placement = drills.find((drill) => drill.loop === loop && drill.check === 'placement' && drill.domain === domain.slug);
    // A light pair may be built as separate drills; never show more built than the total.
    const planned = LOOP_PLAN[loop] ? plannedDrillCount(shown, loop) : shown.concepts.length;
    const details = group(
      id,
      'domain',
      `<span>${domain.name}${whole ? '' : ' <span class="detail">· foundations</span>'}</span>${progress(loopDrills.filter((drill) => drill.done).length, Math.max(planned, loopDrills.length))}`,
      isOpen(id, byDefault),
    );
    if (whole && placement) details.append(link(placement, 'Placement check', selected));
    else if (whole && loop >= FIRST_PLACEMENT_LOOP) details.append(upcoming('Placement check'));
    // Numbered by position in this track's list, the same numbers the page's breadcrumb shows.
    shown.concepts.forEach((concept, index) => {
      // In the order a loop plans them: build it before use it.
      const built = loopDrills
        .filter((drill) => drill.concepts.includes(`${domain.slug}.${concept.slug}`))
        .sort((a, b) => CORE_MODES.indexOf(a.mode ?? '') - CORE_MODES.indexOf(b.mode ?? ''));
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
    const total = Math.max(domain.concepts.length + (domain.effects?.length ?? 0) * BUILD_KINDS.length, items.length);
    const details = group(
      id,
      'domain elective',
      `<span>Elective · ${domain.name}</span>${progress(items.filter((drill) => drill.done).length, total)}`,
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

  const tracks = document.createElement('div');
  tracks.className = 'tracks';
  tracks.setAttribute('role', 'group');
  tracks.setAttribute('aria-label', 'Track');
  for (const track of TRACKS) {
    const anchor = document.createElement('a');
    const params = new URLSearchParams({ track: track.slug });
    if (selected) params.set('drill', selected);
    anchor.href = `?${params}`;
    anchor.textContent = track.name;
    if (track === view.track) anchor.setAttribute('aria-current', 'true');
    tracks.append(anchor);
  }
  container.append(tracks);

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

    if (LOOP_PLAN[loop.n]) {
      for (const domain of CORE_DOMAINS) {
        if (shownPart(domain, view).concepts.length === 0) continue;
        loopGroup.append(domainGroup(`${loopId}/${domain.slug}`, domain, loop.n, loop.n === 1 && domain === firstDomain));
      }
      const checkpoint = drills.find((drill) => drill.loop === loop.n && drill.check === 'checkpoint');
      const entry = checkpoint ? link(checkpoint, `Loop ${loop.n} checkpoint`, selected) : upcoming(`Loop ${loop.n} checkpoint`);
      entry.classList.add('checkpoint');
      loopGroup.append(entry);
    } else {
      const placement = group(
        `${loopId}/placement`, 'domain',
        '<span>Placement checks</span>',
        isOpen(`${loopId}/placement`, false),
      );
      for (const domain of CORE_DOMAINS.filter((item) => wholeDomain(item.slug))) {
        const item = drills.find((drill) => drill.loop === 4 && drill.check === 'placement' && drill.domain === domain.slug);
        placement.append(item ? link(item, domain.name, selected) : upcoming(domain.name));
      }
      // A cross drill is in the track when every concept it uses is; one not built yet goes by its planned domains.
      const crossDrills = CROSS_DRILLS.map((planned) => ({
        planned,
        built: drills.find((drill) => drill.folder.startsWith('cross/4/') && drill.title === planned.title),
      })).filter(({ planned, built }) =>
        built
          ? built.concepts.every((id) => view.concepts.has(id))
          : planned.domains.every((n) => wholeDomain(DOMAINS.find((domain) => domain.n === n)?.slug ?? '')),
      );
      const cross = group(
        `${loopId}/cross`,
        'domain',
        `<span>Cross-domain drills</span>${progress(crossDrills.filter(({ built }) => built?.done).length, crossDrills.length)}`,
        isOpen(`${loopId}/cross`, false),
      );
      crossDrills.forEach(({ planned, built }, index) => {
        cross.append(built ? pageLink(built, index + 1, selected) : upcoming(`${index + 1}. ${planned.title}`, `domains ${planned.domains.join(', ')}`));
      });
      loopGroup.append(placement, cross);
      for (const [mode, heading] of [['ai-review', 'AI review'], ['teach-back', 'Teach-back']] as const) {
        const built = drills.filter((drill) => drill.loop === 4 && drill.mode === mode && drill.concepts.every((id) => view.concepts.has(id)))
          .sort((a, b) => DOMAINS.findIndex((domain) => a.concept.startsWith(`${domain.slug}.`))
            - DOMAINS.findIndex((domain) => b.concept.startsWith(`${domain.slug}.`)));
        const details = group(`${loopId}/${mode}`, 'domain',
          `<span>${heading}</span>${progress(built.filter((drill) => drill.done).length, built.length)}`,
          isOpen(`${loopId}/${mode}`, false));
        built.forEach((drill, index) => details.append(pageLink(drill, index + 1, selected)));
        loopGroup.append(details);
      }
      const checkpoint = drills.find((drill) => drill.loop === 4 && drill.check === 'checkpoint');
      const entry = checkpoint ? link(checkpoint, 'Loop 4 checkpoint', selected) : upcoming('Loop 4 checkpoint');
      entry.classList.add('checkpoint');
      loopGroup.append(entry);
    }
    // A loop's count adds up its groups' pages; placement checks and checkpoints aren't pages.
    const counts = [...loopGroup.querySelectorAll<HTMLElement>(':scope > details > summary > .count')];
    const sum = (key: 'done' | 'total') => counts.reduce((total, count) => total + Number(count.dataset[key]), 0);
    loopGroup.querySelector('summary')?.insertAdjacentHTML('beforeend', progress(sum('done'), sum('total')));
    container.append(loopGroup);
  }

  for (const elective of DOMAINS.filter((domain) => domain.elective && wholeDomain(domain.slug))) container.append(electiveGroup(elective));

  // The current page's loop and domain are the open ones, as if you'd just opened them.
  for (const id of currentGroups) {
    const details = container.querySelector<HTMLDetailsElement>(`details[data-group="${id}"]`);
    for (const sibling of details?.parentElement?.children ?? []) {
      if (sibling !== details && sibling instanceof HTMLDetailsElement) sibling.open = false;
    }
  }

  // `toggle` doesn't bubble, so listen during the capture phase.
  container.addEventListener('toggle', saveOnToggle, true);
  container.addEventListener('click', closeSiblings);
}

const DAY = 24 * 60 * 60 * 1000;
const localDay = (date: Date) => date.toLocaleDateString('en-CA'); // YYYY-MM-DD in local time

// When the current Loop 1 domain and the track's share of Loop 1 would be done at one page a day,
// starting today, or tomorrow if one is already done today. `finished` maps drill ids, like
// "1.math.dot-product.read-the-code.1", to when they were done.
export function renderPace(container: HTMLElement, finished: Map<string, string>, view: TrackView) {
  const today = new Date();
  // Only loop pages count toward the pace; elective items (ids like "vfx.sdf.page") don't.
  const doneToday = [...finished].some(([id, at]) => /^\d+\./.test(id) && localDay(new Date(at)) === localDay(today));
  // Pages in the track only: a checkpoint or placement check isn't one of the loop's pages.
  const doneCount = (prefix: string) =>
    [...finished.keys()].filter(
      (id) => id.startsWith(prefix) && !/\.(checkpoint|placement)$/.test(id) && view.concepts.has(id.split('.').slice(1, 3).join('.')),
    ).length;
  const doneIn = (left: number) => {
    const end = new Date(today.getTime() + (left - (doneToday ? 0 : 1)) * DAY);
    const date = end.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    return `${left} ${left === 1 ? 'day' : 'days'} · ${date}`;
  };
  const parts = CORE_DOMAINS.map((domain) => shownPart(domain, view));
  // The current domain is the first in teaching order with Loop 1 pages left.
  const current = parts.find((part) => doneCount(`1.${part.slug}.`) < plannedDrillCount(part, 1));
  const loopLeft = parts.reduce((sum, part) => sum + plannedDrillCount(part, 1), 0) - doneCount('1.');
  const loopName = view.track.slug === 'all' ? 'Loop 1' : `${view.track.name} Loop 1`;
  container.innerHTML = current
    ? `<p class="pace-title">At one page a day</p>
      <p><span title="${current.name}">${current.name}</span><span>${doneIn(plannedDrillCount(current, 1) - doneCount(`1.${current.slug}.`))}</span></p>
      <p><span>${loopName}</span><span>${doneIn(loopLeft)}</span></p>`
    : `<p class="pace-title">${loopName} is done</p>`;
}
