const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const User = require('../models/User');

// Alle Freiwilligen abrufen (nur für Admins)
router.get('/', auth, async (req, res) => {
  try {
    // Prüfen ob Admin
    const requestingUser = await User.findById(req.user.userId);
    if (requestingUser.role !== 'admin') {
      return res.status(403).json({ message: 'Zugriff verweigert' });
    }

    const volunteers = await User.find({ role: 'volunteer' })
      .select('-password')
      .sort({ lastActive: -1 });

    res.json(volunteers);
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    res.status(500).json({ message: 'Fehler beim Abrufen der Freiwilligen' });
  }
});

module.exports = router;