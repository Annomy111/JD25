const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const auth = require('../middleware/auth');

// Get all events
router.get('/', auth, eventController.getAllEvents);

// Get single event
router.get('/:id', auth, eventController.getEventById);

// Create event
router.post('/', auth, eventController.createEvent);

// Update event
router.put('/:id', auth, eventController.updateEvent);

// Delete event
router.delete('/:id', auth, eventController.deleteEvent);

// Join event
router.post('/:id/join', auth, eventController.joinEvent);

// Leave event
router.post('/:id/leave', auth, eventController.leaveEvent);

module.exports = router;