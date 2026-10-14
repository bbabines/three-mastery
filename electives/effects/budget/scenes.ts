import { buttonGroup, choiceButtons } from '@harness/lesson';
import { onLeave } from '@harness/teardown';
import type { TslSceneSetup } from '@harness/tsl';
import { effectsStage, formatCounts, type EffectsStage, type Timing } from '../stage';
import { budgetBench, describe, deviceRatio, EFFECT_NAMES, EFFECTS, PRESETS, type Preset, type Settings, type State } from './chain';

const PRESET_NAMES: Record<Exclude<Preset, 'everything'>, string> = {
  webgi: "WebGi's showcase",
  desktop: 'desktop configurator',
  phone: 'phone configurator',
};
const PRESET_KEYS = Object.keys(PRESET_NAMES) as (keyof typeof PRESET_NAMES)[];

// Frame-time targets. A phone's can only be checked on the phone.
const TARGETS = {
  'desktop, 60 fps': { ms: 16.7, phone: false },
  'desktop, 120 fps': { ms: 8.3, phone: false },
  'phone, 60 fps': { ms: 16.7, phone: true },
  'phone, 30 fps': { ms: 33.3, phone: true },
} as const;
type Target = keyof typeof TARGETS;

const STATE_NAMES: Record<State, string> = { moving: 'moving', still: 'still', averaging: 'still, averaging', settled: 'still, 32 in' };
const SHORT_NAMES: Record<State, string> = { moving: 'moving', still: 'still', averaging: 'averaging', settled: '32 in' };
type Timed = Partial<Record<State, Timing>>;

const same = (a: Settings, b: Settings) => (Object.keys(a) as (keyof Settings)[]).every((key) => a[key] === b[key]);
// Each state's cost: frames drawn back to back. Or, with `upper`, one at a time, which reads long.
const timedList = (timed: Timed, upper = false) =>
  (Object.keys(timed) as State[]).map((state) => `${SHORT_NAMES[state]} ${timed[state]![upper ? 'oneAtATime' : 'cost'].toFixed(2)}`).join(' · ');
const slowest = (timed: Timed) => Math.max(...Object.values(timed).map((timing) => timing.cost));

// A button that times the current settings: frames drawn back to back, then one at a time.
function timeButton(parent: HTMLElement, run: () => Promise<void>) {
  const button = document.createElement('button');
  button.textContent = 'time it';
  button.addEventListener('click', () => {
    if (button.disabled) return;
    button.disabled = true;
    run()
      .catch(() => undefined) // the page was left, or another scene was timing
      .finally(() => (button.disabled = false));
  });
  parent.append(button);
}

// A row of buttons that shows the current setting, so a preset can change every row at once.
type Row = () => void;
function settingRow<T>(parent: HTMLElement, label: string, options: [string, T][], get: () => T, set: (value: T) => void): Row {
  const group = buttonGroup(parent, label);
  const buttons = options.map(([text, value]) => {
    const button = document.createElement('button');
    button.textContent = text;
    button.addEventListener('click', () => set(value));
    group.append(button);
    return { button, value };
  });
  return () => {
    for (const { button, value } of buttons) button.setAttribute('aria-pressed', String(get() === value));
  };
}

