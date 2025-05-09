import { createStore } from 'solid-js/store';

import { Device } from '@/feature/model/device';

export const [devices, setDevices] = createStore({
  list: [
    {
      id: '1',
      type: 'mic',
      label: '첫번쨰 마이크',
      color: 'red',
    }
  ] as Device[],
});
