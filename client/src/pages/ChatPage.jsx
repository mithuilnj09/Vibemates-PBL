import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Send,
  Smile,
  Paperclip,
  Calendar,
  Users,
  Search,
  Check,
  CheckCheck,
  Sparkles,
  GraduationCap,
  Clock,
  Phone,
  Video,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import CreateSessionModal from '../components/CreateSessionModal';

const EMOJI_LIST = ['👍', '🎉', '📚', '🚀', '💡', '🔥', '💻', '🤝', '☕', '✨', '🙌', '💯'];

const ChatPage = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const location = useLocation();

  const [conversations, setConversations] = useState([]);
  const [activePartner, setActivePartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isPeerTyping, setIsPeerTyping] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [searchConvo, setSearchConvo] = useState('');

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isPeerTyping]);

  // Load conversations list
  const loadConversations = async () => {
    try {
      const res = await api.messages.getConversations();
      if (res.success && res.conversations) {
        setConversations(res.conversations);

        // Check if navigated with state { targetPartnerId }
        const targetId = location.state?.targetPartnerId;
        if (targetId) {
          const match = res.conversations.find((c) => String(c.mate._id) === String(targetId));
          if (match) {
            setActivePartner(match.mate);
          } else {
            // Load partner profile directly
            const peerRes = await api.users.getProfile(targetId);
            if (peerRes.success && peerRes.profile) {
              setActivePartner(peerRes.profile);
            }
          }
        } else if (!activePartner && res.conversations.length > 0) {
          setActivePartner(res.conversations[0].mate);
        }
      }
    } catch (err) {
      console.warn('Convos error:', err);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [user?._id, location.state]);

  // Load messages when active partner changes
  useEffect(() => {
    if (!activePartner) return;

    const loadMessages = async () => {
      setLoadingMessages(true);
      try {
        const res = await api.messages.getDirectMessages(activePartner._id);
        if (res.success) {
          setMessages(res.messages || []);
        }
      } catch (err) {
        console.warn('Messages error:', err);
      } finally {
        setLoadingMessages(false);
      }
    };

    loadMessages();
  }, [activePartner?._id]);

  // Socket.io real-time message & typing listener
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      if (
        activePartner &&
        (String(msg.sender?._id || msg.sender) === String(activePartner._id) ||
          String(msg.recipient?._id || msg.recipient) === String(activePartner._id))
      ) {
        setMessages((prev) => [...prev, msg]);
      }
      loadConversations();
    };

    const handleUserTyping = ({ senderId }) => {
      if (activePartner && String(senderId) === String(activePartner._id)) {
        setIsPeerTyping(true);
      }
    };

    const handleUserStopTyping = ({ senderId }) => {
      if (activePartner && String(senderId) === String(activePartner._id)) {
        setIsPeerTyping(false);
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('user_typing', handleUserTyping);
    socket.on('user_stop_typing', handleUserStopTyping);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('user_typing', handleUserTyping);
      socket.off('user_stop_typing', handleUserStopTyping);
    };
  }, [socket, activePartner?._id]);

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);

    if (socket && activePartner) {
      socket.emit('typing', {
        senderId: user._id,
        senderName: user.name,
        recipientId: activePartner._id,
      });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stop_typing', { senderId: user._id, recipientId: activePartner._id });
      }, 1500);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activePartner) return;

    const content = newMessage.trim();
    setNewMessage('');
    setShowEmojiPicker(false);

    if (socket && activePartner) {
      socket.emit('stop_typing', { senderId: user._id, recipientId: activePartner._id });
    }

    // Optimistic UI update
    const tempMsg = {
      _id: 'temp_' + Date.now(),
      sender: { _id: user._id, name: user.name, avatar: user.avatar },
      recipient: activePartner,
      content,
      read: false,
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      const res = await api.messages.sendMessage({
        recipientId: activePartner._id,
        content,
      });
      if (res.success && res.message) {
        setMessages((prev) =>
          prev.map((m) => (m._id === tempMsg._id ? res.message : m))
        );
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const addEmoji = (emoji) => {
    setNewMessage((prev) => prev + emoji);
  };

  const filteredConversations = conversations.filter((c) =>
    c.mate?.name?.toLowerCase().includes(searchConvo.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 h-[calc(100vh-140px)] min-h-[580px]">
        
        {/* Left Sidebar: Connected students & conversations (4 cols) */}
        <div className="md:col-span-4 lg:col-span-4 border-r border-slate-200 flex flex-col bg-slate-50/50">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg text-navy-900 flex items-center gap-2">
                <span>VibeMates Chat</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </h2>
            </div>

            {/* Search conversations */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchConvo}
                onChange={(e) => setSearchConvo(e.target.value)}
                placeholder="Search peers..."
                className="w-full text-xs pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Conversations list */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 space-y-2">
                <Users className="w-8 h-8 text-slate-300 mx-auto" />
                <p>No active chats found.</p>
                <p>Accept connection requests to start chatting!</p>
              </div>
            ) : (
              filteredConversations.map(({ mate, lastMessage, unreadCount }) => {
                const isSelected = activePartner && String(activePartner._id) === String(mate._id);
                return (
                  <div
                    key={mate._id}
                    onClick={() => setActivePartner(mate)}
                    className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                      isSelected ? 'bg-purple-100/70 border-r-4 border-brand-600' : 'hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={mate.avatar}
                        alt={mate.name}
                        className="w-11 h-11 rounded-2xl object-cover ring-1 ring-slate-200 bg-white"
                      />
                      {mate.isOnline && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white"></span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-navy-900 truncate">{mate.name}</p>
                        {lastMessage && (
                          <span className="text-[10px] text-slate-400">
                            {new Date(lastMessage.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {lastMessage ? lastMessage.content : `${mate.course} • ${mate.year}`}
                      </p>
                    </div>

                    {unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Main Chat Area (8 cols) */}
        <div className="md:col-span-8 lg:col-span-8 flex flex-col h-full bg-white">
          {activePartner ? (
            <>
              {/* Chat Header */}
              <div className="px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-white z-10">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={activePartner.avatar}
                      alt={activePartner.name}
                      className="w-10 h-10 rounded-2xl object-cover ring-2 ring-purple-100"
                    />
                    {activePartner.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-navy-900 flex items-center gap-1.5">
                      {activePartner.name}
                      {activePartner.isOnline && (
                        <span className="text-[10px] text-emerald-600 font-semibold">• Online</span>
                      )}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {activePartner.course} ({activePartner.year}) • {activePartner.college}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowScheduleModal(true)}
                    className="py-1.5 px-3 rounded-xl text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 flex items-center gap-1.5 transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5 text-brand-600" />
                    <span>Schedule Study Session</span>
                  </button>
                </div>
              </div>

              {/* Message List */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#FAF8FF]/60">
                {/* Peer intro banner */}
                <div className="text-center py-3">
                  <div className="inline-block bg-white p-3 rounded-2xl border border-purple-100 shadow-sm text-xs text-slate-500">
                    <span className="font-bold text-navy-900">You are connected with {activePartner.name}</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Matched for peer-to-peer study sessions. Be respectful and collaborative!
                    </p>
                  </div>
                </div>

                {loadingMessages ? (
                  <div className="py-10 text-center text-xs text-slate-400">
                    Loading conversation...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="py-10 text-center text-xs text-slate-400 space-y-1">
                    <p>No messages yet.</p>
                    <p className="text-brand-600 font-medium">
                      Say hello: "Hey! Are you available to study today?"
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = String(msg.sender?._id || msg.sender) === String(user._id);
                    return (
                      <div
                        key={msg._id}
                        className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isMe && (
                          <img
                            src={activePartner.avatar}
                            alt={activePartner.name}
                            className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                          />
                        )}

                        <div
                          className={`max-w-[78%] sm:max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                            isMe
                              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-xs'
                              : 'bg-white text-navy-900 border border-slate-200/80 rounded-bl-xs'
                          }`}
                        >
                          <p>{msg.content}</p>
                          <div
                            className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                              isMe ? 'text-purple-200' : 'text-slate-400'
                            }`}
                          >
                            <span>
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            {isMe && <CheckCheck className="w-3 h-3 text-purple-200" />}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Peer Typing Indicator */}
                {isPeerTyping && (
                  <div className="flex items-center gap-2 text-xs text-slate-400 italic">
                    <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce"></span>
                    <span>{activePartner.name} is typing...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Emoji Picker Popup */}
              {showEmojiPicker && (
                <div className="px-4 py-2 bg-white border-t border-slate-200 flex items-center gap-2 overflow-x-auto">
                  {EMOJI_LIST.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => addEmoji(emoji)}
                      className="text-lg p-1 hover:scale-125 transition-transform"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Bar (Requirement #14) */}
              <form onSubmit={handleSendMessage} className="p-3 sm:p-4 bg-white border-t border-slate-200">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/90 rounded-2xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-purple-400 focus-within:bg-white transition-all">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-1.5 text-slate-400 hover:text-navy-900 rounded-lg hover:bg-slate-200/60"
                    title="Emoji reactions"
                  >
                    <Smile className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => alert('Attachments: PDF problem sheets, code snippets, notes.')}
                    className="p-1.5 text-slate-400 hover:text-navy-900 rounded-lg hover:bg-slate-200/60"
                    title="Attach file or code problem"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    value={newMessage}
                    onChange={handleInputChange}
                    placeholder={`Message ${activePartner.name}...`}
                    className="flex-1 text-xs py-2 bg-transparent focus:outline-none text-navy-900"
                  />

                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="p-2 rounded-xl text-white gradient-primary hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3 text-slate-400">
              <Users className="w-12 h-12 text-slate-300" />
              <h3 className="font-bold text-base text-navy-800">Select a study mate to chat</h3>
              <p className="text-xs max-w-sm">
                Pick a student from your VibeMates list on the left to review homework, discuss algorithm concepts, or schedule study sprints.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Schedule Session Modal */}
      <CreateSessionModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        preselectedPartner={activePartner}
        onSessionCreated={(ses) => {
          alert(`Session "${ses.title}" scheduled successfully!`);
          // Post confirmation message to chat
          setMessages((prev) => [
            ...prev,
            {
              _id: 'sys_' + Date.now(),
              sender: user,
              content: `📅 Scheduled Study Session: "${ses.title}" on ${ses.date} at ${ses.time} (${ses.duration} mins).`,
              createdAt: new Date(),
            },
          ]);
        }}
      />
    </div>
  );
};

export default ChatPage;
