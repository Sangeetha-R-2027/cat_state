import React from 'react';
import {
  Sparkles,
  ArrowRight,
  RefreshCw,
  Check,
  X,
  Sliders,
  AlertTriangle,
  Lightbulb,
  TrendingUp
} from 'lucide-react';
import { AdaptationEvent } from '../types';
import { getMethodById } from '../data/techniques';

interface AdaptiveFeedbackBannerProps {
  adaptation: AdaptationEvent;
  onAccept: () => void;
  onReject: () => void;
  onOverride: () => void;
  isPostReteachingView?: boolean;
}

export const AdaptiveFeedbackBanner: React.FC<AdaptiveFeedbackBannerProps> = ({
  adaptation,
  onAccept,
  onReject,
  onOverride,
  isPostReteachingView = false
}) => {
  const suggestedMethod = getMethodById(adaptation.suggestedMethod);
  const previousMethod = getMethodById(adaptation.previousMethod);

  if (isPostReteachingView && adaptation.postAdaptationScore !== undefined) {
    const improvement = (adaptation.postAdaptationScore || 0) - adaptation.preAdaptationScore;
    const isImproved = improvement > 0;

    return (
      <div
        className="card"
        style={{
          border: `1.5px solid ${isImproved ? 'var(--success-border)' : 'var(--warning-border)'}`,
          backgroundColor: isImproved ? 'var(--success-bg)' : 'var(--warning-bg)',
          padding: '18px 22px',
          marginBottom: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: isImproved ? 'var(--success)' : 'var(--warning)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <TrendingUp size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Adaptive Learning Verification: {isImproved ? 'Understanding Improved!' : 'Further Reinforcement Scheduled'}
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Measured learning delta after switching to <strong>{suggestedMethod?.name}</strong>:
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: isImproved ? 'var(--success)' : 'var(--warning)'
              }}
            >
              {isImproved ? `+${Math.round(improvement)}%` : `${Math.round(improvement)}%`}
            </span>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              ({Math.round(adaptation.preAdaptationScore)}% ➔ {Math.round(adaptation.postAdaptationScore)}%)
            </div>
          </div>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
          {isImproved
            ? `The evidence demonstrates that the ${suggestedMethod?.name} approach successfully addressed the prerequisite gap (${adaptation.diagnosedGap}). This outcome will strengthen future recommendations for this topic.`
            : `The score remains steady. The system has recorded this data point and scheduled spaced retrieval practice.`}
        </p>
      </div>
    );
  }

  return (
    <div
      className="card"
      style={{
        border: '1.5px solid var(--accent-primary)',
        backgroundColor: 'var(--accent-subtle)',
        padding: '20px 24px',
        marginBottom: '24px',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        animation: 'fadeIn 0.25s ease'
      }}
    >
      {/* Title & Diagnostic Gap Alert */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: 'var(--accent-primary)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Lightbulb size={20} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                <Sparkles size={11} /> Transparent Pedagogy Adaptation
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Baseline Score: {Math.round(adaptation.preAdaptationScore)}%
              </span>
            </div>

            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {adaptation.triggeredReason}
            </h3>
          </div>
        </div>

        <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
          Gap: {adaptation.diagnosedGap}
        </span>
      </div>

      {/* Rationale explanation */}
      <div
        style={{
          padding: '12px 16px',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)',
          fontSize: '0.85rem',
          color: 'var(--text-primary)',
          lineHeight: 1.5
        }}
      >
        <p>
          "I noticed that the pointer-based examples were difficult under the <strong>{previousMethod?.name}</strong> approach. Let's try a <strong>{suggestedMethod?.name}</strong> of how nodes connect in memory, followed by a simpler verification exercise."
        </p>
      </div>

      {/* Student Agency Controls (Accept / Reject / Override) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          You remain in full control: choose to adopt this adaptation or keep your current method.
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onReject}
            className="btn-ghost"
            style={{ fontSize: '0.8rem', padding: '7px 12px', border: '1px solid var(--border-light)' }}
            title="Keep current teaching method without adapting"
          >
            <X size={14} />
            <span>Keep Current</span>
          </button>

          <button
            onClick={onOverride}
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '7px 12px' }}
            title="Choose a different method manually"
          >
            <Sliders size={14} />
            <span>Manual Override</span>
          </button>

          <button
            onClick={onAccept}
            className="btn-primary"
            style={{ fontSize: '0.82rem', padding: '7px 16px' }}
            title="Accept suggested visual approach and start reteaching"
          >
            <Check size={14} />
            <span>Accept: Switch to {suggestedMethod?.name}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
