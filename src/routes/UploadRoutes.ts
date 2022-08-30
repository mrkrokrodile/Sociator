import { Router } from 'express';
import { UploadController } from '../Controllers/UploadController';
// import { upload } from "../middleware/multermiddleware";

const router = Router();

// router.post("/", upload.single("file"), UploadController.uploadProfil);

export default router;
