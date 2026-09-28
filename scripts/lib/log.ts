// The practice log: one JSON object per line in progress/log.jsonl.
import { appendFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { ROOT } from './repo';

const LOG_FILE = path.join(ROOT, 'progress', 'log.jsonl');

export interface StartEntry {
  type: 'start';
  id: string;
  at: string;
}

export interface DoneEntry {
  type: 'done';
  id: string;
  at: string;
  passed: boolean;
  // Read-the-code pages: how many questions were right. For reference only; nothing is gated on it.
  score?: { right: number; total: number };
  // Placement checks and checkpoints: the parts (concepts or domains) that failed.
  failedParts?: string[];
}

export type LogEntry = StartEntry | DoneEntry;

export function readLog(): LogEntry[] {
  if (!existsSync(LOG_FILE)) return [];
  return readFileSync(LOG_FILE, 'utf8')
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line) => JSON.parse(line) as LogEntry);
}

export function appendLog(entry: LogEntry) {
  mkdirSync(path.dirname(LOG_FILE), { recursive: true });
  appendFileSync(LOG_FILE, `${JSON.stringify(entry)}\n`);
}
