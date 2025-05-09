import { Hono } from 'hono';
import { serve } from '@hono/node-server';

import { shapeRoute } from './route/shape';
import { deviceRoute } from './route/device';
import { eventRoute } from './route/event';

export const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

const api = new Hono();
api.route('/shape', shapeRoute);
api.route('/device', deviceRoute);
api.route('/event', eventRoute);
app.route('/api', api);

serve({
  fetch: app.fetch,
  port: 8080,
});

console.log('Server is running on http://localhost:8080');
