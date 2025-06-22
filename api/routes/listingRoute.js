import express from 'express';
import { createListing } from '../controllers/listingController.js';
import { verifyToken } from '../utils/verifyUser.js';
import upload from '../utils/multerConfig.js';

const router = express.Router();

router.post('/create', verifyToken, createListing);

//handle image upload
router.post('/upload', upload, (req, res) => {
    if(!req.files || req.files.length === 0){
        return res.status(400).json({success: false, message: 'No files uploaded!'});
    }

    const fileUrls = req.files.map(file => `/uploads/${file.filename}`);

    //send back to the file Urls (paths)
    res.json({success: true, urls: fileUrls});
});

export default router;