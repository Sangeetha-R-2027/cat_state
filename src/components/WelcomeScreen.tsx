import React, { useState } from 'react';
import {
  GraduationCap,
  ArrowRight,
  Paperclip,
  Sparkles,
  BookOpen,
  Code2,
  Cpu,
  Compass,
  FileCheck2,
  CheckCircle2
} from 'lucide-react';
import { TopicChat } from '../types';

interface WelcomeScreenProps {
  onStartTopic: (topicTitle: string, attachedDoc?: any) => void;
  recentChats: TopicChat[];
  onOpenDocModal: () => void;
  attachedDocName?: string;
}

const QUICK_START_TOPICS = [
  {
    title: 'Linked Lists in C',
    category: 'Computer Science',
    icon: Code2,
    description: 'Dynamic memory (malloc), pointer arithmetic, node links, and segfault prevention.',
    tags: ['Pointers', 'Heap vs Stack', 'O(1) Insertion']
  },
  {
    title: 'Binary Search Trees',
    category: 'Algorithms',
    icon: Cpu,
    description: 'Hierarchical BST invariant, recursive search, and in-order sorted traversal.',
    tags: ['Recursion', 'O(log n)', 'Tree Traversal']
  },
  {
    title: "Newton's Laws of Motion",
    category: 'Physics',
    icon: Compass,
    description: 'Inertia, F=ma vector mechanics, and action-reaction pairs with free body diagrams.',
    tags: ['Forces', 'Free Body Diagrams', 'Vector Math']
  },
  {
    title: 'Transformer Attention Mechanism',
    category: 'AI & Machine Learning',
    icon: Sparkles,
    description: 'Query-Key-Value dot-product scaling, softmax weights, and multi-head representation.',
    tags: ['Self-Attention', 'Softmax', 'QKV Projections']
  }
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStartTopic,
  recentChats,
  onOpenDocModal,
  attachedDocName
}) => {
  const [inputVal, setInputVal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    onStartTopic(inputVal.trim());
  };

  return (
    <div
      style={{
        maxWidth: '860px',
        margin: '0 auto',
        padding: '48px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      {/* Hero Badge */}
      <div
        className="badge badge-primary"
        style={{
          marginBottom: '20px',
          padding: '6px 14px',
          fontSize: '0.8rem',
          display: 'inline-flex',
          gap: '6px'
        }}
      >
        <Sparkles size={14} />
        <span>Evidence-Based Adaptive Academic Pedagogy</span>
      </div>

      {/* Main Headline */}
      <h1
        style={{
          fontSize: '2.5rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          textAlign: 'center',
          letterSpacing: '-0.03em',
          marginBottom: '12px',
          lineHeight: 1.2
        }}
      >
        What would you like to learn today?
      </h1>
      <p
        style={{
          fontSize: '1.05rem',
          color: 'var(--text-muted)',
          textAlign: 'center',
          maxWidth: '580px',
          marginBottom: '36px',
          lineHeight: 1.5
        }}
      >
        Enter any academic concept. The assistant measures your understanding in real time, diagnoses knowledge gaps, and adapts its teaching method to how you learn best.
      </p>

      {/* Central Input Box */}
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          backgroundColor: 'var(--bg-surface)',
          border: '1.5px solid var(--border-medium)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)',
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          marginBottom: '14px'
        }}
      >
        <textarea
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="e.g. Linked Lists in C, Eigenvalues and Eigenvectors, Bayes Theorem, Photosynthesis..."
          rows={2}
          style={{
            width: '100%',
            border: 'none',
            outline: 'none',
            fontSize: '1.05rem',
            color: 'var(--text-primary)',
            backgroundColor: 'transparent',
            resize: 'none',
            lineHeight: 1.5
          }}
          autoFocus
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={onOpenDocModal}
              className="btn-ghost"
              style={{
                fontSize: '0.8rem',
                padding: '6px 12px',
                border: '1px dashed var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                color: attachedDocName ? 'var(--accent-primary)' : 'var(--text-muted)'
              }}
              title="Attach handwritten notes, PDF, or syllabus (optional)"
            >
              <Paperclip size={14} />
              <span>{attachedDocName ? `Attached: ${attachedDocName.slice(0, 18)}...` : 'Attach Notes / PDF (Optional)'}</span>
            </button>

            {attachedDocName && (
              <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                <CheckCircle2 size={12} /> Grounding Ready
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="btn-primary"
            style={{
              padding: '8px 18px',
              fontSize: '0.9rem',
              opacity: inputVal.trim() ? 1 : 0.45,
              cursor: inputVal.trim() ? 'pointer' : 'not-allowed'
            }}
          >
            <span>Begin Topic</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </form>

      {/* Upload Reassurance Banner */}
      <div
        style={{
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '42px'
        }}
      >
        <FileCheck2 size={14} color="var(--success)" />
        <span>No uploads required. You can learn any concept from scratch with or without study materials.</span>
      </div>

      {/* Quick-Start Curriculum Suggestions */}
      <div style={{ width: '100%', marginBottom: '40px' }}>
        <div
          style={{
            fontSize: '0.82rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--text-muted)',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <BookOpen size={16} />
          <span>Curated Interactive Topic Workspaces</span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '14px'
          }}
        >
          {QUICK_START_TOPICS.map((topic, i) => {
            const Icon = topic.icon;
            return (
              <div
                key={i}
                className="card"
                onClick={() => onStartTopic(topic.title)}
                style={{
                  cursor: 'pointer',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '1px solid var(--border-light)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--accent-subtle)',
                        color: 'var(--accent-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>
                      {topic.category}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    {topic.title}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '14px' }}>
                    {topic.description}
                  </p>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {topic.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      style={{
                        fontSize: '0.68rem',
                        padding: '2px 7px',
                        borderRadius: '4px',
                        backgroundColor: 'var(--bg-subtle)',
                        color: 'var(--text-muted)'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Learning Activity if any */}
      {recentChats.length > 0 && (
        <div style={{ width: '100%' }}>
          <div
            style={{
              fontSize: '0.82rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-muted)',
              marginBottom: '12px'
            }}
          >
            Resume Recent Learning Chats
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recentChats.slice(0, 3).map((chat) => (
              <div
                key={chat.id}
                onClick={() => onStartTopic(chat.title)}
                className="card"
                style={{
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                    {chat.title}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', gap: '10px', marginTop: '2px' }}>
                    <span>{chat.category}</span>
                    <span>•</span>
                    <span>{chat.assessmentHistory.length} assessments completed</span>
                    <span>•</span>
                    <span>{chat.studyTimeMinutes} mins studied</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Estimated Mastery</div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                      {chat.estimatedMastery}%
                    </div>
                  </div>
                  <ArrowRight size={16} color="var(--text-muted)" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
