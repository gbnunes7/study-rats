import { Router } from 'express';
import { authController } from '../controller/auth-controller';

const router = Router();

const { createSession, createUser, updateUser } = authController;

router.post('/register', createUser);
router.post('/login', createSession);
router.patch('/users/:userId', updateUser);

export default router;
