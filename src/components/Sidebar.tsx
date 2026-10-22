import React from 'react';
import {
  BookOpen,
  PlusCircle,
  BarChart3,
  Layers,
  Settings,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { TopicChat } from '../types';

interface SidebarProps {
  chats: TopicChat[];
  activeChatId: string;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string, e: React.MouseEvent) => void;
  currentView: 'lesson' | 'assessment' | 'dashboard' | 'flashcards';
  onNavigateView: (view: 'lesson' | 'assessment' | 'dashboard' | 'flashcards') => void;
  onOpenSettings: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  isDemoMode: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  currentView,
  onNavigateView,
  onOpenSettings,
  isCollapsed,
  onToggleCollapse,
  theme,
  onToggleTheme,
  isDemoMode
}) => {
  return (
    <aside
      style={{
        width: isCollapsed ? '68px' : '280px',
        backgroundColor: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-light)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        height: '100vh',
        zIndex: 50,
        flexShrink: 0,
        position: 'relative'
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: isCollapsed ? '18px 12px' : '18px 20px',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              flexShrink: 0
            }}
          >
            <GraduationCap size={22} />
          </div>
          {!isCollapsed && (
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
                Antigravity Learn
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                Adaptive Academic AI
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            color: 'var(--text-muted)',
            padding: '6px',
            borderRadius: '6px',
            display: isCollapsed ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          className="btn-ghost"
        >
          <ChevronLeft size={18} />
        </button>
      </div>

      {/* New Learning Chat Button */}
      <div style={{ padding: isCollapsed ? '14px 10px' : '16px 18px' }}>
        <button
          onClick={onNewChat}
          className="btn-primary"
          style={{
            width: '100%',
            justifyContent: 'center',
            padding: isCollapsed ? '10px 0' : '10px 16px',
            fontSize: '0.88rem'
          }}
          title="New Topic Chat"
        >
          <PlusCircle size={18} />
          {!isCollapsed && <span>New Topic Chat</span>}
        </button>
      </div>

      {/* Navigation shortcuts if active chat exists */}
      {activeChatId && !isCollapsed && (
        <div style={{ padding: '0 16px 12px 16px' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', paddingLeft: '8px' }}>
            Current Topic Views
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <button
              onClick={() => onNavigateView('lesson')}
              className="btn-ghost"
              style={{
                width: '100%',
                justifyContent: 'flex-start',
                fontSize: '0.84rem',
                backgroundColor: currentView === 'lesson' ? 'var(--accent-subtle)' : 'transparent',
                color: currentView === 'lesson' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontWeight: currentView === 'lesson' ? 600 : 400
              }}
            >
              <BookOpen size={16} />
              <span>Interactive Lesson</span>
            </button>

            <button
              onClick={() => onNavigateView('assessment')}
              className="btn-ghost"
              style={{
                width: '100%',
                justifyContent: 'flex-start',
                fontSize: '0.84rem',
                backgroundColor: currentView === 'assessment' ? 'var(--accent-subtle)' : 'transparent',
                color: currentView === 'assessment' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontWeight: currentView === 'assessment' ? 600 : 400
              }}
            >
              <Sparkles size={16} />
              <span>Assessments & Practice</span>
            </button>

            <button
              onClick={() => onNavigateView('dashboard')}
              className="btn-ghost"
              style={{
                width: '100%',
                justifyContent: 'flex-start',
                fontSize: '0.84rem',
                backgroundColor: currentView === 'dashboard' ? 'var(--accent-subtle)' : 'transparent',
                color: currentView === 'dashboard' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontWeight: currentView === 'dashboard' ? 600 : 400
              }}
            >
              <BarChart3 size={16} />
              <span>Progress Analytics</span>
            </button>

            <button
              onClick={() => onNavigateView('flashcards')}
              className="btn-ghost"
              style={{
                width: '100%',
                justifyContent: 'flex-start',
                fontSize: '0.84rem',
                backgroundColor: currentView === 'flashcards' ? 'var(--accent-subtle)' : 'transparent',
                color: currentView === 'flashcards' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontWeight: currentView === 'flashcards' ? 600 : 400
              }}
            >
              <Layers size={16} />
              <span>Flashcards & Pomodoro</span>
            </button>
          </div>
        </div>
      )}

      {/* Previous Topic Chats */}
      <div style={{ flex: 1, overflowY: 'auto', padding: isCollapsed ? '6px 8px' : '6px 14px' }}>
        {!isCollapsed && (
          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '8px' }}>
            Previous Learning Topics ({chats.length})
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {chats.map(chat => {
            const isActive = chat.id === activeChatId;
            return (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                title={chat.title}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isCollapsed ? 'center' : 'space-between',
                  padding: isCollapsed ? '10px 0' : '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isActive ? 'var(--bg-subtle)' : 'transparent',
                  border: isActive ? '1px solid var(--border-medium)' : '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px', minWidth: 0 }}>
                  <BookOpen
                    size={16}
                    color={isActive ? 'var(--accent-primary)' : 'var(--text-muted)'}
                    style={{ flexShrink: 0 }}
                  />
                  {!isCollapsed && (
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <div
                        style={{
                          fontSize: '0.84rem',
                          fontWeight: isActive ? 600 : 400,
                          color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {chat.title}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', gap: '6px' }}>
                        <span>{chat.estimatedMastery}% mastery</span>
                        <span>•</span>
                        <span>{chat.uploadedDocs.length > 0 ? 'Doc attached' : 'No docs'}</span>
                      </div>
                    </div>
                  )}
                </div>

                {!isCollapsed && (
                  <button
                    onClick={(e) => onDeleteChat(chat.id, e)}
                    title="Delete topic chat"
                    style={{
                      color: 'var(--text-muted)',
                      padding: '4px',
                      borderRadius: '4px',
                      opacity: isActive ? 1 : 0.4
                    }}
                    className="btn-ghost"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer & Mode Status */}
      <div
        style={{
          padding: isCollapsed ? '12px 8px' : '14px 18px',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        {!isCollapsed && (
          <div
            style={{
              padding: '6px 10px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: isDemoMode ? 'var(--warning-bg)' : 'var(--success-bg)',
              border: `1px solid ${isDemoMode ? 'var(--warning-border)' : 'var(--success-border)'}`,
              fontSize: '0.72rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: isDemoMode ? 'var(--warning)' : 'var(--success)',
              fontWeight: 600
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: isDemoMode ? 'var(--warning)' : 'var(--success)'
              }}
            />
            <span>{isDemoMode ? 'Pedagogical Demo Engine' : 'Live AI Mode Active'}</span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between' }}>
          <button
            onClick={onToggleTheme}
            className="btn-ghost"
            style={{ padding: '6px', borderRadius: '6px' }}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {!isCollapsed && (
            <button
              onClick={onOpenSettings}
              className="btn-ghost"
              style={{ fontSize: '0.8rem', gap: '5px' }}
              title="Settings & Provider Configuration"
            >
              <Settings size={16} />
              <span>Settings</span>
            </button>
          )}

          {isCollapsed && (
            <button
              onClick={onToggleCollapse}
              className="btn-ghost"
              style={{ padding: '6px', borderRadius: '6px' }}
              title="Expand sidebar"
            >
              <ChevronRight size={17} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
