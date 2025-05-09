import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { DeviceRequestBodySchema, DeviceSchema } from '../model/device';
import { base } from '../util';
import { readFile, writeFile } from 'node:fs/promises';

const route = new Hono();
route.post('/', async (c, next) => {
  const body = await c.req.json().catch((err) => new HTTPException(400, { message: 'Invalid body', cause: err }));
  if (body instanceof HTTPException) throw body;

  const json = await DeviceRequestBodySchema.parseAsync(body).catch((err) => new HTTPException(400, {
    message: 'Invalid JSON body',
    cause: err
  }));
  if (json instanceof HTTPException) throw json;

  const newDevice = {
    ...json,
    type: 'mic',
  };

  const raw = await readFile(base`device.json`, 'utf-8').catch((err) => '[]');
  const devices = DeviceSchema.array().parse(JSON.parse(raw));
  const index = devices.findIndex((device) => device.id === json.id);

  const newDevices = [...devices];
  if (index !== -1) {
    newDevices[index] = newDevice;
  } else {
    newDevices.push(newDevice);
  }

  await writeFile(base`device.json`, JSON.stringify(newDevices, null, 2));
  c.status(200);
  return c.text('');
});

route.get('/', async (c) => {
  const raw = await readFile(base`device.json`, 'utf-8').catch(() => '[]');
  const json = JSON.parse(raw);
  const body = await DeviceSchema.array().parseAsync(json).catch((err) => new HTTPException(400, {
    message: 'Invalid JSON body',
    cause: err
  }));
  if (body instanceof HTTPException) throw body;

  return c.json(body);
});

export {
  route as deviceRoute
};
