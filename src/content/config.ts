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
      hidden: z.boolean().optional().default(false), // Add this line
    })
});

const modelsCollection = defineCollection({
    type: 'content',
    schema: z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.date(),
      image: z.object({
        url: z.string(),
        alt: z.string()
      }),
      modelType: z.string(),
      software: z.string(),
      sketchfabLink: z.string().optional(), // Changed from artStationLink to sketchfabLink
      hidden: z.boolean().optional().default(false),
    })
});

const videosCollection = defineCollection({
    type: 'content',
    schema: z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.date(),
      image: z.object({
        url: z.string(),
        alt: z.string()
      }),
      youtubeLink: z.string(),
      hidden: z.boolean().optional().default(false),
    })
});

const blogCollection = defineCollection({
    type: 'content',
    schema: z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.date(),
      image: z.object({
        url: z.string(),
        alt: z.string()
      }),
      hidden: z.boolean().optional().default(false),
    })
});

export const collections = {
  projects: projectsCollection,
  models: modelsCollection,
  videos: videosCollection,
  blog: blogCollection,  // Add this line
};
