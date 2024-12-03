const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const socialMediaController = require('../controllers/socialMediaController');

// Social media routes with proper error handling
router.get('/metrics', auth, (req, res) => {
    try {
        return socialMediaController.getMetrics(req, res);
    } catch (error) {
        console.error('Error in metrics route:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/share/twitter', auth, (req, res) => {
    try {
        return socialMediaController.shareToTwitter(req, res);
    } catch (error) {
        console.error('Error in Twitter share route:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/share/facebook', auth, (req, res) => {
    try {
        return socialMediaController.shareToFacebook(req, res);
    } catch (error) {
        console.error('Error in Facebook share route:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;