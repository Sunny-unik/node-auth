import app, { appInstance } from '../../src/index';
import request from 'supertest';
import { signupData } from '../../src/utils/data/testData';

describe('GET /user', function () {
  const agent = request.agent(app);
  let userId, userOtp;
  afterAll(() => appInstance.close());

  it('users data with total users count', async function () {
    const response = await agent.get('/user');
    expect(response.status).toEqual(200);
    expect(typeof response.body.data).toEqual('object');
    expect(typeof response.body.total).toEqual('number');
    console.log('GET /user/ success');
  });

  it('user save & sent email for verify mail address', async function () {
    const response = await agent
      .post('/user')
      .send(signupData)
      .set('Accept', 'application/json');
    userId = response.body.id;
    expect(response.status).toEqual(200);
    expect(typeof response.body.id).toEqual('string');
    expect(response.body.message).toEqual(
      'Otp sent to your mail address, please check.'
    );
    console.log('POST /user/ success');
  });

  it('user data with otp', async function () {
    const response = await agent.get(
      `/user/${userId}/?query=_id%20name%20otp%20`
    );
    expect(response.status).toEqual(200);
    userOtp = response.body.data?.otp;
    expect(typeof userOtp).toEqual('number');
    console.log('GET /user/:id success');
  });

  it('user update as verified failed because of invalid OTP', async function () {
    const response = await agent
      .post('/user/verify')
      .send({ id: userId, otp: 565656 })
      .set('Accept', 'application/json');
    expect(response.status).toEqual(500);
    expect(response.body.message).toEqual('Invalid OTP');
    console.log('POST /user/verify success 500');
  });

  it('user update as verified successfully', async function () {
    const response = await agent
      .post('/user/verify')
      .send({ id: userId, otp: userOtp })
      .set('Accept', 'application/json');
    expect(response.status).toEqual(200);
    expect(typeof response.body.data).toEqual('object');
    console.log('POST /user/verify success');
  });

  it('user login success', async function () {
    const response = await agent
      .post('/user/login')
      .send(signupData)
      .set('Accept', 'application/json');
    const data = response.body?.data || {};
    expect(response.status).toEqual(200);
    expect(data.password).toEqual(undefined);
    expect(data.name).toEqual('john');
    console.log('POST /user/login success');
  });

  it('user logout', async function () {
    const response = await agent.get('/user/logout');
    expect(response.status).toEqual(200);
    expect(response.body.message).toEqual('Logout Successful');
    console.log('GET /user/logout success');
  });

  it('user login then delete success', async function () {
    await agent
      .post('/user/login')
      .send(signupData)
      .set('Accept', 'application/json');
    const response = await agent.post('/user/delete');
    expect(response.status).toEqual(200);
    expect(response.body.message).toEqual('User Deleted');
    console.log('POST /user/delete success');
  });
});
