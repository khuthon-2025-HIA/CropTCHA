import { Hono } from 'hono';

const route = new Hono();
route.post('/', async (c, next) => {
  const body = await c.req.formData()
  body.get('audio');

  // TODO: handle file upload



  c.status(200);
  return c.json({

  });
});
