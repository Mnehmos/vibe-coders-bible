import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

export const collections = {
  chapters: defineCollection({
    loader: glob({
      pattern: '*.md',
      base: '../manuscript/chapters',
    }),
  }),
};
