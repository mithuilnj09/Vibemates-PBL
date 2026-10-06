const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Connection = require('../models/Connection');
const { getMongoStatus } = require('../config/db');
const memoryStore = require('../utils/memoryStore');
const { calculateCompatibility } = require('../utils/matchingAlgorithm');

// Helper to determine connection status between two students
const getConnectionStatus = async (currentUserId, peerId) => {
  if (getMongoStatus()) {
    const conn = await Connection.findOne({
      $or: [
        { requester: currentUserId, recipient: peerId },
        { requester: peerId, recipient: currentUserId },
      ],
    });

    if (!conn) return 'none';
    if (conn.status === 'accepted') return 'connected';
    if (conn.status === 'rejected') return 'rejected';
    if (String(conn.requester) === String(currentUserId)) return 'pending_sent';
    return 'pending_received';
  } else {
    const conn = memoryStore.connections.find(
      (c) =>
        (String(c.requester) === String(currentUserId) && String(c.recipient) === String(peerId)) ||
        (String(c.requester) === String(peerId) && String(c.recipient) === String(currentUserId))
    );

    if (!conn) return 'none';
    if (conn.status === 'accepted') return 'connected';
    if (conn.status === 'rejected') return 'rejected';
    if (String(conn.requester) === String(currentUserId)) return 'pending_sent';
    return 'pending_received';
  }
};

// @route   GET /api/users/matches
// @desc    Get all recommended peer students with match scores and filters
// @access  Private
router.get('/matches', protect, async (req, res) => {
  try {
    const {
      search,
      subject,
      skillLevel,
      learningPace,
      learningStyle,
      availability,
      college,
      year,
      minScore,
    } = req.query;

    let peers = [];

    if (getMongoStatus()) {
      const query = { _id: { $ne: req.user._id } };
      peers = await User.find(query).select('-password');
    } else {
      peers = memoryStore.users.filter(
        (u) => String(u._id) !== String(req.user._id)
      );
    }

    // Process each peer with compatibility score and connection status
    const matchedPeers = await Promise.all(
      peers.map(async (peer) => {
        const peerObj = peer.toObject ? peer.toObject() : { ...peer };
        delete peerObj.password;

        const { score, breakdown } = calculateCompatibility(req.user, peerObj);
        const connectionStatus = await getConnectionStatus(req.user._id, peerObj._id);

        return {
          ...peerObj,
          compatibilityScore: score,
          compatibilityBreakdown: breakdown,
          connectionStatus,
        };
      })
    );

    // Filter results
    let filtered = matchedPeers.filter((p) => {
      // Search by name, subject, or skill
      if (search && search.trim() !== '') {
        const q = search.toLowerCase();
        const inName = p.name.toLowerCase().includes(q);
        const inCollege = p.college.toLowerCase().includes(q);
        const inBio = (p.bio || '').toLowerCase().includes(q);
        const inLearn = (p.subjectsToLearn || []).some((s) => s.toLowerCase().includes(q));
        const inTeach = (p.subjectsToTeach || []).some((s) => s.toLowerCase().includes(q));
        const inInterests = (p.interests || []).some((s) => s.toLowerCase().includes(q));

        if (!inName && !inCollege && !inBio && !inLearn && !inTeach && !inInterests) {
          return false;
        }
      }

      // Subject filter
      if (subject && subject !== 'All') {
        const sub = subject.toLowerCase();
        const hasSubject =
          (p.subjectsToLearn || []).some((s) => s.toLowerCase().includes(sub)) ||
          (p.subjectsToTeach || []).some((s) => s.toLowerCase().includes(sub));
        if (!hasSubject) return false;
      }

      // Skill level filter
      if (skillLevel && skillLevel !== 'All') {
        if (p.skillLevel !== skillLevel) return false;
      }

      // Learning pace filter
      if (learningPace && learningPace !== 'All') {
        if (p.learningPace !== learningPace) return false;
      }

      // Learning style filter
      if (learningStyle && learningStyle !== 'All') {
        if (p.learningStyle !== learningStyle) return false;
      }

      // Availability filter (day)
      if (availability && availability !== 'All') {
        const hasDay = (p.availableDays || []).some(
          (d) => d.toLowerCase() === availability.toLowerCase()
        );
        if (!hasDay) return false;
      }

      // College filter
      if (college && college !== 'All') {
        if (!p.college.toLowerCase().includes(college.toLowerCase())) return false;
      }

      // Year filter
      if (year && year !== 'All') {
        if (!p.year.toLowerCase().includes(year.toLowerCase())) return false;
      }

      // Min compatibility score
      if (minScore && Number(minScore) > 0) {
        if (p.compatibilityScore < Number(minScore)) return false;
      }

      return true;
    });

    // Sort by compatibility score: highest to lowest
    filtered.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    res.json({
      success: true,
      count: filtered.length,
      mates: filtered,
    });
  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve matches.',
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get detailed student profile with compatibility breakdown
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const peerId = req.params.id;

    let peer;
    if (getMongoStatus()) {
      peer = await User.findById(peerId).select('-password');
    } else {
      peer = memoryStore.users.find((u) => String(u._id) === String(peerId));
    }

    if (!peer) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found.',
      });
    }

    const peerObj = peer.toObject ? peer.toObject() : { ...peer };
    delete peerObj.password;

    const { score, breakdown } = calculateCompatibility(req.user, peerObj);
    const connectionStatus = await getConnectionStatus(req.user._id, peerObj._id);

    res.json({
      success: true,
      profile: {
        ...peerObj,
        compatibilityScore: score,
        compatibilityBreakdown: breakdown,
        connectionStatus,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve student profile.',
    });
  }
});

module.exports = router;
