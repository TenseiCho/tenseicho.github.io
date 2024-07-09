import { z, defineCollection } from "astro:content";

const projectsCollection = defineCollection({
    type: 'content',
    schema: z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.date(), // Add this line
      image: z.object({
        url: z.string(),
        alt: z.string()
      }),
      worksImage1: z.object({
        url: z.string(),
        alt: z.string()
      }),
      worksImage2: z.object({
        url: z.string(),
        alt: z.string()
      }),
      platform: z.string(),
      stack: z.string(),
      github: z.string(),
    })
});

export const collections = {
  projects: projectsCollection,
};