import React, { useState, useEffect } from 'react';
import {
  Users,
  BookOpen,
  Plus,
  Search,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CreateGroupModal from '../components/CreateGroupModal';

const GroupsPage = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [joiningId, setJoiningId] = useState(null);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (subjectFilter !== 'All') params.subject = subjectFilter;

      const res = await api.groups.getGroups(params);
      if (res.success && res.groups) {
        setGroups(res.groups);
      }
    } catch (err) {
      console.warn('Groups error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [search, subjectFilter]);

  const handleJoinLeave = async (groupId) => {
    setJoiningId(groupId);
    try {
      const res = await api.groups.joinOrLeaveGroup(groupId);
      if (res.success) {
        await fetchGroups();
      }
    } catch (err) {
      alert(err.message || 'Failed to update membership');
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 font-display flex items-center gap-2">
            <span>Peer Study Groups</span>
            <span className="text-xs font-bold bg-brand-100 text-brand-700 px-3 py-1 rounded-full">
              {groups.length} Active Cohorts
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Join focused learning cohorts for DSA problem solving, ML experiments, and exam prep.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-semibold text-white gradient-primary hover:opacity-95 shadow-md shadow-purple-500/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Study Group</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search study groups by name, topic, or subject..."
            className="w-full text-xs pl-10 pr-4 py-3 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
          />
        </div>

        <select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          className="w-full sm:w-56 text-xs p-3 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
        >
          <option value="All">All Subjects</option>
          <option value="Java">Java</option>
          <option value="Data Structures">Data Structures</option>
          <option value="Machine Learning">Machine Learning</option>
          <option value="Web Development">Web Development</option>
          <option value="Database">Database</option>
        </select>
      </div>

      {/* Groups Grid (Requirement #16) */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500">Loading study cohorts...</p>
        </div>
      ) : groups.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3 max-w-md mx-auto">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-base text-navy-900">No study groups found</h3>
          <p className="text-xs text-slate-500">
            Be the first to create a study group for this subject!
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white gradient-primary"
          >
            Create Group
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => {
            const isMember = (group.members || []).some(
              (m) => String(m._id || m) === String(user?._id)
            );

            return (
              <div
                key={group._id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Banner Image */}
                  <div className="h-36 relative overflow-hidden bg-slate-100">
                    <img
                      src={group.avatar}
                      alt={group.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-navy-900/30 to-transparent"></div>
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white/90 text-navy-900 backdrop-blur-md">
                        {group.subject}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="font-bold text-base leading-tight drop-shadow-sm">
                        {group.name}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {group.description || 'Collaborative study cohort on VibeMates.'}
                    </p>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Users className="w-4 h-4 text-brand-600" />
                        <span>
                          {group.memberCount || group.members?.length || 1} / {group.maxMembers || 50} students
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-100">
                        {group.skillLevel || 'All Levels'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Join Button */}
                <div className="p-5 pt-0">
                  <button
                    disabled={joiningId === group._id}
                    onClick={() => handleJoinLeave(group._id)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      isMember
                        ? 'bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-600'
                        : 'text-white gradient-primary hover:opacity-95 shadow-md shadow-purple-500/20'
                    }`}
                  >
                    {isMember ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Joined (Click to Leave)</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Join Group</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onGroupCreated={() => fetchGroups()}
      />

    </div>
  );
};

export default GroupsPage;
