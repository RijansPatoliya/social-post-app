// src/controllers/authController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * User Signup
 * Creates new user account with validation
 * Email must be @gmail.com
 */
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate inputs
    if (!username || !email || !password) {
      return res.status(400).json({
        message: 'Username, email and password are required',
      });
    }

    // Check if email is valid format (gmail only)
    if (!email.toLowerCase().endsWith('@gmail.com')) {
      return res.status(400).json({
        message: 'Email format is not valid',  
      });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({
      username: username.toLowerCase(),
    });
    if (existingUsername) {
      return res.status(409).json({
        message: 'Username is already taken',
      });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({
      email: email.toLowerCase(),
    });
    if (existingEmail) {
      return res.status(409).json({
        message: 'Email is already registered',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return response
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} is already taken`,
      });
    }

    res.status(500).json({
      message: 'Server error, please try again',
    });
  }
};

/**
 * User Login
 * Authenticates user and returns JWT token
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

      // Check if email is valid format
    if (!email.toLowerCase().endsWith('@gmail.com')) {
      return res.status(400).json({
        message: 'Email format is not valid', 
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return response
    res.status(200).json({
      message: 'Login successful',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error, please try again',
    });
  }
};