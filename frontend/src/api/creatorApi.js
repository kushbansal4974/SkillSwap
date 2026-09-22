import apiClient from './client';

export const creatorApi = {
  /**
   * Get creator dashboard data (metrics, stats, incoming bookings)
   * @param {string} creatorId
   */
  async getDashboard(creatorId = 'creator_001') {
    const response = await apiClient.get(`/creators/${creatorId}/dashboard`);
    return response.data?.data;
  },

  /**
   * Get all seeded demo creators
   */
  async getAllCreators() {
    const response = await apiClient.get('/creators');
    return response.data?.data || [];
  },

  /**
   * Get creator profile by creatorId
   * @param {string} creatorId
   */
  async getCreatorById(creatorId) {
    const response = await apiClient.get(`/creators/${creatorId}`);
    return response.data?.data;
  },
};

export default creatorApi;
