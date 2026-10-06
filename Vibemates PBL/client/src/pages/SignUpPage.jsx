import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  BookOpen,
  Sparkles,
  Calendar,
  Clock,
  Award,
  Zap,
  Target,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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

const SignUpPage = () => {
  const [step, setStep] = useState(1); // Step 1: Basic info, Step 2: Learning & Schedule
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  // Basic Information
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    college: '',
    course: 'Computer Science',
    year: '2nd Year',
    avatar: AVATAR_OPTIONS[0],
    bio: '',
    subjectsToLearn: ['Data Structures', 'Machine Learning'],
    subjectsToTeach: ['Programming', 'Java'],
    skillLevel: 'Intermediate',
    learningStyle: 'Practical',
    learningPace: 'Moderate',
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    availableTimeSlots: ['Evening (5 PM - 9 PM)'],
  });

  const toggleArrayItem = (field, item) => {
    setFormData((prev) => {
      const current = prev[field] || [];
      const updated = current.includes(item)
        ? current.filter((x) => x !== item)
        : [...current, item];
      return { ...prev, [field]: updated };
    });
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.college) {
      setError('Please fill in your name, email, password, and college name.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError('');
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.subjectsToLearn.length === 0) {
      setError('Please select at least one subject you want to learn.');
      return;
    }
    if (formData.availableDays.length === 0) {
      setError('Please select at least one available study day.');
      return;
    }

    setSubmitting(true);
    setError('');

    const res = await register(formData);
    setSubmitting(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Registration failed. Please check inputs.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-3xl border border-purple-100 shadow-xl p-6 sm:p-10 relative overflow-hidden">
        
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 gradient-primary"></div>

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Step {step} of 2: {step === 1 ? 'Academic Details' : 'Learning Profile & Schedule'}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              {step === 1 ? '50% Complete' : 'Almost Done!'}
            </span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full gradient-primary transition-all duration-300 rounded-full"
              style={{ width: step === 1 ? '50%' : '100%' }}
            ></div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 font-display">
            {step === 1 ? 'Create Your VibeMates Profile' : 'Customize Your Learning Preferences'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-lg mx-auto">
            {step === 1
              ? 'Tell us about yourself so other students can discover and connect with you.'
              : 'Our algorithm uses your subjects and availability to calculate compatibility.'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 rounded-2xl bg-rose-50 text-rose-700 text-xs border border-rose-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Basic Information */}
        {step === 1 && (
          <form onSubmit={handleNext} className="space-y-5">
            {/* Avatar Selection */}
            <div>
              <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-2">
                Choose Profile Avatar
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
                        : 'ring-transparent hover:ring-slate-300 opacity-70 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
                  College Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="student@college.edu"
                  className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
                Password (min 6 characters) *
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* College, Course, Year */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
                  College / University *
                </label>
                <input
                  type="text"
                  required
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  placeholder="e.g. NIT Trichy, DTU, VIT"
                  className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
                  Course / Major *
                </label>
                <input
                  type="text"
                  required
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  placeholder="e.g. Computer Science"
                  className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
                  Academic Year *
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

            {/* Bio */}
            <div>
              <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
                About Me (Bio)
              </label>
              <textarea
                rows={2}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="What are your study habits? What are you currently working on?"
                className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="pt-4 flex items-center justify-between">
              <Link to="/login" className="text-xs text-slate-500 hover:text-navy-900">
                Already have an account? <span className="font-semibold text-brand-600">Login</span>
              </Link>
              <button
                type="submit"
                className="py-3 px-6 rounded-xl text-white font-semibold text-sm gradient-primary hover:opacity-95 shadow-md shadow-purple-500/25 flex items-center gap-2"
              >
                <span>Continue to Preferences</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Learning Information & Availability */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subjects to Learn */}
            <div>
              <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
                Subjects I Want to Learn (Select all that apply) *
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

            {/* Subjects Can Teach */}
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

            {/* Skill Level, Pace, Style (Requirement #7) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
                  Skill Level
                </label>
                <select
                  value={formData.skillLevel}
                  onChange={(e) => setFormData({ ...formData, skillLevel: e.target.value })}
                  className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
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
                  className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
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
                  className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value="Visual">Visual (Diagrams & Videos)</option>
                  <option value="Practical">Practical (Hands-on Code)</option>
                  <option value="Discussion">Discussion (Debate & Talk)</option>
                  <option value="Reading">Reading (Docs & Books)</option>
                  <option value="Problem Solving">Problem Solving (Exercises)</option>
                </select>
              </div>
            </div>

            {/* Available Days */}
            <div>
              <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
                Available Days *
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

            {/* Available Time Slots */}
            <div>
              <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
                Available Time Slots
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

            {/* Bottom buttons */}
            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-2.5 px-4 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="py-3.5 px-7 rounded-xl text-white font-semibold text-sm gradient-primary hover:opacity-95 shadow-lg shadow-purple-500/25 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-purple-200" />
                <span>{submitting ? 'Creating Profile...' : 'Create My Profile'}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default SignUpPage;
