const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

async function main(){
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB for seeding');

  const User = require('../models/User');
  const Task = require('../models/Task');

  // clean existing data (be cautious)
  await Task.deleteMany({});
  await User.deleteMany({});

  const teacherPassword = await bcrypt.hash('teacherpass', 10);
  const teacher = new User({ email: 'teacher@example.com', passwordHash: teacherPassword, role: 'teacher' });
  await teacher.save();

  const studentPassword = await bcrypt.hash('studentpass', 10);
  const student = new User({ email: 'student@example.com', passwordHash: studentPassword, role: 'student', teacherId: teacher._id });
  await student.save();

  const tasks = [
    { userId: student._id, title: 'Read Chapter 1', description: 'Read the first chapter of the book', progress: 'not-started' },
    { userId: student._id, title: 'Submit Quiz', description: 'Complete the short quiz', progress: 'in-progress' },
    { userId: teacher._id, title: 'Prepare Slides', description: 'Prepare lecture slides for week 2', progress: 'not-started' }
  ];

  for (const t of tasks){
    const task = new Task(t);
    await task.save();
  }

  console.log('Seed complete');
  console.log('Teacher id:', teacher._id.toString());
  console.log('Student id:', student._id.toString());
  process.exit(0);
}

main().catch(err=>{ console.error(err); process.exit(1); });
