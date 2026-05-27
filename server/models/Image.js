const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  prompt: {
    type: String,
    required: true,
    maxlength: 500
  },
  negativePrompt: {
    type: String,
    maxlength: 500
  },
  style: {
    type: String,
    enum: [
      'realistic',
      'anime',
      '3d-render',
      'digital-illustration',
      'watercolor',
      'oil-painting',
      'pixel-art',
      'flat-design',
      'cinematic',
      'fantasy-art',
      'minimalist',
      'pop-art'
    ],
    default: 'realistic'
  },
  aspectRatio: {
    type: String,
    enum: ['1:1', '4:3', '16:9', '9:16', '3:4'],
    default: '1:1'
  },
  imageUrl: {
    type: String,
    required: true
  },
  seed: {
    type: Number
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Image', imageSchema);
