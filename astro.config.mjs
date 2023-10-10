import { defineConfig } from 'astro/config';
import vercel from "@astrojs/vercel/serverless";
import vue from "@astrojs/vue";
import svelte from "@astrojs/svelte";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";

import { ViteMdStyles } from './plugins/vite/md-styles';
import { ViteGit } from './plugins/vite/git';
import { RemarkHighlight } from './plugins/remark/highlight';
import { RehypeLinks } from './plugins/rehype/links';


export default defineConfig({
  output: 'hybrid',
  adapter: vercel(),
  integrations: [vue(), svelte(), react(), tailwind({ applyBaseStyles: false }), mdx()],
  markdown: {
    syntaxHighlight: false,
    remarkPlugins: [RemarkHighlight],
    rehypePlugins: [RehypeLinks],
  },
  vite: {
    plugins: [ViteMdStyles(), ViteGit()],
  }
});
