import { createResource } from 'solid-js';

import { Shape, ShapeResponseSchema, SourcePoint } from '@/feature/model/shape';

export const createShape = () => createResource(async () => {
  const response = await fetch('/api/shape');
  const json = await response.json();

  return ShapeResponseSchema.parse(json);
});

export const createShapeMutation = () => {
  return {
    mutate: async (shapes: Shape[], sources: SourcePoint[]) => {
      await fetch('/api/shape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shapes, sources }),
      });
    }
  }
};