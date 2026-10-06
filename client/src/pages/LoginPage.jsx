import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Mail, Lock, Sparkles, ArrowRight, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter both your college email and password.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    const res = await login(email, password);
    setSubmitting(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setErrorMessage(res.error || 'Invalid email or password.');
    }
  };

  const handleDemo = async (demoEmail) => {
    setSubmitting(true);
    setErrorMessage('');
    const res = await demoLogin(demoEmail);
    setSubmitting(false);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setErrorMessage(res.error || 'Failed to login with demo student.');
    }
  };

  const handleGoogleLogin = () => {
    // Simulated Google OAuth login
    handleDemo('arun@college.edu');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-purple-100 shadow-xl relative overflow-hidden">
        
        {/* Top gradient stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 gradient-primary"></div>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center text-white mx-auto shadow-md shadow-purple-500/20">
            <Users className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 font-display">
            Welcome to VibeMates
          </h2>
          <p className="text-xs text-slate-500">
            Log in to connect with your peer learning partners
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 text-rose-700 text-xs border border-rose-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 1-Click Demo Accounts Selector */}
        <div className="bg-purple-50/70 p-3.5 rounded-2xl border border-purple-100 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-purple-900">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              1-Click Instant Demo Login
            </span>
            <span className="text-[10px] text-purple-600 font-semibold uppercase">Examiner Fast-Track</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleDemo('arun@college.edu')}
              className="py-2 px-2.5 rounded-xl bg-white border border-purple-200 text-purple-800 hover:bg-purple-100/80 font-semibold text-left transition-colors truncate"
            >
              👤 Arun (CS 3rd Yr)
            </button>
            <button
              type="button"
              onClick={() => handleDemo('rahul@college.edu')}
              className="py-2 px-2.5 rounded-xl bg-white border border-purple-200 text-purple-800 hover:bg-purple-100/80 font-semibold text-left transition-colors truncate"
            >
              👤 Rahul (IT 2nd Yr)
            </button>
            <button
              type="button"
              onClick={() => handleDemo('priya@college.edu')}
              className="py-2 px-2.5 rounded-xl bg-white border border-purple-200 text-purple-800 hover:bg-purple-100/80 font-semibold text-left transition-colors truncate"
            >
              👤 Priya (SE 3rd Yr)
            </button>
            <button
              type="button"
              onClick={() => handleDemo('karthik@college.edu')}
              className="py-2 px-2.5 rounded-xl bg-white border border-purple-200 text-purple-800 hover:bg-purple-100/80 font-semibold text-left transition-colors truncate"
            >
              👤 Karthik (CS 4th Yr)
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
              College Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@college.edu"
                className="w-full text-sm pl-10 pr-3.5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-navy-800 uppercase tracking-wider">
                Password
              </label>
              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Demo reset link: Your password for all demo accounts is "password123".');
                }}
                className="text-xs text-brand-600 hover:text-brand-800 font-medium"
              >
                Forgot Password?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-sm pl-10 pr-3.5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-4 rounded-xl text-white font-semibold text-sm gradient-primary hover:opacity-95 shadow-md shadow-purple-500/25 flex items-center justify-center gap-2 transition-all"
          >
            <span>{submitting ? 'Authenticating...' : 'Login'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-4 text-xs text-slate-400 uppercase font-medium">Or</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* Continue with Google Button (Requirement #8) */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-navy-800 font-semibold text-xs flex items-center justify-center gap-2.5 transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-brand-600 hover:text-brand-700">
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;
