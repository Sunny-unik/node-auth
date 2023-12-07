import app from '../index';
import request from 'supertest';

describe('GET /user', function () {
  it('responds with json', async function () {
    const response = await request(app).get('/user');
    expect(response.status).toEqual(200);
    expect(typeof response.body.data).toBe('object');
    expect(typeof response.body.total).toBe('number');
  });
});
