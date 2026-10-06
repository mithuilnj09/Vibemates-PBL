import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Sparkles,
  ArrowRight,
  BookOpen,
  Calendar,
  MessageSquare,
  ShieldCheck,
  Zap,
  Target,
  Clock,
  Compass,
  CheckCircle2,
  TrendingUp,
  Award,
  ChevronRight,
} from 'lucide-react';
import MatchBadge from '../components/MatchBadge';

const LandingPage = () => {
  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 lg:pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Glow backdrop decorative blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-purple-300/30 to-indigo-300/30 blur-3xl -z-10 rounded-full pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100 text-brand-700 border border-brand-200/80 shadow-sm animate-bounce-slow">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span className="text-xs font-semibold tracking-wide">
                Smart Peer-to-Peer Learning Platform
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-navy-900 leading-[1.12]">
              Find Your Perfect <br />
              <span className="gradient-text">Study Mate</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Connect with students who share your <span className="font-semibold text-navy-800">subjects</span>,{' '}
              <span className="font-semibold text-navy-800">schedule</span>,{' '}
              <span className="font-semibold text-navy-800">learning style</span>, and{' '}
              <span className="font-semibold text-navy-800">academic goals</span>.
            </p>

            {/* Action CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/find-mates"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl text-base font-semibold text-white gradient-primary hover:opacity-95 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Find a Study Mate</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl text-base font-semibold text-navy-700 bg-white hover:bg-slate-50 border border-slate-200/80 shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>How It Works</span>
              </a>
            </div>

            {/* Micro stats counter bar */}
            <div className="pt-8 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center lg:text-left">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold font-display gradient-text">1,000+</p>
                <p className="text-xs text-slate-500 font-medium">Students Enrolled</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold font-display gradient-text">500+</p>
                <p className="text-xs text-slate-500 font-medium">Study Matches</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold font-display gradient-text">50+</p>
                <p className="text-xs text-slate-500 font-medium">College Subjects</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold font-display text-emerald-600">95%</p>
                <p className="text-xs text-slate-500 font-medium">Match Satisfaction</p>
              </div>
            </div>

          </div>

          {/* Right Visual Column (Interactive Matching Preview Illustration) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md">
              
              {/* Main Preview Card */}
              <div className="bg-white rounded-3xl p-6 shadow-2xl border border-purple-100 relative z-10 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Perfect Compatibility Found
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Just Now</span>
                </div>

                <div className="flex items-center gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80"
                    alt="Arun Kumar"
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-400 shadow-md"
                  />
                  <div>
                    <h3 className="font-bold text-lg text-navy-900">Arun Kumar</h3>
                    <p className="text-xs text-brand-600 font-semibold">Computer Science (3rd Year)</p>
                    <p className="text-[11px] text-slate-500">NIT Campus</p>
                  </div>
                  <div className="ml-auto">
                    <MatchBadge score={92} size="lg" />
                  </div>
                </div>

                {/* Subject match pill demonstration */}
                <div className="p-3 bg-purple-50/70 rounded-2xl border border-purple-100 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Mutual Subjects:</span>
                    <span className="font-bold text-navy-900">Java, DSA & DBMS</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Matched Study Days:</span>
                    <span className="font-bold text-navy-900">Mon, Wed & Fri (6 PM)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Learning Synergy:</span>
                    <span className="font-bold text-emerald-600">Practical + Problem Solving</span>
                  </div>
                </div>

                {/* Simulated action row */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex-1 py-2.5 px-3 rounded-xl bg-purple-50 text-purple-700 text-xs font-semibold text-center">
                    View Profile
                  </div>
                  <div className="flex-1 py-2.5 px-3 rounded-xl text-white gradient-primary text-xs font-semibold text-center shadow-md">
                    Connect as VibeMates ✨
                  </div>
                </div>
              </div>

              {/* Floating Match Floating Pill 1 */}
              <div className="absolute -top-6 -right-6 bg-white rounded-2xl p-3.5 shadow-xl border border-slate-100 hidden sm:flex items-center gap-3 z-20 animate-float">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                  92%
                </div>
                <div>
                  <p className="text-xs font-bold text-navy-900">Algorithm Match</p>
                  <p className="text-[10px] text-slate-400">Pace: Moderate • Evenings</p>
                </div>
              </div>

              {/* Floating Match Floating Pill 2 */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-3.5 shadow-xl border border-slate-100 hidden sm:flex items-center gap-3 z-20">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-navy-900">Study Session Booked</p>
                  <p className="text-[10px] text-slate-400">Today • 6:00 PM – 7:00 PM</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS SECTION (Requirement #4) */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900">
            How VibeMates Works
          </h2>
          <p className="text-base text-slate-600">
            From entering your learning goals to conducting collaborative study sessions in 4 simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Step 1 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all text-center space-y-4 relative group">
            <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto text-xl font-bold group-hover:scale-110 transition-transform">
              1
            </div>
            <h3 className="font-bold text-lg text-navy-900">Create Your Profile</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Students enter their subjects, skills, availability schedule, skill level, and preferred learning style.
            </p>
            <span className="text-[11px] font-semibold text-brand-600 block">Personalized Setup</span>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all text-center space-y-4 relative group">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto text-xl font-bold group-hover:scale-110 transition-transform">
              2
            </div>
            <h3 className="font-bold text-lg text-navy-900">Find Compatible Mates</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The smart matching system analyzes subjects, free days, pace, and computes a compatibility percentage for every peer.
            </p>
            <span className="text-[11px] font-semibold text-indigo-600 block">AI Compatibility Score</span>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all text-center space-y-4 relative group">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto text-xl font-bold group-hover:scale-110 transition-transform">
              3
            </div>
            <h3 className="font-bold text-lg text-navy-900">Connect</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Students view detailed profile cards, breakdown statistics, and send connection requests with personal notes.
            </p>
            <span className="text-[11px] font-semibold text-blue-600 block">Mutual Acceptance</span>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all text-center space-y-4 relative group">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-xl font-bold group-hover:scale-110 transition-transform">
              4
            </div>
            <h3 className="font-bold text-lg text-navy-900">Learn Together</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Matched students chat in real-time, schedule study sessions, and work in virtual study rooms with timers and notes.
            </p>
            <span className="text-[11px] font-semibold text-emerald-600 block">Collaborative Growth</span>
          </div>

        </div>
      </section>

      {/* WHY VIBEMATES? (Requirement #5) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-navy-900 via-navy-800 to-indigo-950 rounded-3xl p-8 sm:p-12 lg:p-16 text-white shadow-2xl relative overflow-hidden">
          
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-300 bg-brand-900/60 px-3 py-1 rounded-full border border-brand-700/60">
                The Peer Learning Dilemma
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white">
                Why Students Need VibeMates
              </h2>
              
              <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
                <p>
                  College students regularly struggle to find the right study partner. Platforms like WhatsApp,
                  Discord, and Google Classroom are communication tools — they don't match you by availability,
                  academic pace, or complimentary subject skills.
                </p>
                <p>
                  VibeMates solves this by using a structured compatibility formula that eliminates trial-and-error
                  searching.
                </p>
              </div>

              {/* The VibeMates Equation */}
              <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
                <p className="text-xs font-bold text-brand-300 uppercase tracking-wider">
                  The VibeMates Matching Formula
                </p>
                <p className="text-base sm:text-lg font-bold text-white font-mono">
                  Subject (30%) + Availability (25%) + Skill Level (15%) + Pace (15%) + Style (15%) = Better Match
                </p>
              </div>
            </div>

            {/* Right Comparison Box */}
            <div className="lg:col-span-5 bg-white/5 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/10 space-y-5">
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                VibeMates vs. Random Messaging
              </h4>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">✕</span>
                  <p className="text-slate-300">
                    <strong className="text-white">WhatsApp & Discord:</strong> Spamming 100+ member groups hoping someone is free at 7 PM for DSA.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">✓</span>
                  <p className="text-slate-300">
                    <strong className="text-white">VibeMates:</strong> Instant filtered list of students already studying DSA who are free Tuesday & Thursday evenings!
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">✓</span>
                  <p className="text-slate-300">
                    <strong className="text-white">Skill Synergy:</strong> Match with someone who can teach you Python while you teach them Database normalization.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/signup"
                  className="w-full py-3 px-4 rounded-xl text-navy-900 bg-white hover:bg-slate-100 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Experience Smart Matching</span>
                  <ArrowRight className="w-4 h-4 text-brand-600" />
                </Link>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* FEATURES SECTION (Requirement #6) */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            Engineered for College Success
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900">
            Core Features
          </h2>
          <p className="text-base text-slate-600">
            Everything students need to find partners, organize study groups, and achieve academic milestones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-navy-900">Smart Matching</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Calculates compatibility percentages based on subjects, schedules, skill level, pace, and style.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-navy-900">Subject-Based Matching</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Find peers who want to learn what you can teach and teach what you want to master.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-navy-900">Availability Matching</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sync schedules across days of the week and specific time windows (mornings, afternoons, nights).
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-navy-900">Learning Pace</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Partner with students who match your tempo — whether slow & meticulous, moderate, or fast sprint.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-navy-900">Real-Time Chat</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Instant messaging with typing indicators, emoji reactions, and direct session booking.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-navy-900">Study Groups</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Create and join small cohorts (Java Beginners, DSA Squad, ML Cohort) with shared discussions.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-navy-900">Profile System</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Showcase your college, course, year, verified skills, and academic interests to peers.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-navy-900">Session Scheduling</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Schedule sessions with duration, dates, and join interactive study rooms with Pomodoro timers.
            </p>
          </div>

        </div>
      </section>

      {/* STUDENT TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            Student Stories
          </span>
          <h2 className="text-3xl font-extrabold text-navy-900">
            Loved by College Learners
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                alt="Rahul"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-200"
              />
              <div>
                <h4 className="font-bold text-sm text-navy-900">Rahul Verma</h4>
                <p className="text-xs text-slate-500">IT Student, IIIT</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              "I used to spend days searching for someone to practice machine learning math with. On VibeMates,
              I matched with Arun who is strong in algorithms while I help him with Python!"
            </p>
            <div className="text-amber-400 text-sm">★★★★★</div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
                alt="Priya"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-200"
              />
              <div>
                <h4 className="font-bold text-sm text-navy-900">Priya Sharma</h4>
                <p className="text-xs text-slate-500">Software Engg, DTU</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              "The schedule matching is a lifesaver. We don't have to exchange 50 messages asking 'are you free today?'.
              The compatibility breakdown showed we both have Friday evenings free."
            </p>
            <div className="text-amber-400 text-sm">★★★★★</div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
                alt="Karthik"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-200"
              />
              <div>
                <h4 className="font-bold text-sm text-navy-900">Karthik Nair</h4>
                <p className="text-xs text-slate-500">Computer Science, BITS Pilani</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              "The DSA study group cohort we created on VibeMates solved 120+ LeetCode problems together this semester.
              True peer accountability that actually works."
            </p>
            <div className="text-amber-400 text-sm">★★★★★</div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-purple-700 via-brand-600 to-indigo-700 rounded-3xl p-8 sm:p-14 text-white text-center shadow-2xl relative overflow-hidden space-y-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display">
              Ready to Learn and Grow Together?
            </h2>
            <p className="text-sm sm:text-base text-purple-100">
              Join thousands of college students matching with compatible study partners every single week.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white text-purple-800 font-bold text-sm hover:bg-slate-100 shadow-lg transition-all"
            >
              Create Free Student Profile
            </Link>
            <Link
              to="/find-mates"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-purple-900/50 hover:bg-purple-900/70 border border-purple-300/40 text-white font-semibold text-sm transition-all"
            >
              Browse Active Mates
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
