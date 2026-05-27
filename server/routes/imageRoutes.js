const express = require('express');
const router = express.Router();
const {
  generateImage,
  getImageHistory,
  getImage,
  deleteImage,
  downloadImage
} = require('../controllers/imageController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.post('/generate', protect, generateImage);
router.get('/history', protect, getImageHistory);
router.get('/:id/download', protect, downloadImage);
router.get('/:id', protect, getImage);
router.delete('/:id', protect, deleteImage);

module.exports = router;
