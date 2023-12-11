import app from '../index';
import request from 'supertest';

describe('GET /user', function () {
  it('users data with total users count', async function () {
    const response = await request(app).get('/user');
    expect(response.status).toEqual(200);
    expect(typeof response.body.data).toBe('object');
    expect(typeof response.body.total).toBe('number');
  });

  it('user save & sent email for verify mail address', async function () {
    const response = await request(app)
      .post('/user')
      .send({
        name: 'john',
        email: 'username@provider.domain',
        password: '#1Password',
      })
      .set('Accept', 'application/json');
    expect(response.status).toEqual(200);
  });
});
