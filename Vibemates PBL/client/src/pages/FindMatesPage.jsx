import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Sparkles,
  RotateCcw,
  BookOpen,
  SlidersHorizontal,
  GraduationCap,
  Users,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StudentCard from '../components/StudentCard';
import ProfileModal from '../components/ProfileModal';
import CreateSessionModal from '../components/CreateSessionModal';

const SUBJECT_OPTIONS = [
  'All',
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
];

const SKILL_LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const PACES = ['All', 'Slow', 'Moderate', 'Fast'];
const STYLES = ['All', 'Visual', 'Practical', 'Discussion', 'Reading', 'Problem Solving'];
const DAYS = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const FindMatesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('All');
  const [skillLevel, setSkillLevel] = useState('All');
  const [learningPace, setLearningPace] = useState('All');
  const [learningStyle, setLearningStyle] = useState('All');
  const [availability, setAvailability] = useState('All');
  const [minScore, setMinScore] = useState(0);

  // Data state
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Modals
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);

  const fetchMates = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (subject !== 'All') params.subject = subject;
      if (skillLevel !== 'All') params.skillLevel = skillLevel;
      if (learningPace !== 'All') params.learningPace = learningPace;
      if (learningStyle !== 'All') params.learningStyle = learningStyle;
      if (availability !== 'All') params.availability = availability;
      if (minScore > 0) params.minScore = minScore;

      const res = await api.users.getMatches(params);
      if (res.success) {
        setStudents(res.mates || []);
      }
    } catch (err) {
      console.warn('Find mates fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMates();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, subject, skillLevel, learningPace, learningStyle, availability, minScore, user?._id]);

  const resetFilters = () => {
    setSearch('');
    setSubject('All');
    setSkillLevel('All');
    setLearningPace('All');
    setLearningStyle('All');
    setAvailability('All');
    setMinScore(0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 font-display flex items-center gap-2">
            <span>Find Your Study Mate</span>
            <span className="text-xs font-bold bg-brand-100 text-brand-700 px-3 py-1 rounded-full">
              {students.length} Peers Available
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Search by subject, skill, or student name. Matches are auto-ranked by compatibility.
          </p>
        </div>

        {/* Toggle Mobile Filter */}
        <button
          onClick={() => setShowFiltersMobile(!showFiltersMobile)}
          className="md:hidden flex items-center gap-2 py-2 px-3.5 rounded-xl border border-slate-200 text-xs font-semibold text-navy-800 bg-white"
        >
          <SlidersHorizontal className="w-4 h-4 text-brand-600" />
          <span>{showFiltersMobile ? 'Hide Filters' : 'Show Advanced Filters'}</span>
        </button>
      </div>

      {/* Search Bar (Requirement #11) */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          <Search className="w-5 h-5 text-brand-600" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by subject, skill, course, college or student name..."
          className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-slate-400 hover:text-navy-900"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filter Toolbar (Desktop + Mobile Collapsible) */}
      <div
        className={`bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4 ${
          showFiltersMobile ? 'block' : 'hidden md:block'
        }`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2 text-xs font-bold text-navy-900 uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-brand-600" />
            <span>Smart Filters</span>
          </div>
          <button
            onClick={resetFilters}
            className="text-xs text-brand-600 hover:text-brand-800 font-semibold flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          
          {/* Subject Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Subject
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white"
            >
              {SUBJECT_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Skill Level Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Skill Level
            </label>
            <select
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white"
            >
              {SKILL_LEVELS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Learning Pace */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Learning Pace
            </label>
            <select
              value={learningPace}
              onChange={(e) => setLearningPace(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white"
            >
              {PACES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Learning Style */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Learning Style
            </label>
            <select
              value={learningStyle}
              onChange={(e) => setLearningStyle(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white"
            >
              {STYLES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Availability Day */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Availability
            </label>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white"
            >
              {DAYS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Min Compatibility Score */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Min Match Score ({minScore}%)
            </label>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="w-full h-2 bg-purple-100 rounded-lg appearance-none cursor-pointer accent-purple-600 mt-2.5"
            />
          </div>

        </div>
      </div>

      {/* Grid of Student Cards (Requirement #11) */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500">Calculating compatibility scores...</p>
        </div>
      ) : students.length === 0 ? (
        /* Empty State (Requirement #27) */
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-navy-900">No study mates found yet</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Start exploring students to find your perfect learning partner. Try adjusting your subject or availability filters.
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white gradient-primary shadow-md"
          >
            Clear Filters & View All Mates
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <StudentCard
              key={student._id}
              student={student}
              currentUser={user}
              onViewProfile={(st) => {
                setSelectedStudent(st);
                setShowProfileModal(true);
              }}
              onStartChat={(st) => navigate('/chat', { state: { targetPartnerId: st._id } })}
              onConnectSuccess={() => fetchMates()}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <ProfileModal
        student={selectedStudent}
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onStartChat={(st) => navigate('/chat', { state: { targetPartnerId: st._id } })}
        onScheduleSession={(st) => {
          setSelectedStudent(st);
          setShowSessionModal(true);
        }}
        onConnectSuccess={() => fetchMates()}
      />

      <CreateSessionModal
        isOpen={showSessionModal}
        onClose={() => setShowSessionModal(false)}
        preselectedPartner={selectedStudent}
        onSessionCreated={() => {
          alert('Study session scheduled!');
          fetchMates();
        }}
      />

    </div>
  );
};

export default FindMatesPage;
