// The viewer's left navigation: every loop and domain in the curriculum plan, with built pages as
// links and the rest greyed out. Groups collapse, and which ones are open is remembered.
import {
  CROSS_DRILLS,
  DOMAINS,
  LOOP_PLAN,
  LOOPS,
  MODE_LABELS,
  plannedDrillCount,
  type Concept,
  type Domain,
} from '../scripts/lib/domains';

export interface NavDrill {
  folder: string;
  loop: number;
  concept: string; // the drill's first concept id, like "math.dot-product"
  title: string;
}

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

function pageLink(drill: NavDrill, number: number, selected: string | null) {
  const link = document.createElement('a');
  link.className = 'drill';
  link.href = `?drill=${drill.folder}`;
  link.textContent = `${number}. ${drill.title}`;
  if (drill.folder === selected) link.setAttribute('aria-current', 'page');
  return link;
}

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
  const currentGroups = current ? [`loop-${current.loop}`, `loop-${current.loop}/${current.concept.split('.')[0]}`] : [];
  // The current page's groups always open. Otherwise the remembered state wins over the default.
  const isOpen = (id: string, byDefault: boolean) => currentGroups.includes(id) || (stored ? stored.has(id) : byDefault);

  // One collapsible domain listing every concept in teaching order, with what the loop plans for it.
  const domainGroup = (id: string, domain: Domain, loop: number, byDefault: boolean) => {
    const loopDrills = drills.filter((drill) => drill.loop === loop && drill.concept.startsWith(`${domain.slug}.`));
    const total = LOOP_PLAN[loop] ? plannedDrillCount(domain, loop) : domain.concepts.length;
    const label = domain.elective ? `Elective · ${domain.name}` : `${domain.n}. ${domain.name}`;
    const details = group(
      id,
      'domain',
      `<span>${label}</span><span class="count">${loopDrills.length}/${total}</span>`,
      isOpen(id, byDefault),
    );
    domain.concepts.forEach((concept, index) => {
      const built = loopDrills.filter((drill) => drill.concept === `${domain.slug}.${concept.slug}`);
      if (built.length === 0) details.append(upcoming(`${index + 1}. ${concept.name}`, plannedModes(concept, loop)));
      for (const drill of built) details.append(pageLink(drill, index + 1, selected));
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

  const elective = DOMAINS.find((domain) => domain.elective);
  if (elective) {
    const electiveGroup = domainGroup(`elective/${elective.slug}`, elective, 1, false);
    electiveGroup.classList.add('elective');
    electiveGroup.querySelector('summary')!.after(note('Its own four-loop pass, after Loop 2, since it needs shader skills.'));
    container.append(electiveGroup);
  }

  // `toggle` doesn't bubble, so listen during the capture phase.
  container.addEventListener('toggle', () => saveOpenGroups(container), true);
}
