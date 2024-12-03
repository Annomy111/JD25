const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const eventController = require('../controllers/eventController');

router.get('/', auth, eventController.getAllEvents);
router.post('/', auth, eventController.createEvent);
router.get('/:id', auth, eventController.getEventById);
router.put('/:id', auth, eventController.updateEvent);
router.delete('/:id', auth, eventController.deleteEvent);
router.post('/:id/join', auth, eventController.joinEvent);
router.post('/:id/leave', auth, eventController.leaveEvent);

module.exports = router;