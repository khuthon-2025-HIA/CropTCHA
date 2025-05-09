import { Device } from './device';

export type SoundEvent = {
  timestamp: Date;
  source: Device;
  data: {
    insect: string;
    value: number;
    others: {
      insect: string;
      value: number;
    }[];
  };
};
