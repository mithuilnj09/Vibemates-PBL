const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Message = require('../models/Message');
const User = require('../models/User');
const StudyGroup = require('../models/StudyGroup');
const { getMongoStatus } = require('../config/db');
const memoryStore = require('../utils/memoryStore');

// @route   GET /api/messages/direct/:partnerId
// @desc    Get chat conversation between current student and a study partner
// @access  Private
router.get('/direct/:partnerId', protect, async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const partnerId = req.params.partnerId;

    if (getMongoStatus()) {
      const messages = await Message.find({
        $or: [
          { sender: currentUserId, recipient: partnerId },
          { sender: partnerId, recipient: currentUserId },
        ],
      })
        .sort({ createdAt: 1 })
        .populate('sender recipient', 'name avatar');

      // Mark unread messages as read
      await Message.updateMany(
        { sender: partnerId, recipient: currentUserId, read: false },
        { read: true }
      );

      return res.json({
        success: true,
        messages,
      });
    } else {
      const messages = memoryStore.messages
        .filter(
          (m) =>
            (String(m.sender) === String(currentUserId) && String(m.recipient) === String(partnerId)) ||
            (String(m.sender) === String(partnerId) && String(m.recipient) === String(currentUserId))
        )
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .map((m) => {
          const senderUser = memoryStore.users.find((u) => String(u._id) === String(m.sender));
          const recipientUser = memoryStore.users.find((u) => String(u._id) === String(m.recipient));

          if (String(m.sender) === String(partnerId)) {
            m.read = true;
          }

          return {
            ...m,
            sender: { _id: senderUser?._id, name: senderUser?.name, avatar: senderUser?.avatar },
            recipient: { _id: recipientUser?._id, name: recipientUser?.name, avatar: recipientUser?.avatar },
          };
        });

      return res.json({
        success: true,
        messages,
      });
    }
  } catch (error) {
    console.error('Get direct messages error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve messages.' });
  }
});

// @route   GET /api/messages/group/:groupId
// @desc    Get messages inside a study group
// @access  Private
router.get('/group/:groupId', protect, async (req, res) => {
  try {
    const groupId = req.params.groupId;

    if (getMongoStatus()) {
      const messages = await Message.find({ studyGroupId: groupId })
        .sort({ createdAt: 1 })
        .populate('sender', 'name avatar');

      return res.json({
        success: true,
        messages,
      });
    } else {
      const messages = memoryStore.messages
        .filter((m) => String(m.studyGroupId) === String(groupId))
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .map((m) => {
          const senderUser = memoryStore.users.find((u) => String(u._id) === String(m.sender));
          return {
            ...m,
            sender: { _id: senderUser?._id, name: senderUser?.name, avatar: senderUser?.avatar },
          };
        });

      return res.json({
        success: true,
        messages,
      });
    }
  } catch (error) {
    console.error('Get group messages error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve group messages.' });
  }
});

