import express from 'express';
import UserController from '../controllers/userController.js';

const router = express.Router();

const { getUsers, createUser } = UserController;

router.get('/', getUsers);
router.post('/', createUser);

export default router;
