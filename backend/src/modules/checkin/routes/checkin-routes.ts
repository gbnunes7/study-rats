import { Router } from 'express';
import { checkinController } from '../controller/checkin-controller';
import multer from 'multer';

const upload = multer();

const {
  createCheckin,
  deleteCheckinById,
  editCheckinById,
  getCheckinById,
  getCheckinsByGroupId,
} = checkinController;

const router = Router();

router.get('/checkins/:groupId/group', getCheckinsByGroupId);
router.post(
  '/checkin/:userId/user/:groupId/group',
  upload.single('file'),
  createCheckin,
);
router.get('/checkin/:checkinId', getCheckinById);
router.delete('/checkin/:checkinId', deleteCheckinById);
router.put('/checkin/:checkinId', editCheckinById);

export default router;
