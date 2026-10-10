import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const work = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    tier: z.number(),
    domain: z.string(),
    status: z.string(),
    strongestEvidence: z.string(),
    ownershipStatement: z.string(),
    observableBehavior: z.string(),
    stack: z.array(z.string()),
    repoUrl: z.string().optional(),
    demoUrl: z.string().optional(),
    isSimulationOnly: z.boolean().default(false),
    date: z.string(),
  }),
});

export const collections = { work };
