// Loads drills, placement checks, checkpoints, and concept cards from their markdown frontmatter.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

export const ROOT = path.resolve(import.meta.dirname, '../..');

export interface Drill {
  id: string;
  loop: number;
  tier: 'core' | 'light';
  concepts: string[];
  mode: string;
  context: string;
  lenses: string[];
  misconceptions: string[];
  domain: string;
  dir: string;
  body: string;
}

export interface Placement {
  id: string;
  loop: number;
  domain: string;
  parts: string[];
  dir: string;
}

export interface Checkpoint {
  id: string;
  loop: number;
  dir: string;
}

export interface Card {
  id: string;
  name: string;
  domain: string;
  tier: 'core' | 'light';
  prerequisites: string[];
  misconceptions: Record<string, string>;
  contexts: Record<string, string>;
  file: string;
}

interface Document {
  data: Record<string, unknown>;
  body: string;
  file: string;
}

// Folder READMEs without frontmatter are notes, not items, so they're skipped.
function readDocuments(topDir: string, fileName: (name: string) => boolean): Document[] {
  const start = path.join(ROOT, topDir);
  if (!existsSync(start)) return [];
  const entries = readdirSync(start, { recursive: true, withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && fileName(entry.name))
    .map((entry) => path.join(entry.parentPath, entry.name))
    .sort()
    .flatMap((file) => {
      const match = readFileSync(file, 'utf8').match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
      return match ? [{ data: parse(match[1]), body: match[2], file }] : [];
    });
}

// Always with forward slashes, even on Windows, so paths match the viewer's `?drill=` URLs and
// checks like `dir.includes('/1/')`.
const toPosix = (file: string) => file.split(path.sep).join('/');
const relativeDir = (file: string) => toPosix(path.relative(ROOT, path.dirname(file)));
const isReadme = (name: string) => name === 'README.md';

export function loadDrills(): Drill[] {
  return ['drills', 'cross'].flatMap((top) =>
    readDocuments(top, isReadme).map(({ data, body, file }) => {
      const drill = data as unknown as Drill;
      return { ...drill, domain: drill.id.split('.')[1], dir: relativeDir(file), body };
    }),
  );
}

export function loadPlacements(): Placement[] {
  return readDocuments('placement', isReadme).map(({ data, file }) => ({
    ...(data as unknown as Placement),
    dir: relativeDir(file),
  }));
}

export function loadCheckpoints(): Checkpoint[] {
  return readDocuments('checkpoints', isReadme).map(({ data, file }) => ({
    ...(data as unknown as Checkpoint),
    dir: relativeDir(file),
  }));
}

export function loadCards(): Card[] {
  return readDocuments('concepts', (name) => name.endsWith('.md')).map(({ data, file }) => ({
    ...(data as unknown as Card),
    file: toPosix(path.relative(ROOT, file)),
  }));
}
