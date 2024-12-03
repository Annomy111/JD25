const mongoose = require('mongoose');

const asanaSyncSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  accessToken: {
    type: String,
    required: true
  },
  asanaUserId: {
    type: String,
    required: true
  },
  asanaWorkspaceId: {
    type: String,
    required: true
  },
  lastSync: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AsanaSync', asanaSyncSchema);