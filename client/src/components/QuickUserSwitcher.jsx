import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCheck, Sparkles, ChevronDown, Check } from 'lucide-react';
import { api } from '../services/api';

const QuickUserSwitcher = () => {
  const { user, demoLogin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [demoUsers, setDemoUsers] = useState([]);
  const [loadingEmail, setLoadingEmail] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const fetchDemos = async () => {
      try {
        const res = await api.auth.getDemoUsers();
        if (res.success && res.demoUsers) {
          setDemoUsers(res.demoUsers);
        }
      } catch (e) {
        // fallback demo list
        setDemoUsers([
          { email: 'arun@college.edu', name: 'Arun Kumar', role: 'Computer Science (3rd Year)' },
          { email: 'rahul@college.edu', name: 'Rahul Verma', role: 'Information Technology (2nd Year)' },
          { email: 'priya@college.edu', name: 'Priya Sharma', role: 'Software Engineering (3rd Year)' },
          { email: 'karthik@college.edu', name: 'Karthik Nair', role: 'Computer Science (4th Year)' },
          { email: 'ananya@college.edu', name: 'Ananya Patel', role: 'Data Science & AI (2nd Year)' },
        ]);
      }
    };
    fetchDemos();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwitch = async (email) => {
    setLoadingEmail(email);
    try {
      await demoLogin(email);
      setIsOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingEmail(null);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 border border-purple-200/80 hover:from-purple-200 hover:to-indigo-200 transition-all shadow-sm"
        title="Quickly switch between student accounts to test peer chat & connections"
      >
        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
        <span className="hidden sm:inline">Demo Switcher</span>
        <ChevronDown className="w-3 h-3 text-purple-700" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-purple-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-4 pb-2 border-b border-gray-100">
            <p className="text-xs font-bold text-navy-900 uppercase tracking-wider">
              1-Click Student Switcher
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Switch student profiles instantly to test peer-to-peer matching, live chat & requests.
            </p>
          </div>

          <div className="py-1 max-h-[300px] overflow-y-auto">
            {demoUsers.map((u) => {
              const isCurrent = user?.email?.toLowerCase() === u.email.toLowerCase();
              return (
                <button
                  key={u.email}
                  disabled={loadingEmail === u.email}
                  onClick={() => handleSwitch(u.email)}
                  className={`w-full text-left px-4 py-2.5 flex items-center justify-between hover:bg-purple-50 transition-colors ${
                    isCurrent ? 'bg-purple-50/70' : ''
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name)}`}
                      alt={u.name}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-purple-300"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-navy-900 truncate flex items-center gap-1.5">
                        {u.name}
                        {isCurrent && (
                          <span className="px-1.5 py-0.2 text-[9px] bg-emerald-100 text-emerald-800 rounded font-bold">
                            Current
                          </span>
                        )}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">{u.role}</p>
                    </div>
                  </div>
                  {isCurrent && <Check className="w-4 h-4 text-purple-600 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickUserSwitcher;
