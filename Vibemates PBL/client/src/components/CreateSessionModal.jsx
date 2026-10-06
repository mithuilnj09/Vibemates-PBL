import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, BookOpen, Users, Sparkles } from 'lucide-react';
import { api } from '../services/api';

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

const CreateSessionModal = ({ isOpen, onClose, preselectedPartner, onSessionCreated }) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Data Structures');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('18:00');
  const [duration, setDuration] = useState('60');
  const [description, setDescription] = useState('');
  const [partnerId, setPartnerId] = useState(preselectedPartner?._id || '');
  const [connectedMates, setConnectedMates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMates = async () => {
      try {
        const res = await api.connections.getConnections();
        if (res.success && res.accepted) {
          setConnectedMates(res.accepted.map((c) => c.mate));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchMates();

    if (preselectedPartner) {
      setPartnerId(preselectedPartner._id);
      setTitle(`Study Session with ${preselectedPartner.name}`);
    } else {
      setTitle('Peer Study Session');
    }
  }, [preselectedPartner]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !subject || !date || !time) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.sessions.createSession({
        title,
        subject,
        date,
        time,
        duration: Number(duration),
        description,
        partnerId: partnerId || null,
      });

      if (res.success) {
        if (onSessionCreated) onSessionCreated(res.session);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to schedule session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-purple-100 p-6 sm:p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-navy-900">Schedule Study Session</h3>
              <p className="text-xs text-slate-500">Plan collaborative study time with your peer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-navy-900 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Session Name */}
          <div>
            <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
              Session Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Java Trees & LeetCode Practice"
              className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Subject & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
                Subject *
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              >
                {SUBJECT_OPTIONS.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
                Duration (Minutes)
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              >
                <option value="30">30 Mins (Quick Review)</option>
                <option value="45">45 Mins</option>
                <option value="60">60 Mins (1 Hour - Standard)</option>
                <option value="90">90 Mins (Deep Dive)</option>
                <option value="120">120 Mins (Intensive)</option>
              </select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
                Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
                Time *
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Select Study Mate */}
          <div>
            <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
              Study Mate (VibeMate)
            </label>
            <select
              value={partnerId}
              onChange={(e) => setPartnerId(e.target.value)}
              className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            >
              <option value="">-- Open Session / Pick VibeMate Later --</option>
              {connectedMates.map((mate) => (
                <option key={mate._id} value={mate._id}>
                  {mate.name} ({mate.course} • {mate.college})
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
              Description / Study Agenda
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What topics or problems will you cover during this session?"
              className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-white font-semibold text-sm gradient-primary hover:opacity-95 shadow-md shadow-purple-500/25 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-purple-200" />
              <span>{loading ? 'Scheduling...' : 'Schedule Session'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSessionModal;
