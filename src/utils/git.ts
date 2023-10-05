import { spawn } from 'node:child_process';
import { once } from 'node:events';

const creationTimes = new Map<string, Date>();

type TimeEntry = [string, Date];

function* processOutput(out: string): Generator<[string, Date]> {
  for (const entry of out.split('\n\n')) {
    const [datestring, ...files] = entry.split('\n') as [string, ...string[]];
    const date = new Date(datestring);

    for (const file of files)
      yield [file, date];
  }
}

async function appendNewEtries(entries: TimeEntry[], files: Set<string>) {
  const proc = spawn(
    'git',
    [
      'log',
      '--diff-filter=A',
      '--pretty=format:%aI',
      '--name-only',
      '--',
      ...files,
    ],
    {
      stdio: ['pipe', 'pipe', 'inherit'],
    }
  );

  const chunks: Buffer[] = [];

  for await (const chunk of proc.stdout) {
    chunks.push(chunk);
  }

  if (proc.exitCode === null) {
    await once(proc, 'exit');
  }

  if (proc.exitCode) {
    throw new Error(`Process exited with code ${proc.exitCode}`);
  }

  const output = Buffer.concat(chunks).toString('utf-8').trim();

  entries.push(...processOutput(output));
};

export async function getCreationTimes(files: string[]) {
  const entries: TimeEntry[] = [];

  const filesSet = new Set(files);

  for (const file of filesSet) {
    const date = creationTimes.get(file);

    if (!date) continue;

    entries.push([file, date]);
    filesSet.delete(file);
  }

  if (filesSet.size) {
    await appendNewEtries(entries, filesSet);
  }

  return Object.fromEntries(entries);
}
