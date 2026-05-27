const axios = require('axios');
const Image = require('../models/Image');
const User = require('../models/User');

// Style presets mapping to Replicate model parameters
const stylePresets = {
  'realistic': 'photorealistic, highly detailed, 8k uhd',
  'anime': 'anime style, manga, cel shaded',
  '3d-render': '3d render, octane render, unreal engine',
  'digital-illustration': 'digital art, illustration, concept art',
  'watercolor': 'watercolor painting, soft colors',
  'oil-painting': 'oil painting, classical art',
  'pixel-art': 'pixel art, 8bit, retro game',
  'flat-design': 'flat design, vector art, minimalist',
  'cinematic': 'cinematic lighting, movie still, dramatic',
  'fantasy-art': 'fantasy art, magical, ethereal',
  'minimalist': 'minimalist, simple, clean design',
  'pop-art': 'pop art, bold colors, andy warhol style'
};

// Aspect ratio to dimensions mapping
const aspectRatioDimensions = {
  '1:1': { width: 1024, height: 1024 },
  '4:3': { width: 1024, height: 768 },
  '16:9': { width: 1024, height: 576 },
  '9:16': { width: 576, height: 1024 },
  '3:4': { width: 768, height: 1024 }
};

// @desc    Generate image from text
// @route   POST /api/images/generate
// @access  Private
const generateImage = async (req, res) => {
  try {
    const { prompt, negativePrompt, style, aspectRatio, seed } = req.body;

    // Check user credits
    const user = await User.findById(req.user._id);
    if (user.credits < 1) {
      return res.status(403).json({ message: 'Insufficient credits' });
    }

    // Build enhanced prompt with style
    const styleModifier = stylePresets[style] || stylePresets['realistic'];
    const enhancedPrompt = `${prompt}, ${styleModifier}`;

    // Get dimensions from aspect ratio
    const dimensions = aspectRatioDimensions[aspectRatio] || aspectRatioDimensions['1:1'];

    // Create image record
    const image = await Image.create({
      userId: req.user._id,
      prompt,
      negativePrompt,
      style,
      aspectRatio,
      seed,
      status: 'processing',
      imageUrl: '' // Will be updated after generation
    });

    // Call Replicate API (using Stable Diffusion)
    // Note: Replace with actual API call
    const replicateResponse = await axios.post(
      'https://api.replicate.com/v1/predictions',
      {
        version: 'stability-ai/sdxl:latest',
        input: {
          prompt: enhancedPrompt,
          negative_prompt: negativePrompt || 'ugly, blurry, low quality',
          width: dimensions.width,
          height: dimensions.height,
          seed: seed || Math.floor(Math.random() * 1000000)
        }
      },
      {
        headers: {
          'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Update image with result URL
    image.imageUrl = replicateResponse.data.output?.[0] || 'https://via.placeholder.com/1024';
    image.status = 'completed';
    await image.save();

    // Deduct credit
    user.credits -= 1;
    await user.save();

    res.status(201).json({
      image,
      remainingCredits: user.credits
    });

  } catch (error) {
    console.error('Generate image error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's image history
// @route   GET /api/images/history
// @access  Private
const getImageHistory = async (req, res) => {
  try {
    const images = await Image.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single image
// @route   GET /api/images/:id
// @access  Private
const getImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Check if user owns the image
    if (image.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(image);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete image
// @route   DELETE /api/images/:id
// @access  Private
const deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Check if user owns the image
    if (image.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await image.deleteOne();

    res.json({ message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Download image (proxy)
// @route   GET /api/images/:id/download
// @access  Private
const downloadImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    if (image.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!image.imageUrl || image.status !== 'completed') {
      return res.status(400).json({ message: 'Image not ready for download' });
    }

    // Proxy the image from the URL
    const response = await axios.get(image.imageUrl, { responseType: 'stream' });

    const ext = req.query.format === 'jpg' ? 'jpg' : 'png';
    res.setHeader('Content-Type', `image/${ext}`);
    res.setHeader('Content-Disposition', `attachment; filename="aipik-${image._id}.${ext}"`);

    response.data.pipe(res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateImage,
  getImageHistory,
  getImage,
  deleteImage,
  downloadImage
};