// The watch with every effect, three presets, and a frame-time target.
export const budget: TslSceneSetup = (harness) => {
  effectsStage(harness, (stage) => {
    // Taller than the other benches: the controls take room.
    harness.container.style.height = '600px';
    const bench = budgetBench(stage);
    let target: Target = 'desktop, 60 fps';
    const timed = new Map<string, Timed>(); // by preset name, or 'your mix'
    const rows: Row[] = [];
    const refresh = () => rows.forEach((row) => row());
    const presetKey = () => PRESET_KEYS.find((name) => same(PRESETS[name], bench.settings())) ?? null;
    const presetName = () => {
      const key = presetKey();
      return key ? PRESET_NAMES[key] : 'your mix';
    };
    const change = (patch: Partial<Settings>) => {
      bench.apply({ ...bench.settings(), ...patch });
      timed.delete('your mix'); // a new mix needs timing again
      refresh();
    };

    rows.push(
      settingRow<keyof typeof PRESET_NAMES | null>(stage.ui, 'preset', PRESET_KEYS.map((name) => [PRESET_NAMES[name], name]), presetKey, (name) => {
        if (name) change(PRESETS[name]);
      }),
    );
    const targets = buttonGroup(stage.ui, 'target');
    choiceButtons(targets, (Object.keys(TARGETS) as Target[]).map((name) => ({ html: name, select: () => (target = name) })));
    const view = buttonGroup(stage.ui, 'view');
    choiceButtons(view, [
      { html: 'turning', select: () => bench.setMotion('turning') },
      { html: 'still', select: () => bench.setMotion('still') },
    ]);
    timeButton(view, async () => {
      const name = presetName();
      timed.set(name, await bench.time());
    });

    // Every setting, folded away until asked for, under the picture so it doesn't cover the watch.
    const all = document.createElement('div');
    all.className = 'controls';
    all.dataset.budgetSettings = '';
    all.style.cssText = 'display: none; position: static; margin: -8px 0 16px;';
    harness.container.after(all);
    onLeave(harness.container, () => all.remove());
    const toggle = document.createElement('button');
    toggle.textContent = 'every setting';
    toggle.setAttribute('aria-pressed', 'false');
    toggle.addEventListener('click', () => {
      const open = all.style.display === 'none';
      all.style.display = open ? 'flex' : 'none';
      toggle.setAttribute('aria-pressed', String(open));
    });
    view.append(toggle);
    const settings = bench.settings;
    rows.push(
      settingRow<Settings['moving']>(all, 'moving', [['none', 'none'], ['MSAA ×4', 'msaa'], ['TRAA', 'traa']], () => settings().moving, (moving) => change({ moving })),
      settingRow<Settings['still']>(all, 'still', [['as moving', 'same'], ['32 averaged', 'progressive']], () => settings().still, (still) => change({ still })),
    );
    for (const effect of EFFECTS) {
      rows.push(
        settingRow(all, EFFECT_NAMES[effect], [['off', 'off'], ['still', 'still'], ['always', 'always']], () => settings()[effect], (use) => change({ [effect]: use })),
      );
    }
    rows.push(
      settingRow(all, 'key shadow', [['on', true], ['off', false]], () => settings().keyShadow, (keyShadow) => change({ keyShadow })),
      settingRow(all, 'baked ground', [['on', true], ['off', false]], () => settings().bakedShadow, (bakedShadow) => change({ bakedShadow })),
      settingRow<Settings['floor']>(all, 'floor', [['matte', 'matte'], ['polished', 'polished']], () => settings().floor, (floor) => change({ floor })),
      settingRow<Settings['glass']>(all, 'glass', [['transmission', 'transmission'], ['none', 'none']], () => settings().glass, (glass) => change({ glass })),
      settingRow(all, 'brushed', [['on', true], ['off', false]], () => settings().brushed, (brushed) => change({ brushed })),
      settingRow(all, 'pixel ratio', [[`screen (${deviceRatio()})`, 0], ['1', 1], ['1.5', 1.5], ['2', 2]], () => settings().ratio, (ratio) => change({ ratio })),
    );
    change(PRESETS.desktop);

    stage.harness.onFrame(() => {
      if (bench.timing()) {
        stage.readout.textContent = `${describe(bench.settings()).join('\n')}\ntiming: drawing frames back to back, then one at a time…`;
        return;
      }
      const state = bench.state();
      const name = presetName();
      const mine = timed.get(name);
      const goal = TARGETS[target];
      let verdict = 'press time it to measure these settings';
      if (mine) {
        const worst = slowest(mine);
        verdict = goal.phone
          ? `that's this computer; a phone's ${goal.ms} ms can only be checked on the phone`
          : worst <= goal.ms
            ? `fits ${goal.ms} ms, ${(goal.ms - worst).toFixed(1)} to spare`
            : `over ${goal.ms} ms by ${(worst - goal.ms).toFixed(1)}`;
      }
      const others = [...timed].filter(([other]) => other !== name).map(([other, result]) => `${other}: ${timedList(result)}`);
      const progress = state === 'averaging' ? ` ${bench.averaged()} of 32` : '';
      const baking = bench.baking();
      stage.readout.textContent = [
        ...describe(bench.settings()),
        `${STATE_NAMES[state]}${progress}${baking ? ` (baking the ground, ${baking})` : ''}: ${formatCounts(stage.frame)}`,
        mine ? `timed, ms a frame: ${timedList(mine)}; ${verdict}` : verdict,
        mine ? `one at a time, which reads long: ${timedList(mine, true)}` : '',
        others.length ? `timed before: ${others.join(' · ')}` : '',
      ]
        .filter(Boolean)
        .join('\n');
    });
  });
};

