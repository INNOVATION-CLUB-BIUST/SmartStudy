import { useState } from 'react';
import { Send, Brain, Zap, Book, FileText, Plus } from 'lucide-react';

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hello! I am your AI Study Assistant. How can I help you today?',
      sender: 'ai',
    },
    {
      id: 2,
      text: 'Can you help me create a study plan for my upcoming exams?',
      sender: 'user',
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() === '') return;
    setMessages([...messages, { id: Date.now(), text: input, sender: 'user' }]);
    setInput('');
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now(), text: 'Of course! To create a personalized study plan, I need to know which subjects you\'re studying and the dates of your exams. Could you please provide that information?', sender: 'ai' }]);
    }, 1500);
  };

  const suggestedPrompts = [
    { icon: Book, text: 'Explain a concept' },
    { icon: FileText, text: 'Summarize a document' },
    { icon: Zap, text: 'Generate quiz questions' },
    { icon: Plus, text: 'Create a study plan' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Brain className="mr-3 text-orange-400" />
            AI Study Assistant
          </h1>
          <p className="text-slate-300 mt-2">Your personalized guide to smarter learning</p>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-orange-500/20 flex flex-col h-[600px]">
        {/* Messages */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-4 ${message.sender === 'user' ? 'justify-end' : ''}`}>
              {message.sender === 'ai' && (
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white">
                  <Brain size={20} />
                </div>
              )}
              <div className={`max-w-lg p-4 rounded-xl ${message.sender === 'user' ? 'bg-orange-500/20 text-orange-300' : 'bg-slate-700/50 text-slate-300'}`}>
                <p>{message.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-orange-500/20">
          {/* Suggested Prompts */}
          <div className="flex items-center gap-2 mb-4">
            {suggestedPrompts.map((prompt, index) => (
              <button key={index} className="flex items-center gap-2 py-2 px-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-slate-300 text-sm transition-colors">
                <prompt.icon size={16} />
                <span>{prompt.text}</span>
              </button>
            ))}
          </div>

          {/* Text Input */}
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything about your studies..."
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 pl-4 pr-12 text-white placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
            />
            <button
              onClick={handleSend}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-orange-500 hover:bg-orange-600 rounded-md text-white transition-colors disabled:opacity-50"
              disabled={!input.trim()}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
