import { mkdir, writeFile } from 'node:fs/promises';
import { Readable } from 'node:stream';

import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { DeviceRequestBodySchema, DeviceSchema } from '../model/device';
import { base } from '../util';

const route = new Hono();
// 분석용
route.get('/latest', async (c, next) => {

});

// 새로운 이벤트 기록
route.post('/', async (c) => {

});

// 음성 데이터 업로드
route.post('/upload', async (c) => {
  const body = await c.req.parseBody();
  const id = body['id'];
  const name = body['name'];
  const audioFile = body['file'];

  // if (!id || !name || !audioFile) {
  //   return c.text('Invalid request', 400);
  // }
  // if (typeof id !== 'string' || typeof name !== 'string') {
  //   return c.text('Invalid request', 400);
  // }
  console.log(id, name, audioFile);
  if (typeof audioFile !== 'object') {
    return c.text('Invalid request', 400);
  }

  const arrayBuffer = await (audioFile as File).arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await mkdir(base`/audio/${id}/`).catch(() => {});
  await writeFile(base`/audio/${id}/${name}.webm`, buffer);
  return c.text('');
});

// 모든 이벤트 리스트
route.get('/', async (c) => {

});

export {
  route as eventRoute
};
