/**
 * VibeMates Smart Compatibility Matching Algorithm
 * Calculates compatibility between two students based on:
 * - Subject Match: 30%
 * - Availability Match: 25%
 * - Skill Level Compatibility: 15%
 * - Learning Pace Compatibility: 15%
 * - Learning Style Compatibility: 15%
 */

function calculateCompatibility(currentUser, peer) {
  if (!currentUser || !peer) return { score: 75, breakdown: {} };

  // 1. Subject Match (30%)
  const userWants = (currentUser.subjectsToLearn || []).map((s) => s.toLowerCase().trim());
  const userTeaches = (currentUser.subjectsToTeach || []).map((s) => s.toLowerCase().trim());
  const peerWants = (peer.subjectsToLearn || []).map((s) => s.toLowerCase().trim());
  const peerTeaches = (peer.subjectsToTeach || []).map((s) => s.toLowerCase().trim());

  // Peer can teach what user wants
  const userCanLearnFromPeer = userWants.filter((sub) =>
    peerTeaches.some((pSub) => pSub.includes(sub) || sub.includes(pSub))
  );

  // User can teach what peer wants
  const peerCanLearnFromUser = peerWants.filter((sub) =>
    userTeaches.some((uSub) => uSub.includes(sub) || sub.includes(uSub))
  );

  // Both want to learn together
  const coLearningSubjects = userWants.filter((sub) =>
    peerWants.some((pSub) => pSub.includes(sub) || sub.includes(pSub))
  );

  let subjectScore = 30; // base score
  if (userCanLearnFromPeer.length > 0 && peerCanLearnFromUser.length > 0) {
    subjectScore = 100; // Perfect mutual exchange!
  } else if (userCanLearnFromPeer.length > 0 || peerCanLearnFromUser.length > 0) {
    subjectScore = 88;
  } else if (coLearningSubjects.length >= 2) {
    subjectScore = 85;
  } else if (coLearningSubjects.length === 1) {
    subjectScore = 70;
  } else if (
    (userTeaches.length > 0 && peerTeaches.some((p) => userTeaches.includes(p)))
  ) {
    subjectScore = 60;
  }

  // 2. Availability Match (25%)
  const userDays = (currentUser.availableDays || []).map((d) => d.toLowerCase());
  const peerDays = (peer.availableDays || []).map((d) => d.toLowerCase());
  const sharedDays = userDays.filter((d) => peerDays.includes(d));

  const userSlots = (currentUser.availableTimeSlots || []).map((s) => s.toLowerCase());
  const peerSlots = (peer.availableTimeSlots || []).map((s) => s.toLowerCase());
  const sharedSlots = userSlots.filter((s) =>
    peerSlots.some((ps) => ps.slice(0, 5) === s.slice(0, 5))
  );

  let availabilityScore = 40;
  const dayFactor = userDays.length > 0 ? (sharedDays.length / Math.max(userDays.length, 1)) : 0.5;
  const slotFactor = userSlots.length > 0 ? (sharedSlots.length / Math.max(userSlots.length, 1)) : 0.5;

  if (sharedDays.length >= 2 && sharedSlots.length >= 1) {
    availabilityScore = 95;
  } else if (sharedDays.length >= 1 && sharedSlots.length >= 1) {
    availabilityScore = 85;
  } else if (sharedDays.length >= 1) {
    availabilityScore = 70;
  } else {
    availabilityScore = Math.round(35 + dayFactor * 30 + slotFactor * 25);
  }

  // 3. Skill Level Compatibility (15%)
  const skillRank = { Beginner: 1, Intermediate: 2, Advanced: 3 };
  const uRank = skillRank[currentUser.skillLevel] || 2;
  const pRank = skillRank[peer.skillLevel] || 2;
  const diff = Math.abs(uRank - pRank);

  let skillScore = 70;
  if (diff === 0) {
    skillScore = 95; // Same level peer study
  } else if (diff === 1) {
    skillScore = 90; // Complementary pace
  } else {
    skillScore = 75; // Mentor-mentee dynamic
  }

  // 4. Learning Pace Compatibility (15%)
  const paceRank = { Slow: 1, Moderate: 2, Fast: 3 };
  const uPace = paceRank[currentUser.learningPace] || 2;
  const pPace = paceRank[peer.learningPace] || 2;
  const paceDiff = Math.abs(uPace - pPace);

  let paceScore = 50;
  if (paceDiff === 0) {
    paceScore = 100;
  } else if (paceDiff === 1) {
    paceScore = 75;
  } else {
    paceScore = 50;
  }

  // 5. Learning Style Compatibility (15%)
  const uStyle = currentUser.learningStyle || 'Practical';
  const pStyle = peer.learningStyle || 'Practical';

  let styleScore = 65;
  if (uStyle === pStyle) {
    styleScore = 100;
  } else {
    const compatiblePairs = [
      ['Practical', 'Problem Solving'],
      ['Visual', 'Practical'],
      ['Discussion', 'Problem Solving'],
      ['Reading', 'Discussion'],
      ['Visual', 'Discussion'],
    ];
    const isCompatible = compatiblePairs.some(
      ([s1, s2]) =>
        (uStyle === s1 && pStyle === s2) || (uStyle === s2 && pStyle === s1)
    );
    styleScore = isCompatible ? 85 : 70;
  }

  // Final Match Calculation
  const totalScore = Math.round(
    subjectScore * 0.3 +
      availabilityScore * 0.25 +
      skillScore * 0.15 +
      paceScore * 0.15 +
      styleScore * 0.15
  );

  // Clamp safely between 50% and 99% for motivating realistic student metrics
  const finalScore = Math.min(Math.max(totalScore, 52), 98);

  return {
    score: finalScore,
    breakdown: {
      subjectScore,
      availabilityScore,
      skillScore,
      paceScore,
      styleScore,
      sharedDays,
      coLearningSubjects,
      userCanLearnFromPeer,
      peerCanLearnFromUser,
    },
  };
}

module.exports = {
  calculateCompatibility,
};
