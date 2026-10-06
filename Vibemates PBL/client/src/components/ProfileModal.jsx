import React, { useState } from 'react';
import {
  X,
  GraduationCap,
  Sparkles,
  BookOpen,
  Calendar,
  MessageSquare,
  Award,
  Zap,
  Target,
  Send,
  Clock,
  CheckCircle,
} from 'lucide-react';
import MatchBadge from './MatchBadge';
import ScheduleMatrix from './ScheduleMatrix';
import { api } from '../services/api';

const ProfileModal = ({
  student,
  isOpen,
  onClose,
  onStartChat,
  onScheduleSession,
  onConnectSuccess,
}) => {
  if (!isOpen || !student) return null;

  const [connecting, setConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(student.connectionStatus || 'none');
  const [requestNotes, setRequestNotes] = useState('');
  const [showNotesInput, setShowNotesInput] = useState(false);

  const breakdown = student.compatibilityBreakdown || {};

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const res = await api.connections.sendRequest(student._id, requestNotes);
      if (res.success) {
        setConnectionStatus('pending_sent');
        setShowNotesInput(false);
        if (onConnectSuccess) onConnectSuccess(student);
      }
    } catch (err) {
      alert(err.message || 'Failed to send request');
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-purple-100 overflow-hidden">
        
        {/* Top Header Banner with Gradient */}
        <div className="h-32 gradient-primary relative p-6 flex items-start justify-between">
          <div className="flex items-center gap-2 text-white/90 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-purple-200" />
            <span>VibeMates Peer Profile</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card Body */}
        <div className="px-6 pb-6 pt-0 relative">
          
          {/* Avatar & Match Score Overlay */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 mb-4">
            <div className="flex items-end gap-4">
              <div className="relative">
                <img
                  src={student.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=vibemate'}
                  alt={student.name}
                  className="w-24 h-24 rounded-3xl object-cover ring-4 ring-white shadow-lg bg-purple-50"
                />
                {student.isOnline && (
                  <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white"></span>
                )}
              </div>
              <div className="mb-1">
                <h2 className="text-xl sm:text-2xl font-bold font-display text-navy-900">
                  {student.name}
                </h2>
                <p className="text-sm font-medium text-brand-600 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4" />
                  {student.course} ({student.year})
                </p>
                <p className="text-xs text-slate-500">{student.college}</p>
              </div>
            </div>

            {/* Circular Match Badge */}
            <div className="flex items-center gap-3 bg-purple-50/80 p-2.5 rounded-2xl border border-purple-100 self-start sm:self-auto">
              <MatchBadge score={student.compatibilityScore || 85} size="lg" />
              <div className="text-left pr-1">
                <span className="text-xs font-bold text-navy-900 block">Compatibility</span>
                <span className="text-[11px] text-brand-600 font-medium">Smart AI Match</span>
              </div>
            </div>
          </div>

          {/* About Me Section */}
          <div className="mb-5">
            <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
              About Me
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              {student.bio || 'Excited to collaborate and learn with peers on VibeMates.'}
            </p>
          </div>

          {/* Subjects: Can Teach vs Wants to Learn */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            {/* Can Teach */}
            <div className="bg-emerald-50/60 rounded-2xl p-3.5 border border-emerald-100">
              <div className="flex items-center gap-1.5 mb-2">
                <Award className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  Subjects I Can Teach
                </h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {student.subjectsToTeach && student.subjectsToTeach.length > 0 ? (
                  student.subjectsToTeach.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-100/80 text-emerald-800"
                    >
                      ★ {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-emerald-600 italic">None listed</span>
                )}
              </div>
            </div>

            {/* Wants to Learn */}
            <div className="bg-brand-50/60 rounded-2xl p-3.5 border border-brand-100">
              <div className="flex items-center gap-1.5 mb-2">
                <BookOpen className="w-4 h-4 text-brand-600" />
                <h4 className="text-xs font-bold text-brand-900 uppercase tracking-wider">
                  Subjects I Want to Learn
                </h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {student.subjectsToLearn && student.subjectsToLearn.length > 0 ? (
                  student.subjectsToLearn.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-brand-100 text-brand-800"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-brand-600 italic">None listed</span>
                )}
              </div>
            </div>
          </div>

          {/* Learning Preferences */}
          <div className="grid grid-cols-3 gap-2.5 mb-5 text-center">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Skill Level
              </span>
              <span className="text-xs font-bold text-navy-800 mt-0.5 block">
                {student.skillLevel || 'Intermediate'}
              </span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Learning Pace
              </span>
              <span className="text-xs font-bold text-navy-800 mt-0.5 block">
                ⚡ {student.learningPace || 'Moderate'}
              </span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Learning Style
              </span>
              <span className="text-xs font-bold text-navy-800 mt-0.5 block">
                🎯 {student.learningStyle || 'Practical'}
              </span>
            </div>
          </div>

          {/* Compatibility Breakdown Bars */}
          <div className="mb-5 bg-gradient-to-r from-purple-50/70 to-indigo-50/70 p-4 rounded-2xl border border-purple-100">
            <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>Why you match</span>
              <span className="text-brand-600">{student.compatibilityScore}% Overall</span>
            </h4>
            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Subject Overlap (30%)</span>
                  <span className="font-semibold text-navy-900">{breakdown.subjectScore || 85}%</span>
                </div>
                <div className="h-1.5 w-full bg-white rounded-full overflow-hidden">
                  <div
                    className="h-full gradient-primary rounded-full"
                    style={{ width: `${breakdown.subjectScore || 85}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Availability Match (25%)</span>
                  <span className="font-semibold text-navy-900">{breakdown.availabilityScore || 90}%</span>
                </div>
                <div className="h-1.5 w-full bg-white rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${breakdown.availabilityScore || 90}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Pace & Style Synergy (45%)</span>
                  <span className="font-semibold text-navy-900">
                    {Math.round(((breakdown.paceScore || 80) + (breakdown.styleScore || 85) + (breakdown.skillScore || 80)) / 3)}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-white rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{
                      width: `${Math.round(
                        ((breakdown.paceScore || 80) + (breakdown.styleScore || 85) + (breakdown.skillScore || 80)) / 3
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule Matrix */}
          <div className="mb-6">
            <ScheduleMatrix
              availableDays={student.availableDays}
              availableTimeSlots={student.availableTimeSlots}
            />
          </div>

          {/* Connect Notes Input if shown */}
          {showNotesInput && (
            <div className="mb-4 p-3 bg-purple-50 rounded-2xl border border-purple-200">
              <label className="text-xs font-bold text-navy-900 block mb-1.5">
                Add a personal note (optional):
              </label>
              <textarea
                value={requestNotes}
                onChange={(e) => setRequestNotes(e.target.value)}
                placeholder="Hey, saw you can teach Java! Would love to study together..."
                className="w-full text-xs p-2.5 rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
                rows={2}
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setShowNotesInput(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  disabled={connecting}
                  onClick={handleConnect}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white gradient-primary rounded-lg"
                >
                  {connecting ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-2 pt-3 border-t border-slate-100">
            {connectionStatus === 'connected' ? (
              <>
                <button
                  onClick={() => {
                    onClose();
                    if (onStartChat) onStartChat(student);
                  }}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl text-white gradient-primary font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-purple-500/20"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Start Chat</span>
                </button>
                <button
                  onClick={() => {
                    onClose();
                    if (onScheduleSession) onScheduleSession(student);
                  }}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 font-semibold text-sm flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Schedule Session</span>
                </button>
              </>
            ) : connectionStatus === 'pending_sent' ? (
              <button
                disabled
                className="w-full py-3 px-4 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 font-semibold text-sm flex items-center justify-center gap-2 cursor-not-allowed"
              >
                <Clock className="w-4 h-4" />
                <span>Connection Request Pending</span>
              </button>
            ) : connectionStatus === 'pending_received' ? (
              <button
                onClick={() => {
                  onClose();
                  window.location.href = '/connections';
                }}
                className="w-full py-3 px-4 rounded-xl text-white gradient-primary font-semibold text-sm flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Respond to Pending Request</span>
              </button>
            ) : (
              <button
                onClick={() => setShowNotesInput(!showNotesInput)}
                className="w-full py-3 px-4 rounded-xl text-white gradient-primary font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-purple-500/25"
              >
                <Sparkles className="w-4 h-4 text-purple-200" />
                <span>Send Connection Request</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
