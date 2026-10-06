const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { protect, JWT_SECRET } = require('../middleware/auth');
const User = require('../models/User');
const { getMongoStatus } = require('../config/db');
const memoryStore = require('../utils/memoryStore');

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// @route   POST /api/auth/register
// @desc    Register a new student
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      college,
      course,
      year,
      avatar,
      bio,
      subjectsToLearn,
      subjectsToTeach,
      skillLevel,
      learningStyle,
      learningPace,
      availableDays,
      availableTimeSlots,
      interests,
    } = req.body;

    if (!name || !email || !password || !college || !course || !year) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, password, college, course, and year.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const defaultAvatar =
      avatar ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

    if (getMongoStatus()) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists. Please log in.',
        });
      }

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        college,
        course,
        year,
        avatar: defaultAvatar,
        bio: bio || 'Excited to learn and collaborate with study mates!',
        subjectsToLearn: subjectsToLearn || [],
        subjectsToTeach: subjectsToTeach || [],
        skillLevel: skillLevel || 'Intermediate',
        learningStyle: learningStyle || 'Practical',
        learningPace: learningPace || 'Moderate',
        availableDays: availableDays || ['Monday', 'Wednesday', 'Friday'],
        availableTimeSlots: availableTimeSlots || ['Evening (5 PM - 9 PM)'],
        interests: interests || ['Coding', 'Peer Study'],
      });

      const token = generateToken(user._id);

      const userObj = user.toObject();
      delete userObj.password;

      return res.status(201).json({
        success: true,
        token,
        user: userObj,
        message: 'Registration successful! Welcome to VibeMates.',
      });
    } else {
      // Memory Store logic
      const existing = memoryStore.users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists. Please log in.',
        });
      }

      const newUser = {
        _id: 'usr_' + Date.now(),
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        college,
        course,
        year,
        avatar: defaultAvatar,
        bio: bio || 'Excited to learn and collaborate with study mates!',
        subjectsToLearn: subjectsToLearn || [],
        subjectsToTeach: subjectsToTeach || [],
        skillLevel: skillLevel || 'Intermediate',
        learningStyle: learningStyle || 'Practical',
        learningPace: learningPace || 'Moderate',
        availableDays: availableDays || ['Monday', 'Wednesday', 'Friday'],
        availableTimeSlots: availableTimeSlots || ['Evening (5 PM - 9 PM)'],
        interests: interests || ['Coding', 'Peer Study'],
        isOnline: true,
        lastActive: new Date(),
        createdAt: new Date(),
      };

      memoryStore.users.unshift(newUser);
      const token = generateToken(newUser._id);

      const userCopy = { ...newUser };
      delete userCopy.password;

      return res.status(201).json({
        success: true,
        token,
        user: userCopy,
        message: 'Registration successful! Welcome to VibeMates.',
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration. Please try again.',
    });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate student & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    let user;
    if (getMongoStatus()) {
      user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    } else {
      user = memoryStore.users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please try again.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please try again.',
      });
    }

    const token = generateToken(user._id);

    const userObj = user.toObject ? user.toObject() : { ...user };
    delete userObj.password;

    res.json({
      success: true,
      token,
      user: userObj,
      message: `Welcome back, ${user.name}!`,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login. Please try again.',
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', protect, async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

// @route   PUT /api/auth/profile
// @desc    Update current user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const fieldsToUpdate = [
      'name',
      'college',
      'course',
      'year',
      'avatar',
      'bio',
      'subjectsToLearn',
      'subjectsToTeach',
      'skillLevel',
      'learningStyle',
      'learningPace',
      'availableDays',
      'availableTimeSlots',
      'interests',
    ];

    if (getMongoStatus()) {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      fieldsToUpdate.forEach((field) => {
        if (req.body[field] !== undefined) {
          user[field] = req.body[field];
        }
      });

      await user.save();
      const updated = user.toObject();
      delete updated.password;

      return res.json({
        success: true,
        user: updated,
        message: 'Profile updated successfully!',
      });
    } else {
      const userIdx = memoryStore.users.findIndex(
        (u) => String(u._id) === String(req.user._id)
      );
      if (userIdx === -1) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      fieldsToUpdate.forEach((field) => {
        if (req.body[field] !== undefined) {
          memoryStore.users[userIdx][field] = req.body[field];
        }
      });

      const updated = { ...memoryStore.users[userIdx] };
      delete updated.password;

      return res.json({
        success: true,
        user: updated,
        message: 'Profile updated successfully!',
      });
    }
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile.',
    });
  }
});

// @route   GET /api/auth/demo-users
// @desc    Get sample student accounts for quick testing & evaluation
// @access  Public
router.get('/demo-users', async (req, res) => {
  const users = memoryStore.users.slice(0, 5).map((u) => ({
    id: u._id,
    name: u.name,
    email: u.email,
    role: `${u.course} (${u.year})`,
    college: u.college,
    avatar: u.avatar,
    subjects: u.subjectsToTeach.concat(u.subjectsToLearn).slice(0, 3),
  }));

  res.json({
    success: true,
    demoUsers: users,
  });
});

// @route   POST /api/auth/demo-login
// @desc    Quick 1-click switch login to any demo student
// @access  Public
router.post('/demo-login', async (req, res) => {
  const { email } = req.body;
  const targetEmail = email ? email.toLowerCase() : 'arun@college.edu';

  let user;
  if (getMongoStatus()) {
    user = await User.findOne({ email: targetEmail });
  } else {
    user = memoryStore.users.find((u) => u.email.toLowerCase() === targetEmail);
  }

  if (!user) {
    user = memoryStore.users[0];
  }

  const token = generateToken(user._id);
  const userObj = user.toObject ? user.toObject() : { ...user };
  delete userObj.password;

  res.json({
    success: true,
    token,
    user: userObj,
    message: `Logged in as demo student ${user.name}!`,
  });
});

module.exports = router;
