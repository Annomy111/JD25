const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const asanaController = require('../controllers/asanaController');

router.get('/tasks', auth, asanaController.getTasks);
router.post('/tasks/:id/complete', auth, asanaController.completeTask);
router.post('/webhook', asanaController.handleWebhook);

module.exports = router;