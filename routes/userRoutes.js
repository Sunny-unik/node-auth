import express from 'express';
import UserController from '../controllers/userController.js';
import UserValidation from '../validations/index.js';

const router = express.Router();

const { getUsers, createUser } = UserController;

router.get('/', getUsers);
router.post('/', UserValidation, createUser);

export default router;
