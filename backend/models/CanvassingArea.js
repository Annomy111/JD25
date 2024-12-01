const mongoose = require('mongoose');

const canvassingAreaSchema = new mongoose.Schema({
  districtId: {
    type: String,
    required: true
  },
  districtName: String,
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  totalHouseholds: {
    type: Number,
    default: 0
  },
  visitedHouseholds: {
    type: Number,
    default: 0
  },
  volunteers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  visits: [{
    address: String,
    date: Date,
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['completed', 'not_home', 'refused', 'to_revisit'],
      default: 'completed'
    },
    notes: String
  }],
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CanvassingArea', canvassingAreaSchema);