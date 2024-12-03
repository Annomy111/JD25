import express from 'express';
import { auth } from '../middleware/auth.jsx';
import socialMediaController from '../controllers/socialMediaController.jsx';

const router = express.Router();

// Get social media metrics
router.get('/metrics', auth, socialMediaController.getMetrics);

// Share content to social platforms
router.post('/share/twitter', auth, socialMediaController.shareToTwitter);
router.post('/share/facebook', auth, socialMediaController.shareToFacebook);

export default router;