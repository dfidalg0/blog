import { spawn } from 'node:child_process';
import { once } from 'node:events';

function * processOutput(out: string): Generator<[string, Date]> {
  for (const entry of out.split('\n\n')) {
    const [datestring, ...files] = entry.split('\n') as [string, ...string[]];
    const date = new Date(datestring);

    for (const file of files)
      yield [file, date];
  }
}

export interface GetCreationTimesOptions {
  from?: string;
  to?: string;
}

export async function getCreationTimes(
  files: string[] | Set<string>,
  options?: GetCreationTimesOptions
) {
  options ??= {};

  files = new Set(files);

  const args = [
    'log',
    '--diff-filter=A',
    '--pretty=format:%aI',
    '--name-only',
  ];

  if (options.from || options.to) {
    args.push(
      `${options.from ?? ''}..${options.to ?? ''}`
    );
  }

  args.push(
    '--',
    ...files
  );

  const proc = spawn('git', args, { stdio: ['pipe', 'pipe', 'inherit'] });

  const untilExit = once(proc, 'exit') as Promise<[number]>;

  const chunks: Buffer[] = [];

  for await (const chunk of proc.stdout) {
    chunks.push(chunk);
  }

  const [code] = await untilExit;

  if (code) {
    throw new Error(`Process exited with code ${code}`);
  }

  const output = Buffer.concat(chunks).toString('utf-8').trim();

  return Object.fromEntries(processOutput(output));
};
