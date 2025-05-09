import { createStore } from 'solid-js/store';

import { SoundEvent } from '@/feature/model/event';

// TODO: remove dummy
import { devices } from '@/feature/store/device';

export const [events, setEvents] = createStore({
  list: [
    {
      timestamp: new Date(),
      source: devices.list[0],
      data: {
        insect: '벌레1',
        value: 0.5,
        others: [
          {
            insect: '벌레2',
            value: 0.3,
          },
          {
            insect: '벌레3',
            value: 0.2,
          },
        ],
      }
    },
  ] as SoundEvent[],
});
