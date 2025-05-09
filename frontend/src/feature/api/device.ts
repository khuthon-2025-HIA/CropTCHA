import { createResource } from 'solid-js';

import { Device, DeviceSchema } from '@/feature/model/device';

export const createDeviceResource = () => createResource(async () => {
  const response = await fetch('/api/device');
  const json = await response.json();

  return DeviceSchema.array().parse(json);
});

export const createDeviceMutation = () => {
  return {
    mutate: async (device: Device) => {
      await fetch('/api/shape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(device),
      });
    }
  };
};