const express = require('express');
const User = require('../models/User');
const validateObjectId = require('../utils/validateObjectId');

const router = express.Router();

// GET /users?role=teacher - list users, optionally filtered by role
router.get('/', async (req, res, next) => {
  try {
    const q = {};
    if (req.query.role) q.role = req.query.role;
    const users = await User.find(q).select('_id email role teacherId').sort({ email: 1 });
    res.json({ success: true, users: users.map(u => ({ id: u._id, email: u.email, role: u.role, teacherId: u.teacherId })) });
  } catch (err) { next(err); }
});

module.exports = router;
