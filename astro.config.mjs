import { defineConfig } from 'astro/config';
import vercel from "@astrojs/vercel/serverless";
import vue from "@astrojs/vue";
import svelte from "@astrojs/svelte";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import { ViteMdStyles } from './plugins/vite/md-styles';
import { RemarkHighlight } from './plugins/remark/highlight';


// https://astro.build/config
export default defineConfig({
  output: 'hybrid',
  adapter: vercel(),
  integrations: [vue(), svelte(), react(), tailwind({ applyBaseStyles: false }), mdx()],
  markdown: {
    syntaxHighlight: false,
    remarkPlugins: [RemarkHighlight]
  },
  vite: {
    plugins: [ViteMdStyles]
  }
});
