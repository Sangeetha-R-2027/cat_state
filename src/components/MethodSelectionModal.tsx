import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Check,
  Info,
  BookOpen,
  Code2,
  Calendar,
  Layers,
  ArrowRight,
  X,
  BrainCircuit,
  HelpCircle
} from 'lucide-react';
import {
  TEACHING_APPROACHES,
  PRACTICE_APPROACHES,
  STUDY_SCHEDULES
} from '../data/techniques';
import { MethodOption, TopicChat } from '../types';
import { recommendLearningMethod } from '../services/aiService';

interface MethodSelectionModalProps {
  topicTitle: string;
  existingChat?: TopicChat;
  initialTeachingMethod?: string;
  initialPracticeMethod?: string;
  initialScheduleMethod?: string;
  onApply: (methods: { teaching: string; practice: string; schedule: string }) => void;
  onClose?: () => void;
  isOpen: boolean;
}

export const MethodSelectionModal: React.FC<MethodSelectionModalProps> = ({
  topicTitle,
  existingChat,
  initialTeachingMethod = 'step-by-step',
  initialPracticeMethod = 'guided-problem-solving',
  initialScheduleMethod = 'pomodoro',
  onApply,
  onClose,
  isOpen
}) => {
  const [selectedTeaching, setSelectedTeaching] = useState(initialTeachingMethod);
  const [selectedPractice, setSelectedPractice] = useState(initialPracticeMethod);
  const [selectedSchedule, setSelectedSchedule] = useState(initialScheduleMethod);
  const [selectionMode, setSelectionMode] = useState<'choose' | 'recommend' | 'default'>('recommend');
  const [recommendation, setRecommendation] = useState<{
    recommendedApproachId: string;
    recommendedCategory: 'teaching' | 'practice';
    rationale: string;
    evidence: string;
  } | null>(null);

  useEffect(() => {
    // Generate evidence-based recommendation using AI engine
    const rec = recommendLearningMethod(
      topicTitle,
      existingChat ? existingChat.assessmentHistory : [],
      existingChat ? existingChat.adaptationEvents : []
    );
    setRecommendation(rec);

    if (selectionMode === 'recommend') {
      if (rec.recommendedCategory === 'teaching') {
        setSelectedTeaching(rec.recommendedApproachId);
      } else {
        setSelectedPractice(rec.recommendedApproachId);
      }
    }
  }, [topicTitle, existingChat, selectionMode]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply({
      teaching: selectedTeaching,
      practice: selectedPractice,
      schedule: selectedSchedule
    });
  };

  const handleModeChange = (mode: 'choose' | 'recommend' | 'default') => {
    setSelectionMode(mode);
    if (mode === 'default') {
      setSelectedTeaching('step-by-step');
      setSelectedPractice('guided-problem-solving');
      setSelectedSchedule('pomodoro');
    } else if (mode === 'recommend' && recommendation) {
      if (recommendation.recommendedCategory === 'teaching') {
        setSelectedTeaching(recommendation.recommendedApproachId);
      } else {
        setSelectedPractice(recommendation.recommendedApproachId);
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '940px', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Modal Header */}
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
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--accent-subtle)',
                  color: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <BrainCircuit size={18} />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Personalize Your Learning Strategy
              </h2>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Topic: <strong>{topicTitle}</strong>. Combine an explanation approach, practice format, and study schedule.
            </p>
          </div>

          {onClose && (
            <button onClick={onClose} className="btn-ghost" style={{ padding: '6px' }}>
              <X size={20} />
            </button>
          )}
        </div>

        {/* 3 Strategy Choices Bar */}
        <div
          style={{
            padding: '16px 24px',
            backgroundColor: 'var(--bg-subtle)',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Choose Starting Path:
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {/* Option 1: AI Recommendation */}
            <div
              onClick={() => handleModeChange('recommend')}
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: selectionMode === 'recommend' ? 'var(--bg-surface)' : 'transparent',
                border: selectionMode === 'recommend' ? '2px solid var(--accent-primary)' : '1px solid var(--border-medium)',
                cursor: 'pointer',
                boxShadow: selectionMode === 'recommend' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <Sparkles size={16} color="var(--accent-primary)" />
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Recommend for Me
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                AI selects the highest-yield method based on your past assessments or topic diagnostics.
              </p>
            </div>

            {/* Option 2: Let me choose */}
            <div
              onClick={() => handleModeChange('choose')}
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: selectionMode === 'choose' ? 'var(--bg-surface)' : 'transparent',
                border: selectionMode === 'choose' ? '2px solid var(--accent-primary)' : '1px solid var(--border-medium)',
                cursor: 'pointer',
                boxShadow: selectionMode === 'choose' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <Layers size={16} color="var(--text-secondary)" />
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Let Me Choose
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                Manually select your preferred teaching, practice, and schedule combination below.
              </p>
            </div>

            {/* Option 3: Default */}
            <div
              onClick={() => handleModeChange('default')}
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: selectionMode === 'default' ? 'var(--bg-surface)' : 'transparent',
                border: selectionMode === 'default' ? '2px solid var(--accent-primary)' : '1px solid var(--border-medium)',
                cursor: 'pointer',
                boxShadow: selectionMode === 'default' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <BookOpen size={16} color="var(--text-secondary)" />
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Default Foundation
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                Start immediately with standard Step-by-Step explanation and Guided Problem-Solving.
              </p>
            </div>
          </div>

          {/* AI Recommendation Evidence Banner */}
          {recommendation && (
            <div
              style={{
                backgroundColor: 'var(--accent-subtle)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}
            >
              <Sparkles size={18} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '2px' }}>
                  AI Pedagogical Diagnosis: {recommendation.rationale}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                  <strong>Evidence:</strong> {recommendation.evidence}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Method Selection Cards */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* CATEGORY A: TEACHING APPROACHES */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    A. Teaching Approaches
                  </h3>
                  <span className="badge badge-primary" style={{ fontSize: '0.68rem' }}>How Concepts Are Explained</span>
                </div>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  Controls the pedagogical structure, mental models, and abstraction level of lessons.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '12px' }}>
              {TEACHING_APPROACHES.map((method) => {
                const isSelected = selectedTeaching === method.id;
                const isRec = recommendation?.recommendedApproachId === method.id;
                return (
                  <div
                    key={method.id}
                    onClick={() => {
                      setSelectedTeaching(method.id);
                      setSelectionMode('choose');
                    }}
                    style={{
                      border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)',
                      backgroundColor: isSelected ? 'var(--accent-subtle)' : 'var(--bg-surface)',
                      borderRadius: 'var(--radius-md)',
                      padding: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease',
                      position: 'relative'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.88rem', fontWeight: 700, color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                          {method.name}
                        </span>
                        {isSelected && (
                          <div
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--accent-primary)',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Check size={12} />
                          </div>
                        )}
                      </div>

                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '10px' }}>
                        {method.description}
                      </p>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '8px', borderTop: '1px solid var(--border-light)', paddingTop: '6px' }}>
                        <strong>How it helps:</strong> {method.howItHelps}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>
                          {method.badge}
                        </span>
                        {isRec && (
                          <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>
                            <Sparkles size={10} /> AI Recommendation
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CATEGORY B: PRACTICE APPROACHES */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    B. Practice Approaches
                  </h3>
                  <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>How You Demonstrate Understanding</span>
                </div>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  Controls how assessments, challenges, code exercises, and recall quizzes are administered.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '12px' }}>
              {PRACTICE_APPROACHES.map((method) => {
                const isSelected = selectedPractice === method.id;
                const isRec = recommendation?.recommendedApproachId === method.id;
                return (
                  <div
                    key={method.id}
                    onClick={() => {
                      setSelectedPractice(method.id);
                      setSelectionMode('choose');
                    }}
                    style={{
                      border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)',
                      backgroundColor: isSelected ? 'var(--accent-subtle)' : 'var(--bg-surface)',
                      borderRadius: 'var(--radius-md)',
                      padding: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.88rem', fontWeight: 700, color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                          {method.name}
                        </span>
                        {isSelected && (
                          <div
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--accent-primary)',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Check size={12} />
                          </div>
                        )}
                      </div>

                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '10px' }}>
                        {method.description}
                      </p>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '8px', borderTop: '1px solid var(--border-light)', paddingTop: '6px' }}>
                        <strong>How it helps:</strong> {method.howItHelps}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>
                          {method.badge}
                        </span>
                        {isRec && (
                          <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>
                            <Sparkles size={10} /> AI Recommendation
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CATEGORY C: STUDY & REVISION SCHEDULES */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    C. Study & Revision Schedules
                  </h3>
                  <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>When Learning & Revision Occurs</span>
                </div>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  Controls focus timers, Leitner flashcard review cycles, and milestone check-ins.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '12px' }}>
              {STUDY_SCHEDULES.map((method) => {
                const isSelected = selectedSchedule === method.id;
                return (
                  <div
                    key={method.id}
                    onClick={() => setSelectedSchedule(method.id)}
                    style={{
                      border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)',
                      backgroundColor: isSelected ? 'var(--accent-subtle)' : 'var(--bg-surface)',
                      borderRadius: 'var(--radius-md)',
                      padding: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.88rem', fontWeight: 700, color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                          {method.name}
                        </span>
                        {isSelected && (
                          <div
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--accent-primary)',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Check size={12} />
                          </div>
                        )}
                      </div>

                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '10px' }}>
                        {method.description}
                      </p>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '8px', borderTop: '1px solid var(--border-light)', paddingTop: '6px' }}>
                        <strong>How it helps:</strong> {method.howItHelps}
                      </div>

                      <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>
                        {method.badge}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-surface)'
          }}
        >
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Selected: <strong>{TEACHING_APPROACHES.find(m => m.id === selectedTeaching)?.name}</strong> + <strong>{PRACTICE_APPROACHES.find(m => m.id === selectedPractice)?.name}</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {onClose && (
              <button onClick={onClose} className="btn-secondary" style={{ fontSize: '0.88rem' }}>
                Cancel
              </button>
            )}
            <button onClick={handleApply} className="btn-primary" style={{ fontSize: '0.88rem', padding: '9px 20px' }}>
              <span>Apply & Start Learning</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
