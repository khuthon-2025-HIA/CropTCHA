import { Hono } from 'hono';
import { serve } from '@hono/node-server'
import { shapeRoute } from './route/shape';

export const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

const api = new Hono();
api.route('/shape', shapeRoute);
app.route('/api', api);

serve({
  fetch: app.fetch,
  port: 8080,
});

console.log('Server is running on http://localhost:8080');
