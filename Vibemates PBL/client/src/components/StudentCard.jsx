import React, { useState } from 'react';
import {
  BookOpen,
  GraduationCap,
  Calendar,
  Sparkles,
  UserCheck,
  Clock,
  Send,
  MessageSquare,
  Award,
  Zap,
} from 'lucide-react';
import MatchBadge from './MatchBadge';
import ScheduleMatrix from './ScheduleMatrix';
import { api } from '../services/api';

const StudentCard = ({
  student,
  onViewProfile,
  onConnectSuccess,
  onStartChat,
  currentUser,
}) => {
  const [connecting, setConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(student.connectionStatus || 'none');

  const handleConnect = async (e) => {
    e.stopPropagation();
    if (connectionStatus === 'connected' && onStartChat) {
      onStartChat(student);
      return;
    }
    if (connectionStatus !== 'none') return;

    setConnecting(true);
    try {
      const res = await api.connections.sendRequest(student._id);
      if (res.success) {
        setConnectionStatus('pending_sent');
        if (onConnectSuccess) onConnectSuccess(student);
      }
    } catch (err) {
      alert(err.message || 'Failed to send request');
    } finally {
      setConnecting(false);
    }
  };

  // Skill badge color
  const getSkillBadge = (level) => {
    if (level === 'Advanced') {
      return 'bg-purple-100 text-purple-700 border-purple-200';
    }
    if (level === 'Beginner') {
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    }
    return 'bg-blue-100 text-blue-700 border-blue-200';
  };

  return (
    <div
      onClick={() => onViewProfile && onViewProfile(student)}
      className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
    >
      {/* Top subtle highlight gradient */}
      <div className="absolute top-0 left-0 right-0 h-1.5 gradient-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>

      <div>
        {/* Top Header: Avatar, Info & Match Score */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={student.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=student'}
                alt={student.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-brand-100 group-hover:ring-brand-400 transition-all bg-brand-50"
              />
              {student.isOnline && (
                <span
                  className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white"
                  title="Online Now"
                ></span>
              )}
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-navy-900 group-hover:text-brand-600 transition-colors flex items-center gap-1.5">
                {student.name}
              </h3>
              <p className="text-xs text-navy-600 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-brand-500" />
                <span className="truncate max-w-[170px]">{student.course}</span>
              </p>
              <p className="text-[11px] text-slate-500 truncate max-w-[180px]">
                {student.college} • {student.year}
              </p>
            </div>
          </div>

          {/* Circular Compatibility Indicator */}
          <div className="flex-shrink-0 text-center">
            <MatchBadge score={student.compatibilityScore || 85} size="md" />
          </div>
        </div>

        {/* Bio Snippet */}
        {student.bio && (
          <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
            "{student.bio}"
          </p>
        )}

        {/* Subjects Matrix */}
        <div className="space-y-2 mb-4">
          {/* Can Teach */}
          {student.subjectsToTeach && student.subjectsToTeach.length > 0 && (
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Can Teach
              </span>
              <div className="flex flex-wrap gap-1">
                {student.subjectsToTeach.slice(0, 3).map((sub) => (
                  <span
                    key={sub}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                  >
                    ★ {sub}
                  </span>
                ))}
                {student.subjectsToTeach.length > 3 && (
                  <span className="text-[10px] text-slate-400 self-center">
                    +{student.subjectsToTeach.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Wants to Learn */}
          {student.subjectsToLearn && student.subjectsToLearn.length > 0 && (
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Wants to Learn
              </span>
              <div className="flex flex-wrap gap-1">
                {student.subjectsToLearn.slice(0, 3).map((sub) => (
                  <span
                    key={sub}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-brand-50 text-brand-700 border border-brand-200/70"
                  >
                    {sub}
                  </span>
                ))}
                {student.subjectsToLearn.length > 3 && (
                  <span className="text-[10px] text-slate-400 self-center">
                    +{student.subjectsToLearn.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Meta badges: Pace, Style, Skill */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span
            className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${getSkillBadge(
              student.skillLevel
            )}`}
          >
            {student.skillLevel || 'Intermediate'}
          </span>
          <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
            ⚡ {student.learningPace || 'Moderate'} Pace
          </span>
          <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
            🎯 {student.learningStyle || 'Practical'} Style
          </span>
        </div>

        {/* Availability compact preview */}
        <div className="pt-2 border-t border-slate-100 mb-4">
          <ScheduleMatrix
            availableDays={student.availableDays}
            availableTimeSlots={student.availableTimeSlots}
            compact={true}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onViewProfile) onViewProfile(student);
          }}
          className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl text-navy-700 bg-slate-100 hover:bg-slate-200 transition-colors text-center"
        >
          View Profile
        </button>

        {connectionStatus === 'connected' ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onStartChat) onStartChat(student);
            }}
            className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-center gap-1.5 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat</span>
          </button>
        ) : connectionStatus === 'pending_sent' ? (
          <button
            disabled
            className="flex-1 py-2 px-3 text-xs font-medium rounded-xl text-amber-700 bg-amber-50 border border-amber-200 cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Requested</span>
          </button>
        ) : connectionStatus === 'pending_received' ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onViewProfile) onViewProfile(student);
            }}
            className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl text-white gradient-primary flex items-center justify-center gap-1.5"
          >
            <span>Respond</span>
          </button>
        ) : (
          <button
            type="button"
            disabled={connecting}
            onClick={handleConnect}
            className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl text-white gradient-primary hover:opacity-95 shadow-sm shadow-purple-500/20 flex items-center justify-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-200" />
            <span>{connecting ? 'Sending...' : 'Connect'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default StudentCard;
