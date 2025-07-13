'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, Send, Phone, Video, MoreVertical, 
  Search, Paperclip, Image, Smile, Star, MapPin,
  Check, CheckCheck, Clock, AlertCircle, X, 
  User, Verified, Online, Offline, Archive,
  Flag, Block, Delete, Edit, Reply, Forward
} from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'product' | 'location';
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  edited?: boolean;
  replyTo?: string;
  attachments?: Array<{
    id: string;
    type: 'image' | 'file';
    url: string;
    name: string;
    size: number;
  }>;
}

interface Conversation {
  id: string;
  participants: Array<{
    id: string;
    name: string;
    avatar?: string;
    verified: boolean;
    online: boolean;
    lastSeen?: Date;
  }>;
  lastMessage?: Message;
  unreadCount: number;
  archived: boolean;
  muted: boolean;
  productId?: string;
  productTitle?: string;
  productImage?: string;
}

interface MessagingSystemProps {
  currentUserId: string;
  onClose?: () => void;
  initialConversationId?: string;
}

// Sample data
const sampleConversations: Conversation[] = [
  {
    id: '1',
    participants: [
      { id: 'user1', name: 'أحمد بن علي', verified: true, online: true },
      { id: 'user2', name: 'محمد الطاهر', verified: true, online: false, lastSeen: new Date(Date.now() - 300000) }
    ],
    lastMessage: {
      id: 'msg1',
      senderId: 'user1',
      receiverId: 'user2',
      content: 'هل الجرار ما زال متاحاً؟',
      type: 'text',
      timestamp: new Date(),
      status: 'read'
    },
    unreadCount: 2,
    archived: false,
    muted: false,
    productId: 'prod1',
    productTitle: 'جرار زراعي فيات 110 حصان',
    productImage: '/assets/pexels-timmossholder-974314.jpg'
  },
  {
    id: '2',
    participants: [
      { id: 'user1', name: 'أحمد بن علي', verified: true, online: true },
      { id: 'user3', name: 'مريم الزهراء', verified: true, online: true }
    ],
    lastMessage: {
      id: 'msg2',
      senderId: 'user3',
      receiverId: 'user1',
      content: 'شكراً لك على البذور الممتازة',
      type: 'text',
      timestamp: new Date(Date.now() - 3600000),
      status: 'delivered'
    },
    unreadCount: 0,
    archived: false,
    muted: false,
    productId: 'prod2',
    productTitle: 'بذور طماطم عضوية',
    productImage: '/assets/pexels-cottonbro-4921204.jpg'
  }
];

const sampleMessages: Message[] = [
  {
    id: 'msg1',
    senderId: 'user2',
    receiverId: 'user1',
    content: 'السلام عليكم، أريد الاستفسار عن الجرار',
    type: 'text',
    timestamp: new Date(Date.now() - 7200000),
    status: 'read'
  },
  {
    id: 'msg2',
    senderId: 'user1',
    receiverId: 'user2',
    content: 'وعليكم السلام، أهلاً وسهلاً. الجرار في حالة ممتازة',
    type: 'text',
    timestamp: new Date(Date.now() - 7000000),
    status: 'read'
  },
  {
    id: 'msg3',
    senderId: 'user2',
    receiverId: 'user1',
    content: 'ما هو السعر النهائي؟',
    type: 'text',
    timestamp: new Date(Date.now() - 6800000),
    status: 'read'
  },
  {
    id: 'msg4',
    senderId: 'user1',
    receiverId: 'user2',
    content: 'السعر 2,500,000 دج قابل للتفاوض',
    type: 'text',
    timestamp: new Date(Date.now() - 6600000),
    status: 'read'
  },
  {
    id: 'msg5',
    senderId: 'user2',
    receiverId: 'user1',
    content: 'هل يمكنني رؤيته غداً؟',
    type: 'text',
    timestamp: new Date(Date.now() - 300000),
    status: 'read'
  },
  {
    id: 'msg6',
    senderId: 'user1',
    receiverId: 'user2',
    content: 'بالطبع، يمكنك زيارتنا في أي وقت',
    type: 'text',
    timestamp: new Date(Date.now() - 60000),
    status: 'delivered'
  }
];

