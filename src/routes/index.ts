import { Router } from 'express';
import UserRoutes from './UserRoutes';
import AuthRoutes from './AuthRoutes';
import PostRoutes from './PostRoutes';
import UploadRoutes from './UploadRoutes';
import { checkUser } from '../middleware/AuthMiddleware';

const root = Router();

root.use('/auth', AuthRoutes);
root.use('/users', [checkUser], UserRoutes);
root.use('/post', [checkUser], PostRoutes);
root.use('/upload', [checkUser], UploadRoutes);

export default root;
