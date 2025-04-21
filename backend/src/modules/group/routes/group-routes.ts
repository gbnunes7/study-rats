import { Router } from 'express';
import { groupController } from '../controller/group-controller';

const router = Router();

const {
  createGroup,
  enterInGroup,
  enterInPrivateGroup,
  getPrivateGroupForEntryCode,
  getPublicGroupsWithVacancies,
} = groupController;

router.post('/groups/:userId', createGroup);
router.post('/groups/:groupId/join/:userId', enterInGroup);
router.post('/groups/:entryCode/join-private', enterInPrivateGroup);
router.get('/groups/public', getPublicGroupsWithVacancies);
router.get('/groups/:entryCode/private', getPrivateGroupForEntryCode);

export default router;
