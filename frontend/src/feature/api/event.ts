import { createResource } from 'solid-js';

import { SoundEventSchema } from '@/feature/model/event';

export const createEventResource = () => createResource(async () => {
  const response = await fetch('/api/event');
  const json = await response.json();

  return SoundEventSchema.array().parse(json);
});

export const createRecordMutation = () => {
  return {
    mutate: async (id: string, timestamp: Date, blob: Blob) => {
      const body = new FormData();
      body.append('id', id);
      body.append('name', `${timestamp.getTime()}`);
      body.append('file', blob);

      await fetch('/api/event/upload', {
        method: 'POST',
        // headers: {
        //   'Content-Type': 'multipart/form-data',
        // },
        body,
      });
    }
  };
};