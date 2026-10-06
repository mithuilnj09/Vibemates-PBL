import React, { useState, useEffect } from 'react';
import {
  User,
  GraduationCap,
  Sparkles,
  BookOpen,
  Calendar,
  Clock,
  Save,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ScheduleMatrix from '../components/ScheduleMatrix';

const SUBJECT_OPTIONS = [
  'Programming',
  'Data Structures',
  'Mathematics',
  'Database',
  'Machine Learning',
  'Web Development',
  'Computer Networks',
  'Operating Systems',
  'Java',
  'Python',
  'C++',
  'Other',
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const TIME_SLOTS = [
  'Morning (8 AM - 12 PM)',
  'Afternoon (12 PM - 5 PM)',
  'Evening (5 PM - 9 PM)',
  'Night (9 PM - 12 AM)',
];

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
];

const MyProfilePage = () => {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    college: '',
    course: '',
    year: '',
    avatar: '',
    bio: '',
    subjectsToLearn: [],
    subjectsToTeach: [],
    skillLevel: 'Intermediate',
    learningStyle: 'Practical',
    learningPace: 'Moderate',
    availableDays: [],
    availableTimeSlots: [],
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        college: user.college || '',
        course: user.course || '',
        year: user.year || '2nd Year',
        avatar: user.avatar || AVATAR_OPTIONS[0],
        bio: user.bio || '',
        subjectsToLearn: user.subjectsToLearn || [],
        subjectsToTeach: user.subjectsToTeach || [],
        skillLevel: user.skillLevel || 'Intermediate',
        learningStyle: user.learningStyle || 'Practical',
        learningPace: user.learningPace || 'Moderate',
        availableDays: user.availableDays || [],
        availableTimeSlots: user.availableTimeSlots || [],
      });
    }
  }, [user]);

  const toggleArrayItem = (field, item) => {
    setFormData((prev) => {
      const current = prev[field] || [];
      const updated = current.includes(item)
        ? current.filter((x) => x !== item)
        : [...current, item];
      return { ...prev, [field]: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await updateProfile(formData);
      if (res.success) {
        setSuccessMsg('Profile and study preferences updated successfully! Matches recalculating...');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(res.error || 'Failed to update profile.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error saving changes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 font-display flex items-center gap-2">
          <span>My Profile & Learning Preferences</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Keep your subjects, pace, and weekly availability updated to receive the most accurate study matches.
        </p>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Card 1: Personal Profile */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-brand-600" />
            <span>Academic & Personal Identity</span>
          </h2>

          {/* Avatar Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Profile Avatar
            </label>
            <div className="flex flex-wrap items-center gap-3">
              {AVATAR_OPTIONS.map((imgUrl, i) => (
                <img
                  key={i}
                  src={imgUrl}
                  alt="Avatar option"
                  onClick={() => setFormData({ ...formData, avatar: imgUrl })}
                  className={`w-12 h-12 rounded-2xl object-cover cursor-pointer ring-2 transition-all ${
                    formData.avatar === imgUrl
                      ? 'ring-brand-600 scale-105 shadow-md'
                      : 'ring-transparent hover:ring-slate-300 opacity-60 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
                College / University
              </label>
              <input
                type="text"
                required
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
                Course / Major
              </label>
              <input
                type="text"
                required
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
                Year of Study
              </label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              >
                <option value="1st Year">1st Year (Freshman)</option>
                <option value="2nd Year">2nd Year (Sophomore)</option>
                <option value="3rd Year">3rd Year (Junior)</option>
                <option value="4th Year">4th Year (Senior)</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
              Bio / Study Goals
            </label>
            <textarea
              rows={2}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Card 2: Subjects & Learning Styles (Requirement #18) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-600" />
            <span>Subjects & Compatibility Metrics</span>
          </h2>

          {/* Subjects I Want to Learn */}
          <div>
            <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
              Subjects I Want to Learn
            </label>
            <div className="flex flex-wrap gap-2">
              {SUBJECT_OPTIONS.map((sub) => {
                const selected = formData.subjectsToLearn.includes(sub);
                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => toggleArrayItem('subjectsToLearn', sub)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      selected
                        ? 'bg-brand-600 text-white border-brand-700 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {selected ? '✓ ' : '+ '}
                    {sub}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subjects I Can Teach */}
          <div>
            <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
              Subjects I Can Teach or Mentor In
            </label>
            <div className="flex flex-wrap gap-2">
              {SUBJECT_OPTIONS.map((sub) => {
                const selected = formData.subjectsToTeach.includes(sub);
                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => toggleArrayItem('subjectsToTeach', sub)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      selected
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {selected ? '★ ' : '+ '}
                    {sub}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
                Skill Level
              </label>
              <select
                value={formData.skillLevel}
                onChange={(e) => setFormData({ ...formData, skillLevel: e.target.value })}
                className="w-full text-sm p-3 rounded-xl border border-slate-200 bg-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
                Learning Pace
              </label>
              <select
                value={formData.learningPace}
                onChange={(e) => setFormData({ ...formData, learningPace: e.target.value })}
                className="w-full text-sm p-3 rounded-xl border border-slate-200 bg-white"
              >
                <option value="Slow">Slow (Meticulous)</option>
                <option value="Moderate">Moderate (Balanced)</option>
                <option value="Fast">Fast (Sprint)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
                Learning Style
              </label>
              <select
                value={formData.learningStyle}
                onChange={(e) => setFormData({ ...formData, learningStyle: e.target.value })}
                className="w-full text-sm p-3 rounded-xl border border-slate-200 bg-white"
              >
                <option value="Visual">Visual</option>
                <option value="Practical">Practical</option>
                <option value="Discussion">Discussion</option>
                <option value="Reading">Reading</option>
                <option value="Problem Solving">Problem Solving</option>
              </select>
            </div>
          </div>
        </div>

        {/* Card 3: Availability Schedule */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-600" />
            <span>Study Availability Times</span>
          </h2>

          <div>
            <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-2">
              Available Days
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DAYS.map((day) => {
                const selected = formData.availableDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleArrayItem('availableDays', day)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                      selected
                        ? 'bg-purple-100 text-purple-800 border-purple-300 font-semibold'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {selected ? '✓ ' : ''}
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-2">
              Time Windows
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TIME_SLOTS.map((slot) => {
                const selected = formData.availableTimeSlots.includes(slot);
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => toggleArrayItem('availableTimeSlots', slot)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border text-left transition-all ${
                      selected
                        ? 'bg-indigo-100 text-indigo-800 border-indigo-300 font-semibold'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {selected ? '✓ ' : ''}
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            <ScheduleMatrix
              availableDays={formData.availableDays}
              availableTimeSlots={formData.availableTimeSlots}
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-2xl text-white font-semibold text-sm gradient-primary hover:opacity-95 shadow-lg shadow-purple-500/25 flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4 text-purple-200" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};

export default MyProfilePage;
