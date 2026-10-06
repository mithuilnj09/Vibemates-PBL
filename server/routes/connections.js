const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Connection = require('../models/Connection');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { getMongoStatus } = require('../config/db');
const memoryStore = require('../utils/memoryStore');

// @route   POST /api/connections/request/:recipientId
// @desc    Send a connection request to a student
// @access  Private
router.post('/request/:recipientId', protect, async (req, res) => {
  try {
    const recipientId = req.params.recipientId;
    const requesterId = req.user._id;
    const { notes } = req.body;

    if (String(recipientId) === String(requesterId)) {
      return res.status(400).json({
        success: false,
        message: 'You cannot send a connection request to yourself.',
      });
    }

    if (getMongoStatus()) {
      const recipient = await User.findById(recipientId);
      if (!recipient) {
        return res.status(404).json({ success: false, message: 'Student not found.' });
      }

      // Check existing connection
      const existing = await Connection.findOne({
        $or: [
          { requester: requesterId, recipient: recipientId },
          { requester: recipientId, recipient: requesterId },
        ],
      });

      if (existing) {
        if (existing.status === 'accepted') {
          return res.status(400).json({
            success: false,
            message: 'You are already VibeMates!',
          });
        }
        if (existing.status === 'pending') {
          return res.status(400).json({
            success: false,
            message: 'A connection request is already pending between you two.',
          });
        }
        // If rejected, allow re-request
        existing.status = 'pending';
        existing.requester = requesterId;
        existing.recipient = recipientId;
        existing.notes = notes || '';
        await existing.save();
      } else {
        await Connection.create({
          requester: requesterId,
          recipient: recipientId,
          status: 'pending',
          notes: notes || '',
        });
      }

      // Create notification for recipient
      await Notification.create({
        recipient: recipientId,
        sender: requesterId,
        type: 'connection_request',
        title: 'New Connection Request',
        message: `${req.user.name} sent you a study connection request.`,
        link: '/connections',
      });

      return res.status(201).json({
        success: true,
        message: 'Connection request sent successfully!',
      });
    } else {
      const recipient = memoryStore.users.find(
        (u) => String(u._id) === String(recipientId)
      );
      if (!recipient) {
        return res.status(404).json({ success: false, message: 'Student not found.' });
      }

      const existingIndex = memoryStore.connections.findIndex(
        (c) =>
          (String(c.requester) === String(requesterId) && String(c.recipient) === String(recipientId)) ||
          (String(c.requester) === String(recipientId) && String(c.recipient) === String(requesterId))
      );

      if (existingIndex !== -1) {
        const existing = memoryStore.connections[existingIndex];
        if (existing.status === 'accepted') {
          return res.status(400).json({
            success: false,
            message: 'You are already VibeMates!',
          });
        }
        if (existing.status === 'pending') {
          return res.status(400).json({
            success: false,
            message: 'A connection request is already pending between you two.',
          });
        }
        existing.status = 'pending';
        existing.requester = requesterId;
        existing.recipient = recipientId;
        existing.notes = notes || '';
      } else {
        memoryStore.connections.push({
          _id: 'conn_' + Date.now(),
          requester: requesterId,
          recipient: recipientId,
          status: 'pending',
          notes: notes || '',
          createdAt: new Date(),
        });
      }

      // Add notification in memory store
      memoryStore.notifications.unshift({
        _id: 'notif_' + Date.now(),
        recipient: recipientId,
        sender: requesterId,
        type: 'connection_request',
        title: 'New Connection Request',
        message: `${req.user.name} sent you a study connection request.`,
        link: '/connections',
        read: false,
        createdAt: new Date(),
      });

      return res.status(201).json({
        success: true,
        message: 'Connection request sent successfully!',
      });
    }
  } catch (error) {
    console.error('Request connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send connection request.',
    });
  }
});

