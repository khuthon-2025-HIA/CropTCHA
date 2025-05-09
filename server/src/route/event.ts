import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { Hono } from 'hono';
import { base } from '../util';
import { SoundEventSchema } from '../model/event';

const route = new Hono();
// 분석용
route.get('/latest', async (c) => {
  const list = await readdir(base`/audio/`).catch(() => [] as string[]);
  const list2 = await readdir(base`/audio/${list[0]}`).catch(() => [] as string[]);

  const latest = list2.filter((it) => !it.startsWith('.')).sort((a, b) => Number(b) - Number(a))[0];

  console.log(list, list2)
  return c.json({
    id: list[0],
    name: latest,
  });
});

// 새로운 이벤트 기록
route.post('/', async (c) => {
  const json = SoundEventSchema.parse(await c.req.json());

  const raw = await readFile(base`event.json`, 'utf-8').catch(() => '[]');
  const events = SoundEventSchema.array().parse(JSON.parse(raw));

  const newEvents = [...events];
  newEvents.push(json);

  await writeFile(base`event.json`, JSON.stringify(newEvents, null, 2));
  c.status(201);
  return c.text('');
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
  const raw = await readFile(base`event.json`, 'utf-8').catch(() => '[]');
  const events = SoundEventSchema.array().parse(JSON.parse(raw));

  return c.json(events);
});

export {
  route as eventRoute
};
