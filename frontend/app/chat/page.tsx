'use client';

import { useEffect, useState } from 'react';
import { Send, Calendar, Mail, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SignOutButton } from '@clerk/nextjs';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const examplePrompts = [
  {
    icon: Calendar,
    text: "Summarize all my emails from February 14th",
    description: "Get a quick overview of your Valentine's Day communications"
  },
  {
    icon: Mail,
    text: "Find all meeting invites from last week",
    description: "Quickly locate and organize recent meeting requests"
  },
  {
    icon: Clock,
    text: "Show upcoming deadlines mentioned in emails",
    description: "Stay on top of important due dates and commitments"
  },
  {
    icon: Sparkles,
    text: "Analyze my email response time",
    description: "Get insights into your email communication patterns"
  }
];

export default function ChatPage() {
  const [labels, setLabels] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        console.log('in useffect try block')
        const response = await fetch('/api/gmail');
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const data = await response.json();
        console.log("fetched: ", data);
        setLabels(data);
      } catch (err) {
        console.log('in use effect catch block');
        setError(err.message || 'Error fetching labels');
      } finally {
        setLoading(false);
      }
    };

    fetchLabels();
  }, []);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I can help you manage your emails and schedule. What would you like to know?'
    }
  ]);
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = { role: 'user', content: input };
    
    // Simulate AI response
    const aiResponse: Message = {
      role: 'assistant',
      content: "Here's a summary of your emails from February 14th:\n\n" +
        "1. Meeting with Marketing Team (10:00 AM)\n" +
        "2. Project Deadline Reminder from John\n" +
        "3. Client Proposal Review Request\n" +
        "4. Team Lunch Invitation\n\n" +
        "Would you like me to add any of these events to your calendar?"
    };

    setMessages(prev => [...prev, userMessage, aiResponse]);
    setInput('');
  };

  const handleExampleClick = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-purple-50">
      <SignOutButton/>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-[300px,1fr] gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-purple-100">
              <h2 className="text-xl font-semibold mb-4 gradient-text">Example Prompts</h2>
              <div className="space-y-4">
                {examplePrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(prompt.text)}
                    className="w-full text-left p-4 rounded-xl hover:bg-purple-50 transition-colors duration-200 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-purple-100 rounded-lg p-2 group-hover:bg-purple-200 transition-colors duration-200">
                        <prompt.icon className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-900">{prompt.text}</p>
                        <p className="text-sm text-gray-500 mt-1">{prompt.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="bg-white rounded-2xl shadow-xl border border-purple-100 flex flex-col h-[calc(100vh-4rem)]">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      message.role === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200">
              <form onSubmit={handleSubmit} className="flex gap-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your emails and schedule..."
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <Button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-6"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}