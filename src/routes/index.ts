import express, { type Request, type Response, type Express } from 'express';
import cors from 'cors';
import authRoutes from '../modules/auth/routes/auth-routes';
import groupRoutes from '../modules/group/routes/group-routes';

const setupRoutes = (app: Express) => {
  app.use(express.json());
  app.use(cors());
  app.get('/server-test', (req: Request, res: Response) => {
    res.status(200).json({ message: 'Server is running!' });
  });

  app.use(authRoutes);
  app.use(groupRoutes);
};

export { setupRoutes };