export default function MessagingSystem({ 
  currentUserId, 
  onClose, 
  initialConversationId 
}: MessagingSystemProps) {
  const [conversations, setConversations] = useState<Conversation[]>(sampleConversations);
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [activeConversation, setActiveConversation] = useState<string | null>(initialConversationId || null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [showAttachments, setShowAttachments] = useState(false);
  const [typing, setTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>(['user1', 'user3']);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeConversation]);

  // Handle typing indicator
  useEffect(() => {
    if (newMessage.trim()) {
      setTyping(true);
      const timer = setTimeout(() => setTyping(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [newMessage]);

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv => {
    const participant = conv.participants.find(p => p.id !== currentUserId);
    return participant?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           conv.productTitle?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Get messages for active conversation
  const conversationMessages = messages.filter(msg => 
    (msg.senderId === currentUserId || msg.receiverId === currentUserId) &&
    (activeConversation ? 
      (msg.senderId === activeConversation || msg.receiverId === activeConversation) : 
      false)
  );

  // Get active conversation details
  const activeConversationData = conversations.find(conv => 
    conv.participants.some(p => p.id === activeConversation)
  );

  // Send message
  const sendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      receiverId: activeConversation,
      content: newMessage.trim(),
      type: 'text',
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Update conversation last message
    setConversations(prev => prev.map(conv => 
      conv.participants.some(p => p.id === activeConversation)
        ? { ...conv, lastMessage: message }
        : conv
    ));

    // Simulate message delivery
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? { ...msg, status: 'delivered' } : msg
      ));
    }, 1000);
  };

  // Mark messages as read
  const markAsRead = (conversationId: string) => {
    setConversations(prev => prev.map(conv => 
      conv.participants.some(p => p.id === conversationId)
        ? { ...conv, unreadCount: 0 }
        : conv
    ));
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'الآن';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} د`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} س`;
    
    return date.toLocaleDateString('ar-DZ', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get message status icon
  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sent':
        return <Check className="w-4 h-4 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-4 h-4 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-4 h-4 text-emerald-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 w-full max-w-6xl h-[80vh] flex overflow-hidden"
      >
        {/* Conversations Sidebar */}
        <div className="w-1/3 border-r border-white/20 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">الرسائل</h2>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              )}
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="البحث في المحادثات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-400 text-sm"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map(conversation => {
              const participant = conversation.participants.find(p => p.id !== currentUserId);
              if (!participant) return null;

              return (
                <motion.div
                  key={conversation.id}
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                  className={`p-4 cursor-pointer border-b border-white/10 transition-colors ${
                    activeConversation === participant.id ? 'bg-emerald-600/20' : ''
                  }`}
                  onClick={() => {
                    setActiveConversation(participant.id);
                    markAsRead(participant.id);
                  }}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      {participant.online && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white/20"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white truncate">{participant.name}</h3>
                        {participant.verified && (
                          <Verified className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        )}
                      </div>

                      {/* Product info */}
                      {conversation.productTitle && (
                        <div className="text-xs text-gray-400 mb-1 truncate">
                          {conversation.productTitle}
                        </div>
                      )}

                      {/* Last message */}
                      {conversation.lastMessage && (
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-300 truncate flex-1">
                            {conversation.lastMessage.content}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <span className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Timestamp */}
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-400">
                          {conversation.lastMessage && formatTime(conversation.lastMessage.timestamp)}
                        </span>
                        {!participant.online && participant.lastSeen && (
                          <span className="text-xs text-gray-500">
                            آخر ظهور {formatTime(participant.lastSeen)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-white/20 bg-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      {onlineUsers.includes(activeConversation) && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white/20"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        {activeConversationData?.participants.find(p => p.id === activeConversation)?.name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {onlineUsers.includes(activeConversation) ? 'متصل الآن' : 'غير متصل'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <Phone className="w-5 h-5 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <Video className="w-5 h-5 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                {activeConversationData?.productTitle && (
                  <div className="mt-3 p-3 bg-white/10 rounded-lg flex items-center gap-3">
                    <img
                      src={activeConversationData.productImage}
                      alt={activeConversationData.productTitle}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-white text-sm">
                        {activeConversationData.productTitle}
                      </h4>
                      <p className="text-xs text-gray-400">المنتج المتفاوض عليه</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {conversationMessages.map(message => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.senderId === currentUserId
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white/10 text-white'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs opacity-70">
                          {formatTime(message.timestamp)}
                        </span>
                        {message.senderId === currentUserId && (
                          <div className="ml-2">
                            {getStatusIcon(message.status)}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-white/20">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowAttachments(!showAttachments)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Paperclip className="w-5 h-5 text-gray-400" />
                  </button>

                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="اكتب رسالة..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-400"
                    />
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
                    >
                      <Smile className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="p-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors"
                  >
                    <Send className="w-5 h-5 text-white" />
                  </button>
                </div>

                {/* Typing indicator */}
                {typing && (
                  <div className="mt-2 text-xs text-gray-400">
                    جاري الكتابة...
                  </div>
                )}
              </div>
            </>
          ) : (
            /* No conversation selected */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  اختر محادثة للبدء
                </h3>
                <p className="text-gray-400">
                  اختر محادثة من القائمة للبدء في المراسلة
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}