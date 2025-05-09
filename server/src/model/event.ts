import { z } from 'zod';
import { DeviceSchema } from './device';

export type SoundEvent = z.infer<typeof SoundEventSchema>;
export const SoundEventSchema = z.object({
  timestamp: z.date(),
  source: DeviceSchema,
  data: z.object({
    type: z.string(),
    value: z.number(),
  }).array(),
});
