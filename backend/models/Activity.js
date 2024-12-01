const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['door_knock', 'flyer_distribution', 'phone_call', 'event_participation', 'training_completion'],
    required: true
  },
  details: {
    doorsKnocked: Number,
    flyersDistributed: Number,
    callsMade: Number,
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    },
    trainingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Training'
    }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  district: String,
  pointsEarned: Number,
  date: {
    type: Date,
    default: Date.now
  },
  notes: String
});

activitySchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Activity', activitySchema);