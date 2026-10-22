import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  X,
  HelpCircle,
  Sparkles,
  Bot,
  User,
  Paperclip,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { DocumentItem } from '../types';
import { answerStudentDoubt } from '../services/aiService';

interface DoubtMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface DoubtChatProps {
  topicTitle: string;
  currentStep?: string;
  attachedDoc?: DocumentItem;
  isOpen: boolean;
  onToggle: () => void;
}

export const DoubtChat: React.FC<DoubtChatProps> = ({
  topicTitle,
  currentStep,
  attachedDoc,
  isOpen,
  onToggle
}) => {
  const [messages, setMessages] = useState<DoubtMessage[]>([
    {
      id: 'welcome-doubt',
      sender: 'assistant',
      text: `Hello! I'm here to clarify any doubts on "${topicTitle}" while you work through the lesson. What part can I explain more clearly?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim() || isTyping) return;

    const userMsg: DoubtMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    try {
      const res = await answerStudentDoubt(topicTitle, text, currentStep, attachedDoc);
      const botMsg: DoubtMessage = {
        id: `b-${Date.now()}`,
        sender: 'assistant',
        text: res.data,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `b-err-${Date.now()}`,
          sender: 'assistant',
          text: 'I understood your question, but encountered a brief connection issue. Try asking once more!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const QUICK_QUESTIONS = [
    'Why does dereferencing NULL crash the program?',
    'Can you give me an everyday analogy for this?',
    'What is the common exam mistake here?'
  ];

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="btn-primary"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          borderRadius: 'var(--radius-full)',
          padding: '12px 20px',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.88rem'
        }}
      >
        <MessageSquare size={18} />
        <span>Ask a Doubt ({messages.length > 1 ? messages.length - 1 : '0'})</span>
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '400px',
        maxWidth: 'calc(100vw - 32px)',
        height: '520px',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'fadeIn 0.2s ease'
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '14px 16px',
          borderBottom: '1px solid var(--border-light)',
          backgroundColor: 'var(--bg-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '6px',
              backgroundColor: 'var(--accent-primary)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Sparkles size={14} />
          </div>
          <div>
            <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Doubt-Clearing Assistant
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Context: {currentStep || topicTitle}
            </div>
          </div>
        </div>

        <button onClick={onToggle} className="btn-ghost" style={{ padding: '4px' }}>
          <X size={18} />
        </button>
      </div>

      {/* Grounding pill if document attached */}
      {attachedDoc && (
        <div
          style={{
            padding: '6px 12px',
            backgroundColor: 'var(--success-bg)',
            borderBottom: '1px solid var(--success-border)',
            fontSize: '0.7rem',
            color: 'var(--success)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Paperclip size={12} />
          <span>Grounded in: <strong>{attachedDoc.name}</strong></span>
        </div>
      )}

      {/* Messages Thread */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'flex-start',
                flexDirection: isUser ? 'row-reverse' : 'row'
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: isUser ? 'var(--bg-subtle)' : 'var(--accent-subtle)',
                  color: isUser ? 'var(--text-secondary)' : 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '0.75rem'
                }}
              >
                {isUser ? <User size={13} /> : <Bot size={13} />}
              </div>

              <div
                style={{
                  maxWidth: '82%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isUser ? 'var(--accent-primary)' : 'var(--bg-subtle)',
                  color: isUser ? 'var(--text-inverse)' : 'var(--text-primary)',
                  fontSize: '0.82rem',
                  lineHeight: 1.45,
                  whiteSpace: 'pre-wrap'
                }}
              >
                {msg.text}
                <div
                  style={{
                    fontSize: '0.65rem',
                    color: isUser ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)',
                    textAlign: isUser ? 'right' : 'left',
                    marginTop: '4px'
                  }}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
            <Sparkles size={14} className="animate-spin" />
            <span>Formulating pedagogical explanation...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div style={{ padding: '6px 12px', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '6px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
        {QUICK_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            style={{
              fontSize: '0.7rem',
              padding: '4px 8px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-light)',
              cursor: 'pointer'
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '8px', backgroundColor: 'var(--bg-surface)' }}>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask any question about this lesson..."
          style={{
            flex: 1,
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 12px',
            fontSize: '0.84rem',
            outline: 'none',
            backgroundColor: 'var(--bg-surface)',
            color: 'var(--text-primary)'
          }}
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputVal.trim() || isTyping}
          className="btn-primary"
          style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', opacity: inputVal.trim() ? 1 : 0.5 }}
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
};