// @route   PUT /api/connections/respond/:connectionId
// @desc    Accept or reject a connection request
// @access  Private
router.put('/respond/:connectionId', protect, async (req, res) => {
  try {
    const { connectionId } = req.params;
    const { action } = req.body; // 'accept' or 'reject'

    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Action must be either 'accept' or 'reject'.",
      });
    }

    const newStatus = action === 'accept' ? 'accepted' : 'rejected';

    if (getMongoStatus()) {
      const conn = await Connection.findById(connectionId).populate('requester recipient');
      if (!conn) {
        return res.status(404).json({ success: false, message: 'Connection request not found.' });
      }

      // Only the recipient can accept or reject
      if (String(conn.recipient._id) !== String(req.user._id)) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to respond to this request.',
        });
      }

      conn.status = newStatus;
      await conn.save();

      if (action === 'accept') {
        // Create celebration notification for the requester
        await Notification.create({
          recipient: conn.requester._id,
          sender: req.user._id,
          type: 'connection_accepted',
          title: 'Connection Accepted 🎉',
          message: `${req.user.name} accepted your request. You are now VibeMates!`,
          link: '/chat',
        });
      }

      return res.json({
        success: true,
        status: newStatus,
        message:
          action === 'accept'
            ? 'You are now VibeMates! 🎉'
            : 'Connection request rejected.',
      });
    } else {
      const conn = memoryStore.connections.find(
        (c) => String(c._id) === String(connectionId)
      );

      if (!conn) {
        return res.status(404).json({ success: false, message: 'Connection request not found.' });
      }

      if (String(conn.recipient) !== String(req.user._id)) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to respond to this request.',
        });
      }

      conn.status = newStatus;

      if (action === 'accept') {
        memoryStore.notifications.unshift({
          _id: 'notif_' + Date.now(),
          recipient: conn.requester,
          sender: req.user._id,
          type: 'connection_accepted',
          title: 'Connection Accepted 🎉',
          message: `${req.user.name} accepted your request. You are now VibeMates!`,
          link: '/chat',
          read: false,
          createdAt: new Date(),
        });
      }

      return res.json({
        success: true,
        status: newStatus,
        message:
          action === 'accept'
            ? 'You are now VibeMates! 🎉'
            : 'Connection request rejected.',
      });
    }
  } catch (error) {
    console.error('Respond connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process connection response.',
    });
  }
});

// @route   GET /api/connections
// @desc    Get user's connections (accepted, pending received, pending sent)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    if (getMongoStatus()) {
      const allUserConns = await Connection.find({
        $or: [{ requester: userId }, { recipient: userId }],
      }).populate('requester recipient', '-password');

      const accepted = [];
      const pendingReceived = [];
      const pendingSent = [];

      allUserConns.forEach((c) => {
        const isRequester = String(c.requester._id) === String(userId);
        const mate = isRequester ? c.recipient : c.requester;

        if (c.status === 'accepted') {
          accepted.push({
            connectionId: c._id,
            mate,
            createdAt: c.createdAt,
          });
        } else if (c.status === 'pending') {
          if (isRequester) {
            pendingSent.push({
              connectionId: c._id,
              mate,
              notes: c.notes,
              createdAt: c.createdAt,
            });
          } else {
            pendingReceived.push({
              connectionId: c._id,
              mate,
              notes: c.notes,
              createdAt: c.createdAt,
            });
          }
        }
      });

      return res.json({
        success: true,
        stats: {
          totalConnected: accepted.length,
          pendingReceivedCount: pendingReceived.length,
          pendingSentCount: pendingSent.length,
        },
        accepted,
        pendingReceived,
        pendingSent,
      });
    } else {
      const userConns = memoryStore.connections.filter(
        (c) => String(c.requester) === String(userId) || String(c.recipient) === String(userId)
      );

      const accepted = [];
      const pendingReceived = [];
      const pendingSent = [];

      userConns.forEach((c) => {
        const isRequester = String(c.requester) === String(userId);
        const mateId = isRequester ? c.recipient : c.requester;
        const mateObj = memoryStore.users.find((u) => String(u._id) === String(mateId));
        if (!mateObj) return;

        const mate = { ...mateObj };
        delete mate.password;

        if (c.status === 'accepted') {
          accepted.push({
            connectionId: c._id,
            mate,
            createdAt: c.createdAt,
          });
        } else if (c.status === 'pending') {
          if (isRequester) {
            pendingSent.push({
              connectionId: c._id,
              mate,
              notes: c.notes,
              createdAt: c.createdAt,
            });
          } else {
            pendingReceived.push({
              connectionId: c._id,
              mate,
              notes: c.notes,
              createdAt: c.createdAt,
            });
          }
        }
      });

      return res.json({
        success: true,
        stats: {
          totalConnected: accepted.length,
          pendingReceivedCount: pendingReceived.length,
          pendingSentCount: pendingSent.length,
        },
        accepted,
        pendingReceived,
        pendingSent,
      });
    }
  } catch (error) {
    console.error('Get connections error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve connections.',
    });
  }
});

module.exports = router;
