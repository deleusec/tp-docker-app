import { Router } from 'express';
import multer from 'multer';
import { uploadImage, deleteImage } from '../controllers/image.controller';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/:id', upload.single('image'), uploadImage);
router.delete('/:id/:filename', deleteImage);

export default router;