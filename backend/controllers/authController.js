const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @route POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user._id, user.email, user.role);
    res.json({ token, user: { id: user._id, email: user.email, role: user.role, fullName: user.fullName } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Optional: /api/auth/register (only admin)
exports.register = async (req, res) => {
  try {
    const { email, password, role, fullName } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });
    const user = await User.create({ email, password, role, fullName });
    const token = generateToken(user._id, user.email, user.role);
    res.status(201).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};