import React, { useState } from 'react';
import { Play, RotateCcw, CheckCircle2, AlertCircle, Terminal, Copy, Check } from 'lucide-react';

interface CodeExerciseProps {
  starterCode?: string;
  expectedOutput?: string;
  targetBugDescription?: string;
  onSubmitCode: (code: string) => void;
  isEvaluating?: boolean;
}

export const CodeExercise: React.FC<CodeExerciseProps> = ({
  starterCode = '// Write or debug your code here\n',
  expectedOutput,
  targetBugDescription,
  onSubmitCode,
  isEvaluating = false
}) => {
  const [code, setCode] = useState(starterCode);
  const [copied, setCopied] = useState(false);

  const handleReset = () => {
    setCode(starterCode);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-medium)',
        overflow: 'hidden',
        backgroundColor: '#0d1117',
        color: '#c9d1d9',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.85rem',
        boxShadow: 'var(--shadow-md)',
        marginTop: '12px'
      }}
    >
      {/* Editor Top Bar */}
      <div
        style={{
          padding: '10px 16px',
          backgroundColor: '#161b22',
          borderBottom: '1px solid #30363d',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ff5f56' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#27c93f' }} />
          </div>
          <span style={{ fontSize: '0.75rem', color: '#8b949e', marginLeft: '6px', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>
            C / C++ Code Debugging Environment
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handleCopy}
            className="btn-ghost"
            style={{ color: '#8b949e', padding: '4px 8px', fontSize: '0.72rem', height: 'auto' }}
            title="Copy code"
          >
            {copied ? <Check size={13} color="#27c93f" /> : <Copy size={13} />}
            <span style={{ marginLeft: '4px' }}>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleReset}
            className="btn-ghost"
            style={{ color: '#8b949e', padding: '4px 8px', fontSize: '0.72rem', height: 'auto' }}
            title="Reset to starter buggy snippet"
          >
            <RotateCcw size={13} />
            <span style={{ marginLeft: '4px' }}>Reset</span>
          </button>
        </div>
      </div>

      {/* Target Bug Clue */}
      {targetBugDescription && (
        <div
          style={{
            padding: '8px 16px',
            backgroundColor: 'rgba(234, 179, 8, 0.1)',
            borderBottom: '1px solid rgba(234, 179, 8, 0.25)',
            color: '#e3b341',
            fontSize: '0.76rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'var(--font-sans)'
          }}
        >
          <AlertCircle size={14} style={{ flexShrink: 0 }} />
          <span><strong>Objective:</strong> {targetBugDescription}</span>
        </div>
      )}

      {/* Textarea Editor */}
      <div style={{ position: 'relative' }}>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          rows={11}
          style={{
            width: '100%',
            backgroundColor: '#0d1117',
            color: '#58a6ff',
            border: 'none',
            outline: 'none',
            padding: '16px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.86rem',
            lineHeight: 1.6,
            resize: 'vertical',
            tabSize: 4
          }}
        />
      </div>

      {/* Run / Verify Bar */}
      <div
        style={{
          padding: '10px 16px',
          backgroundColor: '#161b22',
          borderTop: '1px solid #30363d',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: 'var(--font-sans)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: '#8b949e' }}>
          <Terminal size={14} />
          <span>Static verification & memory boundary analyzer active</span>
        </div>

        <button
          onClick={() => onSubmitCode(code)}
          disabled={isEvaluating}
          className="btn-primary"
          style={{
            padding: '6px 16px',
            fontSize: '0.82rem',
            backgroundColor: '#238636',
            borderColor: '#2ea043'
          }}
        >
          <Play size={13} fill="currentColor" />
          <span>{isEvaluating ? 'Checking Logic...' : 'Run & Verify Fix'}</span>
        </button>
      </div>
    </div>
  );
};
