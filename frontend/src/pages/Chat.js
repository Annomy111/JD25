import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';
import { PaperAirplaneIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      auth: { token: localStorage.getItem('token') }
    });

    newSocket.on('connect', () => setIsConnected(true));
    newSocket.on('disconnect', () => setIsConnected(false));

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('message:receive', (message) => {
      setMessages(prev => [...prev, message]);
      scrollToBottom();
    });

    socket.on('message:history', (history) => {
      setMessages(history);
      scrollToBottom();
    });

    socket.on('users:online', (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off('message:receive');
      socket.off('message:history');
      socket.off('users:online');
    };
  }, [socket]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && socket) {
      socket.emit('message:send', { content: newMessage.trim() });
      setNewMessage('');
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="h-full bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b flex items-center justify-between bg-white">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">Team Chat</h2>
          <div className="flex items-center text-sm text-gray-500">
            <UserGroupIcon className="h-4 w-4 mr-1" />
            <span>{onlineUsers.length} online</span>
          </div>
        </div>
        <div className="flex items-center">
          <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></span>
          <span className="ml-2 text-sm text-gray-500">
            {isConnected ? 'Verbunden' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={message._id || index}
              className={`flex ${message.sender._id === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.sender._id === user?.id ? 'items-end' : 'items-start'}`}>
                <div className="flex items-end space-x-2">
                  {message.sender._id !== user?.id && (
                    <div className="flex flex-col items-start">
                      <span className="text-xs text-gray-500 mb-1">{message.sender.name}</span>
                    </div>
                  )}
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      message.sender._id === user?.id
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-900 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
                <div className={`mt-1 text-xs text-gray-400 ${message.sender._id === user?.id ? 'text-right' : 'text-left'}`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="px-6 py-4 border-t bg-white">
        <form onSubmit={handleSendMessage} className="flex space-x-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Schreibe eine Nachricht..."
            className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || !isConnected}
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;