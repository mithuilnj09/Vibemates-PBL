import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Target,
  Sparkles,
  Heart,
  BookOpen,
  Compass,
  ArrowRight,
  ShieldCheck,
  Award,
} from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3.5 py-1.5 rounded-full border border-brand-200">
          About VibeMates
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-navy-900 font-display">
          Learn Together. <span className="gradient-text">Grow Together.</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          VibeMates is a Peer-to-Peer Learning System designed specifically for college students to find
          academically and schedule-compatible study partners.
        </p>
      </div>

      {/* Mission & Vision Cards (Requirement #20) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Mission */}
        <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-xl space-y-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Our Mission</span>
          <h2 className="text-2xl font-bold text-navy-900">
            “To make peer learning easier, smarter, and more accessible for every student.”
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            We believe that no student should struggle through difficult coursework alone. When peers study together,
            understanding deepens, accountability increases, and academic stress turns into collaborative confidence.
          </p>
        </div>

        {/* Vision */}
        <div className="bg-white rounded-3xl p-8 border border-indigo-100 shadow-xl space-y-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Our Vision</span>
          <h2 className="text-2xl font-bold text-navy-900">
            “Build a connected student community where everyone can learn from and teach one another.”
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Every student possesses strengths in some subjects and areas for growth in others. By creating a
            reciprocal learning ecosystem, every learner becomes both a curious student and an empowering mentor.
          </p>
        </div>

      </div>

      {/* What is VibeMates? Detailed Story */}
      <div className="bg-slate-50/70 rounded-3xl p-8 sm:p-10 border border-slate-200/80 space-y-4">
        <h3 className="text-xl font-bold text-navy-900">What is VibeMates?</h3>
        <p className="text-sm text-slate-700 leading-relaxed">
          In traditional college environments, students often turn to chaotic WhatsApp groups or Discord servers
          looking for study buddies. Most requests get lost in the noise, or lead to partners with incompatible
          schedules and mismatched expectations.
        </p>
        <p className="text-sm text-slate-700 leading-relaxed">
          VibeMates replaces random searches with an intelligent multi-attribute matching algorithm. We analyze
          subjects you want to master, subjects you can teach, available study hours, learning pace, and cognitive style
          to recommend peers who are genuinely compatible with you.
        </p>
      </div>

      {/* Core Values */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-navy-900">Our Guiding Values</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-navy-900">Reciprocal Learning</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Teaching others is the most effective way to solidify your own knowledge.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-navy-900">Student Trust</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              A safe, verified, college student-first environment built for focused growth.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-navy-900">Academic Excellence</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Structured study sessions, Pomodoro timers, and shared notes drive real results.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link
          to="/signup"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-white font-semibold text-sm gradient-primary shadow-lg shadow-purple-500/25 hover:opacity-95 transition-all"
        >
          <span>Find Your Study Mate Today</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
};

export default AboutPage;
