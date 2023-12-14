import express from 'express';
import UserController from '../controllers/userController.js';
import UserValidation from '../validations/index.js';

const router = express.Router();

const {
  getUsers,
  getUser,
  verifyMailAddress,
  verifyUser,
  loginUser,
  deleteUser,
} = UserController;

router.get('/', async (req, res) => {
  await responseResolver(getUsers, [req.query.query], res);
});

router.get('/:id', async (req, res) => {
  await responseResolver(getUser, [req.query.query, req.params.id], res);
});

router.post('/verify', async (req, res) => {
  await responseResolver(verifyUser, [req.body.otp, req.body.id], res);
});

router.post('/', UserValidation, async (req, res) => {
  await responseResolver(verifyMailAddress, [req.body], res);
});

router.post('/delete', async (req, res) => {
  await responseResolver(deleteUser, [req.body.userId], res);
});

router.post('/login', loginUser);

export default router;

const responseResolver = async (controller, parameters, res) => {
  const result = await controller(...parameters);
  const error = result.error;
  if (!error) return res.status(200).send(result);
  console.log(error);
  res
    .status(error.customStatusCode || 500)
    .send({ message: error.customMessage || 'Internal Server Error' });
};