// @route   POST /api/messages/send
// @desc    Send a message (Direct or Group)
// @access  Private
router.post('/send', protect, async (req, res) => {
  try {
    const { recipientId, studyGroupId, content, attachments } = req.body;
    const senderId = req.user._id;

    if (!content || content.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Message content cannot be empty.',
      });
    }

    if (!recipientId && !studyGroupId) {
      return res.status(400).json({
        success: false,
        message: 'Must specify a recipient student or a study group.',
      });
    }

    if (getMongoStatus()) {
      const message = await Message.create({
        sender: senderId,
        recipient: recipientId || null,
        studyGroupId: studyGroupId || null,
        content: content.trim(),
        attachments: attachments || [],
      });

      const populated = await Message.findById(message._id).populate(
        'sender recipient',
        'name avatar'
      );

      // Notify Socket.io if available
      if (req.app.get('io')) {
        const io = req.app.get('io');
        if (studyGroupId) {
          io.to(`group_${studyGroupId}`).emit('new_message', populated);
        } else if (recipientId) {
          io.to(`user_${recipientId}`).emit('new_message', populated);
        }
      }

      return res.status(201).json({
        success: true,
        message: populated,
      });
    } else {
      const newMsg = {
        _id: 'msg_' + Date.now(),
        sender: senderId,
        recipient: recipientId || null,
        studyGroupId: studyGroupId || null,
        content: content.trim(),
        attachments: attachments || [],
        read: false,
        createdAt: new Date(),
      };

      memoryStore.messages.push(newMsg);

      const senderUser = memoryStore.users.find((u) => String(u._id) === String(senderId));
      const recipientUser = recipientId
        ? memoryStore.users.find((u) => String(u._id) === String(recipientId))
        : null;

      const populated = {
        ...newMsg,
        sender: { _id: senderUser?._id, name: senderUser?.name, avatar: senderUser?.avatar },
        recipient: recipientUser
          ? { _id: recipientUser._id, name: recipientUser.name, avatar: recipientUser.avatar }
          : null,
      };

      if (req.app.get('io')) {
        const io = req.app.get('io');
        if (studyGroupId) {
          io.to(`group_${studyGroupId}`).emit('new_message', populated);
        } else if (recipientId) {
          io.to(`user_${recipientId}`).emit('new_message', populated);
        }
      }

      return res.status(201).json({
        success: true,
        message: populated,
      });
    }
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ success: false, message: 'Failed to send message.' });
  }
});

// @route   GET /api/messages/conversations
// @desc    Get student's recent conversations list with last message & unread count
// @access  Private
router.get('/conversations', protect, async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // Get connected mates
    let connectedMates = [];
    if (getMongoStatus()) {
      const connections = await Connection.find({
        $or: [{ requester: currentUserId }, { recipient: currentUserId }],
        status: 'accepted',
      }).populate('requester recipient', 'name avatar college course year isOnline lastActive');

      connectedMates = connections.map((c) => {
        return String(c.requester._id) === String(currentUserId)
          ? c.recipient
          : c.requester;
      });
    } else {
      const connections = memoryStore.connections.filter(
        (c) =>
          (String(c.requester) === String(currentUserId) || String(c.recipient) === String(currentUserId)) &&
          c.status === 'accepted'
      );

      connectedMates = connections.map((c) => {
        const mateId =
          String(c.requester) === String(currentUserId) ? c.recipient : c.requester;
        const u = memoryStore.users.find((usr) => String(usr._id) === String(mateId));
        return {
          _id: u?._id,
          name: u?.name,
          avatar: u?.avatar,
          college: u?.college,
          course: u?.course,
          year: u?.year,
          isOnline: u?.isOnline,
          lastActive: u?.lastActive,
        };
      });
    }

    // Attach latest message & unread count to each mate
    const convos = await Promise.all(
      connectedMates.map(async (mate) => {
        let lastMsg = null;
        let unread = 0;

        if (getMongoStatus()) {
          lastMsg = await Message.findOne({
            $or: [
              { sender: currentUserId, recipient: mate._id },
              { sender: mate._id, recipient: currentUserId },
            ],
          }).sort({ createdAt: -1 });

          unread = await Message.countDocuments({
            sender: mate._id,
            recipient: currentUserId,
            read: false,
          });
        } else {
          const userMsgs = memoryStore.messages
            .filter(
              (m) =>
                (String(m.sender) === String(currentUserId) && String(m.recipient) === String(mate._id)) ||
                (String(m.sender) === String(mate._id) && String(m.recipient) === String(currentUserId))
            )
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

          lastMsg = userMsgs[0] || null;
          unread = userMsgs.filter(
            (m) => String(m.sender) === String(mate._id) && !m.read
          ).length;
        }

        return {
          mate,
          lastMessage: lastMsg,
          unreadCount: unread,
        };
      })
    );

    res.json({
      success: true,
      conversations: convos,
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve conversations.' });
  }
});

module.exports = router;
