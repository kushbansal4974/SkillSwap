import apiClient from './client';

const normalizeBooking = (b) => {
  if (!b) return null;
  const id = b._id || b.id;
  const gig = b.gig || {};
  const creator = b.creator || {};
  const client = b.client || {};

  return {
    ...b,
    id,
    _id: id,
    price: Number(b.agreedRate || b.price || gig.rate || 0),
    agreedRate: Number(b.agreedRate || b.price || gig.rate || 0),
    requirementsNote: b.message || b.requirementsNote || '',
    status: (b.status || 'pending').toLowerCase(),
    declineReason: b.declineReason || '',
    gig: {
      id: gig._id || gig.id || b.gigId,
      _id: gig._id || gig.id || b.gigId,
      title: gig.title || 'Creator Service',
      category: gig.category || 'Services',
      rate: Number(gig.rate || b.agreedRate || 0),
      coverImage:
        gig.coverImage ||
        gig.image ||
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80',
      deliveryDays: Number(gig.deliveryDays || 3),
    },
    seller: {
      id: creator._id || creator.id || b.creatorId,
      name: creator.name || 'Creator',
      email: creator.email || '',
      avatar:
        creator.avatar ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(creator.name || 'Creator')}`,
    },
    buyer: {
      id: client._id || client.id || b.clientId,
      name: client.name || 'Client',
      email: client.email || '',
      avatar:
        client.avatar ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(client.name || 'Client')}`,
    },
  };
};

export const bookingApi = {
  /**
   * Create a new booking request
   * @param {Object} bookingData - { gigId, message }
   */
  async createBooking(bookingData) {
    const payload = {
      gigId: bookingData.gigId || bookingData.gig?.id,
      message: bookingData.requirementsNote || bookingData.message || 'I would like to book this service package.',
    };

    const response = await apiClient.post('/bookings', payload);
    const b = response.data?.data?.booking || response.data?.data || response.data;
    return normalizeBooking(b);
  },

  /**
   * Fetch client's bookings
   * @param {Object} [params] - optional { status }
   */
  async getMyBookings(params = {}) {
    const response = await apiClient.get('/bookings/my');
    const rawBookings = response.data?.data?.bookings || response.data?.data || [];
    let bookings = rawBookings.map(normalizeBooking);

    if (params.status && params.status !== 'All') {
      bookings = bookings.filter(
        (b) => b.status === params.status.toLowerCase()
      );
    }

    return bookings;
  },

  /**
   * Fetch creator's incoming bookings
   */
  async getCreatorBookings() {
    const response = await apiClient.get('/bookings/creator');
    const rawBookings = response.data?.data?.bookings || response.data?.data || [];
    return rawBookings.map(normalizeBooking);
  },

  /**
   * Fetch booking details by ID
   * @param {string} id
   */
  async getBookingById(id) {
    const response = await apiClient.get(`/bookings/${id}`);
    const b = response.data?.data?.booking || response.data?.data || response.data;
    return normalizeBooking(b);
  },

  /**
   * Creator accepts booking
   * @param {string} id
   */
  async acceptBooking(id) {
    const response = await apiClient.put(`/bookings/${id}/status`, { status: 'accepted' });
    const b = response.data?.data?.booking || response.data?.data || response.data;
    return normalizeBooking(b);
  },

  /**
   * Creator declines booking
   * @param {string} id
   * @param {string} reason
   */
  async declineBooking(id, reason) {
    const response = await apiClient.put(`/bookings/${id}/status`, {
      status: 'declined',
      reason,
      declineReason: reason,
    });
    const b = response.data?.data?.booking || response.data?.data || response.data;
    return normalizeBooking(b);
  },
};

export default bookingApi;
