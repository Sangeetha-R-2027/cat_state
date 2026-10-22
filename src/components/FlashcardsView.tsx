import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  Sparkles,
  Play,
  Pause,
  Clock,
  Layers,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { Flashcard, TopicChat } from '../types';

interface FlashcardsViewProps {
  chat: TopicChat;
  onUpdateFlashcard: (cardId: string, boxLevel: number) => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  chat,
  onUpdateFlashcard
}) => {
  const cards = chat.flashcards || [];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Pomodoro Timer State (25 min default)
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');

  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (mode === 'focus') {
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        setMode('focus');
        setTimeLeft(25 * 60);
      }
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentCard = cards[currentIdx];

  const handleRate = (box: number) => {
    if (currentCard) {
      onUpdateFlashcard(currentCard.id, box);
    }
    setIsFlipped(false);
    if (currentIdx + 1 < cards.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setCurrentIdx(0);
    }
  };

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px', paddingBottom: '60px' }}>
      
      {/* Top Bar with Pomodoro Focus Timer */}
      <div
        className="card"
        style={{
          padding: '18px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          backgroundColor: 'var(--bg-surface)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
              <Clock size={12} /> Pomodoro Session
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Mode: <strong>{mode === 'focus' ? 'Focus Burst (25m)' : 'Cognitive Break (5m)'}</strong>
            </span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            {formatTime(timeLeft)}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.84rem' }}
          >
            {isRunning ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
            <span>{isRunning ? 'Pause' : 'Start Focus Session'}</span>
          </button>

          <button
            onClick={() => {
              setIsRunning(false);
              setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
            }}
            className="btn-secondary"
            style={{ padding: '8px 12px', fontSize: '0.84rem' }}
            title="Reset timer"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Main Flashcard Deck Area */}
      {cards.length === 0 ? (
        <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Layers size={36} style={{ margin: '0 auto 12px' }} />
          <h3>No flashcards generated yet for this topic.</h3>
          <p style={{ fontSize: '0.84rem', marginTop: '6px' }}>
            Flashcards are generated automatically as you study lessons and complete assessments.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
          
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Card {currentIdx + 1} of {cards.length}
            </span>
            <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
              Leitner Box {currentCard.box} (Next Review Scheduled)
            </span>
          </div>

          {/* Flip Card Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="card"
            style={{
              width: '100%',
              minHeight: '260px',
              padding: '36px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: isFlipped ? 'var(--bg-subtle)' : 'var(--bg-surface)',
              border: isFlipped ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-medium)',
              boxShadow: 'var(--shadow-md)',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
          >
            <div style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <RefreshCw size={12} />
              <span>Click to {isFlipped ? 'view Question' : 'reveal Answer'}</span>
            </div>

            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '14px' }}>
              {isFlipped ? 'Answer & Core Principle' : 'Prompt / Recall Question'}
            </div>

            <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.45, maxWidth: '620px' }}>
              {isFlipped ? currentCard.answer : currentCard.question}
            </p>
          </div>

          {/* Leitner Spaced Repetition Rating Buttons (Only shown when flipped) */}
          {isFlipped ? (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                How well did you recall this principle? (Leitner Interval Scheduling)
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', width: '100%' }}>
                <button
                  onClick={() => handleRate(1)}
                  className="btn-secondary"
                  style={{ padding: '10px', borderColor: 'var(--danger-border)', color: 'var(--danger)', fontSize: '0.82rem' }}
                >
                  <div>Again (Box 1)</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Review in 10m</div>
                </button>

                <button
                  onClick={() => handleRate(2)}
                  className="btn-secondary"
                  style={{ padding: '10px', borderColor: 'var(--warning-border)', color: 'var(--warning)', fontSize: '0.82rem' }}
                >
                  <div>Hard (Box 2)</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Review in 1d</div>
                </button>

                <button
                  onClick={() => handleRate(3)}
                  className="btn-secondary"
                  style={{ padding: '10px', borderColor: 'var(--border-medium)', color: 'var(--text-primary)', fontSize: '0.82rem' }}
                >
                  <div>Good (Box 3)</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Review in 3d</div>
                </button>

                <button
                  onClick={() => handleRate(4)}
                  className="btn-primary"
                  style={{ padding: '10px', fontSize: '0.82rem' }}
                >
                  <div>Easy (Box 4)</div>
                  <div style={{ fontSize: '0.68rem', opacity: 0.85 }}>Review in 7d</div>
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsFlipped(true)}
              className="btn-secondary"
              style={{ fontSize: '0.85rem', padding: '9px 24px' }}
            >
              Reveal Answer
            </button>
          )}

        </div>
      )}
    </div>
  );
};
