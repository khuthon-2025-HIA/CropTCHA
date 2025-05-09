import { z } from 'zod';

export type Device = z.infer<typeof DeviceSchema>;
export const DeviceSchema = z.object({
  id: z.string(),
  type: z.string(),
  label: z.string().optional(),
  color: z.string().optional(),
});

export const DeviceRequestBodySchema = z.object({
  id: z.string(),
  label: z.string().optional(),
  color: z.string().optional(),
});
