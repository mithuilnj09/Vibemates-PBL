import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Heart, Github, Twitter, Linkedin, Mail, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-navy-900 text-slate-300 pt-16 pb-12 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white shadow-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold font-display text-white tracking-tight">
                Vibe<span className="text-brand-400">Mates</span>
              </span>
            </div>
            <p className="text-brand-200 font-medium text-base">
              “Learn Together. Grow Together.”
            </p>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              VibeMates is the intelligent peer-to-peer study partner matching system for college students.
              Stop searching randomly on WhatsApp or Discord — match with peers who share your exact subjects,
              pace, and schedule.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-navy-800 hover:bg-brand-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-navy-800 hover:bg-brand-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-navy-800 hover:bg-brand-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <Link
                to="/contact"
                className="w-9 h-9 rounded-lg bg-navy-800 hover:bg-brand-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Platform
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-brand-300 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/find-mates" className="hover:text-brand-300 transition-colors">
                  Find Study Mates
                </Link>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-brand-300 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-brand-300 transition-colors">
                  Key Features
                </a>
              </li>
              <li>
                <Link to="/groups" className="hover:text-brand-300 transition-colors">
                  Peer Study Groups
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Community
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-brand-300 transition-colors">
                  About VibeMates
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-300 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs bg-brand-900/60 text-brand-300 border border-brand-700/50">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  50+ College Campuses
                </span>
              </li>
              <li className="pt-2 text-xs text-slate-400">
                Peer learning hubs active across NITs, IIITs, BITS, DTU & VIT.
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Trust & Safety
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#privacy" className="hover:text-brand-300 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-brand-300 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#guidelines" className="hover:text-brand-300 transition-colors">
                  Student Safety Code
                </a>
              </li>
              <li>
                <a href="#guidelines" className="hover:text-brand-300 transition-colors">
                  Honor Code
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 VibeMates. All Rights Reserved.</p>
          <p className="flex items-center gap-1 text-slate-400">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for College Learners Everywhere
          </p>
          <div className="flex items-center gap-4">
            <span className="text-emerald-400 flex items-center gap-1 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
