import express from 'express';
import UserController from '../controllers/userController.js';
import UserValidation from '../validations/index.js';

const router = express.Router();

const { getUsers, verifyMailAddress, createUser } = UserController;

router.get('/', getUsers);
router.post('/verify', UserValidation, verifyMailAddress);
router.post('/', UserValidation, createUser);

export default router;
