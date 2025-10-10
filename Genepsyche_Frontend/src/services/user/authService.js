import { API_BASE_URL, handleResponse, getHeaders } from './apiConfig';

// Login user (if you implement authentication later)
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials)
    });
    
    const data = await handleResponse(response);
    
    // Store token if available
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem('authToken');
  // Additional cleanup if needed
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};

// Get current user (if you implement user sessions)
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return null;
    }
    
    // This would depend on your backend implementation
    const response = await fetch(`${API_BASE_URL}/me`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Get current user error:', error);
    logoutUser();
    throw error;
  }
};