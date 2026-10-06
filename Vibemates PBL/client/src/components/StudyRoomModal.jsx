import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Video,
  Mic,
  MicOff,
  VideoOff,
  CheckSquare,
  FileText,
  Users,
  CheckCircle,
  Share2,
} from 'lucide-react';
import { api } from '../services/api';

const StudyRoomModal = ({ session, isOpen, onClose, onSessionCompleted }) => {
  if (!isOpen || !session) return null;

  // Pomodoro timer state
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [timerMode, setTimerMode] = useState('focus'); // 'focus' or 'break'

  // Notes state
  const [notes, setNotes] = useState(session.notes || '');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // Audio/Video toggle simulation
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);

  // Checklist tasks
  const [tasks, setTasks] = useState([
    { id: 1, text: `Review ${session.subject} core principles`, done: true },
    { id: 2, text: 'Work through 3 practice problems together', done: false },
    { id: 3, text: 'Summarize key takeaways in study notes', done: false },
  ]);
  const [newTaskText, setNewTaskText] = useState('');

  // Pomodoro ticker
  useEffect(() => {
    let interval = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((s) => s - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsRunning(false);
      if (timerMode === 'focus') {
        alert('🎉 Focus session completed! Time for a 5-minute study break.');
        setTimerMode('break');
        setSecondsLeft(5 * 60);
      } else {
        alert('Break finished! Ready to resume learning?');
        setTimerMode('focus');
        setSecondsLeft(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft, timerMode]);

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    try {
      await api.sessions.updateStatus(session._id, session.status, notes);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleCompleteSession = async () => {
    try {
      await api.sessions.updateStatus(session._id, 'completed', notes);
      if (onSessionCompleted) onSessionCompleted(session._id);
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: newTaskText.trim(), done: false }]);
    setNewTaskText('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-900/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-purple-100 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Room Header */}
        <div className="px-6 py-4 gradient-primary text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
            <div>
              <h3 className="font-bold text-lg font-display">{session.title}</h3>
              <p className="text-xs text-purple-200">
                {session.subject} • Virtual Peer Study Room • {session.duration} mins
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Room Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          
          {/* Left Column: Video Mockup & Pomodoro Timer (7 cols) */}
          <div className="lg:col-span-7 p-6 space-y-5">
            
            {/* Virtual Call Mockup Box */}
            <div className="relative bg-navy-900 rounded-2xl aspect-video overflow-hidden flex items-center justify-center border border-slate-800 shadow-inner">
              <div className="text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-brand-600/30 text-brand-300 flex items-center justify-center mx-auto border border-brand-500/50">
                  <Users className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-white text-sm font-semibold">
                    Peer Collaborative Study Feed
                  </h4>
                  <p className="text-xs text-slate-400 max-w-xs mt-1">
                    Connected with {session.partner?.name || 'Study Mate'}. Camera & screen share active.
                  </p>
                </div>
              </div>

              {/* Call Controls Floating Bar */}
              <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-3">
                <button
                  onClick={() => setMicOn(!micOn)}
                  className={`p-2.5 rounded-full transition-colors ${
                    micOn ? 'bg-slate-700/80 text-white hover:bg-slate-600' : 'bg-rose-600 text-white'
                  }`}
                  title={micOn ? 'Mute Mic' : 'Unmute Mic'}
                >
                  {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setVideoOn(!videoOn)}
                  className={`p-2.5 rounded-full transition-colors ${
                    videoOn ? 'bg-slate-700/80 text-white hover:bg-slate-600' : 'bg-rose-600 text-white'
                  }`}
                  title={videoOn ? 'Turn Off Camera' : 'Turn On Camera'}
                >
                  {videoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </button>
                <a
                  href={session.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-full text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white flex items-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>External Room</span>
                </a>
              </div>
            </div>

            {/* Pomodoro Focus Timer Widget */}
            <div className="bg-purple-50/70 rounded-2xl p-5 border border-purple-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block">
                  {timerMode === 'focus' ? '🎯 Focus Sprint' : '☕ Study Break'}
                </span>
                <span className="text-3xl font-extrabold text-navy-900 font-display">
                  {formatTimer(secondsLeft)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className="px-4 py-2 rounded-xl text-white font-semibold text-xs gradient-primary flex items-center gap-1.5 shadow-sm"
                >
                  {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isRunning ? 'Pause' : 'Start Timer'}</span>
                </button>
                <button
                  onClick={() => {
                    setIsRunning(false);
                    setSecondsLeft(timerMode === 'focus' ? 25 * 60 : 5 * 60);
                  }}
                  className="p-2 rounded-xl bg-white border border-purple-200 text-slate-600 hover:text-navy-900"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Shared Notes & Goals Checklist (5 cols) */}
          <div className="lg:col-span-5 p-6 flex flex-col justify-between space-y-5 bg-slate-50/40">
            
            {/* Checklist */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-navy-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-brand-600" />
                  Session Goals
                </span>
                <span className="text-[11px] font-semibold text-slate-500">
                  {tasks.filter((t) => t.done).length}/{tasks.length} done
                </span>
              </div>

              <div className="space-y-1.5 mb-2.5 max-h-36 overflow-y-auto pr-1">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200/70 text-xs cursor-pointer hover:border-brand-300 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => {}}
                      className="rounded text-brand-600 focus:ring-brand-500"
                    />
                    <span
                      className={`flex-1 truncate ${
                        task.done ? 'line-through text-slate-400' : 'text-navy-800 font-medium'
                      }`}
                    >
                      {task.text}
                    </span>
                  </div>
                ))}
              </div>

              <form onSubmit={addTask} className="flex gap-1.5">
                <input
                  type="text"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  placeholder="Add goal..."
                  className="flex-1 text-xs px-2.5 py-1.5 bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
                <button
                  type="submit"
                  className="px-2.5 py-1.5 text-xs font-semibold bg-brand-100 text-brand-700 rounded-lg hover:bg-brand-200"
                >
                  Add
                </button>
              </form>
            </div>

            {/* Shared Notes Scratchpad */}
            <div className="flex-1 flex flex-col min-h-[140px]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-navy-900 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-brand-600" />
                  Shared Scratchpad
                </span>
                <button
                  onClick={handleSaveNotes}
                  className="text-[11px] font-semibold text-brand-600 hover:text-brand-800"
                >
                  {isSavingNotes ? 'Saving...' : 'Save Notes'}
                </button>
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Type formulas, algorithm snippets, or problem solutions here to keep with your session..."
                className="w-full flex-1 text-xs p-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white resize-none"
              />
            </div>

            {/* Footer action */}
            <div className="pt-2">
              <button
                onClick={handleCompleteSession}
                className="w-full py-2.5 px-4 rounded-xl text-white font-semibold text-xs bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-1.5 shadow-sm transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Mark Session Complete 🎉</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default StudyRoomModal;
