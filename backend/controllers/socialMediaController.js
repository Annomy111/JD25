const SocialAccount = require('../models/socialAccount');
const axios = require('axios');

const socialMediaController = {
    getMetrics: async (req, res) => {
        try {
            const accounts = await SocialAccount.find({ userId: req.user.id });
            const metrics = {
                twitter: {
                    followers: 0,
                    engagement: 0,
                    posts: 0
                },
                facebook: {
                    followers: 0,
                    engagement: 0,
                    posts: 0
                }
            };

            for (const account of accounts) {
                if (account.provider === 'twitter') {
                    try {
                        const twitterMetrics = await socialMediaController.getTwitterMetrics(account);
                        metrics.twitter = { ...metrics.twitter, ...twitterMetrics };
                    } catch (error) {
                        console.error('Error fetching Twitter metrics:', error);
                    }
                } else if (account.provider === 'facebook') {
                    try {
                        const facebookMetrics = await socialMediaController.getFacebookMetrics(account);
                        metrics.facebook = { ...metrics.facebook, ...facebookMetrics };
                    } catch (error) {
                        console.error('Error fetching Facebook metrics:', error);
                    }
                }
            }

            res.json({ success: true, metrics });
        } catch (error) {
            console.error('Error in getMetrics:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    shareToTwitter: async (req, res) => {
        try {
            const { content } = req.body;
            const account = await SocialAccount.findOne({
                userId: req.user.id,
                provider: 'twitter'
            });

            if (!account) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Twitter account not connected' 
                });
            }

            const result = await socialMediaController.postToTwitter(account, content);
            res.json({ success: true, postId: result.id });
        } catch (error) {
            console.error('Error in shareToTwitter:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    shareToFacebook: async (req, res) => {
        try {
            const { content } = req.body;
            const account = await SocialAccount.findOne({
                userId: req.user.id,
                provider: 'facebook'
            });

            if (!account) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Facebook account not connected' 
                });
            }

            const result = await axios.post(
                `https://graph.facebook.com/v12.0/me/feed`,
                {
                    message: content.text,
                    link: content.url,
                    access_token: account.accessToken
                }
            );

            res.json({ success: true, postId: result.data.id });
        } catch (error) {
            console.error('Error in shareToFacebook:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Helper methods
    getTwitterMetrics: async (account) => {
        // Implementation for Twitter metrics
        return {
            followers: 0,
            engagement: 0,
            posts: 0
        };
    },

    getFacebookMetrics: async (account) => {
        try {
            const response = await axios.get(
                `https://graph.facebook.com/v12.0/me`,
                {
                    params: {
                        fields: 'followers_count,posts{engagement}',
                        access_token: account.accessToken
                    }
                }
            );

            return {
                followers: response.data.followers_count || 0,
                posts: response.data.posts?.data?.length || 0,
                engagement: response.data.posts?.data?.reduce((sum, post) => 
                    sum + (post.engagement?.reaction_count || 0), 0) || 0
            };
        } catch (error) {
            console.error('Error fetching Facebook metrics:', error);
            return {
                followers: 0,
                engagement: 0,
                posts: 0
            };
        }
    },

    postToTwitter: async (account, content) => {
        // Implementation for Twitter posting
        return { id: 'twitter-post-id' };
    }
};

module.exports = socialMediaController;