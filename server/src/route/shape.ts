import { writeFile, readFile } from 'node:fs/promises';

import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';

import { ShapeRequestBodySchema } from '../model/shape';
import { base } from '../util';

const route = new Hono();
route.post('/', async (c, next) => {
  const body = await c.req.json().catch((err) => new HTTPException(400, { message: 'Invalid body', cause: err }));
  if (body instanceof HTTPException) throw body;

  const json = await ShapeRequestBodySchema.parseAsync(body).catch((err) => new HTTPException(400, {
    message: 'Invalid JSON body',
    cause: err
  }));
  if (json instanceof HTTPException) throw json;

  await writeFile(base`config.json`, JSON.stringify(json, null, 2));
  c.status(200);
  return c.text('');
});

route.get('/', async (c) => {
  const raw = await readFile(base`config.json`, 'utf-8').catch((err) => '{ "shapes": [], "sources": [] }');

  const json = JSON.parse(raw);
  const body = await ShapeRequestBodySchema.parseAsync(json).catch((err) => new HTTPException(400, {
    message: 'Invalid JSON body',
    cause: err
  }));
  if (body instanceof HTTPException) throw body;

  return c.json(body);
});

export {
  route as shapeRoute
};
