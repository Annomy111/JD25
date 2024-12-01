const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const CanvassingArea = require('../models/CanvassingArea');

// Alle Gebiete abrufen
router.get('/', auth, async (req, res) => {
  try {
    const areas = await CanvassingArea.find()
      .populate('volunteers', 'name')
      .select('-visits');
    res.json(areas);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen der Gebiete' });
  }
});

// Gebiet Details abrufen
router.get('/:districtId', auth, async (req, res) => {
  try {
    const area = await CanvassingArea.findOne({ districtId: req.params.districtId })
      .populate('volunteers', 'name')
      .populate('visits.volunteer', 'name');
    
    if (!area) {
      return res.status(404).json({ message: 'Gebiet nicht gefunden' });
    }
    
    res.json(area);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen des Gebiets' });
  }
});

// Neuen Besuch registrieren
router.post('/:districtId/visits', auth, async (req, res) => {
  try {
    const { address, status, notes } = req.body;
    
    const area = await CanvassingArea.findOne({ districtId: req.params.districtId });
    if (!area) {
      return res.status(404).json({ message: 'Gebiet nicht gefunden' });
    }

    area.visits.push({
      address,
      date: new Date(),
      volunteer: req.user.userId,
      status,
      notes
    });

    area.visitedHouseholds = area.visits.length;
    area.progress = Math.min(100, (area.visitedHouseholds / area.totalHouseholds) * 100);
    area.status = area.progress === 100 ? 'completed' : 'in_progress';
    area.lastUpdated = new Date();

    await area.save();
    res.status(201).json(area);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Registrieren des Besuchs' });
  }
});

// Gebiet einem Freiwilligen zuweisen
router.post('/:districtId/assign', auth, async (req, res) => {
  try {
    const area = await CanvassingArea.findOne({ districtId: req.params.districtId });
    if (!area) {
      return res.status(404).json({ message: 'Gebiet nicht gefunden' });
    }

    if (!area.volunteers.includes(req.user.userId)) {
      area.volunteers.push(req.user.userId);
      area.status = 'in_progress';
      area.lastUpdated = new Date();
      await area.save();
    }

    res.json(area);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Zuweisen des Gebiets' });
  }
});

module.exports = router;