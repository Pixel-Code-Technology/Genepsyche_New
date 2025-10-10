import { API_BASE_URL, handleResponse, getHeaders } from './apiConfig';

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Get all users
export const getAllUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Get users error:', error);
    throw error;
  }
};

// Get user by ID
export const getUserById = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Get user error:', error);
    throw error;
  }
};

// Update user
export const updateUser = async (userId, userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Update user error:', error);
    throw error;
  }
};

// Delete user
export const deleteUser = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Delete user error:', error);
    throw error;
  }
};

// Search users by name, email, or user group
export const searchUsers = async (searchTerm) => {
  try {
    const allUsers = await getAllUsers();
    
    if (!searchTerm) return allUsers;
    
    const filteredUsers = allUsers.data.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user_group.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return {
      success: true,
      count: filteredUsers.length,
      data: filteredUsers
    };
  } catch (error) {
    console.error('Search users error:', error);
    throw error;
  }
};