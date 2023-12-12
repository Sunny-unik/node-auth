import app, { appInstance } from '../index';
import request from 'supertest';

describe('GET /user', function () {
  let userId, userOtp;
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
    expect(typeof response.body.id).toEqual('string');
    expect(response.body.message).toEqual(
      'Otp sent to your mail address, please check.'
    );
  });

  it('user data with otp', async function () {
    const response = await request(app).get(
      `/user/${userId}/?query=_id%20name%20otp%20`
    );
    expect(response.status).toEqual(200);
    userOtp = response.body.data?.otp;
    expect(typeof userOtp).toBe('number');
  });

  it('user update as verified failed because of invalid OTP', async function () {
    const response = await request(app)
      .post('/user/verify')
      .send({ id: userId, otp: 565656 })
      .set('Accept', 'application/json');
    expect(response.status).toEqual(500);
    expect(response.body.message).toEqual('Invalid OTP');
  });

  it('user update as verified successfully', async function () {
    const response = await request(app)
      .post('/user/verify')
      .send({ id: userId, otp: userOtp })
      .set('Accept', 'application/json');
    expect(response.status).toEqual(200);
    expect(typeof response.body.data).toEqual('object');
  });
});
