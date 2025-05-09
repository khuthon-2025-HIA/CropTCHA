import { z } from 'zod';

export type SoundEvent = z.infer<typeof SoundEventSchema>;
export const SoundEventSchema = z.object({
  timestamp: z.string(),
  sourceId: z.string(),
  data: z.object({
    type: z.string(),
    value: z.number(),
  }).array(),
});
