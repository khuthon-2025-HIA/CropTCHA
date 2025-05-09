import { z } from 'zod';

const PointSchema = z.tuple([z.number(), z.number()]);

export type Shape = z.infer<typeof ShapeSchema>;
export const ShapeSchema = PointSchema.array();

export type SourcePoint = z.infer<typeof SourcePointSchema>;
export const SourcePointSchema = z.object({
  point: PointSchema,
  source: z.object({
    id: z.string(),
    type: z.string(),
    label: z.string().optional(),
  }),
});

export const ShapeResponseSchema = z.object({
  shapes: ShapeSchema.array(),
  sources: SourcePointSchema.array(),
});
