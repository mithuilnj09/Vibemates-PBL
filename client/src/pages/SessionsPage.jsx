import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Play,
  CheckCircle,
  Plus,
  Users,
  BookOpen,
  Share2,
  FileText,
  RotateCcw,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CreateSessionModal from '../components/CreateSessionModal';
import StudyRoomModal from '../components/StudyRoomModal';

const SessionsPage = () => {
  const { user } = useAuth();
  const [sessionsData, setSessionsData] = useState({ upcoming: [], completed: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'completed'

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeRoomSession, setActiveRoomSession] = useState(null);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await api.sessions.getMySessions();
      if (res.success) {
        setSessionsData({
          upcoming: res.upcoming || [],
          completed: res.completed || [],
        });
      }
    } catch (err) {
      console.warn('Sessions error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [user?._id]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 font-display flex items-center gap-2">
            <span>Study Sessions</span>
            <span className="text-xs font-bold bg-brand-100 text-brand-700 px-3 py-1 rounded-full">
              {sessionsData.upcoming.length} Upcoming
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Organize study sprints, solve problems together, and track collaborative learning time.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-semibold text-white gradient-primary hover:opacity-95 shadow-md shadow-purple-500/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Session</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'upcoming'
              ? 'bg-purple-100 text-purple-800 font-bold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Upcoming Sessions ({sessionsData.upcoming.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'completed'
              ? 'bg-emerald-100 text-emerald-800 font-bold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          <span>Completed ({sessionsData.completed.length})</span>
        </button>
      </div>

      {/* Tab: Upcoming Sessions */}
      {activeTab === 'upcoming' && (
        <div>
          {sessionsData.upcoming.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto">
                <Calendar className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-navy-900">No upcoming sessions</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Schedule a focused study session with your study partner.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white gradient-primary"
              >
                Schedule First Session
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sessionsData.upcoming.map((session) => (
                <div
                  key={session._id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2.5 py-1 text-xs font-bold bg-brand-100 text-brand-700 rounded-lg">
                        {session.subject}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Ready to Join
                      </span>
                    </div>

                    <h3 className="font-bold text-lg text-navy-900 leading-snug">
                      {session.title}
                    </h3>

                    {session.description && (
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-2.5 rounded-xl">
                        {session.description}
                      </p>
                    )}

                    <div className="space-y-1.5 text-xs text-slate-500 pt-1">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-brand-600" />
                        <span>
                          {session.date} • {session.time} ({session.duration} minutes)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-brand-600" />
                        <span>
                          With: <strong className="text-navy-900">{session.partner?.name || 'Study Mate'}</strong>{' '}
                          ({session.partner?.course || 'Peer'})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => setActiveRoomSession(session)}
                      className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-2 shadow-sm transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      <span>Enter Study Room</span>
                    </button>
                    <a
                      href={session.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs"
                      title="Direct Room Link"
                    >
                      <Share2 className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Completed Sessions */}
      {activeTab === 'completed' && (
        <div className="space-y-4">
          {sessionsData.completed.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-sm space-y-2 max-w-md mx-auto">
              <CheckCircle className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-navy-800">No completed sessions yet</p>
              <p className="text-xs text-slate-400">
                Sessions you complete in the virtual study room will be recorded here with your study notes.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sessionsData.completed.map((session) => (
                <div
                  key={session._id}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                      {session.subject}
                    </span>
                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Completed
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-navy-900">{session.title}</h4>
                  <p className="text-xs text-slate-500">
                    {session.date} • {session.duration} mins with {session.partner?.name || 'Study Mate'}
                  </p>
                  {session.notes && (
                    <div className="p-2.5 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100">
                      <strong>Session Notes:</strong> {session.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <CreateSessionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSessionCreated={() => fetchSessions()}
      />

      <StudyRoomModal
        session={activeRoomSession}
        isOpen={!!activeRoomSession}
        onClose={() => setActiveRoomSession(null)}
        onSessionCompleted={() => fetchSessions()}
      />

    </div>
  );
};

export default SessionsPage;
