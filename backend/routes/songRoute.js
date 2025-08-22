import express from 'express'
import { listSong, addSong, singleSong } from '../controllers/songController.js'
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const songRouter = express.Router();

songRouter.post('/add', adminAuth, upload.fields([{ name: 'image1', adminAuth, maxCount: 1 }, { name: 'image2', adminAuth, maxCount: 1 }, { name: 'image3', adminAuth, maxCount: 1 }]), addSong);
songRouter.get('/list', listSong);
songRouter.post('/single', singleSong);

export default songRouter
