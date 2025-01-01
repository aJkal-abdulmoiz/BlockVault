const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

// Register
const register = async (req, res) => {
  const { username , email, password } = req.body;

  // Validation
  await body('email').isEmail().withMessage('Invalid email format').run(req);
  await body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation errors',
      errors: errors.array(),
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const existingUserName = await User.findOne({ username });
    if (existingUserName) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: 'User registered successfully', token });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ message: 'An unexpected server error occurred' });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  // Validation
  await body('email').isEmail().withMessage('Invalid email format').run(req);
  await body('password')
    .notEmpty()
    .withMessage('Password is required')
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation errors',
      errors: errors.array(),
    });
  }

  try {
    const user = await User.findOne({ email });
    const username = user.username
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token,username });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'An unexpected server error occurred' });
  }
};

module.exports = { register, login };
