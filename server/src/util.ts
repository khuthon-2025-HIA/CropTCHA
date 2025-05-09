import { join } from 'node:path';
import * as process from 'node:process';

export const base = (params: TemplateStringsArray) => {
  return join(process.cwd(), '/data/', params.join('').trim());
};
