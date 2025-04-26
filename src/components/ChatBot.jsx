import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, AlertTriangle, User, Bot, Loader2 } from 'lucide-react';
import { useParams } from 'react-router-dom';

const ChatBot = () => {
  const [conversation, setConversation] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [topicDetails, setTopicDetails] = useState(null);

  // Get topic_id from URL params
  const { topicId } = useParams();

  const inputRef = useRef(null);

  // Remove auto-focus on mount to prevent automatic scrolling
  // useEffect(() => {
  //   inputRef.current?.focus();
  // }, []);

  useEffect(() => {
    // Fetch just the topic name for display in the header
    if (topicId) {
      axios.get(`${import.meta.env.VITE_API_BASE_URL || '/api'}/get_topic/${topicId}`)
        .then(response => {
          const topicInfo = response.data[0];
          setTopicDetails({ topic_name: topicInfo.topic_name });
        })
        .catch(err => {
          console.error("Failed to fetch topic name", err);
        });
    }
  }, [topicId]);

  const sendMessage = async () => {
    if (!userInput.trim()) {
      setError('Please enter a message');
      return;
    }
    setError(null);
    setIsLoading(true);

    // Add user message to conversation immediately
    const updatedConversation = [...conversation, { role: 'user', content: userInput }];
    setConversation(updatedConversation);
    const currentUserInput = userInput;
    setUserInput('');

    try {
      // Send only the user prompt to the server
      const response = await axios.post(`http://192.168.137.218:8000/${topicId}/chat`, {
        prompt: currentUserInput,
        topic_id: topicId
      });
      
      // Add bot response to conversation
      setConversation(prev => [...prev, { role: 'assistant', content: response.data.reply }]);
    } catch (err) {
      if (axios.isAxiosError && axios.isAxiosError(err)) {
        const errorMsg = err.response?.data?.error || 'An unexpected error occurred';
        setError(errorMsg);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  // New: handle Enter key press for submission
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  const handleTextareaChange = (e) => {
    setUserInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  return (
    <div className="flex flex-col h-full min-h-[75vh] bg-indigo-50 shadow-xl rounded-xl overflow-hidden border border-indigo-200">
      {/* Header with Topic Name */}
      <div className="bg-gradient-to-r from-indigo-700 to-indigo-500 text-white p-4 shadow-lg">
        <h1 className="text-xl font-bold flex items-center gap-2 md:text-2xl">
          <Bot className="h-5 w-5 md:h-6 md:w-6" />
          <span className="font-mono tracking-tight">Topic Assistant</span>
          {topicDetails && (
            <>
              <span className="mx-1 text-indigo-200">|</span>
              <span className="font-semibold text-indigo-100 truncate max-w-xs">
                {topicDetails.topic_name}
              </span>
            </>
          )}
        </h1>
      </div>

      {/* Chat Messages Section */}
      <div className="flex-grow overflow-y-auto p-3 md:p-5 space-y-4 bg-gradient-to-b from-indigo-50 to-white">
        {conversation.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-indigo-800 py-8 space-y-4">
            <Bot className="h-12 w-12 text-indigo-400" />
            <div className="max-w-md">
              <p className="text-lg font-medium text-indigo-700">Welcome to the Topic Assistant!</p>
              <p className="text-indigo-600 mt-2">Ask any questions about this topic and I'll help you understand it better.</p>
            </div>
          </div>
        )}
        
        {conversation.map((msg, index) => (
          <div 
            key={index} 
            className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role !== 'user' && (
              <div className="flex-shrink-0 mb-1">
                <div className="bg-indigo-600 text-white p-1.5 rounded-full">
                  <Bot size={16} />
                </div>
              </div>
            )}
            
            <div 
              className={`
                max-w-[85%] md:max-w-[75%] p-3 rounded-2xl shadow-sm 
                ${msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 rounded-tl-none border border-indigo-100'}
              `}
            >
              <p className={`text-sm md:text-base ${msg.role === 'user' ? 'text-indigo-50' : 'text-gray-700'}`}>
                {msg.content}
              </p>
            </div>
            
            {msg.role === 'user' && (
              <div className="flex-shrink-0 mb-1">
                <div className="bg-indigo-500 text-white p-1.5 rounded-full">
                  <User size={16} />
                </div>
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start space-x-2 justify-start">
            <div className="flex-shrink-0">
              <div className="bg-indigo-600 text-white p-1.5 rounded-full">
                <Bot size={16} />
              </div>
            </div>
            <div className="bg-white text-indigo-800 p-3 rounded-2xl rounded-tl-none border border-indigo-100 shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Handling */}
      {error && (
        <div className="fixed bottom-20 left-0 right-0 mx-auto max-w-sm md:max-w-md z-50 px-4">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md flex items-center animate-fade-in">
            <AlertTriangle className="mr-2 flex-shrink-0 text-red-500" size={20} />
            <span className="text-sm font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Message Input Section */}
      <div className="p-3 bg-white border-t border-indigo-100 shadow-inner">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <div className="relative flex-grow">
            <textarea
              ref={inputRef}
              value={userInput}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown} // New: submit on Enter key press
              placeholder="Ask a question about this topic..."
              className="w-full p-3 pr-12 border-2 border-indigo-200 bg-indigo-50 text-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 resize-none placeholder-indigo-400 min-h-[44px] max-h-[120px]"
              rows={1}
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !userInput.trim()}
            className="
              bg-gradient-to-r from-indigo-700 to-indigo-500 text-white p-3 rounded-xl
              hover:from-indigo-800 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed 
              transition-all duration-200 shadow-md hover:shadow-lg flex-shrink-0
              flex items-center justify-center h-11 w-11
            "
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;