import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';

const SocialMediaPanel = () => {
  const [metrics, setMetrics] = useState({
    twitter: { followers: 0, engagement: 0, posts: 0 },
    facebook: { followers: 0, engagement: 0, posts: 0 }
  });
  const [content, setContent] = useState({ text: '', url: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await axios.get('/api/social-media/metrics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMetrics(response.data.metrics);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      setError('Failed to fetch social media metrics');
    }
  };

  const handleShare = async (platform) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`/api/social-media/share/${platform}`, content, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContent({ text: '', url: '' });
      fetchMetrics(); // Refresh metrics after posting
    } catch (error) {
      console.error(`Error sharing to ${platform}:`, error);
      setError(`Failed to share content to ${platform}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Social Media Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Twitter Metrics */}
            <div className="p-4 rounded-lg bg-blue-50">
              <h3 className="font-semibold mb-2">Twitter</h3>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <p className="text-gray-600">Followers</p>
                  <p className="font-bold">{metrics.twitter.followers}</p>
                </div>
                <div>
                  <p className="text-gray-600">Engagement</p>
                  <p className="font-bold">{metrics.twitter.engagement}</p>
                </div>
                <div>
                  <p className="text-gray-600">Posts</p>
                  <p className="font-bold">{metrics.twitter.posts}</p>
                </div>
              </div>
            </div>

            {/* Facebook Metrics */}
            <div className="p-4 rounded-lg bg-blue-50">
              <h3 className="font-semibold mb-2">Facebook</h3>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <p className="text-gray-600">Followers</p>
                  <p className="font-bold">{metrics.facebook.followers}</p>
                </div>
                <div>
                  <p className="text-gray-600">Engagement</p>
                  <p className="font-bold">{metrics.facebook.engagement}</p>
                </div>
                <div>
                  <p className="text-gray-600">Posts</p>
                  <p className="font-bold">{metrics.facebook.posts}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Share Content Form */}
          <div className="mt-6">
            <h3 className="font-semibold mb-4">Share Content</h3>
            <div className="space-y-4">
              <Textarea
                placeholder="What would you like to share?"
                value={content.text}
                onChange={(e) => setContent({ ...content, text: e.target.value })}
                className="min-h-[100px]"
              />
              <Input
                type="url"
                placeholder="Add a link (optional)"
                value={content.url}
                onChange={(e) => setContent({ ...content, url: e.target.value })}
              />
              <div className="flex space-x-4">
                <Button
                  onClick={() => handleShare('twitter')}
                  disabled={loading || !content.text}
                  className="bg-blue-400 hover:bg-blue-500"
                >
                  Share to Twitter
                </Button>
                <Button
                  onClick={() => handleShare('facebook')}
                  disabled={loading || !content.text}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Share to Facebook
                </Button>
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialMediaPanel;