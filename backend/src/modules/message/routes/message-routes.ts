import { Router } from 'express';
import { messageController } from '../controller/message-controller';

const { createMessage, getMessagesByGroupId } = messageController;

const router = Router();

router.post('/messages/:groupId/group/:userId/user', createMessage);
router.get('/messages/:groupId/group', getMessagesByGroupId);

export default router;
