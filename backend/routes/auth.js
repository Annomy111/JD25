const express = require('express');
const router = express.Router();
const { login, register, getCurrentUser } = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { getAuthUrl, setTokens } = require('../config/googleCalendar');

// Bestehende Routen
router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getCurrentUser);

// Google OAuth2 Routen
router.get('/google/auth', (req, res) => {
  const authUrl = getAuthUrl();
  res.json({ url: authUrl });
});

router.get('/google/callback', async (req, res) => {
  try {
    const { code } = req.query;
    const tokens = await setTokens(code);
    // Hier könnten wir die Tokens in der Datenbank speichern
    res.json({ success: true, message: 'Calendar access granted' });
  } catch (error) {
    console.error('Google auth callback error:', error);
    res.status(500).json({ message: 'Failed to authenticate with Google' });
  }
});

module.exports = router;