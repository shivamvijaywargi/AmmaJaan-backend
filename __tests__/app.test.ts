import request from 'supertest';

import app from '../src/app';

describe('Test app.ts', () => {
  test('API Ping', async () => {
    const res = await request(app).get('/api/ping');
    expect(res.body).toEqual({ success: true, status: 'UP', message: 'PONG' });
  });
});
