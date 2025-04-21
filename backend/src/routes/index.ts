import express, { type Request, type Response, type Express } from 'express';
import cors from 'cors';
import authRoutes from '../modules/auth/routes/auth-routes';
import groupRoutes from '../modules/group/routes/group-routes';
import userRoutes from '../modules/users/routes/user-routes';
import checkinRoutes from '../modules/checkin/routes/checkin-routes';
import messageRoutes from '../modules/message/routes/message-routes';
import authMiddleware from '../modules/auth/middleware/auth-middleware';

const setupRoutes = (app: Express) => {
  app.use(express.json());
  app.use(cors());

  const apiRouter = express.Router();

  apiRouter.get('/server-test', (req: Request, res: Response) => {
    res.status(200).json({ message: 'Server is running!' });
  });

  apiRouter.use(authRoutes);
  apiRouter.use(authMiddleware)
  apiRouter.use(groupRoutes);
  apiRouter.use(userRoutes);
  apiRouter.use(checkinRoutes);
  apiRouter.use(messageRoutes);
  app.use('/api/v1', apiRouter);
};

export { setupRoutes };
