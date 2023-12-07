import express from 'express';
import UserController from '../controllers/userController.js';
import UserValidation from '../validations/index.js';

const router = express.Router();

const { getUsers, verifyMailAddress, verifyUser, loginUser } = UserController;

router.get('/', async (req, res) => {
  await responseResolver(getUsers, [req.body.query], res);
});

router.post('/verify', async (req, res) => {
  await responseResolver(verifyUser, [req.body.otp, req.body.id], res);
});

router.post('/', UserValidation, async (req, res) => {
  await responseResolver(verifyMailAddress, [req.body], res);
});

router.post('/login', loginUser);

export default router;

const responseResolver = async (controller, parameters, res) => {
  const result = await controller(...parameters);
  const error = result.error;
  res
    .status(error ? 500 : 200)
    .send(error ? { message: 'Internal Server Error' } : result);
};
