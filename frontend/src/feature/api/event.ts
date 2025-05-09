import { createResource } from 'solid-js';

import { DeviceSchema } from '@/feature/model/device';

export const createDeviceResource = () => createResource(async () => {
  const response = await fetch('/api/device');
  const json = await response.json();

  return DeviceSchema.array().parse(json);
});

export const createRecordMutation = () => {
  return {
    mutate: async (id: string, timestamp: Date, blob: Blob) => {
      const body = new FormData();
      body.append('id', id);
      body.append('name', timestamp.toISOString());
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