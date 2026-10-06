import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Users,
  Compass,
  MessageSquare,
  Calendar,
  BookOpen,
  Bell,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import QuickUserSwitcher from './QuickUserSwitcher';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform duration-200">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-bold font-display tracking-tight text-navy-900 group-hover:text-brand-600 transition-colors">
                Vibe<span className="gradient-text">Mates</span>
              </span>
              <span className="hidden sm:block text-[10px] font-semibold tracking-wider uppercase text-brand-600/80 -mt-1">
                Peer-to-Peer Learning
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive('/') ? 'text-brand-600 font-semibold' : 'text-navy-700 hover:text-brand-600 hover:bg-brand-50'
                  }`}
                >
                  Home
                </Link>
                <a
                  href="#how-it-works"
                  className="px-3 py-2 text-sm font-medium text-navy-700 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                >
                  How It Works
                </a>
                <Link
                  to="/find-mates"
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive('/find-mates') ? 'text-brand-600 font-semibold' : 'text-navy-700 hover:text-brand-600 hover:bg-brand-50'
                  }`}
                >
                  Find Mates
                </Link>
                <a
                  href="#features"
                  className="px-3 py-2 text-sm font-medium text-navy-700 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                >
                  Features
                </a>
                <Link
                  to="/about"
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive('/about') ? 'text-brand-600 font-semibold' : 'text-navy-700 hover:text-brand-600 hover:bg-brand-50'
                  }`}
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive('/contact') ? 'text-brand-600 font-semibold' : 'text-navy-700 hover:text-brand-600 hover:bg-brand-50'
                  }`}
                >
                  Contact
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive('/dashboard') ? 'bg-brand-100 text-brand-700 font-semibold' : 'text-navy-700 hover:text-brand-600 hover:bg-brand-50'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to="/find-mates"
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive('/find-mates') ? 'bg-brand-100 text-brand-700 font-semibold' : 'text-navy-700 hover:text-brand-600 hover:bg-brand-50'
                  }`}
                >
                  <Compass className="w-4 h-4" />
                  Find Mates
                </Link>
                <Link
                  to="/connections"
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive('/connections') ? 'bg-brand-100 text-brand-700 font-semibold' : 'text-navy-700 hover:text-brand-600 hover:bg-brand-50'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Connections
                </Link>
                <Link
                  to="/chat"
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive('/chat') ? 'bg-brand-100 text-brand-700 font-semibold' : 'text-navy-700 hover:text-brand-600 hover:bg-brand-50'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  Chat
                </Link>
                <Link
                  to="/sessions"
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive('/sessions') ? 'bg-brand-100 text-brand-700 font-semibold' : 'text-navy-700 hover:text-brand-600 hover:bg-brand-50'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Sessions
                </Link>
                <Link
                  to="/groups"
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive('/groups') ? 'bg-brand-100 text-brand-700 font-semibold' : 'text-navy-700 hover:text-brand-600 hover:bg-brand-50'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  Study Groups
                </Link>
              </>
            )}
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Demo Switcher Tool (Key for evaluating peer-to-peer interactions) */}
            <QuickUserSwitcher />

            {!isAuthenticated ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-medium text-navy-700 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white gradient-primary hover:opacity-95 rounded-xl shadow-md shadow-brand-500/25 hover:shadow-lg transition-all"
                >
                  <span>Sign Up</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/find-mates"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-brand-700 bg-brand-100 hover:bg-brand-200 border border-brand-200 rounded-xl transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                  <span>Find Your Study Mate</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* Notifications Dropdown */}
                <NotificationDropdown isOpen={notifOpen} setIsOpen={setNotifOpen} />

                {/* User Profile Avatar Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-brand-50 transition-colors focus:outline-none"
                  >
                    <img
                      src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=student'}
                      alt={user?.name}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-brand-300 bg-white"
                    />
                    <span className="hidden md:block text-sm font-semibold text-navy-800 max-w-[120px] truncate">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown className="hidden md:block w-3.5 h-3.5 text-navy-500" />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-brand-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2.5 border-b border-gray-100">
                        <p className="text-sm font-bold text-navy-900 truncate">{user?.name}</p>
                        <p className="text-xs text-navy-500 truncate">{user?.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold bg-brand-100 text-brand-700 rounded-md">
                          {user?.course || 'Student'} • {user?.year || 'College'}
                        </span>
                      </div>
                      <Link
                        to="/my-profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-navy-700 hover:bg-brand-50 hover:text-brand-600"
                      >
                        <User className="w-4 h-4 text-brand-500" />
                        My Profile & Schedule
                      </Link>
                      <Link
                        to="/connections"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-navy-700 hover:bg-brand-50 hover:text-brand-600"
                      >
                        <Users className="w-4 h-4 text-brand-500" />
                        My VibeMates
                      </Link>
                      <Link
                        to="/sessions"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-navy-700 hover:bg-brand-50 hover:text-brand-600"
                      >
                        <Calendar className="w-4 h-4 text-brand-500" />
                        Study Sessions
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-navy-700 hover:bg-brand-50 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-brand-100 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2">
          {!isAuthenticated ? (
            <>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium rounded-lg text-navy-800 hover:bg-brand-50"
              >
                Home
              </Link>
              <Link
                to="/find-mates"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium rounded-lg text-navy-800 hover:bg-brand-50"
              >
                Find Mates
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium rounded-lg text-navy-800 hover:bg-brand-50"
              >
                About
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium rounded-lg text-navy-800 hover:bg-brand-50"
              >
                Contact
              </Link>
              <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-semibold rounded-xl border border-brand-200 text-brand-700"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-semibold rounded-xl text-white gradient-primary"
                >
                  Create Student Profile
                </Link>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-base font-medium rounded-lg text-navy-800 hover:bg-brand-50"
              >
                <Layers className="w-5 h-5 text-brand-600" />
                Dashboard
              </Link>
              <Link
                to="/find-mates"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-base font-medium rounded-lg text-navy-800 hover:bg-brand-50"
              >
                <Compass className="w-5 h-5 text-brand-600" />
                Find Mates
              </Link>
              <Link
                to="/connections"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-base font-medium rounded-lg text-navy-800 hover:bg-brand-50"
              >
                <Users className="w-5 h-5 text-brand-600" />
                Connections
              </Link>
              <Link
                to="/chat"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-base font-medium rounded-lg text-navy-800 hover:bg-brand-50"
              >
                <MessageSquare className="w-5 h-5 text-brand-600" />
                Real-Time Chat
              </Link>
              <Link
                to="/sessions"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-base font-medium rounded-lg text-navy-800 hover:bg-brand-50"
              >
                <Calendar className="w-5 h-5 text-brand-600" />
                Study Sessions
              </Link>
              <Link
                to="/groups"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-base font-medium rounded-lg text-navy-800 hover:bg-brand-50"
              >
                <BookOpen className="w-5 h-5 text-brand-600" />
                Study Groups
              </Link>
              <Link
                to="/my-profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-base font-medium rounded-lg text-navy-800 hover:bg-brand-50"
              >
                <User className="w-5 h-5 text-brand-600" />
                My Profile
              </Link>
              <div className="pt-2 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-base font-medium text-rose-600 hover:bg-rose-50 rounded-lg text-left"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
