import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import axios from 'axios';

const SocialMediaIntegration = () => {
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [postContent, setPostContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shareStatus, setShareStatus] = useState(null);

  const platforms = [
    { id: 'facebook', name: 'Facebook', icon: 'facebook-icon' },
    { id: 'twitter', name: 'Twitter', icon: 'twitter-icon' }
  ];

  const handleShare = async () => {
    if (!postContent || selectedPlatforms.length === 0) {
      setError('Please enter content and select at least one platform');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/social-media/share', {
        content: {
          text: postContent,
          // Add media attachments handling here
        },
        platforms: selectedPlatforms
      });

      setShareStatus({
        success: true,
        results: response.data.results
      });
      setPostContent('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePlatform = (platformId) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Social Media Sharing</h2>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {shareStatus?.success && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription>Content shared successfully!</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {platforms.map(platform => (
            <button
              key={platform.id}
              onClick={() => togglePlatform(platform.id)}
              className={`px-4 py-2 rounded-md transition-colors ${
                selectedPlatforms.includes(platform.id)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {platform.name}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="What would you like to share?"
            className="w-full p-2 border rounded-md h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleShare}
            disabled={loading}
            className={`w-full px-4 py-2 rounded-md ${
              loading
                ? 'bg-gray-400'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white transition-colors`}
          >
            {loading ? 'Sharing...' : 'Share'}
          </button>
        </div>

        {shareStatus?.results && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Sharing Results:</h3>
            <div className="space-y-2">
              {shareStatus.results.map((result, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-md ${
                    result.success
                      ? 'bg-green-50 text-green-800'
                      : 'bg-red-50 text-red-800'
                  }`}
                >
                  <span className="capitalize">{result.platform}</span>:{' '}
                  {result.success ? 'Shared successfully' : result.error}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialMediaIntegration;