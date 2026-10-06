// Use environment variable for production backend (e.g., Render/Railway), fallback to '/api' for local Vite proxy
const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('vibemates_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong. Please try again.');
  }
  return data;
};

export const api = {
  // Authentication
  auth: {
    login: async (email, password) => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return handleResponse(res);
    },
    register: async (userData) => {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      return handleResponse(res);
    },
    getMe: async () => {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    updateProfile: async (updates) => {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });
      return handleResponse(res);
    },
    getDemoUsers: async () => {
      const res = await fetch(`${API_BASE}/auth/demo-users`);
      return handleResponse(res);
    },
    demoLogin: async (email) => {
      const res = await fetch(`${API_BASE}/auth/demo-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      return handleResponse(res);
    },
  },

  // Peer Matching & Profiles
  users: {
    getMatches: async (params = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.append(key, val);
        }
      });
      const res = await fetch(`${API_BASE}/users/matches?${query.toString()}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    getProfile: async (id) => {
      const res = await fetch(`${API_BASE}/users/${id}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Connections
  connections: {
    getConnections: async () => {
      const res = await fetch(`${API_BASE}/connections`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    sendRequest: async (recipientId, notes = '') => {
      const res = await fetch(`${API_BASE}/connections/request/${recipientId}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ notes }),
      });
      return handleResponse(res);
    },
    respondRequest: async (connectionId, action) => {
      const res = await fetch(`${API_BASE}/connections/respond/${connectionId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ action }),
      });
      return handleResponse(res);
    },
  },

  // Messaging & Chat
  messages: {
    getConversations: async () => {
      const res = await fetch(`${API_BASE}/messages/conversations`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    getDirectMessages: async (partnerId) => {
      const res = await fetch(`${API_BASE}/messages/direct/${partnerId}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    getGroupMessages: async (groupId) => {
      const res = await fetch(`${API_BASE}/messages/group/${groupId}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    sendMessage: async ({ recipientId, studyGroupId, content, attachments }) => {
      const res = await fetch(`${API_BASE}/messages/send`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ recipientId, studyGroupId, content, attachments }),
      });
      return handleResponse(res);
    },
  },

  // Study Sessions
  sessions: {
    getMySessions: async () => {
      const res = await fetch(`${API_BASE}/sessions/my-sessions`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    createSession: async (sessionData) => {
      const res = await fetch(`${API_BASE}/sessions/create`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(sessionData),
      });
      return handleResponse(res);
    },
    updateStatus: async (sessionId, status, notes) => {
      const res = await fetch(`${API_BASE}/sessions/${sessionId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status, notes }),
      });
      return handleResponse(res);
    },
  },

  // Study Groups
  groups: {
    getGroups: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/groups${query ? `?${query}` : ''}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    getGroupDetails: async (groupId) => {
      const res = await fetch(`${API_BASE}/groups/${groupId}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    createGroup: async (groupData) => {
      const res = await fetch(`${API_BASE}/groups/create`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(groupData),
      });
      return handleResponse(res);
    },
    joinOrLeaveGroup: async (groupId) => {
      const res = await fetch(`${API_BASE}/groups/${groupId}/join`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Notifications
  notifications: {
    getNotifications: async () => {
      const res = await fetch(`${API_BASE}/notifications`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    markAllAsRead: async () => {
      const res = await fetch(`${API_BASE}/notifications/read-all`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    markAsRead: async (notifId) => {
      const res = await fetch(`${API_BASE}/notifications/${notifId}/read`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },
};
