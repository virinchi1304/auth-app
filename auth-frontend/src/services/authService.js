import api from './api';

// Register new user
export const register = async (userData) => {
  try {
    // Map username to name for backend compatibility
    const backendData = {
      name: userData.username,
      email: userData.email,
      password: userData.password
    };

    const response = await api.post('/auth/register', backendData);

    if (response.data.success) {
      // Store token and user data
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' };
  }
};  

// Login user
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);

    if (response.data.success) {
      // Store token and user data
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

// Get current user profile (fallback to stored user since backend doesn't have this endpoint)
export const getCurrentUser = async () => {
  try {
    // Return stored user as your backend doesn't have /auth/me endpoint yet
    const storedUser = getStoredUser();
    if (storedUser) {
      return {
        success: true,
        data: { user: storedUser }
      };
    }
    throw new Error('No user found');
  } catch (error) {
    throw { message: 'Failed to get user profile' };
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Get stored user data
export const getStoredUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};
