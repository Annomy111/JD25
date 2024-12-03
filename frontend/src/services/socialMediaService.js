import axios from 'axios';

const BASE_URL = '/api/social-media';

class SocialMediaService {
  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL
    });
  }

  setToken(token) {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  async getMetrics() {
    try {
      const response = await this.api.get('/metrics');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async shareToTwitter(content) {
    try {
      const response = await this.api.post('/share/twitter', content);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async shareToFacebook(content) {
    try {
      const response = await this.api.post('/share/facebook', content);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return new Error(error.response.data.message || 'An error occurred');
    } else if (error.request) {
      // The request was made but no response was received
      return new Error('No response from server');
    } else {
      // Something happened in setting up the request that triggered an Error
      return new Error('Error setting up request');
    }
  }
}

export default new SocialMediaService();