import React, { useState } from 'react';
import {
  Mail,
  MapPin,
  Send,
  MessageSquare,
  Sparkles,
  CheckCircle,
  Github,
  Twitter,
  Linkedin,
} from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3.5 py-1.5 rounded-full border border-brand-200">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 font-display">
          Contact the VibeMates Team
        </h1>
        <p className="text-sm text-slate-500">
          Have questions, campus partnership inquiries, or suggestions? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Contact Form (Requirement #21) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xl space-y-6">
          <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-brand-600" />
            <span>Send Us a Message</span>
          </h2>

          {sent && (
            <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Thank you! Your message has been sent to the VibeMates campus support team.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Arun Kumar"
                  className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
                  Your Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="student@college.edu"
                  className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
                Subject *
              </label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g. Campus Ambassador Program / Technical Feedback"
                className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-1.5">
                Message *
              </label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Write your message here..."
                className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl text-white font-semibold text-sm gradient-primary hover:opacity-95 shadow-md shadow-purple-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-4 h-4 text-purple-200" />
              <span>Send Message</span>
            </button>
          </form>
        </div>

        {/* Right: Info and College Ambassador details */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl p-6 sm:p-8 border border-purple-100 space-y-4">
            <h3 className="font-bold text-base text-navy-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-brand-600" />
              <span>Direct Support</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our student operations team responds to all college student queries within 24 hours.
            </p>
            <div className="text-xs space-y-2 text-navy-900 font-semibold">
              <p>support@vibemates.study</p>
              <p>partnerships@vibemates.study</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-navy-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-600" />
              <span>Campus Ambassador Network</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Want to launch a VibeMates peer-learning chapter at your university or engineering institute?
              Apply to become a campus lead and host local hack sprints.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-brand-600 text-slate-600 hover:text-white flex items-center justify-center transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-brand-600 text-slate-600 hover:text-white flex items-center justify-center transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-brand-600 text-slate-600 hover:text-white flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ContactPage;
