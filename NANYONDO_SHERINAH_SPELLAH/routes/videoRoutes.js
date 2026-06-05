const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const Video = require('../models/Video');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage }).fields([
  { name: 'videoFile', maxCount: 1 },
  { name: 'thumbnailFile', maxCount: 1 }
]);
router.get('/', (req, res) => {
  res.render('index'); 
});

router.get('/add', (req, res) => {
  res.render('add'); 
});

router.get('/videos', async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ createdAt: -1 }); // Newest first
    res.render('videos', { videos });
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).send('Error loading videos dashboard.');
  }
});

router.post('/api/upload', upload, async (req, res) => {
  try {
    if (!req.files || !req.files['videoFile'] || !req.files['thumbnailFile']) {
      return res.status(400).send('Missing files! Please upload both a video and a thumbnail.');
    }

    const { title, description, quality, publishDate } = req.body;

    const videoUrl = `/uploads/${req.files['videoFile'][0].filename}`;
    const thumbnailUrl = `/uploads/${req.files['thumbnailFile'][0].filename}`;

    const newVideo = new Video({
      title,
      description,
      quality,
      publishDate,
      videoUrl,      
      thumbnailUrl,  
      views: '0',
      timeAgo: 'Just now'
    });

    await newVideo.save();
    
    res.redirect('/videos');
  } catch (error) {
    console.error('Upload Process failure:', error);
    res.status(500).send('Internal Server Error processing your upload.');
  }
});

module.exports = router;