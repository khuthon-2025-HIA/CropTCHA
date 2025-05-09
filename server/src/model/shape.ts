import { z } from 'zod';

const PointSchema = z.tuple([z.number(), z.number()]);
export const ShapeRequestBodySchema = z.object({
  shapes: PointSchema.array().array(),
  sources: z.object({
    point: PointSchema,
    source: z.object({
      id: z.string(),
      type: z.string(),
      label: z.string().optional(),
    }),
  }).array(),
});
