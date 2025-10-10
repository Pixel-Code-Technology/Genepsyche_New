const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/auth';

// Helper function to handle API responses
export const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper function to get headers with authentication if needed
export const getHeaders = (includeJson = true) => {
  const headers = {};
  
  if (includeJson) {
    headers['Content-Type'] = 'application/json';
  }
  
  // Add authentication token if available
  const token = localStorage.getItem('authToken');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export { API_BASE_URL };
