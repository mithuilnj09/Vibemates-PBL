const mongoose = require('mongoose');

const StudySessionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a session title'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Please provide the subject'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Please provide a session date'],
    },
    time: {
      type: String,
      required: [true, 'Please provide a session time'],
    },
    duration: {
      type: Number,
      default: 60, // in minutes
    },
    description: {
      type: String,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    studyGroupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudyGroup',
      default: null,
    },
    status: {
      type: String,
      enum: ['upcoming', 'completed', 'cancelled'],
      default: 'upcoming',
    },
    meetingLink: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.StudySession || mongoose.model('StudySession', StudySessionSchema);
