const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const StudyGroup = require('../models/StudyGroup');
const User = require('../models/User');
const { getMongoStatus } = require('../config/db');
const memoryStore = require('../utils/memoryStore');

// @route   GET /api/groups
// @desc    Get all study groups
// @access  Public / Private
router.get('/', async (req, res) => {
  try {
    const { subject, skillLevel, search } = req.query;

    if (getMongoStatus()) {
      let query = {};
      if (subject && subject !== 'All') {
        query.subject = new RegExp(subject, 'i');
      }
      if (skillLevel && skillLevel !== 'All') {
        query.skillLevel = skillLevel;
      }
      if (search) {
        query.$or = [
          { name: new RegExp(search, 'i') },
          { description: new RegExp(search, 'i') },
          { subject: new RegExp(search, 'i') },
        ];
      }

      const groups = await StudyGroup.find(query).populate('creator', 'name avatar');
      return res.json({ success: true, groups });
    } else {
      let groups = [...memoryStore.studyGroups];

      if (subject && subject !== 'All') {
        groups = groups.filter((g) => g.subject.toLowerCase().includes(subject.toLowerCase()));
      }
      if (skillLevel && skillLevel !== 'All') {
        groups = groups.filter((g) => g.skillLevel === skillLevel);
      }
      if (search) {
        const q = search.toLowerCase();
        groups = groups.filter(
          (g) =>
            g.name.toLowerCase().includes(q) ||
            g.description.toLowerCase().includes(q) ||
            g.subject.toLowerCase().includes(q)
        );
      }

      const populated = groups.map((g) => {
        const creator = memoryStore.users.find((u) => String(u._id) === String(g.creator));
        return {
          ...g,
          creator: { _id: creator?._id, name: creator?.name, avatar: creator?.avatar },
        };
      });

      return res.json({ success: true, groups: populated });
    }
  } catch (error) {
    console.error('Get groups error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve study groups.' });
  }
});

// @route   POST /api/groups/create
// @desc    Create a new study group
// @access  Private
router.post('/create', protect, async (req, res) => {
  try {
    const { name, subject, description, skillLevel, avatar, maxMembers, tags } = req.body;

    if (!name || !subject) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both group name and subject.',
      });
    }

    const defaultAvatar =
      avatar ||
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80';

    if (getMongoStatus()) {
      const group = await StudyGroup.create({
        name: name.trim(),
        subject: subject.trim(),
        description: description || '',
        skillLevel: skillLevel || 'All Levels',
        creator: req.user._id,
        members: [req.user._id],
        avatar: defaultAvatar,
        maxMembers: Number(maxMembers) || 50,
        tags: tags || [subject],
      });

      const populated = await StudyGroup.findById(group._id).populate('creator', 'name avatar');
      return res.status(201).json({
        success: true,
        group: populated,
        message: 'Study group created successfully!',
      });
    } else {
      const newGroup = {
        _id: 'grp_' + Date.now(),
        name: name.trim(),
        subject: subject.trim(),
        description: description || '',
        skillLevel: skillLevel || 'All Levels',
        creator: req.user._id,
        members: [req.user._id],
        avatar: defaultAvatar,
        maxMembers: Number(maxMembers) || 50,
        memberCount: 1,
        tags: tags || [subject],
        createdAt: new Date(),
      };

      memoryStore.studyGroups.unshift(newGroup);

      const creator = memoryStore.users.find((u) => String(u._id) === String(req.user._id));
      const populated = {
        ...newGroup,
        creator: { _id: creator?._id, name: creator?.name, avatar: creator?.avatar },
      };

      return res.status(201).json({
        success: true,
        group: populated,
        message: 'Study group created successfully!',
      });
    }
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({ success: false, message: 'Failed to create study group.' });
  }
});

// @route   POST /api/groups/:id/join
// @desc    Join or leave a study group
// @access  Private
router.post('/:id/join', protect, async (req, res) => {
  try {
    const groupId = req.params.id;
    const userId = req.user._id;

    if (getMongoStatus()) {
      const group = await StudyGroup.findById(groupId);
      if (!group) {
        return res.status(404).json({ success: false, message: 'Group not found.' });
      }

      const isMember = group.members.some((m) => String(m) === String(userId));

      if (isMember) {
        // Leave group
        group.members = group.members.filter((m) => String(m) !== String(userId));
        await group.save();
        return res.json({
          success: true,
          action: 'left',
          message: `You left ${group.name}.`,
          membersCount: group.members.length,
        });
      } else {
        // Join group
        if (group.members.length >= group.maxMembers) {
          return res.status(400).json({
            success: false,
            message: 'This study group has reached maximum capacity.',
          });
        }
        group.members.push(userId);
        await group.save();
        return res.json({
          success: true,
          action: 'joined',
          message: `Successfully joined ${group.name}! 🎉`,
          membersCount: group.members.length,
        });
      }
    } else {
      const group = memoryStore.studyGroups.find((g) => String(g._id) === String(groupId));
      if (!group) {
        return res.status(404).json({ success: false, message: 'Group not found.' });
      }

      const isMember = group.members.some((m) => String(m) === String(userId));

      if (isMember) {
        group.members = group.members.filter((m) => String(m) !== String(userId));
        if (group.memberCount) group.memberCount = Math.max(1, group.memberCount - 1);
        return res.json({
          success: true,
          action: 'left',
          message: `You left ${group.name}.`,
          membersCount: group.memberCount || group.members.length,
        });
      } else {
        group.members.push(userId);
        if (group.memberCount) group.memberCount += 1;
        return res.json({
          success: true,
          action: 'joined',
          message: `Successfully joined ${group.name}! 🎉`,
          membersCount: group.memberCount || group.members.length,
        });
      }
    }
  } catch (error) {
    console.error('Join/leave group error:', error);
    res.status(500).json({ success: false, message: 'Failed to update group membership.' });
  }
});

// @route   GET /api/groups/:id
// @desc    Get detailed group info with members
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const groupId = req.params.id;

    if (getMongoStatus()) {
      const group = await StudyGroup.findById(groupId)
        .populate('creator', 'name avatar')
        .populate('members', 'name avatar college course year skillLevel');

      if (!group) {
        return res.status(404).json({ success: false, message: 'Group not found.' });
      }

      return res.json({ success: true, group });
    } else {
      const group = memoryStore.studyGroups.find((g) => String(g._id) === String(groupId));
      if (!group) {
        return res.status(404).json({ success: false, message: 'Group not found.' });
      }

      const creator = memoryStore.users.find((u) => String(u._id) === String(group.creator));
      const members = group.members
        .map((mId) => memoryStore.users.find((u) => String(u._id) === String(mId)))
        .filter(Boolean)
        .map((u) => ({
          _id: u._id,
          name: u.name,
          avatar: u.avatar,
          college: u.college,
          course: u.course,
          year: u.year,
          skillLevel: u.skillLevel,
        }));

      return res.json({
        success: true,
        group: {
          ...group,
          creator: { _id: creator?._id, name: creator?.name, avatar: creator?.avatar },
          members,
        },
      });
    }
  } catch (error) {
    console.error('Get group details error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve group details.' });
  }
});

module.exports = router;
