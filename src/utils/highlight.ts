import hljs from 'highlight.js/lib/common';

hljs.registerAliases(['vue', 'svelte'], { languageName: 'xml' });

const format = (code: string) => `<pre><code class="hljs">${code}</code></pre>`;

export async function getHighlightHtml(code: string, lang?: string | null) {
  if (!lang) {
    return format(hljs.highlightAuto(code).value);
  }

  if (!hljs.getLanguage(lang)) {
    console.warn(`\x1b[33m[Highlight.js] Couldn't find language: ${lang}\x1b[0m`);
    lang = 'plaintext';
  }

  return format(hljs.highlight(code, { language: lang }).value);
}
