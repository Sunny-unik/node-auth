import express from 'express';
import UserController from '../controllers/userController.js';
import UserValidation from '../validations/index.js';
import responseResolver from '../utils/responseResolver.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  await responseResolver(UserController.getUsers, [req.query.query], res);
});

router.get('/:id', async ({ params, query }, res) => {
  await responseResolver(UserController.getUser, [query.query, params.id], res);
});

router.post('/verify', async ({ body }, res) => {
  await responseResolver(UserController.verifyUser, [body.otp, body.id], res);
});

router.post('/', UserValidation, async (req, res) => {
  await responseResolver(UserController.verifyMailAddress, [req.body], res);
});

router.post('/delete', auth, async (req, res) => {
  await responseResolver(UserController.deleteUser, [req.body.userId], res);
});

router.post('/login', UserController.loginUser);

export default router;
