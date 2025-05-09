import { z, ZodSchema } from 'zod';

export const external = <Schema extends ZodSchema>(
  key: string,
  schema: Schema,
  external: Storage = localStorage,
) => {
  const get = (): z.infer<typeof schema> | null => {
    try {
      const rawData = external.getItem(key);
      const json = JSON.parse(rawData ?? '');

      return schema.parse(json);
    } catch {
    }

    return null;
  };
  const set = (data: z.infer<typeof schema>) => {
    external.setItem(key, JSON.stringify(data));
  };

  return {
    get,
    set,
  };
};
