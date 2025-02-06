import React, { useState, useRef, useEffect } from 'react';
import { Plus, Send } from 'lucide-react';

const ChatBubble = ({ message, isUser }) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 max-w-2xl ${isUser ? 'ml-auto' : 'mr-auto'}`}>
      <div className="relative flex">
        {!isUser && (
          <svg className="absolute left-0 top-0 -translate-x-2" width="10" height="20" viewBox="0 0 10 20" fill="#F3F4F6">
            <path d="M10 0C2 0 0 8 0 8v4c0 0 2 8 10 8" />
          </svg>
        )}
        
        <div className={`relative px-4 py-2 rounded-lg ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
          {message}
        </div>
        
        {isUser && (
          <svg className="absolute right-0 top-0 translate-x-2" width="10" height="20" viewBox="0 0 10 20" fill="#3B82F6">
            <path d="M0 0c8 0 10 8 10 8v4c0 0-2 8-10 8" />
          </svg>
        )}
      </div>
    </div>
  );
};

export const NotFoundPage = () => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([
    {
      text: "Generate an email pitch to attract millennials target market. Ask first about my business, the products or services offered and their advantages.",
      isUser: true
    },
    {
      text: "Sure! To make the email pitch truly effective, could you confirm a few details about your business and offerings?",
      isUser: false
    }
  ]);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle textarea height adjustment
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [inputValue]);

  // Handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Handle message send
  const handleSendMessage = () => {
    if (inputValue.trim()) {
      // Add user message
      setMessages(prev => [...prev, { text: inputValue.trim(), isUser: true }]);
      setInputValue('');

      // Simulate system reply after 1 second
      setTimeout(() => {
        setMessages(prev => [...prev, { text: "Okay", isUser: false }]);
      }, 1000);
    }
  };

  // Handle enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Full-width Sticky Header */}
      <header className="bg-white border-b border-gray-200 fixed top-0 right-0 left-0 z-10">
        <div className="flex justify-between items-center px-6 py-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">L</span>
            </div>
            <span className="ml-2 font-semibold text-gray-800">LOGO NAME</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">GPT 4.0-mini</span>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Sticky Sidebar */}
      <div className="w-64 flex-shrink-0 bg-white border-r border-gray-200 fixed h-full overflow-y-auto pt-16">
        <div className="p-4">
          {/* Folders Section */}
          <div className="mb-6">
            <h2 className="text-sm font-medium text-gray-500 mb-3">Folders</h2>
            <div className="grid grid-cols-3 gap-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="p-3 bg-blue-50 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 text-blue-500">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Chat History */}
          <div>
            <h2 className="text-sm font-medium text-gray-500 mb-3">Chat History</h2>
            <div className="space-y-2">
              {[
                'Building Browser Extension Guide',
                'Help Request',
                'Memory and Identification Query',
                'Order Tracking 004',
                'Conversation Starter'
              ].map((item, i) => (
                <div key={i} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto pt-16 pb-20 px-6">
          <div className="py-6">
            {messages.map((message, index) => (
              <ChatBubble 
                key={index}
                message={message.text}
                isUser={message.isUser}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Adaptive Chat Input */}
        <div className="fixed bottom-0 right-0 left-64 bg-white border-t border-gray-200 p-4">
          <div className="flex items-start space-x-2 bg-gray-50 rounded-lg border border-gray-200 px-3 py-2">
            <button className="p-2 hover:bg-gray-200 rounded-lg text-gray-500">
              <Plus size={20} />
            </button>
            
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Ask anything..."
              rows="1"
              className="flex-1 bg-transparent resize-none outline-none py-2 min-h-[40px] max-h-48 overflow-y-auto"
              style={{
                lineHeight: '1.5'
              }}
            />
            
            <button 
              onClick={handleSendMessage}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                inputValue.trim() 
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : 'text-gray-400 cursor-not-allowed'
              }`}
              disabled={!inputValue.trim()}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;