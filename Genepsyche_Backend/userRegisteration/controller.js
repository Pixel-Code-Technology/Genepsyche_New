const User = require('./model');
const { validationResult } = require('express-validator');

// Register new user
exports.registerUser = async (req, res) => {
  try {
    const { name, phone, email, password, userGroup } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
        field: 'email'
      });
    }

    // Create new user
    const newUser = await User.create({
      name,
      phone,
      email,
      password,
      user_group: userGroup || 'VIEWER'
    });

    // Get created user without password
    const user = await User.findByPk(newUser.id, {
      attributes: { exclude: ['password'] }
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};


// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, phone, userGroup, password } = req.body;
    const userId = req.params.id;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let affectedRows;
    // If password is provided, update with password
    if (password) {
      affectedRows = await User.updateWithPassword(userId, { 
        name, 
        phone, 
        userGroup, 
        password 
      });
    } else {
      // Update without password
      affectedRows = await User.update(userId, { 
        name, 
        phone, 
        userGroup 
      });
    }
    
    if (affectedRows > 0) {
      const updatedUser = await User.findById(userId);
      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: updatedUser
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to update user'
      });
    }
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if user exists
    const user = await User.findByPk(userId); // Sequelize method
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete user
    const deletedRows = await User.destroy({ where: { id: userId } });

    if (deletedRows > 0) {
      return res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete user'
      });
    }
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
