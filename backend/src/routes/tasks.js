const express = require('express');
const Task = require('../models/Task');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { createTaskSchema, updateTaskSchema } = require('../validators/task');
const validateObjectId = require('../utils/validateObjectId');

const router = express.Router();

router.use(auth);

// GET /tasks
router.get('/', async (req, res, next) => {
  try {
    const { id, role } = req.user;
    if (role === 'student') {
      // student: only own tasks
      const tasks = await Task.find({ userId: id }).sort({ createdAt: -1 });
      return res.json({ success: true, tasks });
    }
    // teacher: tasks created by teacher OR tasks belonging to their assigned students
    const students = await User.find({ teacherId: id }).select('_id');
    const studentIds = students.map(s => s._id);
    const tasks = await Task.find({ $or: [ { userId: id }, { userId: { $in: studentIds } } ] }).sort({ createdAt: -1 });
    res.json({ success: true, tasks });
  } catch (err) { next(err); }
});

// POST /tasks
router.post('/', async (req, res, next) => {
  try {
    const { error, value } = createTaskSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.message });
    const { userId, title, description, dueDate, progress } = value;
    if (!validateObjectId(userId)) return res.status(400).json({ success: false, message: 'Invalid userId' });
    if (userId !== req.user.id) return res.status(403).json({ success: false, message: 'userId must match the logged-in user' });
    const task = new Task({ userId, title, description, dueDate, progress });
    await task.save();
    res.json({ success: true, task });
  } catch (err) { next(err); }
});

// PUT /tasks/:id
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!validateObjectId(id)) return res.status(400).json({ success: false, message: 'Invalid task id' });
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    if (task.userId.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Only owner can update' });
    const { error, value } = updateTaskSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.message });
    Object.assign(task, value);
    await task.save();
    res.json({ success: true, task });
  } catch (err) { next(err); }
});

// DELETE /tasks/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!validateObjectId(id)) return res.status(400).json({ success: false, message: 'Invalid task id' });
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    if (task.userId.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Only owner can delete' });
    // use deleteOne() to remove document (remove() may not exist on newer Mongoose versions)
    await task.deleteOne();
    res.json({ success: true, message: 'Task deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
