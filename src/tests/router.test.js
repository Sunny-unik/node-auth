import app, { appInstance } from '../index';
import request from 'supertest';

describe('GET /user', function () {
  let userId;
  afterAll(() => appInstance.close());

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
    userId = response.body.id;
    expect(response.status).toEqual(200);
  });

  it('user update as verified failed because of invalid OTP', async function () {
    const response = await request(app)
      .post('/user/verify')
      .send({
        id: userId,
        otp: 565656,
      })
      .set('Accept', 'application/json');
    expect(response.status).toEqual(500);
  });
});
