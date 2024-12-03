const SocialAccount = require('../models/socialAccount');
const axios = require('axios');

class SocialMediaController {
  async shareContent(userId, content, platforms) {
    try {
      const results = [];
      const accounts = await SocialAccount.find({
        userId,
        provider: { $in: platforms }
      });

      for (const account of accounts) {
        try {
          const result = await this.shareToProvider(account, content);
          results.push({
            platform: account.provider,
            success: true,
            postId: result.id
          });
        } catch (error) {
          results.push({
            platform: account.provider,
            success: false,
            error: error.message
          });
        }
      }

      return results;
    } catch (error) {
      throw error;
    }
  }

  async shareToProvider(account, content) {
    switch (account.provider) {
      case 'facebook':
        return this.shareToFacebook(account, content);
      case 'twitter':
        return this.shareToTwitter(account, content);
      default:
        throw new Error(`Unsupported platform: ${account.provider}`);
    }
  }

  async shareToFacebook(account, content) {
    try {
      const response = await axios.post(
        `https://graph.facebook.com/v12.0/me/feed`,
        {
          message: content.text,
          link: content.url,
          access_token: account.accessToken
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Facebook sharing failed: ${error.message}`);
    }
  }

  async shareToTwitter(account, content) {
    try {
      // Implement Twitter API v2 posting
      // Note: Twitter API implementation would go here
      // This is a placeholder for the actual implementation
      return { id: 'twitter-post-id' };
    } catch (error) {
      throw new Error(`Twitter sharing failed: ${error.message}`);
    }
  }
}

module.exports = new SocialMediaController();