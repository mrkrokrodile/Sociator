import { Router } from "express";
import { AuthController } from "../Controllers/AuthController";
import { UserController } from "../Controllers/UserController"

const router = Router()

router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.userInfo);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);
router.patch('/follow/:id', UserController.follow);
router.patch('/unfollow/:id', UserController.unfollow)

export default router;