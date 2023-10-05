import { z, defineCollection } from 'astro:content';

export const collections = {
  blog: defineCollection({
    schema: ({ image }) => z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      cover: z.object({
        img: image()
          .refine((img) => img.width >= 680, 'Cover must be at least 680px wide'),
        caption: z.string().optional(),
        alt: z.string().optional(),
      }).optional(),
      prerender: z.boolean().default(true),
      tags: z.array(z.string()).default([])
    })
  }),
};
