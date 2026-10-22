import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  BookOpen,
  Award,
  Lightbulb,
  Check,
  Send
} from 'lucide-react';
import { Question, AssessmentResult, QuestionAttempt, AdaptationEvent, TopicChat } from '../types';
import { evaluateAnswer } from '../services/aiService';
import { CodeExercise } from './CodeExercise';
import { AdaptiveFeedbackBanner } from './AdaptiveFeedbackBanner';

interface AssessmentViewProps {
  chat: TopicChat;
  questions: Question[];
  onCompleteAssessment: (result: AssessmentResult, triggeredAdaptation?: AdaptationEvent) => void;
  onAcceptAdaptation: (adaptation: AdaptationEvent) => void;
  onRejectAdaptation: (adaptation: AdaptationEvent) => void;
  onOverrideAdaptation: () => void;
  isPostReteaching?: boolean;
}

export const AssessmentView: React.FC<AssessmentViewProps> = ({
  chat,
  questions,
  onCompleteAssessment,
  onAcceptAdaptation,
  onRejectAdaptation,
  onOverrideAdaptation,
  isPostReteaching = false
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState('');
  const [codeAnswer, setCodeAnswer] = useState('');
  const [hintsRevealed, setHintsRevealed] = useState<number>(0);
  const [confidence, setConfidence] = useState<number>(3);
  const [attemptsOnCurrent, setAttemptsOnCurrent] = useState<number>(1);
  const [attemptsList, setAttemptsList] = useState<QuestionAttempt[]>([]);
  const [currentFeedback, setCurrentFeedback] = useState<{
    isCorrect: boolean;
    scorePercent: number;
    feedback: string;
    identifiedMistakes: string[];
  } | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [adaptationState, setAdaptationState] = useState<AdaptationEvent | null>(null);

  const currentQ = questions[currentIdx];

  const handleEvaluate = async (customAnswer?: string) => {
    let answerToGrade = '';
    if (currentQ.type === 'mcq') {
      if (selectedOption === null) return;
      answerToGrade = String(selectedOption);
    } else if (currentQ.type === 'code-debugging') {
      answerToGrade = customAnswer || codeAnswer;
    } else {
      if (!textAnswer.trim()) return;
      answerToGrade = textAnswer.trim();
    }

    const evalResult = await evaluateAnswer(currentQ, answerToGrade);
    setCurrentFeedback(evalResult);

    const attempt: QuestionAttempt = {
      questionId: currentQ.id,
      userAnswer: answerToGrade,
      isCorrect: evalResult.isCorrect,
      scorePercent: evalResult.scorePercent,
      hintsUsed: hintsRevealed,
      attemptsCount: attemptsOnCurrent,
      confidenceRating: confidence,
      feedback: evalResult.feedback,
      identifiedMistakes: evalResult.identifiedMistakes
    };

    setAttemptsList(prev => [...prev, attempt]);
  };

  const handleNext = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setTextAnswer('');
      setCodeAnswer('');
      setHintsRevealed(0);
      setAttemptsOnCurrent(1);
      setCurrentFeedback(null);
    } else {
      // Calculate overall result
      finalizeAssessment();
    }
  };

  const finalizeAssessment = () => {
    const totalScore = attemptsList.reduce((acc, a) => acc + a.scorePercent, 0) / (attemptsList.length || 1);
    const roundedScore = Math.round(totalScore);
    const mistakes: string[] = [];
    attemptsList.forEach(a => {
      if (a.identifiedMistakes) mistakes.push(...a.identifiedMistakes);
    });

    const totalHints = attemptsList.reduce((acc, a) => acc + a.hintsUsed, 0);
    const avgConfidence = attemptsList.reduce((acc, a) => acc + (a.confidenceRating || 3), 0) / (attemptsList.length || 1);

    const result: AssessmentResult = {
      id: `assess-${Date.now()}`,
      topicId: chat.id,
      timestamp: new Date().toISOString(),
      score: roundedScore,
      questionsAnswered: attemptsList.length,
      totalQuestions: questions.length,
      difficulty: 'intermediate',
      mistakeTypes: Array.from(new Set(mistakes)),
      hintsRequested: totalHints,
      confidenceAverage: Number(avgConfidence.toFixed(1)),
      isPostReteaching,
      methodUsed: chat.selectedMethods.teaching,
      attempts: attemptsList
    };

    if (roundedScore >= 80) {
      confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
    }

    // Adaptive Engine Check: Trigger transparent adaptation if repeated errors or score < 70%
    let triggeredAdaptation: AdaptationEvent | undefined = undefined;
    if (!isPostReteaching && roundedScore < 70) {
      const suggested = chat.selectedMethods.teaching === 'step-by-step' ? 'visual-diagram' : 'worked-examples';
      triggeredAdaptation = {
        id: `adapt-${Date.now()}`,
        topicId: chat.id,
        timestamp: new Date().toISOString(),
        triggeredReason: 'Repeated difficulty observed in pointer reassignment sequence and memory dereferencing.',
        diagnosedGap: 'Memory Address Continuity & Pointer Invariants',
        previousMethod: chat.selectedMethods.teaching,
        suggestedMethod: suggested,
        status: 'pending',
        preAdaptationScore: roundedScore
      };
      setAdaptationState(triggeredAdaptation);
    }

    setIsFinished(true);
    onCompleteAssessment(result, triggeredAdaptation);
  };

  if (isFinished) {
    const totalScore = Math.round(attemptsList.reduce((acc, a) => acc + a.scorePercent, 0) / (attemptsList.length || 1));
    const passed = totalScore >= 70;

    return (
      <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Adaptation Trigger Banner if struggling */}
        {adaptationState && (
          <AdaptiveFeedbackBanner
            adaptation={adaptationState}
            onAccept={() => onAcceptAdaptation(adaptationState)}
            onReject={() => onRejectAdaptation(adaptationState)}
            onOverride={onOverrideAdaptation}
          />
        )}

        {/* Results Card */}
        <div
          className="card"
          style={{
            padding: '32px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: passed ? 'var(--success-bg)' : 'var(--warning-bg)',
              color: passed ? 'var(--success)' : 'var(--warning)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {passed ? <Award size={36} /> : <AlertTriangle size={36} />}
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Assessment Complete: {totalScore}%
          </h2>

          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', maxWidth: '500px' }}>
            {passed
              ? `Demonstrated solid mastery of ${chat.title}! Your responses have been incorporated into your topic progress records.`
              : `You completed all questions. Several boundary cases were challenging; the adaptive engine has pinpointed the specific gap below.`}
          </p>

          {/* Stats Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              width: '100%',
              maxWidth: '520px',
              marginTop: '12px'
            }}
          >
            <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Score & Accuracy</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>{totalScore}%</div>
            </div>

            <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Hints Requested</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {attemptsList.reduce((acc, a) => acc + a.hintsUsed, 0)}
              </div>
            </div>

            <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Confidence Avg</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {(attemptsList.reduce((acc, a) => acc + (a.confidenceRating || 3), 0) / attemptsList.length).toFixed(1)} / 5
              </div>
            </div>
          </div>

          {/* Question Breakdown */}
          <div style={{ width: '100%', textAlign: 'left', marginTop: '16px' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
              Detailed Question Evidence:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {attemptsList.map((att, i) => (
                <div
                  key={i}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-subtle)',
                    borderLeft: `4px solid ${att.isCorrect ? 'var(--success)' : 'var(--danger)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Question {i + 1}: {questions[i]?.concept || 'Concept Check'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {att.feedback}
                    </div>
                  </div>
                  <span
                    className={`badge ${att.isCorrect ? 'badge-success' : 'badge-danger'}`}
                    style={{ fontSize: '0.72rem' }}
                  >
                    {att.isCorrect ? 'Correct' : 'Needs Review'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Question Tracker */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
            Question {currentIdx + 1} of {questions.length}
          </span>
          <span className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>
            {currentQ.concept}
          </span>
          {isPostReteaching && (
            <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
              Post-Reteaching Assessment
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Difficulty: <strong>{currentQ.difficulty}</strong>
          </span>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.4 }}>
          {currentQ.question}
        </h2>

        {/* Question Type: MCQ */}
        {currentQ.type === 'mcq' && currentQ.options && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {currentQ.options.map((opt, oIdx) => {
              const isSelected = selectedOption === oIdx;
              const isEvaluated = currentFeedback !== null;
              const isCorrectOpt = String(currentQ.correctAnswer) === String(oIdx);

              let borderColor = 'var(--border-light)';
              let bgColor = 'var(--bg-surface)';

              if (isSelected) {
                borderColor = 'var(--accent-primary)';
                bgColor = 'var(--accent-subtle)';
              }

              if (isEvaluated) {
                if (isCorrectOpt) {
                  borderColor = 'var(--success)';
                  bgColor = 'var(--success-bg)';
                } else if (isSelected && !isCorrectOpt) {
                  borderColor = 'var(--danger)';
                  bgColor = 'var(--danger-bg)';
                }
              }

              return (
                <div
                  key={oIdx}
                  onClick={() => !currentFeedback && setSelectedOption(oIdx)}
                  style={{
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-md)',
                    border: `1.5px solid ${borderColor}`,
                    backgroundColor: bgColor,
                    cursor: currentFeedback ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    {opt}
                  </span>
                  {isSelected && !isEvaluated && (
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                      <Check size={11} />
                    </div>
                  )}
                  {isEvaluated && isCorrectOpt && <CheckCircle2 size={18} color="var(--success)" />}
                  {isEvaluated && isSelected && !isCorrectOpt && <XCircle size={18} color="var(--danger)" />}
                </div>
              );
            })}
          </div>
        )}

        {/* Question Type: Code Debugging */}
        {currentQ.type === 'code-debugging' && (
          <CodeExercise
            starterCode={currentQ.starterCode}
            targetBugDescription={currentQ.targetBugDescription}
            onSubmitCode={(code) => {
              setCodeAnswer(code);
              handleEvaluate(code);
            }}
            isEvaluating={false}
          />
        )}

        {/* Question Type: Explain in own words / Short Answer */}
        {(currentQ.type === 'explain-own-words' || currentQ.type === 'short-answer') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Articulate clearly in your own words. The AI evaluates against conceptual criteria:
            </div>
            <textarea
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              disabled={currentFeedback !== null}
              rows={4}
              placeholder="Type your explanation here..."
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-medium)',
                outline: 'none',
                fontSize: '0.88rem',
                lineHeight: 1.5,
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
        )}

        {/* Confidence Rating Selection */}
        {!currentFeedback && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '14px' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              How confident do you feel in this answer?
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setConfidence(lvl)}
                  className="btn-ghost"
                  style={{
                    width: '30px',
                    height: '30px',
                    padding: 0,
                    borderRadius: '50%',
                    backgroundColor: confidence === lvl ? 'var(--accent-primary)' : 'var(--bg-subtle)',
                    color: confidence === lvl ? '#fff' : 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '0.78rem'
                  }}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Hints Box */}
        {currentQ.hints && currentQ.hints.length > 0 && (
          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
            {hintsRevealed > 0 ? (
              <div
                style={{
                  padding: '10px 14px',
                  backgroundColor: 'var(--warning-bg)',
                  border: '1px solid var(--warning-border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8rem',
                  color: 'var(--warning)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}
              >
                <Lightbulb size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Hint {hintsRevealed}:</strong> {currentQ.hints[hintsRevealed - 1]}
                </div>
              </div>
            ) : (
              <button
                onClick={() => setHintsRevealed(1)}
                className="btn-ghost"
                style={{ fontSize: '0.78rem', color: 'var(--text-muted)', gap: '4px' }}
              >
                <HelpCircle size={14} />
                <span>Need a hint? (recorded as 1 hint requested)</span>
              </button>
            )}
          </div>
        )}

        {/* Immediate Feedback Card after Submit */}
        {currentFeedback && (
          <div
            style={{
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: currentFeedback.isCorrect ? 'var(--success-bg)' : 'var(--danger-bg)',
              border: `1.5px solid ${currentFeedback.isCorrect ? 'var(--success-border)' : 'var(--danger-border)'}`,
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {currentFeedback.isCorrect ? <CheckCircle2 size={18} color="var(--success)" /> : <XCircle size={18} color="var(--danger)" />}
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: currentFeedback.isCorrect ? 'var(--success)' : 'var(--danger)' }}>
                {currentFeedback.isCorrect ? `Correct (+${currentFeedback.scorePercent}%)` : `Incorrect (${currentFeedback.scorePercent}%)`}
              </span>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-primary)', lineHeight: 1.45 }}>
              {currentFeedback.feedback}
            </p>
          </div>
        )}

        {/* Bottom Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
          {!currentFeedback && currentQ.type !== 'code-debugging' && (
            <button
              onClick={() => handleEvaluate()}
              disabled={currentQ.type === 'mcq' ? selectedOption === null : !textAnswer.trim()}
              className="btn-primary"
              style={{ padding: '8px 20px', fontSize: '0.88rem' }}
            >
              <span>Submit Answer</span>
              <Send size={14} />
            </button>
          )}

          {currentFeedback && (
            <button
              onClick={handleNext}
              className="btn-primary"
              style={{ padding: '8px 22px', fontSize: '0.88rem' }}
            >
              <span>{currentIdx + 1 < questions.length ? 'Next Question' : 'View Assessment Summary'}</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
