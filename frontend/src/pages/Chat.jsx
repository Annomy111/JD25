import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import io from 'socket.io-client';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { ScrollArea } from '../components/ui/scroll-area';
import { Send, User } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Chat = () => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typing, setTyping] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const newSocket = io(API_URL, {
      auth: { token },
      transports: ['websocket']
    });

    newSocket.on('connect', () => {
      console.log('Connected to chat');
    });

    newSocket.on('message:history', (history) => {
      setMessages(history);
      scrollToBottom();
    });

    newSocket.on('message:receive', (message) => {
      setMessages(prev => [...prev, message]);
      scrollToBottom();
    });

    newSocket.on('users:online', (users) => {
      setOnlineUsers(users);
    });

    newSocket.on('typing:update', ({ userId, name, isTyping }) => {
      if (isTyping) {
        setTyping(prev => [...prev.filter(id => id !== userId), userId]);
      } else {
        setTyping(prev => prev.filter(id => id !== userId));
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    socket.emit('message:send', { content: newMessage });
    setNewMessage('');
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (!socket) return;

    if (e.target.value) {
      socket.emit('typing:start');
    } else {
      socket.emit('typing:stop');
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-100px)]">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Chat</h1>
        <div className="flex items-center space-x-2">
          <User className="w-5 h-5" />
          <span>{onlineUsers.length} online</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 h-[calc(100%-80px)]">
        {/* Online Users Sidebar */}
        <Card className="col-span-3 p-4">
          <h2 className="font-semibold mb-4">Online Users</h2>
          <ScrollArea className="h-[calc(100%-2rem)]">
            {onlineUsers.map((onlineUser) => (
              <div
                key={onlineUser._id}
                className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100"
              >
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>{onlineUser.name}</span>
              </div>
            ))}
          </ScrollArea>
        </Card>

        {/* Chat Area */}
        <Card className="col-span-9 flex flex-col">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.sender._id === user?._id ? 'text-right' : ''
                }`}
              >
                <div
                  className={`inline-block rounded-lg p-3 ${
                    message.sender._id === user?._id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100'
                  }`}
                >
                  <p className="text-sm font-semibold">{message.sender.name}</p>
                  <p>{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {typing.length > 0 && (
              <div className="text-sm text-gray-500 italic">
                {typing.length === 1
                  ? 'Ein Benutzer schreibt...'
                  : `${typing.length} Benutzer schreiben...`}
              </div>
            )}
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Message Input */}
          <form onSubmit={handleSend} className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={handleTyping}
                placeholder="Nachricht eingeben..."
                className="flex-1"
              />
              <Button type="submit" variant="primary">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Chat;