import { Router } from 'express';
import { groupController } from '../controller/group-controller';

const router = Router();

const { createGroup, enterInGroup } = groupController;

router.post('/groups/:userId', createGroup);
router.post('/groups/:groupId/join/:userId', enterInGroup);

export default router;