// "Turn everything on and lower the resolution," next to a deliberate pick at full resolution.
type Pick = 'everything-low' | 'deliberate' | 'everything-full';
const PICKS: Record<Pick, { label: string; short: string; settings: Settings; code: string }> = {
  'everything-low': { label: 'everything on, pixel ratio 1', short: 'everything @ 1', settings: { ...PRESETS.everything, ratio: 1 }, code: 'every effect; renderer.setPixelRatio(1)' },
  deliberate: { label: 'desktop configurator, pixel ratio 2', short: 'configurator @ 2', settings: { ...PRESETS.desktop, ratio: 2 }, code: 'TRAA, AO, baked ground, 32 averaged; renderer.setPixelRatio(2)' },
  'everything-full': { label: 'everything on, pixel ratio 2', short: 'everything @ 2', settings: { ...PRESETS.everything, ratio: 2 }, code: 'every effect; renderer.setPixelRatio(2)' },
};

export const everything: TslSceneSetup = (harness) => {
  effectsStage(harness, (stage: EffectsStage) => {
    const bench = budgetBench(stage);
    let pick: Pick = 'everything-low';
    const timed = new Map<Pick, Timed>();
    const picks = buttonGroup(stage.ui, '');
    choiceButtons(
      picks,
      (Object.keys(PICKS) as Pick[]).map((name) => ({ html: PICKS[name].label, select: () => bench.apply(PICKS[(pick = name)].settings) })),
    );
    const zoom = buttonGroup(stage.ui, 'view');
    choiceButtons(zoom, [
      { html: 'crown, 4× closer', select: () => bench.setZoom(4) },
      { html: 'whole picture', select: () => bench.setZoom(1) },
    ]);
    const motion = buttonGroup(stage.ui, '');
    choiceButtons(motion, [
      { html: 'still', select: () => bench.setMotion('still') },
      { html: 'turning', select: () => bench.setMotion('turning') },
    ]);
    timeButton(motion, async () => {
      const name = pick;
      timed.set(name, await bench.time());
    });
    stage.harness.onFrame(() => {
      if (bench.timing()) {
        stage.readout.textContent = `${PICKS[pick].code}\ntiming: drawing frames back to back, then one at a time…`;
        return;
      }
      const state = bench.state();
      const baking = bench.baking();
      const list = [...timed].map(([name, result]) => `${PICKS[name].short}: ${timedList(result)}`);
      stage.readout.textContent = [
        PICKS[pick].code,
        `${STATE_NAMES[state]}${baking ? ` (baking the ground, ${baking})` : ''}: ${formatCounts(stage.frame)}`,
        list.length ? `timed, ms a frame:\n  ${list.join('\n  ')}` : 'press time it to measure',
      ].join('\n');
    });
  });
};
