import type { Plugin } from 'vite';

const r = String.raw;

export function ViteMdStyles(): Plugin {
  function newlineJoin(...lines: string[]) {
    return lines.join('\n');
  }

  function hasCodeSamples(id: string, code: string) {
    return (
      id.endsWith('.md') && code.includes(r`<pre><code class=\"hljs\">`)
    ) || (
      id.endsWith('.mdx') && code.includes(r`class: "hljs"`)
    );
  }

  return {
    name: 'local:md-styles',
    transform(code, id) {
      if (!/\.mdx?$/.test(id)) return;

      if (hasCodeSamples(id, code)) {
        code = newlineJoin(
          `import '/src/styles/highlight.scss';`,
          code
        );
      }

      return code;
    }
  }
}
