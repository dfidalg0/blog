import { type Plugin } from 'vite';
import { getCreationTimes } from './creationTime';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { watch } from 'chokidar';
import { performance } from 'node:perf_hooks';

export function ViteGit(): Plugin {
  const MODULE_NAME = 'virtual:creation-times';
  const MODULE_NAME_PREFIXED = `\0${MODULE_NAME}`;

  const GIT_PATH = fileURLToPath(new URL('../../../.git', import.meta.url));

  return {
    name: 'local:git',
    async resolveId(id) {
      if (id !== MODULE_NAME) return;

      return MODULE_NAME_PREFIXED;
    },
    async configureServer(server) {
      const gitWatcher = watch([
        path.resolve(GIT_PATH, 'refs/heads/**'),
        path.resolve(GIT_PATH, 'HEAD'),
      ], { ignoreInitial: true });

      gitWatcher.on('all', async () => {
        const mod = server.moduleGraph.getModuleById(MODULE_NAME_PREFIXED);

        if (!mod) return;

        server.reloadModule(mod);
      });
    },
    async load(id) {
      if (id !== MODULE_NAME_PREFIXED) return;

      const t = performance.now();

      const creationTimes = await getCreationTimes(['src/content/blog']);

      console.log(`Updated creation times in ${performance.now() - t}ms`);

      const obj = Object.entries(creationTimes).map(
        ([file, date]) =>
          `${JSON.stringify(file)}: new Date(${JSON.stringify(date)})`
      ).join(',');

      return `export const creationTimes = { ${obj} };`;
    },
  };
}
