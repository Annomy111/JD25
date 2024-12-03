const User = require('../models/User');

// Get all volunteers
const getAllVolunteers = async (req, res) => {
  try {
    const volunteers = await User.find({ role: 'volunteer' })
      .select('-password')
      .sort({ points: -1 });
    res.json(volunteers);
  } catch (error) {
    console.error('Get volunteers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single volunteer
const getVolunteerById = async (req, res) => {
  try {
    const volunteer = await User.findById(req.params.id)
      .select('-password');
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }
    res.json(volunteer);
  } catch (error) {
    console.error('Get volunteer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update volunteer
const updateVolunteer = async (req, res) => {
  try {
    const volunteer = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).select('-password');

    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    res.json(volunteer);
  } catch (error) {
    console.error('Update volunteer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add points to volunteer
const addPoints = async (req, res) => {
  try {
    const { points } = req.body;
    const volunteer = await User.findByIdAndUpdate(
      req.params.id,
      { $inc: { points: points } },
      { new: true }
    ).select('-password');

    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    res.json(volunteer);
  } catch (error) {
    console.error('Add points error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add badge to volunteer
const addBadge = async (req, res) => {
  try {
    const { badge } = req.body;
    const volunteer = await User.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { badges: badge } },
      { new: true }
    ).select('-password');

    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    res.json(volunteer);
  } catch (error) {
    console.error('Add badge error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllVolunteers,
  getVolunteerById,
  updateVolunteer,
  addPoints,
  addBadge
};