import React, { useState } from 'react';
import {
  Settings,
  X,
  Key,
  ShieldCheck,
  Cpu,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Database
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetData: () => void;
  isDemoMode: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onResetData,
  isDemoMode
}) => {
  const [provider, setProvider] = useState<'demo' | 'gemini' | 'openai'>(isDemoMode ? 'demo' : 'gemini');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '680px' }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-surface)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
              <Settings size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Application & AI Architecture Settings
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Configure AI providers, backend environment keys, and learning data.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn-ghost" style={{ padding: '6px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          {/* Provider Selection */}
          <div>
            <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', display: 'block' }}>
              Active AI Pedagogical Engine
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {/* Option 1: Demo Engine */}
              <div
                onClick={() => setProvider('demo')}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  border: provider === 'demo' ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)',
                  backgroundColor: provider === 'demo' ? 'var(--accent-subtle)' : 'var(--bg-surface)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Built-in Demo Engine
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                  100% offline, deterministic, rich academic simulation. No API keys required.
                </p>
                <span className="badge badge-warning" style={{ fontSize: '0.62rem', marginTop: '8px' }}>
                  Default & Zero Setup
                </span>
              </div>

              {/* Option 2: Google Gemini */}
              <div
                onClick={() => setProvider('gemini')}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  border: provider === 'gemini' ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)',
                  backgroundColor: provider === 'gemini' ? 'var(--accent-subtle)' : 'var(--bg-surface)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Google Gemini API
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                  Uses server-side <code style={{ fontSize: '0.7rem' }}>GEMINI_API_KEY</code> via Node Express backend.
                </p>
                <span className="badge badge-primary" style={{ fontSize: '0.62rem', marginTop: '8px' }}>
                  Gemini 1.5 Flash
                </span>
              </div>

              {/* Option 3: OpenAI */}
              <div
                onClick={() => setProvider('openai')}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  border: provider === 'openai' ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)',
                  backgroundColor: provider === 'openai' ? 'var(--accent-subtle)' : 'var(--bg-surface)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  OpenAI API
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                  Uses server-side <code style={{ fontSize: '0.7rem' }}>OPENAI_API_KEY</code> via Node Express backend.
                </p>
                <span className="badge badge-neutral" style={{ fontSize: '0.62rem', marginTop: '8px' }}>
                  GPT-4o-mini
                </span>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px'
            }}
          >
            <ShieldCheck size={18} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              <strong>API Key Security:</strong> In accordance with strict application security rules, API secrets are never stored in client browser storage or committed to code repositories. Keys are read securely by <code style={{ fontSize: '0.72rem' }}>server/index.js</code> from your local <code style={{ fontSize: '0.72rem' }}>.env</code> file.
            </div>
          </div>

          {/* Local Learning Data Reset */}
          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
              Course Persistence & Learning Records
            </div>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Your learning history, adaptation records, and flashcard states are saved locally in browser storage.
            </p>

            <button
              onClick={() => {
                if (window.confirm('Reset all topic learning histories, assessment logs, and flashcards to default state?')) {
                  onResetData();
                  onClose();
                }
              }}
              className="btn-ghost"
              style={{
                color: 'var(--danger)',
                border: '1px solid var(--danger-border)',
                backgroundColor: 'var(--danger-bg)',
                fontSize: '0.8rem',
                padding: '7px 14px'
              }}
            >
              <RotateCcw size={14} />
              <span>Reset Learning Records to Factory Seed</span>
            </button>
          </div>

          {savedSuccess && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)', fontSize: '0.82rem' }}>
              <CheckCircle2 size={16} />
              <span>Settings updated successfully!</span>
            </div>
          )}

        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '10px',
            backgroundColor: 'var(--bg-surface)'
          }}
        >
          <button onClick={onClose} className="btn-secondary" style={{ fontSize: '0.84rem' }}>
            Cancel
          </button>
          <button onClick={handleSave} className="btn-primary" style={{ fontSize: '0.84rem', padding: '8px 20px' }}>
            Save & Apply
          </button>
        </div>
      </div>
    </div>
  );
};
