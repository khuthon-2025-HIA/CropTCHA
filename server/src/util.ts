import { join } from 'node:path';
import * as process from 'node:process';

export const base = (str: TemplateStringsArray, ...args: unknown[]) => {
  const result = str.reduce(
    (prev, curr, i) => prev + curr + (args[i] ?? ''),
    '',
  );

  return join(process.cwd(), '/data/', result.trim());
};
