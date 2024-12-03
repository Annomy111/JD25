const mongoose = require('mongoose');

const socialAccountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  provider: {
    type: String,
    enum: ['facebook', 'twitter', 'instagram'],
    required: true
  },
  providerId: {
    type: String,
    required: true
  },
  accessToken: {
    type: String,
    required: true
  },
  refreshToken: String,
  expiresAt: Date,
  username: String,
  profileUrl: String
}, { timestamps: true });

module.exports = mongoose.model('SocialAccount', socialAccountSchema);