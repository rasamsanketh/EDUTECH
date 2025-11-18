const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const { signupSchema, loginSchema } = require('../validators/auth');
const validateObjectId = require('../utils/validateObjectId');

const authMiddleware = require('../middleware/auth');
const router = express.Router();

const loginLimiter = rateLimit({ windowMs: 60*1000, max: 6, message: { success: false, message: 'Too many login attempts, try again later' } });

router.post('/signup', async (req, res, next) => {
  try {
    const { error, value } = signupSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.message });

    const { email, password, role, teacherId } = value;
    if (role === 'student') {
      if (!teacherId) return res.status(400).json({ success: false, message: 'Students must specify a teacherId' });
      if (!validateObjectId(teacherId)) return res.status(400).json({ success: false, message: 'Invalid teacherId' });
      const teacher = await User.findById(teacherId);
      if (!teacher || teacher.role !== 'teacher') return res.status(400).json({ success: false, message: 'teacherId must reference an existing teacher' });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ success: false, message: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ email, passwordHash, role, teacherId: role === 'student' ? teacherId : undefined });
    await user.save();
    res.json({ success: true, user: { id: user._id, email: user.email, role: user.role, teacherId: user.teacherId } });
  } catch (err) { next(err); }
});

router.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.message });
    const { email, password } = value;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ success: false, message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ success: true, token });
  } catch (err) { next(err); }
});

// GET /auth/me - returns current user info
router.get('/me', authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('_id email role teacherId');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user: { id: user._id, email: user.email, role: user.role, teacherId: user.teacherId } });
  } catch (err) { next(err); }
});

module.exports = router;
