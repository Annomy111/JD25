import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const canvassingService = {
  // Get all canvassing areas
  getAreas: async () => {
    const response = await axios.get(`${API_URL}/canvassing`);
    return response.data;
  },

  // Get specific area details
  getAreaDetails: async (districtId) => {
    const response = await axios.get(`${API_URL}/canvassing/${districtId}`);
    return response.data;
  },

  // Register a new visit
  registerVisit: async (districtId, visitData) => {
    const response = await axios.post(`${API_URL}/canvassing/${districtId}/visits`, visitData);
    return response.data;
  },

  // Assign area to volunteer
  assignArea: async (districtId) => {
    const response = await axios.post(`${API_URL}/canvassing/${districtId}/assign`);
    return response.data;
  }
};

export default canvassingService;