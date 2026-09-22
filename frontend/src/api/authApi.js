import apiClient, { setAuthToken } from './client';

export const AUTH_ENDPOINTS = {
  login: '/users/login',
  register: '/users/register',
  logout: '/users/logout',
  me: '/users/me',
  profile: '/users/profile',
};

const normalizeUser = (user) => {
  if (!user) return null;
  const id = user.id || user._id;
  return {
    ...user,
    id,
    _id: id,
    initials: (user.name || 'User')
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2),
    avatar: user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || 'User')}`,
    role: user.role || 'client',
    bio: user.bio || '',
    skills: user.skills || [],
    location: user.location || 'India',
  };
};

export const authApi = {
  /**
   * Log in user with credentials
   * @param {Object} credentials - { email, password }
   * @returns {Promise<{ user: Object, token: string }>}
   */
  async login(credentials) {
    const response = await apiClient.post(AUTH_ENDPOINTS.login, credentials);
    const data = response.data?.data || response.data;
    const token = data.token;
    const user = normalizeUser(data.user);

    if (token) {
      setAuthToken(token);
    }
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('skillswap_role', user.role);
    }

    return { user, token };
  },

  /**
   * Register new user
   * @param {Object} userData - { name, email, password, role }
   * @returns {Promise<{ user: Object, token: string }>}
   */
  async register(userData) {
    const response = await apiClient.post(AUTH_ENDPOINTS.register, userData);
    const data = response.data?.data || response.data;
    const token = data.token;
    const user = normalizeUser(data.user);

    if (token) {
      setAuthToken(token);
    }
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('skillswap_role', user.role);
    }

    return { user, token };
  },

  /**
   * Log out user
   */
  async logout() {
    try {
      await apiClient.post(AUTH_ENDPOINTS.logout);
    } catch {
      // Backend may be offline or stateless, proceed with client cleanup
    }
    setAuthToken(null);
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('skillswap_role');
    } catch {
      // Ignore
    }
    return { success: true };
  },

  /**
   * Get current authenticated user profile
   * @returns {Promise<Object>}
   */
  async getCurrentUser() {
    const response = await apiClient.get(AUTH_ENDPOINTS.me);
    const rawUser = response.data?.data?.user || response.data?.user || response.data;
    const user = normalizeUser(rawUser);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('skillswap_role', user.role);
    }
    return user;
  },

  /**
   * Update profile
   * @param {Object} profileData
   */
  async updateProfile(profileData) {
    const response = await apiClient.put(AUTH_ENDPOINTS.profile, profileData);
    const rawUser = response.data?.data?.user || response.data?.user || response.data;
    const user = normalizeUser(rawUser);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('skillswap_role', user.role);
    }
    return user;
  },
};

export default authApi;
