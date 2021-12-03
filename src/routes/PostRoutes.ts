import { Router } from "express";
import { PostController } from "../Controllers/PostController";

const router = Router()

router.get('/', PostController.readPost);
router.post('/', PostController.createPost);
router.put('/:id', PostController.updatePost);
router.delete('/:id', PostController.deletePost);
router.patch('/like-post/:id', PostController.likePost);
router.patch('/unlike-post/:id', PostController.unlikePost);

router.patch('/comment-post/:id', PostController.commentPost);
router.patch('/edit-comment-post/:id', PostController.editCommentPost);
router.patch('/delete-comment-post/:id', PostController.deleteCommentPost);

export default router;