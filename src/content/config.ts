import { z, defineCollection } from "astro:content";

const postsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    published: z.date().optional(),
    edited: z.date().optional(),
    tags: z.array(z.string()).optional(),
    unlisted: z.boolean().optional(),
    "short-description": z.string().optional(),
    "on-page-title-prefix": z.string().optional(),
    contents: z
      .union([
        z.boolean(),
        z.object({
          enabled: z.boolean().optional(),
          open: z.boolean().optional(),
        }),
      ])
      .optional(),
  }),
});

export const collections = {
  posts: postsCollection,
};
