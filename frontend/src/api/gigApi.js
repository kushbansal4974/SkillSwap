import apiClient from './client';

const normalizeGig = (g) => {
  if (!g) return null;
  const id = g._id || g.id;
  const creator = g.creator || {};
  const creatorName = creator.name || g.creatorName || 'Creator';

  return {
    ...g,
    id,
    _id: id,
    price: Number(g.rate || g.price || 0),
    rate: Number(g.rate || g.price || 0),
    coverImage:
      g.coverImage ||
      g.image ||
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80',
    deliveryDays: Number(g.deliveryDays) || 3,
    features: Array.isArray(g.features) && g.features.length > 0
      ? g.features
      : ['High quality deliverables', 'Revisions included', 'Commercial rights'],
    rating: Number(g.rating || 5.0),
    reviewsCount: Number(g.reviewsCount || 0),
    seller: {
      id: creator._id || creator.id || g.creatorId,
      _id: creator._id || creator.id || g.creatorId,
      name: creatorName,
      email: creator.email || '',
      avatar:
        creator.avatar ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(creatorName)}`,
      bio: creator.bio || 'Professional creator on SkillsSwap',
      rating: Number(g.rating || 5.0),
      reviewsCount: Number(g.reviewsCount || 0),
    },
  };
};

export const gigApi = {
  /**
   * Fetch all marketplace gigs with optional search, category, and sorting
   * @param {Object} params - { search, category, minPrice, maxPrice, sort, creator }
   */
  async getGigs(params = {}) {
    const cleanParams = {};
    if (params.search) cleanParams.search = params.search;
    if (params.category && params.category !== 'All') cleanParams.category = params.category;
    if (params.minPrice) cleanParams.minPrice = params.minPrice;
    if (params.maxPrice) cleanParams.maxPrice = params.maxPrice;
    if (params.sort) cleanParams.sort = params.sort;
    if (params.creator) cleanParams.creator = params.creator;

    const response = await apiClient.get('/gigs', { params: cleanParams });
    const data = response.data?.data;
    const rawGigs = data?.gigs || (Array.isArray(data) ? data : []);

    return rawGigs.map(normalizeGig);
  },

  /**
   * Get single gig details by ID
   * @param {string} id
   */
  async getGigById(id) {
    const response = await apiClient.get(`/gigs/${id}`);
    const g = response.data?.data?.gig || response.data?.data || response.data?.gig || response.data;
    if (!g) throw new Error('Gig not found or no longer available');

    return normalizeGig(g);
  },

  /**
   * Create a new gig
   * @param {Object} gigData
   */
  async createGig(gigData) {
    const payload = {
      title: gigData.title,
      category: gigData.category,
      rate: Number(gigData.rate || gigData.price),
      description: gigData.description,
      shortDescription: gigData.shortDescription || gigData.title.slice(0, 100),
      coverImage: gigData.coverImage || gigData.image,
      deliveryDays: Number(gigData.deliveryDays) || 3,
      features: gigData.features,
    };

    const response = await apiClient.post('/gigs', payload);
    const g = response.data?.data?.gig || response.data?.data || response.data;
    return normalizeGig(g);
  },

  /**
   * Update an existing gig
   * @param {string} id
   * @param {Object} gigData
   */
  async updateGig(id, gigData) {
    const payload = {
      ...gigData,
      rate: gigData.rate ? Number(gigData.rate) : (gigData.price ? Number(gigData.price) : undefined),
    };

    const response = await apiClient.put(`/gigs/${id}`, payload);
    const g = response.data?.data?.gig || response.data?.data || response.data;
    return normalizeGig(g);
  },

  /**
   * Delete a gig by ID
   * @param {string} id
   */
  async deleteGig(id) {
    const response = await apiClient.delete(`/gigs/${id}`);
    return response.data;
  },

  /**
   * Get all gigs created by current logged-in creator
   * @param {string} [creatorId]
   */
  async getMyGigs(creatorId) {
    try {
      // Primary: protected creator route
      const response = await apiClient.get('/gigs/my');
      const rawGigs = response.data?.data?.gigs || response.data?.data || [];
      return rawGigs.map(normalizeGig);
    } catch {
      // Fallback: filter by creator id
      if (creatorId) {
        const response = await apiClient.get('/gigs', { params: { creator: creatorId } });
        const rawGigs = response.data?.data?.gigs || [];
        return rawGigs.map(normalizeGig);
      }
      return [];
    }
  },
};

export default gigApi;
