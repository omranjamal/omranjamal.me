import { z, defineCollection } from "astro:content";

const postsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    published: z.date(),
    edited: z.date(),
    tags: z.array(z.string()),
    image: z.string().optional(),
    unlisted: z.boolean().optional(),
    highlight: z.boolean().optional(),
    'short-description': z.string().optional(),
    'on-page-title-prefix': z.string().optional()
  }),
});

export const collections = {
  posts: postsCollection,
};
