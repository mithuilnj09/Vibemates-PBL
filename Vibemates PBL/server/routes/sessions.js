const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const StudySession = require('../models/StudySession');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { getMongoStatus } = require('../config/db');
const memoryStore = require('../utils/memoryStore');

// @route   POST /api/sessions/create
// @desc    Schedule a new study session
// @access  Private
router.post('/create', protect, async (req, res) => {
  try {
    const { title, subject, date, time, duration, description, partnerId, studyGroupId, meetingLink } =
      req.body;

    if (!title || !subject || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Please provide session title, subject, date, and time.',
      });
    }

    const defaultMeetingLink =
      meetingLink ||
      `https://vibemates.study/room/${encodeURIComponent(title.toLowerCase().replace(/\s+/g, '-'))}-${Date.now().toString().slice(-4)}`;

    if (getMongoStatus()) {
      const session = await StudySession.create({
        title,
        subject,
        date,
        time,
        duration: Number(duration) || 60,
        description: description || '',
        createdBy: req.user._id,
        partner: partnerId || null,
        studyGroupId: studyGroupId || null,
        meetingLink: defaultMeetingLink,
        status: 'upcoming',
      });

      if (partnerId) {
        await Notification.create({
          recipient: partnerId,
          sender: req.user._id,
          type: 'session_reminder',
          title: 'New Study Session Scheduled 📅',
          message: `${req.user.name} scheduled a "${title}" session for ${date} at ${time}.`,
          link: '/sessions',
        });
      }

      const populated = await StudySession.findById(session._id).populate(
        'createdBy partner',
        'name avatar college course'
      );

      return res.status(201).json({
        success: true,
        session: populated,
        message: 'Study session scheduled successfully!',
      });
    } else {
      const newSession = {
        _id: 'ses_' + Date.now(),
        title,
        subject,
        date,
        time,
        duration: Number(duration) || 60,
        description: description || '',
        createdBy: req.user._id,
        partner: partnerId || null,
        studyGroupId: studyGroupId || null,
        meetingLink: defaultMeetingLink,
        status: 'upcoming',
        notes: '',
        createdAt: new Date(),
      };

      memoryStore.studySessions.unshift(newSession);

      if (partnerId) {
        memoryStore.notifications.unshift({
          _id: 'notif_' + Date.now(),
          recipient: partnerId,
          sender: req.user._id,
          type: 'session_reminder',
          title: 'New Study Session Scheduled 📅',
          message: `${req.user.name} scheduled a "${title}" session for ${date} at ${time}.`,
          link: '/sessions',
          read: false,
          createdAt: new Date(),
        });
      }

      const creator = memoryStore.users.find((u) => String(u._id) === String(req.user._id));
      const partner = partnerId
        ? memoryStore.users.find((u) => String(u._id) === String(partnerId))
        : null;

      const populated = {
        ...newSession,
        createdBy: { _id: creator?._id, name: creator?.name, avatar: creator?.avatar },
        partner: partner
          ? { _id: partner._id, name: partner.name, avatar: partner.avatar }
          : null,
      };

      return res.status(201).json({
        success: true,
        session: populated,
        message: 'Study session scheduled successfully!',
      });
    }
  } catch (error) {
    console.error('Schedule session error:', error);
    res.status(500).json({ success: false, message: 'Failed to schedule study session.' });
  }
});

// @route   GET /api/sessions/my-sessions
// @desc    Get current student's upcoming and completed study sessions
// @access  Private
router.get('/my-sessions', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    if (getMongoStatus()) {
      const sessions = await StudySession.find({
        $or: [{ createdBy: userId }, { partner: userId }],
      })
        .sort({ date: 1, time: 1 })
        .populate('createdBy partner', 'name avatar college course year');

      const upcoming = sessions.filter((s) => s.status === 'upcoming');
      const completed = sessions.filter((s) => s.status === 'completed');

      return res.json({
        success: true,
        upcoming,
        completed,
        total: sessions.length,
      });
    } else {
      const userSessions = memoryStore.studySessions
        .filter(
          (s) => String(s.createdBy) === String(userId) || String(s.partner) === String(userId)
        )
        .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
        .map((s) => {
          const creator = memoryStore.users.find((u) => String(u._id) === String(s.createdBy));
          const partner = s.partner
            ? memoryStore.users.find((u) => String(u._id) === String(s.partner))
            : null;

          return {
            ...s,
            createdBy: {
              _id: creator?._id,
              name: creator?.name,
              avatar: creator?.avatar,
              course: creator?.course,
            },
            partner: partner
              ? {
                  _id: partner._id,
                  name: partner.name,
                  avatar: partner.avatar,
                  course: partner.course,
                }
              : null,
          };
        });

      const upcoming = userSessions.filter((s) => s.status === 'upcoming');
      const completed = userSessions.filter((s) => s.status === 'completed');

      return res.json({
        success: true,
        upcoming,
        completed,
        total: userSessions.length,
      });
    }
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve study sessions.' });
  }
});

// @route   PUT /api/sessions/:id/status
// @desc    Update session status or notes
// @access  Private
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (getMongoStatus()) {
      const session = await StudySession.findById(id);
      if (!session) {
        return res.status(404).json({ success: false, message: 'Session not found' });
      }

      if (status) session.status = status;
      if (notes !== undefined) session.notes = notes;

      await session.save();
      return res.json({ success: true, session, message: 'Session updated successfully.' });
    } else {
      const session = memoryStore.studySessions.find((s) => String(s._id) === String(id));
      if (!session) {
        return res.status(404).json({ success: false, message: 'Session not found' });
      }

      if (status) session.status = status;
      if (notes !== undefined) session.notes = notes;

      return res.json({ success: true, session, message: 'Session updated successfully.' });
    }
  } catch (error) {
    console.error('Update session error:', error);
    res.status(500).json({ success: false, message: 'Failed to update session.' });
  }
});

module.exports = router;
