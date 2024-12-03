import mongoose from 'mongoose';

const socialAccountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  provider: {
    type: String,
    required: true,
    enum: ['twitter', 'facebook']
  },
  accessToken: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String
  },
  profileId: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastTokenRefresh: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for faster queries
socialAccountSchema.index({ userId: 1, provider: 1 }, { unique: true });

const SocialAccount = mongoose.model('SocialAccount', socialAccountSchema);

export default SocialAccount;