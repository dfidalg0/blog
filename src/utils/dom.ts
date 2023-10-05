export const LOG_LEVELS = ['error', 'warn', 'log'] as const;

export type LogLevel = typeof LOG_LEVELS[number];

export type DomLogger = Record<LogLevel, (msg: string) => void>;

export function createDomLogger(root: Element | string) {
  const rootElement = root instanceof Element
    ? root
    : document.querySelector(root)!;

  if (!rootElement) {
    throw new Error('Logger element not found');
  }

  function createLogEntry(level: LogLevel, msg: string) {
    const entry = document.createElement('div');
    entry.classList.add('entry', level);
    entry.textContent = msg;

    rootElement.append(entry);
    rootElement.scrollTop = rootElement.scrollHeight;
  }

  return LOG_LEVELS.reduce((acc, level) => {
    acc[level] = (msg) => createLogEntry(level, msg);
    return acc;
  }, {} as DomLogger);
}
