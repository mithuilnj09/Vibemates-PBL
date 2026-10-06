const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Notification = require('../models/Notification');
const { getMongoStatus } = require('../config/db');
const memoryStore = require('../utils/memoryStore');

// @route   GET /api/notifications
// @desc    Get user's notifications and unread count
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    if (getMongoStatus()) {
      const notifications = await Notification.find({ recipient: userId })
        .sort({ createdAt: -1 })
        .populate('sender', 'name avatar');

      const unreadCount = notifications.filter((n) => !n.read).length;

      return res.json({
        success: true,
        unreadCount,
        notifications,
      });
    } else {
      const userNotifs = memoryStore.notifications
        .filter((n) => String(n.recipient) === String(userId))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map((n) => {
          const sender = n.sender
            ? memoryStore.users.find((u) => String(u._id) === String(n.sender))
            : null;
          return {
            ...n,
            sender: sender ? { _id: sender._id, name: sender.name, avatar: sender.avatar } : null,
          };
        });

      const unreadCount = userNotifs.filter((n) => !n.read).length;

      return res.json({
        success: true,
        unreadCount,
        notifications: userNotifs,
      });
    }
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve notifications.' });
  }
});

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put('/read-all', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    if (getMongoStatus()) {
      await Notification.updateMany({ recipient: userId, read: false }, { read: true });
    } else {
      memoryStore.notifications.forEach((n) => {
        if (String(n.recipient) === String(userId)) {
          n.read = true;
        }
      });
    }

    res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (error) {
    console.error('Mark read all error:', error);
    res.status(500).json({ success: false, message: 'Failed to mark notifications.' });
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark single notification as read
// @access  Private
router.put('/:id/read', protect, async (req, res) => {
  try {
    const { id } = req.params;

    if (getMongoStatus()) {
      await Notification.findByIdAndUpdate(id, { read: true });
    } else {
      const notif = memoryStore.notifications.find((n) => String(n._id) === String(id));
      if (notif) notif.read = true;
    }

    res.json({ success: true, message: 'Notification marked as read.' });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ success: false, message: 'Failed to update notification.' });
  }
});

module.exports = router;
