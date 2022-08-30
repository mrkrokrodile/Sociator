import { Router } from 'express';
import { AuthController } from '../Controllers/AuthController';

const router = Router();

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.get('/logout', AuthController.logout);

export default router;
