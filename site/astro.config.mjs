import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// Strip [stage.*] commands from rendered HTML — they're only for the Stagehand runtime
function remarkStripStageCommands() {
  return (tree) => {
    // Pass 1: strip [stage.*] from all text nodes recursively
    function cleanText(node) {
      if (node.type === 'text') {
        node.value = node.value.replace(/\[stage\.[^\]]*\]/g, '');
      }
      if (node.children) node.children.forEach(cleanText);
    }
    cleanText(tree);

    // Pass 2: remove paragraphs that are now empty after stripping
    function removeEmpty(node) {
      if (!node.children) return;
      node.children = node.children.filter(child => {
        if (child.type === 'paragraph') {
          const text = (child.children ?? []).map(n => n.value ?? '').join('').trim();
          return text !== '';
        }
        return true;
      });
      node.children.forEach(removeEmpty);
    }
    removeEmpty(tree);
  };
}

export default defineConfig({
  site: 'https://mnehmos.github.io',
  base: '/vibe-coders-bible',
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
    sitemap(),
  ],
  markdown: {
    remarkPlugins: [remarkStripStageCommands],
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
