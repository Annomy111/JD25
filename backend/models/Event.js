const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['door2door', 'infostand', 'meeting', 'other'],
    default: 'other'
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['confirmed', 'maybe', 'declined'],
      default: 'confirmed'
    }
  }],
  maxParticipants: {
    type: Number
  },
  status: {
    type: String,
    enum: ['planned', 'ongoing', 'completed', 'cancelled'],
    default: 'planned'
  },
  materials: [{
    name: String,
    quantity: Number,
    assigned: Boolean
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);