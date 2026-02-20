const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { signAccessToken } = require('../services/tokenService');

async function register(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'name, email, and password are required.' });
  }

  const existing = await User.findOne({ email: String(email).toLowerCase() });
  if (existing) {
    return res.status(409).json({ success: false, message: 'User already exists with this email.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  const token = signAccessToken({ userId: user._id.toString(), email: user.email });

  return res.status(201).json({
    success: true,
    data: {
      token,
      user: { id: user._id, name: user.name, email: user.email },
    },
  });
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'email and password are required.' });
  }

  const user = await User.findOne({ email: String(email).toLowerCase() });
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials.' });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ success: false, message: 'Invalid credentials.' });
  }

  const token = signAccessToken({ userId: user._id.toString(), email: user.email });

  return res.json({
    success: true,
    data: {
      token,
      user: { id: user._id, name: user.name, email: user.email },
    },
  });
}

module.exports = {
  register,
  login,
};
