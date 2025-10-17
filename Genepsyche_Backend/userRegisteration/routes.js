const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('./controller');

// Validation rules for registration
const registrationValidation = [
  body('name')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2-100 characters')
    .trim()
    .escape(),
  
  body('phone')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Phone number cannot exceed 20 characters')
    .isMobilePhone()
    .withMessage('Please enter a valid phone number'),
  
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('userGroup')
    .optional()
    .isIn(['ADMIN', 'EDITOR', 'VIEWER'])
    .withMessage('User group must be ADMIN, EDITOR, or VIEWER')
];

// Validation rules for update
const updateValidation = [
  body('name')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2-100 characters')
    .trim()
    .escape(),
  
  body('phone')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Phone number cannot exceed 20 characters')
    .isMobilePhone()
    .withMessage('Please enter a valid phone number'),
  
  body('userGroup')
    .optional()
    .isIn(['ADMIN', 'EDITOR', 'VIEWER'])
    .withMessage('User group must be ADMIN, EDITOR, or VIEWER'),
  
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number')
];

// Routes
router.post('/register', registrationValidation, userController.registerUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', updateValidation, userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;