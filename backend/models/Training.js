const mongoose = require('mongoose');

const trainingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  type: {
    type: String,
    enum: ['video', 'document', 'quiz', 'interactive'],
    required: true
  },
  content: {
    url: String,
    fileType: String,
    duration: Number, // in minutes
    questions: [{
      question: String,
      options: [String],
      correctAnswer: Number
    }]
  },
  category: {
    type: String,
    enum: ['canvassing', 'phone_banking', 'social_media', 'general', 'leadership'],
    required: true
  },
  points: {
    type: Number,
    default: 0
  },
  completions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    score: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  isRequired: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Training', trainingSchema);