import type { Domain } from './domains';
import type { ElectiveItem } from './repo';

// Build schedules only for domains that explicitly opt in. Existing unscheduled study pages
// remain manually accessible. Unbuilt pages are never suggested.
export function scheduledElectives(domains: Domain[], built: ElectiveItem[]) {
  const directories = new Map(built.map(item => [item.id, item.dir]));
  return domains.filter(domain => domain.elective && domain.afterLoop !== undefined).flatMap(domain => {
    const plan = [
      ...domain.concepts.map(concept => ({id:`${domain.slug}.${concept.slug}.page`, kind:'page' as const, concepts:[`${domain.slug}.${concept.slug}`]})),
      ...(domain.effects ?? []).flatMap(effect => (['guided','from-memory'] as const).map(kind => ({
        id:`${domain.slug}.effects.${effect.slug}.${kind}`, kind, concepts:effect.concepts.map(slug=>`${domain.slug}.${slug}`),
      }))),
    ];
    return plan.flatMap((item, order) => {
      const dir = directories.get(item.id);
      return dir ? [{...item, elective:domain.slug, dir, order, afterLoop:domain.afterLoop!}] : [];
    });
  });
}

export function electivePrerequisitesMet(
  elective: string, concepts: string[], prerequisites: Map<string,string[]>,
  pagePassed: (id:string)=>boolean, literacyCovered:(id:string)=>boolean,
) {
  return concepts.every(concept => (prerequisites.get(concept) ?? []).every(id => {
    if (id.startsWith(`${elective}.`)) return pagePassed(`${id}.page`);
    // VFX retains its existing whole-Loop-2 entry rule. The visual product elective checks
    // its actual foundational pages rather than requiring unrelated domains or shader fluency.
    return elective === 'product' ? literacyCovered(id) : true;
  }));
}
