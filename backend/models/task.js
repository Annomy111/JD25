const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  },
  dueDate: {
    type: Date
  },
  asanaId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  tags: [{
    type: String
  }],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  completedAt: {
    type: Date
  },
  section: {
    type: String,
    default: 'default'
  },
  project: {
    type: String
  }
}, {
  timestamps: true
});

// Indexe für häufige Abfragen
taskSchema.index({ asanaId: 1 });
taskSchema.index({ userId: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ dueDate: 1 });

module.exports = mongoose.model('Task', taskSchema);