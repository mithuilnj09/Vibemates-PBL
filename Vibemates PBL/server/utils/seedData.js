const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Connection = require('../models/Connection');
const Message = require('../models/Message');
const StudySession = require('../models/StudySession');
const StudyGroup = require('../models/StudyGroup');
const Notification = require('../models/Notification');
const memoryStore = require('./memoryStore');

const seedMongoDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vibemates';

  try {
    console.log('Connecting to MongoDB at:', mongoURI);
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB. Clearing existing collections...');

    await User.deleteMany({});
    await Connection.deleteMany({});
    await Message.deleteMany({});
    await StudySession.deleteMany({});
    await StudyGroup.deleteMany({});
    await Notification.deleteMany({});

    await memoryStore.init();

    console.log('Inserting seed users...');
    const createdUsers = [];
    for (const u of memoryStore.users) {
      const user = await User.create({
        name: u.name,
        email: u.email,
        password: u.password,
        college: u.college,
        course: u.course,
        year: u.year,
        avatar: u.avatar,
        bio: u.bio,
        subjectsToLearn: u.subjectsToLearn,
        subjectsToTeach: u.subjectsToTeach,
        skillLevel: u.skillLevel,
        learningStyle: u.learningStyle,
        learningPace: u.learningPace,
        availableDays: u.availableDays,
        availableTimeSlots: u.availableTimeSlots,
        interests: u.interests,
      });
      createdUsers.push(user);
    }

    const arun = createdUsers[0];
    const rahul = createdUsers[1];
    const priya = createdUsers[2];
    const karthik = createdUsers[3];
    const ananya = createdUsers[4];

    console.log('Inserting seed connections...');
    await Connection.create([
      { requester: arun._id, recipient: rahul._id, status: 'accepted' },
      { requester: priya._id, recipient: arun._id, status: 'accepted' },
      { requester: ananya._id, recipient: arun._id, status: 'pending', notes: 'Looking forward to studying DBMS!' },
    ]);

    console.log('Inserting seed messages...');
    await Message.create([
      {
        sender: arun._id,
        recipient: rahul._id,
        content: 'Hey Rahul! Are you available to study Java & Python algorithms today?',
        read: true,
      },
      {
        sender: rahul._id,
        recipient: arun._id,
        content: "Yes! I'm free after 6 PM. Shall we schedule a 1-hour session?",
        read: true,
      },
      {
        sender: arun._id,
        recipient: rahul._id,
        content: "Awesome! I just scheduled our session on VibeMates for 6:00 PM.",
        read: true,
      },
    ]);

    console.log('Inserting seed study groups...');
    await StudyGroup.create([
      {
        name: 'Java Beginners Cohort',
        subject: 'Java',
        description: 'Friendly peer learning cohort for Java syntax, OOP concepts, and practical coding labs.',
        skillLevel: 'Beginner',
        creator: arun._id,
        members: [arun._id, rahul._id],
        avatar: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80',
      },
      {
        name: 'DSA Preparation Squad',
        subject: 'Data Structures',
        description: 'Daily LeetCode discussions, dynamic programming, and mock technical interviews.',
        skillLevel: 'Intermediate',
        creator: karthik._id,
        members: [karthik._id, arun._id, priya._id],
        avatar: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80',
      },
      {
        name: 'Machine Learning Study Group',
        subject: 'Machine Learning',
        description: 'Exploring neural networks, PyTorch, and Kaggle student competitions together.',
        skillLevel: 'Intermediate',
        creator: rahul._id,
        members: [rahul._id, ananya._id],
        avatar: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=400&q=80',
      },
    ]);

    console.log('Inserting seed study sessions...');
    await StudySession.create([
      {
        title: 'Java Practice & DSA Trees Session',
        subject: 'Java',
        date: new Date().toISOString().split('T')[0],
        time: '18:00',
        duration: 60,
        description: 'Reviewing Binary Search Trees and coding BST insertion in Java.',
        createdBy: arun._id,
        partner: rahul._id,
        status: 'upcoming',
        meetingLink: 'https://vibemates.study/room/dsa-trees-practice',
      },
      {
        title: 'DBMS SQL & Indexing Deep Dive',
        subject: 'Database',
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        time: '19:30',
        duration: 90,
        description: 'B-Tree indexes, query optimization, and normalization.',
        createdBy: priya._id,
        partner: arun._id,
        status: 'upcoming',
        meetingLink: 'https://vibemates.study/room/dbms-indexing',
      },
    ]);

    console.log('Inserting seed notifications...');
    await Notification.create([
      {
        recipient: arun._id,
        sender: ananya._id,
        type: 'connection_request',
        title: 'New Connection Request',
        message: 'Ananya Patel sent you a study connection request for DBMS & DSA.',
        link: '/connections',
        read: false,
      },
      {
        recipient: arun._id,
        sender: rahul._id,
        type: 'new_message',
        title: 'New Message from Rahul',
        message: "Yes! I'm free after 6 PM. Shall we schedule a 1-hour session?",
        link: '/chat',
        read: false,
      },
    ]);

    console.log('✅ Seed completed successfully! Database populated with realistic student data.');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedMongoDB();
}

module.exports = seedMongoDB;
