import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  HelpCircle,
  Copy,
  Check,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Sliders,
  Layers,
  Lightbulb,
  FileText,
  RotateCcw,
  Zap
} from 'lucide-react';
import { ConceptLesson, DocumentItem, TopicChat } from '../types';
import { getMethodById } from '../data/techniques';
import { DoubtChat } from './DoubtChat';

interface LessonWorkspaceProps {
  lesson: ConceptLesson;
  chat: TopicChat;
  onStartAssessment: () => void;
  onChangeMethod: (approachId: string) => void;
  onMakeEasier: () => void;
  onHarderExample: () => void;
  onSummarize: () => void;
  onRevise: () => void;
  attachedDoc?: DocumentItem;
}

export const LessonWorkspace: React.FC<LessonWorkspaceProps> = ({
  lesson,
  chat,
  onStartAssessment,
  onChangeMethod,
  onMakeEasier,
  onHarderExample,
  onSummarize,
  onRevise,
  attachedDoc
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isDoubtOpen, setIsDoubtOpen] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(2); // 1: Intro, 2: Explanation, 3: Examples, 4: Clarification, 5: Assessment

  const teachingMethod = getMethodById(chat.selectedMethods.teaching);

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px', paddingBottom: '80px' }}>
      
      {/* Lesson Header Card */}
      <div
        className="card"
        style={{
          padding: '24px 28px',
          borderLeft: '4px solid var(--accent-primary)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-primary" style={{ fontSize: '0.74rem' }}>
              <BookOpen size={12} /> Unit {chat.currentConceptIndex + 1}
            </span>
            <span className="badge badge-neutral" style={{ fontSize: '0.74rem' }}>
              Method: {teachingMethod?.name || lesson.teachingApproach}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Mastery: <strong>{chat.estimatedMastery}%</strong>
            </span>
          </div>
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
          {lesson.title}
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {lesson.subtitle}
        </p>

        {/* Structured Lesson Flow Progress bar */}
        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '14px', marginTop: '4px' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Lesson Pedagogical Stages:
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {[
              { step: 1, label: '1. Introduce' },
              { step: 2, label: '2. Explain with Method' },
              { step: 3, label: '3. Worked Examples' },
              { step: 4, label: '4. Clarification' },
              { step: 5, label: '5. Assessment & Check' }
            ].map(s => (
              <button
                key={s.step}
                onClick={() => {
                  setActiveStep(s.step);
                  if (s.step === 5) onStartAssessment();
                }}
                className="btn-ghost"
                style={{
                  fontSize: '0.74rem',
                  padding: '5px 10px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: activeStep === s.step ? 'var(--accent-primary)' : 'var(--bg-subtle)',
                  color: activeStep === s.step ? '#fff' : 'var(--text-secondary)',
                  fontWeight: activeStep === s.step ? 600 : 500,
                  whiteSpace: 'nowrap'
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grounding Context pill if attached */}
      {attachedDoc && (
        <div
          style={{
            padding: '10px 16px',
            backgroundColor: 'var(--success-bg)',
            border: '1px solid var(--success-border)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            color: 'var(--success)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={16} />
            <span>This lesson is grounded in your uploaded material: <strong>{attachedDoc.name}</strong></span>
          </div>
          <span style={{ fontSize: '0.72rem', fontWeight: 600 }}>Active Grounding</span>
        </div>
      )}

      {/* 1. Introduction Hook */}
      <div className="card" style={{ padding: '22px 26px', lineHeight: 1.6 }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={14} />
          <span>Stage 1: Conceptual Foundation</span>
        </div>
        <p style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 500 }}>
          {lesson.introduction}
        </p>
      </div>

      {/* 2. Visual / Diagram Representation (if available) */}
      {lesson.visualDiagram && (
        <div
          className="card"
          style={{
            padding: '20px 24px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-medium)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {lesson.visualDiagram.title}
            </div>
            <span className="badge badge-primary" style={{ fontSize: '0.68rem' }}>
              Visual Layout
            </span>
          </div>

          <pre
            style={{
              padding: '18px 20px',
              backgroundColor: '#0d1117',
              color: '#7ee787',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              lineHeight: 1.45,
              overflowX: 'auto',
              border: '1px solid #30363d'
            }}
          >
            {lesson.visualDiagram.diagram}
          </pre>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            {lesson.visualDiagram.caption}
          </div>
        </div>
      )}

      {/* 3. Core Explanation Body */}
      <div
        className="card"
        style={{
          padding: '24px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          lineHeight: 1.65
        }}
      >
        <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <BookOpen size={14} />
          <span>Stage 2: Core Explanation ({lesson.teachingApproach})</span>
        </div>

        <div
          style={{
            fontSize: '0.94rem',
            color: 'var(--text-primary)',
            whiteSpace: 'pre-line',
            lineHeight: 1.7
          }}
        >
          {lesson.explanation}
        </div>

        {/* Key Takeaways */}
        {lesson.keyTakeaways && lesson.keyTakeaways.length > 0 && (
          <div
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 20px',
              border: '1px solid var(--border-light)',
              marginTop: '10px'
            }}
          >
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>
              Key Conceptual Takeaways:
            </div>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {lesson.keyTakeaways.map((point, idx) => (
                <li key={idx} style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 4. Concrete Examples & Code Walkthroughs */}
      {lesson.examples && lesson.examples.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Stage 3: Worked Problem Walkthroughs
          </div>

          {lesson.examples.map((ex, idx) => (
            <div key={idx} className="card" style={{ padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {ex.title}
              </div>

              <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                <strong>Execution sequence:</strong> {ex.walkthrough}
              </div>

              {ex.codeSnippet && (
                <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <div
                    style={{
                      padding: '8px 14px',
                      backgroundColor: '#161b22',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid #30363d',
                      fontSize: '0.74rem',
                      color: '#8b949e',
                      fontFamily: 'var(--font-sans)'
                    }}
                  >
                    <span>C Source Implementation</span>
                    <button
                      onClick={() => handleCopyCode(ex.codeSnippet!, idx)}
                      className="btn-ghost"
                      style={{ color: '#8b949e', padding: '2px 6px', fontSize: '0.72rem' }}
                    >
                      {copiedIndex === idx ? <Check size={12} color="#27c93f" /> : <Copy size={12} />}
                      <span style={{ marginLeft: '4px' }}>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre
                    style={{
                      padding: '16px',
                      backgroundColor: '#0d1117',
                      color: '#c9d1d9',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.84rem',
                      lineHeight: 1.55,
                      overflowX: 'auto',
                      margin: 0
                    }}
                  >
                    {ex.codeSnippet}
                  </pre>
                </div>
              )}

              <div
                style={{
                  padding: '10px 14px',
                  backgroundColor: 'var(--accent-subtle)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary)'
                }}
              >
                <strong>Why this works:</strong> {ex.explanation}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. Socratic Self-Reflection Prompt */}
      {lesson.socraticQuestion && (
        <div
          className="card"
          style={{
            padding: '18px 22px',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px dashed var(--border-medium)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}
        >
          <Lightbulb size={20} color="var(--warning)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--warning)', marginBottom: '3px' }}>
              Metacognitive Reflection Check:
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontStyle: 'italic' }}>
              "{lesson.socraticQuestion}"
            </p>
          </div>
        </div>
      )}

      {/* Interactive Quick Action Bar */}
      <div
        className="card"
        style={{
          padding: '18px 22px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          border: '1.5px solid var(--border-medium)',
          backgroundColor: 'var(--bg-surface)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Lesson Control & Pedagogical Actions
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Adjust difficulty, request alternative mental models, or proceed to assessment.
            </div>
          </div>

          <button
            onClick={onStartAssessment}
            className="btn-primary"
            style={{ padding: '9px 20px', fontSize: '0.88rem', fontWeight: 600 }}
          >
            <span>Check My Understanding</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* 6 Required Specific Quick Actions */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
          <button
            onClick={() => onChangeMethod(chat.selectedMethods.teaching === 'visual-diagram' ? 'analogy-based' : 'visual-diagram')}
            className="btn-secondary"
            style={{ fontSize: '0.78rem', padding: '6px 12px' }}
          >
            <Sliders size={13} />
            <span>Explain Differently</span>
          </button>

          <button
            onClick={onMakeEasier}
            className="btn-secondary"
            style={{ fontSize: '0.78rem', padding: '6px 12px' }}
          >
            <Sparkles size={13} />
            <span>Make This Easier (ELI5)</span>
          </button>

          <button
            onClick={onHarderExample}
            className="btn-secondary"
            style={{ fontSize: '0.78rem', padding: '6px 12px' }}
          >
            <Zap size={13} />
            <span>Give Me a Harder Example</span>
          </button>

          <button
            onClick={onSummarize}
            className="btn-secondary"
            style={{ fontSize: '0.78rem', padding: '6px 12px' }}
          >
            <FileText size={13} />
            <span>Summarize This Concept</span>
          </button>

          <button
            onClick={onRevise}
            className="btn-secondary"
            style={{ fontSize: '0.78rem', padding: '6px 12px' }}
          >
            <RotateCcw size={13} />
            <span>Revise This Concept</span>
          </button>

          <button
            onClick={() => setIsDoubtOpen(true)}
            className="btn-ghost"
            style={{ fontSize: '0.78rem', padding: '6px 12px', border: '1px solid var(--border-light)', marginLeft: 'auto' }}
          >
            <HelpCircle size={13} />
            <span>Ask a Doubt</span>
          </button>
        </div>
      </div>

      {/* Conversational Doubt-Clearing Drawer */}
      <DoubtChat
        topicTitle={chat.title}
        currentStep={lesson.title}
        attachedDoc={attachedDoc}
        isOpen={isDoubtOpen}
        onToggle={() => setIsDoubtOpen(!isDoubtOpen)}
      />
    </div>
  );
};
