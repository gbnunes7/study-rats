import { userController } from '../controller/user-controller';
import { Router } from 'express';

const router = Router();

const { deleteUserById, getUserById, getUsers, updateUser } = userController;

router.get('/users', getUsers);
router.get('/users/:userId', getUserById);
router.put('/users/:userId', updateUser);
router.delete('/users/:userId', deleteUserById);

export default router;
