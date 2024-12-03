const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const volunteerController = require('../controllers/volunteerController');

// Get all volunteers
router.get('/', auth, volunteerController.getAllVolunteers);

// Get single volunteer
router.get('/:id', auth, volunteerController.getVolunteerById);

// Update volunteer
router.put('/:id', auth, volunteerController.updateVolunteer);

// Add points to volunteer
router.post('/:id/points', auth, volunteerController.addPoints);

// Add badge to volunteer
router.post('/:id/badges', auth, volunteerController.addBadge);

module.exports = router;