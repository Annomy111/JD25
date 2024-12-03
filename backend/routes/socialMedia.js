const express = require('express');
const router = express.Router();
const socialMediaController = require('../controllers/socialMediaController');
const auth = require('../middleware/auth');

router.post('/share', auth, async (req, res) => {
  try {
    const { content, platforms } = req.body;
    const results = await socialMediaController.shareContent(
      req.user.id,
      content,
      platforms
    );
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/connect/:platform', auth, async (req, res) => {
  try {
    const { accessToken, refreshToken, providerId, username } = req.body;
    const account = await SocialAccount.findOneAndUpdate(
      {
        userId: req.user.id,
        provider: req.params.platform
      },
      {
        accessToken,
        refreshToken,
        providerId,
        username,
        expiresAt: req.body.expiresAt
      },
      { upsert: true, new: true }
    );
    res.json({ success: true, account });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;