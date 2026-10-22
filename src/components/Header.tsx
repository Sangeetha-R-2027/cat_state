import React from 'react';
import {
  BookOpen,
  FileText,
  Sliders,
  Sparkles,
  BarChart3,
  Layers,
  Paperclip
} from 'lucide-react';
import { TopicChat } from '../types';
import { getMethodById } from '../data/techniques';

interface HeaderProps {
  chat?: TopicChat;
  currentView: 'lesson' | 'assessment' | 'dashboard' | 'flashcards';
  onNavigateView: (view: 'lesson' | 'assessment' | 'dashboard' | 'flashcards') => void;
  onOpenMethodModal: () => void;
  onOpenDocModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  chat,
  currentView,
  onNavigateView,
  onOpenMethodModal,
  onOpenDocModal,
}) => {
  if (!chat) return null;

  const teachingMethod = getMethodById(chat.selectedMethods.teaching);
  const practiceMethod = getMethodById(chat.selectedMethods.practice);

  return (
    <header
      style={{
        height: 'var(--header-height)',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        flexShrink: 0,
        zIndex: 40
      }}
    >
      {/* Topic Title & Badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1
              style={{
                fontSize: '1.05rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.01em',
                maxWidth: '280px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
              title={chat.title}
            >
              {chat.title}
            </h1>
            <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>
              {chat.category}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
            <span
              style={{
                fontSize: '0.72rem',
                color: 'var(--accent-primary)',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              onClick={onOpenMethodModal}
              title="Click to customize teaching approach"
            >
              <Sliders size={12} />
              {teachingMethod?.name || 'Step-by-Step'}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {practiceMethod?.name || 'Guided Problems'}
            </span>
          </div>
        </div>
      </div>

      {/* Center Navigation Tabs */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'var(--bg-subtle)', padding: '3px', borderRadius: 'var(--radius-md)' }}>
        <button
          onClick={() => onNavigateView('lesson')}
          className="btn-ghost"
          style={{
            padding: '6px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.82rem',
            fontWeight: currentView === 'lesson' ? 600 : 500,
            backgroundColor: currentView === 'lesson' ? 'var(--bg-surface)' : 'transparent',
            color: currentView === 'lesson' ? 'var(--text-primary)' : 'var(--text-secondary)',
            boxShadow: currentView === 'lesson' ? 'var(--shadow-sm)' : 'none'
          }}
        >
          <BookOpen size={15} />
          <span>Lesson</span>
        </button>

        <button
          onClick={() => onNavigateView('assessment')}
          className="btn-ghost"
          style={{
            padding: '6px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.82rem',
            fontWeight: currentView === 'assessment' ? 600 : 500,
            backgroundColor: currentView === 'assessment' ? 'var(--bg-surface)' : 'transparent',
            color: currentView === 'assessment' ? 'var(--text-primary)' : 'var(--text-secondary)',
            boxShadow: currentView === 'assessment' ? 'var(--shadow-sm)' : 'none'
          }}
        >
          <Sparkles size={15} />
          <span>Assessments</span>
        </button>

        <button
          onClick={() => onNavigateView('dashboard')}
          className="btn-ghost"
          style={{
            padding: '6px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.82rem',
            fontWeight: currentView === 'dashboard' ? 600 : 500,
            backgroundColor: currentView === 'dashboard' ? 'var(--bg-surface)' : 'transparent',
            color: currentView === 'dashboard' ? 'var(--text-primary)' : 'var(--text-secondary)',
            boxShadow: currentView === 'dashboard' ? 'var(--shadow-sm)' : 'none'
          }}
        >
          <BarChart3 size={15} />
          <span>Analytics</span>
        </button>

        <button
          onClick={() => onNavigateView('flashcards')}
          className="btn-ghost"
          style={{
            padding: '6px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.82rem',
            fontWeight: currentView === 'flashcards' ? 600 : 500,
            backgroundColor: currentView === 'flashcards' ? 'var(--bg-surface)' : 'transparent',
            color: currentView === 'flashcards' ? 'var(--text-primary)' : 'var(--text-secondary)',
            boxShadow: currentView === 'flashcards' ? 'var(--shadow-sm)' : 'none'
          }}
        >
          <Layers size={15} />
          <span>Flashcards</span>
        </button>
      </nav>

      {/* Right Actions: Document upload indicator & Method switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={onOpenDocModal}
          className="btn-secondary"
          style={{
            fontSize: '0.8rem',
            padding: '7px 12px',
            borderColor: chat.uploadedDocs.length > 0 ? 'var(--accent-primary)' : 'var(--border-medium)',
            color: chat.uploadedDocs.length > 0 ? 'var(--accent-primary)' : 'var(--text-secondary)'
          }}
          title={chat.uploadedDocs.length > 0 ? `${chat.uploadedDocs.length} document(s) grounded` : 'Attach optional lecture notes or documents'}
        >
          <Paperclip size={14} />
          <span>{chat.uploadedDocs.length > 0 ? `${chat.uploadedDocs[0].name.slice(0, 16)}...` : 'Attach Notes'}</span>
        </button>

        <button
          onClick={onOpenMethodModal}
          className="btn-ghost"
          style={{
            fontSize: '0.8rem',
            padding: '7px 10px',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)'
          }}
          title="Change pedagogical method"
        >
          <Sliders size={14} />
          <span>Method</span>
        </button>
      </div>
    </header>
  );
};
