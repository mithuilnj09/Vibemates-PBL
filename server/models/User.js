const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    college: {
      type: String,
      required: [true, 'Please provide your college name'],
      trim: true,
    },
    course: {
      type: String,
      required: [true, 'Please provide your course/degree (e.g. Computer Science)'],
      trim: true,
    },
    year: {
      type: String,
      required: [true, 'Please provide your academic year (e.g. 1st Year, 2nd Year)'],
      trim: true,
    },
    avatar: {
      type: String,
      default: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vibemate',
    },
    bio: {
      type: String,
      default: 'Excited to learn collaboratively and grow together on VibeMates!',
    },
    subjectsToLearn: {
      type: [String],
      default: [],
    },
    subjectsToTeach: {
      type: [String],
      default: [],
    },
    skillLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
    learningStyle: {
      type: String,
      enum: ['Visual', 'Practical', 'Discussion', 'Reading', 'Problem Solving'],
      default: 'Practical',
    },
    learningPace: {
      type: String,
      enum: ['Slow', 'Moderate', 'Fast'],
      default: 'Moderate',
    },
    availableDays: {
      type: [String],
      default: ['Monday', 'Wednesday', 'Friday'],
    },
    availableTimeSlots: {
      type: [String],
      default: ['Evening (5 PM - 9 PM)'],
    },
    interests: {
      type: [String],
      default: ['Coding', 'Hackathons', 'Peer Learning'],
    },
    isOnline: {
      type: Boolean,
      default: true,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
