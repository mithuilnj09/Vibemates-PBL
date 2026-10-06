import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  Calendar,
  Sparkles,
  ArrowRight,
  GraduationCap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProfileModal from '../components/ProfileModal';
import CreateSessionModal from '../components/CreateSessionModal';

const ConnectionsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('accepted'); // 'accepted', 'pendingReceived', 'pendingSent'
  const [connectionsData, setConnectionsData] = useState({
    accepted: [],
    pendingReceived: [],
    pendingSent: [],
    stats: { totalConnected: 0, pendingReceivedCount: 0, pendingSentCount: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [respondingId, setRespondingId] = useState(null);
  const [celebrationMessage, setCelebrationMessage] = useState('');

  // Modals
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);

  const fetchConnections = async () => {
    setLoading(true);
    try {
      const res = await api.connections.getConnections();
      if (res.success) {
        setConnectionsData({
          accepted: res.accepted || [],
          pendingReceived: res.pendingReceived || [],
          pendingSent: res.pendingSent || [],
          stats: res.stats || { totalConnected: 0, pendingReceivedCount: 0, pendingSentCount: 0 },
        });
      }
    } catch (err) {
      console.warn('Connections fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, [user?._id]);

  const handleRespond = async (connectionId, action, mateName) => {
    setRespondingId(connectionId);
    try {
      const res = await api.connections.respondRequest(connectionId, action);
      if (res.success) {
        if (action === 'accept') {
          // Trigger celebratory confetti effect
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#7C3AED', '#4F46E5', '#10B981', '#F59E0B'],
          });
          setCelebrationMessage(`🎉 You and ${mateName} are now VibeMates!`);
          setTimeout(() => setCelebrationMessage(''), 5000);
        }
        await fetchConnections();
      }
    } catch (err) {
      alert(err.message || 'Failed to update request');
    } finally {
      setRespondingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 font-display flex items-center gap-2">
            <span>My Connections & Requests</span>
            <span className="text-xs font-bold bg-brand-100 text-brand-700 px-3 py-1 rounded-full">
              {connectionsData.accepted.length} VibeMates
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your peer-learning network and review incoming study requests.
          </p>
        </div>

        <Link
          to="/find-mates"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white gradient-primary hover:opacity-95 shadow-md shadow-purple-500/20 self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Discover New Mates</span>
        </Link>
      </div>

      {/* Celebration Alert banner if accepted */}
      {celebrationMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="text-sm font-bold text-emerald-900">{celebrationMessage}</p>
              <p className="text-xs text-emerald-700">
                You can now chat in real-time and schedule collaborative study sessions!
              </p>
            </div>
          </div>
          <Link
            to="/chat"
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700"
          >
            Start Chat
          </Link>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('accepted')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'accepted'
              ? 'bg-purple-100 text-purple-800 font-bold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>My VibeMates ({connectionsData.accepted.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pendingReceived')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'pendingReceived'
              ? 'bg-amber-100 text-amber-900 font-bold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>
            Pending Requests ({connectionsData.pendingReceived.length})
          </span>
          {connectionsData.pendingReceived.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('pendingSent')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'pendingSent'
              ? 'bg-slate-200 text-navy-900 font-bold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Sent Requests ({connectionsData.pendingSent.length})</span>
        </button>
      </div>

      {/* TAB CONTENT */}

      {/* Tab 1: Accepted VibeMates */}
      {activeTab === 'accepted' && (
        <div>
          {connectionsData.accepted.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-navy-900">No VibeMates connected yet</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Browse matching students and send a request to start peer learning.
                </p>
              </div>
              <Link
                to="/find-mates"
                className="inline-block px-6 py-2.5 rounded-xl text-xs font-semibold text-white gradient-primary"
              >
                Find Study Mates
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {connectionsData.accepted.map(({ connectionId, mate, createdAt }) => (
                <div
                  key={connectionId}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3.5 mb-4">
                      <div className="relative">
                        <img
                          src={mate?.avatar}
                          alt={mate?.name}
                          className="w-14 h-14 rounded-2xl object-cover ring-2 ring-brand-200 bg-brand-50"
                        />
                        {mate?.isOnline && (
                          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white"></span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-navy-900">{mate?.name}</h3>
                        <p className="text-xs text-brand-600 font-semibold">{mate?.course}</p>
                        <p className="text-[11px] text-slate-500">{mate?.college} • {mate?.year}</p>
                      </div>
                    </div>

                    <div className="p-3 bg-purple-50/60 rounded-2xl border border-purple-100 text-xs space-y-1 mb-4">
                      <p className="text-slate-500 font-medium">
                        Can Teach:{' '}
                        <strong className="text-navy-900">
                          {mate?.subjectsToTeach?.slice(0, 2).join(', ') || 'Various topics'}
                        </strong>
                      </p>
                      <p className="text-slate-500 font-medium">
                        Pace & Style:{' '}
                        <strong className="text-navy-900">
                          {mate?.learningPace || 'Moderate'} • {mate?.learningStyle || 'Practical'}
                        </strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => navigate('/chat', { state: { targetPartnerId: mate?._id } })}
                      className="flex-1 py-2 px-3 rounded-xl text-white gradient-primary font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedStudent(mate);
                        setShowSessionModal(true);
                      }}
                      className="flex-1 py-2 px-3 rounded-xl text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 font-semibold text-xs flex items-center justify-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Schedule</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Pending Received Requests (Requirement #13) */}
      {activeTab === 'pendingReceived' && (
        <div className="space-y-4">
          {connectionsData.pendingReceived.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-sm space-y-2 max-w-md mx-auto">
              <Clock className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-navy-800">No pending requests</p>
              <p className="text-xs text-slate-400">
                When other students request to connect with you, they will appear here.
              </p>
            </div>
          ) : (
            connectionsData.pendingReceived.map(({ connectionId, mate, notes, createdAt }) => (
              <div
                key={connectionId}
                className="bg-white rounded-3xl p-5 border border-purple-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={mate?.avatar}
                    alt={mate?.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-purple-200"
                  />
                  <div>
                    <h3 className="font-bold text-base text-navy-900">{mate?.name}</h3>
                    <p className="text-xs text-brand-600 font-semibold">{mate?.course} • {mate?.college}</p>
                    {notes && (
                      <p className="text-xs text-slate-600 mt-1 italic bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100 inline-block">
                        "{notes}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    disabled={respondingId === connectionId}
                    onClick={() => handleRespond(connectionId, 'reject', mate?.name)}
                    className="py-2 px-3.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <XCircle className="w-4 h-4 text-slate-400" />
                    <span>Decline</span>
                  </button>

                  <button
                    disabled={respondingId === connectionId}
                    onClick={() => handleRespond(connectionId, 'accept', mate?.name)}
                    className="py-2 px-4 rounded-xl text-white gradient-primary text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-purple-500/20 transition-all"
                  >
                    <CheckCircle className="w-4 h-4 text-purple-200" />
                    <span>Accept Request 🎉</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Pending Sent Requests */}
      {activeTab === 'pendingSent' && (
        <div className="space-y-4">
          {connectionsData.pendingSent.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-sm space-y-2 max-w-md mx-auto">
              <Clock className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-navy-800">No sent requests</p>
              <p className="text-xs text-slate-400">
                You haven't sent any pending connection requests.
              </p>
            </div>
          ) : (
            connectionsData.pendingSent.map(({ connectionId, mate, notes }) => (
              <div
                key={connectionId}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={mate?.avatar}
                    alt={mate?.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-navy-900">{mate?.name}</h3>
                    <p className="text-xs text-slate-500">{mate?.course} • {mate?.college}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Awaiting Acceptance</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modals */}
      <CreateSessionModal
        isOpen={showSessionModal}
        onClose={() => setShowSessionModal(false)}
        preselectedPartner={selectedStudent}
        onSessionCreated={() => alert('Study session scheduled!')}
      />

    </div>
  );
};

export default ConnectionsPage;
