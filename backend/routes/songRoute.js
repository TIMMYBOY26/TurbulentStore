import express from 'express';
import { listSong, addSong, singleSong } from '../controllers/songController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const songRouter = express.Router();

// Route to add a song
songRouter.post('/add', adminAuth, upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 }
]), addSong);

// Route to list all songs
songRouter.get('/list', listSong);

// Route to get a single song by ID (GET method)
songRouter.get('/:id', singleSong); // Using GET to retrieve a song by ID

// Route to get a single song by ID (POST method)
songRouter.post('/single', singleSong); // Using POST to retrieve a song by ID

export default songRouter;
