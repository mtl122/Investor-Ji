import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Bot, 
  HelpCircle,
  PhoneCall,
  Loader2
} from 'lucide-react';
import { Property } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'model';
  text: string;
  timestamp: Date;
}

interface InvestorChatbotProps {
  properties: Property[];
  favoritedIds: string[];
  compareIds: string[];
  onNotify: (message: string, type: 'success' | 'error') => void;
  onOpenConsultation: (message: string) => void;
}

export function InvestorChatbot({
  properties,
  favoritedIds,
  compareIds,
  onNotify,
  onOpenConsultation
}: InvestorChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasNewAlert, setHasNewAlert] = useState(true); // alert visual pulse on startup
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'model',
      text: `### Welcome to AdvisorJi Sourcing Desk.

I am your active investment AI, loaded with 2026 Indian micro-market indexing and RERA parameters. 
I am currently monitoring your selections on the dashboard to provide context-aware feedback.

Based on our active catalog, here's what investors are prioritizing today:
1. **Premium Assured Yields**: DLF Sovereign Oasis in Sector 54, Gurgaon offering a solid **14.8% Projected ROI**.
2. **Transit Corridor Plots**: Vrindavan gated township plots and Mathura Yamuna Expressway land parcels showing over **15% YOY appreciation**.
3. **Grade-A Logistics**: Embassy smart logistic warehouses in Chakan, Pune offering immediate **9.2% rent yields** backed by inflation guards.

How can I assist your real estate capital deployment strategy today? Ask me about specific calculations, lease metrics, or RERA registries!`,
      timestamp: new Date()
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to latest chat item
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Turn off new alert pulse when opened
  const handleToggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasNewAlert(false);
    }
  };

  // Predefined contextual quick prompts
  const quickPrompts = [
    { label: "⚖️ Explain RERA protections", text: "Explain the legal escrow protections and 70% rule under UP RERA and MahaRERA." },
    { label: "📈 Compute 1Cr yield options", text: "Propose a diversified portfolio with ₹1 Crore capital to maximize gross passive monthly rent and land appreciation." },
    { label: "🌳 Vrindavan vs Gurgaon", text: "Compare Gated Villa Plots in Vrindavan against Commercial Assured returns in Gurgaon." },
    { label: "🏦 Stamp duty & tax rules", text: "What is the standard stamp duty, registration outlay, and GST rate on commercial and residential property in NCR?" }
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsgId = Date.now().toString();
    const newUserMsg: Message = {
      id: userMsgId,
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setLoading(true);

    // Format properties state context to feed Gemini
    const userWorkspaceContext = `
    Active Comparison IDs: [${compareIds.join(', ')}]. 
    Active Favorited IDs: [${favoritedIds.join(', ')}].
    Total Verifiable Listings Count: ${properties.length}.
    Latest listings: ${properties.slice(0, 3).map(p => `${p.title} (₹${p.minInvestment}L)`).join(', ')}.
    `;

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend,
          history: messages.map(m => ({ sender: m.sender, text: m.text })),
          userPropertiesContext: userWorkspaceContext
        })
      });

      if (!response.ok) {
        throw new Error("Server chat route failed");
      }

      const data = await response.json();
      const modelNewMsg: Message = {
        id: `model-${Date.now()}`,
        sender: 'model',
        text: data.reply || "No response received.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, modelNewMsg]);
    } catch (err) {
      console.error("AI Communication error:", err);
      // Fallback response simulation inside client
      setTimeout(() => {
        const fallBackMsg: Message = {
          id: `model-fallback-${Date.now()}`,
          sender: 'model',
          text: `### AI Connectivity Update

I encountered a minor network latency issue while requesting remote cloud model keys. However, here is your RERA compliance summary:

The standard NCR stamp duty is **6%** for males and **5%** for females, with an additional **1%** court registration surcharge. Direct developer escrows under Section 4(2)(l)(D) of the RERA Act guarantee 70% constructor deployment.

If you require instant premium assistance, please tap the button below to route your inquiry to our HNI Desk.`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, fallBackMsg]);
      }, 800);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="persistent-investor-chatbot" className="fixed bottom-6 right-6 z-50 font-sans">
      
      {/* 1. FLOATING GLOWING CHAT ACTION EMBLEM */}
      {!isOpen && (
        <button
          onClick={handleToggleOpen}
          className="relative bg-gradient-to-tr from-red-650 to-red-600 hover:from-red-650 hover:to-[#D4AF37] text-white p-4 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 group shadow-red-500/20 active:scale-95 flex items-center justify-center cursor-pointer"
          title="Consult AdvisorJi AI"
        >
          {hasNewAlert && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border border-slate-950 animate-pulse flex items-center justify-center text-[10px] font-bold">
              1
            </span>
          )}
          <MessageSquare className="w-6 h-6 animate-pulse group-hover:rotate-6" />
        </button>
      )}

      {/* 2. CHAT PANEL INTERFACE */}
      {isOpen && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-[90vw] sm:w-[420px] h-[550px] flex flex-col justify-between overflow-hidden animate-in slide-in-from-bottom duration-300">
          
          {/* HEADER BAR */}
          <div className="bg-slate-50 border-b border-slate-200 p-4 shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-red-50 text-red-650 rounded-xl border border-red-100">
                <Bot className="w-5 h-5 stroke-2" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-xs flex items-center gap-1">
                  AdvisorJi Sourcing AI
                  <Sparkles className="w-3.5 h-3.5 text-red-650 fill-red-650" />
                </h3>
                <span className="text-[10px] text-emerald-700 font-mono font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                  RERA Knowledge Engine
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onOpenConsultation("Chat initiated: requesting live desk voice routing.");
                  onNotify("Requested voice callback. An advisor will contact you shortly.", "success");
                }}
                className="p-1 px-2.5 bg-red-50 hover:bg-red-100 border border-red-100 text-red-650 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1"
                title="Direct voice request"
              >
                <PhoneCall className="w-3 h-3" />
                <span>Call Desk</span>
              </button>
              
              <button
                onClick={handleToggleOpen}
                className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-red-650 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* CHAT WINDOW / MESSAGE COLUMN */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-50/50 text-xs text-slate-800">
            {messages.map(m => {
              const isUser = m.sender === 'user';
              return (
                <div 
                  key={m.id} 
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in duration-200`}
                >
                  <div className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed border shadow-xs ${
                    isUser 
                      ? 'bg-red-50 border-red-100 text-slate-800 rounded-br-none' 
                      : 'bg-white border-slate-200 text-slate-800 rounded-bl-none'
                  }`}>
                    {/* Render basic Markdown headings and bullet points natively */}
                    <div className="space-y-2 whitespace-pre-wrap select-text markdown-body">
                      {m.text.split('\n').map((line, linIdx) => {
                        if (line.startsWith('### ')) {
                          return <h4 key={linIdx} className="font-extrabold text-slate-900 text-xs mt-2 border-b border-slate-100 pb-0.5">{line.replace('### ', '')}</h4>;
                        }
                        if (line.startsWith('- ') || line.startsWith('* ')) {
                          return <div key={linIdx} className="pl-3.5 relative flex items-start gap-1 text-slate-600 font-medium my-0.5">
                            <span className="text-red-500 shrink-0 select-none">•</span>
                            <span>{line.replace('- ', '').replace('* ', '')}</span>
                          </div>;
                        }
                        if (line.match(/^\d+\.\s/)) {
                          return <div key={linIdx} className="pl-3.5 relative flex items-start gap-1 text-slate-600 font-medium my-0.5">
                            <span className="text-red-500 shrink-0 font-mono font-bold select-none">{line.match(/^\d+\./)?.[0]}</span>
                            <span>{line.replace(/^\d+\.\s/, '')}</span>
                          </div>;
                        }
                        // Handle bold text in simplistic fashion
                        if (line.includes('**')) {
                          const parts = line.split('**');
                          return <p key={linIdx} className="font-medium">
                            {parts.map((p, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="font-extrabold text-amber-700">{p}</strong> : p)}
                          </p>;
                        }
                        return <p key={linIdx} className="font-medium text-slate-600">{line}</p>;
                      })}
                    </div>
                    <span className="text-[8px] text-slate-400 font-mono block text-right mt-1.5 select-none">
                      {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* TYPING LOADER */}
            {loading && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-white p-3.5 border border-slate-200 rounded-2xl rounded-bl-none text-slate-500 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-red-650" />
                  <span className="font-mono text-[10px] uppercase font-bold">AdvisorJi is calculating...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* QUICK PROMPTS STRIP */}
          {messages.length < 5 && (
            <div className="p-2 border-t border-slate-100 bg-slate-50/70 shrink-0 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none scroll-smooth">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(qp.text)}
                  className="bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 text-[9px] text-slate-700 hover:text-red-650 px-2.5 py-1.5 rounded-lg transition-all font-bold cursor-pointer shadow-xs"
                >
                  {qp.label}
                </button>
              ))}
            </div>
          )}

          {/* INPUT BUTTON CONTAINER */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
            }} 
            className="p-3 border-t border-slate-200 bg-slate-50 shrink-0 flex gap-2 items-center"
          >
            <input
              type="text"
              className="bg-white border border-slate-200 text-slate-800 px-3 py-2.5 rounded-xl text-xs outline-none focus:border-red-500 transition-all flex-grow font-semibold placeholder-slate-450 shadow-xs"
              placeholder="Ask about properties, legal audits, yields..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              required
            />
            <button
              type="submit"
              className="bg-red-650 hover:bg-red-700 text-white p-2.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-40"
              disabled={loading || !input.trim()}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
