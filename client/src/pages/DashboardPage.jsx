import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Compass,
  Calendar,
  BookOpen,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Clock,
  Play,
  CheckCircle,
  Plus,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import StudentCard from '../components/StudentCard';
import ProfileModal from '../components/ProfileModal';
import CreateSessionModal from '../components/CreateSessionModal';
import StudyRoomModal from '../components/StudyRoomModal';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [topMatches, setTopMatches] = useState([]);
  const [connectionsStats, setConnectionsStats] = useState({ totalConnected: 0, pendingReceivedCount: 0 });
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [activeRoomSession, setActiveRoomSession] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [matchesRes, connsRes, sessionsRes, groupsRes] = await Promise.all([
        api.users.getMatches({ minScore: 60 }),
        api.connections.getConnections(),
        api.sessions.getMySessions(),
        api.groups.getGroups(),
      ]);

      if (matchesRes.success) {
        setTopMatches(matchesRes.mates.slice(0, 3));
      }
      if (connsRes.success) {
        setConnectionsStats(connsRes.stats);
      }
      if (sessionsRes.success) {
        setUpcomingSessions(sessionsRes.upcoming || []);
      }
      if (groupsRes.success) {
        setGroups(groupsRes.groups.slice(0, 3));
      }
    } catch (err) {
      console.warn('Dashboard fetch warning:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user?._id]);

  const handleViewProfile = (student) => {
    setSelectedStudent(student);
    setShowProfileModal(true);
  };

  const handleStartChat = (student) => {
    navigate('/chat', { state: { targetPartnerId: student._id } });
  };

  const handleScheduleWithStudent = (student) => {
    setSelectedStudent(student);
    setShowSessionModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Personalized Welcome Header (Requirement #9) */}
      <div className="bg-gradient-to-r from-purple-800 via-brand-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-purple-200 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>Smart Match System Online</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display">
            Welcome back, {user?.name || 'Student'}! 👋
          </h1>
          <p className="text-sm sm:text-base text-purple-200 font-medium">
            “Ready to learn something new today?”
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 flex-wrap">
          <Link
            to="/find-mates"
            className="py-2.5 px-4 rounded-xl bg-white text-brand-800 font-bold text-xs hover:bg-slate-100 transition-colors flex items-center gap-1.5 shadow-md"
          >
            <Compass className="w-4 h-4" />
            <span>Find Study Mate</span>
          </Link>
          <button
            onClick={() => setShowSessionModal(true)}
            className="py-2.5 px-4 rounded-xl bg-purple-900/60 hover:bg-purple-900/80 border border-purple-300/30 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 backdrop-blur-md"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Session</span>
          </button>
        </div>

        {/* Decorative circle glow */}
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* 4 Dashboard Metric Cards (Requirement #9) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Card 1: My Matches */}
        <Link
          to="/find-mates"
          className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              My Matches
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl sm:text-3xl font-extrabold text-navy-900 font-display">
              {topMatches.length > 0 ? `${topMatches.length}+ High` : 'Exploring'}
            </p>
            <p className="text-xs text-brand-600 font-semibold flex items-center gap-1 mt-1">
              <span>View peer matches</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </p>
          </div>
        </Link>

        {/* Card 2: Pending Requests */}
        <Link
          to="/connections"
          className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pending Requests
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl sm:text-3xl font-extrabold text-navy-900 font-display">
              {connectionsStats.pendingReceivedCount}
            </p>
            <p className="text-xs text-amber-600 font-semibold flex items-center gap-1 mt-1">
              <span>{connectionsStats.pendingReceivedCount > 0 ? 'Respond to peers' : 'Manage connections'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </p>
          </div>
        </Link>

        {/* Card 3: Upcoming Sessions */}
        <Link
          to="/sessions"
          className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Upcoming Sessions
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl sm:text-3xl font-extrabold text-navy-900 font-display">
              {upcomingSessions.length}
            </p>
            <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <span>Scheduled study rooms</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </p>
          </div>
        </Link>

        {/* Card 4: Study Groups */}
        <Link
          to="/groups"
          className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Study Groups
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl sm:text-3xl font-extrabold text-navy-900 font-display">
              {groups.length} Cohorts
            </p>
            <p className="text-xs text-indigo-600 font-semibold flex items-center gap-1 mt-1">
              <span>Join peer communities</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </p>
          </div>
        </Link>

      </div>

      {/* Recommended Study Mates Section (Requirement #10) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-navy-900 flex items-center gap-2">
              <span>Top Recommended Mates</span>
              <span className="text-xs font-bold bg-brand-100 text-brand-700 px-2.5 py-0.5 rounded-full">
                Smart Algorithm
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Ranked by compatibility percentage with your subjects & study availability.
            </p>
          </div>
          <Link
            to="/find-mates"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <span>See All Mates</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Top Matches Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topMatches.map((mate) => (
            <StudentCard
              key={mate._id}
              student={mate}
              currentUser={user}
              onViewProfile={handleViewProfile}
              onStartChat={handleStartChat}
              onConnectSuccess={() => fetchDashboardData()}
            />
          ))}
        </div>
      </div>

      {/* Upcoming Sessions Widget & Active Groups Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Upcoming Study Sessions (Requirement #15) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-600" />
              <h3 className="font-bold text-base text-navy-900">Upcoming Study Sessions</h3>
            </div>
            <button
              onClick={() => setShowSessionModal(true)}
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule New</span>
            </button>
          </div>

          {upcomingSessions.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-navy-800">No upcoming sessions yet</p>
              <p className="text-xs text-slate-400">
                Connect with a mate and schedule your first 1-hour study sprint!
              </p>
              <button
                onClick={() => setShowSessionModal(true)}
                className="mt-2 px-4 py-2 rounded-xl text-xs font-semibold text-white gradient-primary"
              >
                Schedule Session
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingSessions.map((session) => (
                <div
                  key={session._id}
                  className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-purple-50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-brand-100 text-brand-700 rounded-md">
                        {session.subject}
                      </span>
                      <h4 className="font-bold text-sm text-navy-900">{session.title}</h4>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {session.date} • {session.time} ({session.duration} mins)
                      </span>
                      {session.partner && (
                        <span>• With <strong className="text-navy-800">{session.partner.name}</strong></span>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveRoomSession(session)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 shadow-sm"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Join Room</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Active Study Groups (Requirement #16) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-600" />
              <h3 className="font-bold text-base text-navy-900">Active Study Groups</h3>
            </div>
            <Link
              to="/groups"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {groups.map((group) => (
              <div
                key={group._id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 hover:border-brand-200 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={group.avatar}
                    alt={group.name}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-navy-900 truncate">{group.name}</h4>
                    <p className="text-[11px] text-slate-500">
                      {group.subject} • {group.memberCount || group.members?.length || 20} members
                    </p>
                  </div>
                </div>
                <Link
                  to="/groups"
                  className="px-3 py-1 rounded-lg text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 flex-shrink-0"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Modals */}
      <ProfileModal
        student={selectedStudent}
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onStartChat={handleStartChat}
        onScheduleSession={handleScheduleWithStudent}
        onConnectSuccess={() => fetchDashboardData()}
      />

      <CreateSessionModal
        isOpen={showSessionModal}
        onClose={() => setShowSessionModal(false)}
        preselectedPartner={selectedStudent}
        onSessionCreated={() => fetchDashboardData()}
      />

      <StudyRoomModal
        session={activeRoomSession}
        isOpen={!!activeRoomSession}
        onClose={() => setActiveRoomSession(null)}
        onSessionCompleted={() => fetchDashboardData()}
      />

    </div>
  );
};

export default DashboardPage;
