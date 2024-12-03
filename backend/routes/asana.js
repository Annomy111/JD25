const express = require('express');
const router = express.Router();
const asanaController = require('../controllers/asanaController');
const auth = require('../middleware/auth');
const AsanaSync = require('../models/asanaSync');

router.post('/sync', auth, async (req, res) => {
  try {
    const result = await asanaController.syncTasks(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/configure', auth, async (req, res) => {
  try {
    const { asanaUserId, asanaWorkspaceId, accessToken, refreshToken } = req.body;
    
    const asanaSync = await AsanaSync.findOneAndUpdate(
      { userId: req.user.id },
      { asanaUserId, asanaWorkspaceId, accessToken, refreshToken },
      { upsert: true, new: true }
    );
    
    res.json({ success: true, data: asanaSync });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;