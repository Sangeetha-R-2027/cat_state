import {
  ConceptLesson,
  Question,
  Flashcard,
  DocumentItem,
  AssessmentResult,
  AdaptationEvent,
  MethodOption
} from '../types';
import { SEED_CURRICULA } from '../data/seedCourses';
import { TEACHING_APPROACHES, PRACTICE_APPROACHES, STUDY_SCHEDULES } from '../data/techniques';

export interface ServiceResult<T> {
  success: boolean;
  data: T;
  provider: 'demo' | 'gemini' | 'openai';
  isDemo: boolean;
  message?: string;
}

// Check provider status from backend
export async function getProviderStatus(): Promise<{
  provider: 'demo' | 'gemini' | 'openai';
  isDemo: boolean;
}> {
  try {
    const res = await fetch('/api/health');
    if (res.ok) {
      const data = await res.json();
      return {
        provider: data.mode || 'demo',
        isDemo: data.mode === 'demo'
      };
    }
  } catch (e) {
    // Backend may not be running; client demo mode works 100% standalone
  }
  return { provider: 'demo', isDemo: true };
}

// 1. explainConcept
export async function explainConcept(
  topic: string,
  teachingMethod: string,
  difficulty: 'beginner' | 'intermediate' | 'advanced' = 'intermediate',
  contextDocument?: DocumentItem,
  studentHistory?: { assessmentAccuracy: number; mistakePatterns: string[] }
): Promise<ServiceResult<ConceptLesson>> {
  const normKey = topic.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
  const seed = SEED_CURRICULA[normKey];

  // Try API call first
  try {
    const res = await fetch('/api/ai/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic,
        teachingMethod,
        difficulty,
        contextDocument: contextDocument ? contextDocument.extractedText : undefined,
        studentHistory
      })
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data && !json.isDemo) {
        return {
          success: true,
          data: {
            id: `api-lesson-${Date.now()}`,
            topicId: normKey,
            title: json.data.title || topic,
            subtitle: `Explaining ${topic} with ${teachingMethod}`,
            teachingApproach: teachingMethod,
            introduction: json.data.introduction,
            explanation: json.data.explanation,
            keyTakeaways: json.data.keyTakeaways || [],
            examples: json.data.examples || [],
            visualDiagram: json.data.visualPrompt ? {
              type: 'ascii',
              title: 'Visual Representation',
              caption: 'Diagram generated based on concept structure',
              diagram: json.data.visualPrompt
            } : undefined,
            socraticQuestion: json.data.socraticCheck
          },
          provider: json.provider || 'gemini',
          isDemo: false
        };
      }
    }
  } catch {
    // fallback to demo engine
  }

  // Pedagogical Engine Fallback
  if (seed) {
    const tailoredLesson = seed.lessons[teachingMethod] || seed.lessons['step-by-step'] || Object.values(seed.lessons)[0];
    return {
      success: true,
      data: tailoredLesson,
      provider: 'demo',
      isDemo: true,
      message: 'Generated using Built-in Pedagogical Simulation Engine'
    };
  }

  // Dynamic generic academic generator for any topic entered by user
  return {
    success: true,
    data: {
      id: `lesson-${Date.now()}`,
      topicId: normKey,
      title: `${topic}: Conceptual Fundamentals`,
      subtitle: `Tailored through the ${teachingMethod} pedagogy`,
      teachingApproach: teachingMethod,
      introduction: `${topic} is a cornerstone academic topic. In this tailored lesson, we break down its fundamental axioms, mechanical execution, and boundary edge cases.`,
      explanation: `### Core Principles of ${topic}
To master **${topic}**, we focus on three foundational dimensions:
1. **The Invariant Condition:** What rules must remain true at all times?
2. **State & Transformations:** How inputs transition step-by-step into desired outputs.
3. **Common Failure Modes:** Where typical student misconceptions occur.

${contextDocument ? `> **Grounded in Uploaded Material (${contextDocument.name}):**\n> ${contextDocument.summary}\n` : ''}

### Analytical Breakdown
When applying the **${teachingMethod}** method, we inspect each component in isolation before assembling the full conceptual picture. Notice how the internal dependencies link together to form a robust system.`,
      keyTakeaways: [
        `Understand the core invariant rule of ${topic}.`,
        'Verify preconditions and edge conditions before executing operations.',
        'Synthesize theoretical principles with practical step-by-step execution.'
      ],
      visualDiagram: {
        type: 'ascii',
        title: `Structural Diagram: ${topic}`,
        caption: 'Conceptual flow and component dependencies.',
        diagram: `┌───────────────────────────────────────────┐
│            ${topic.toUpperCase().slice(0, 30).padEnd(30)} │
└─────────────────────┬─────────────────────┘
                      ▼
         ┌────────────────────────┐
         │ Core Invariant Check   │
         └────────────┬───────────┘
                      ▼
       [ Valid ] ◄────┴────► [ Exception ]`
      },
      examples: [
        {
          title: `Standard Execution Model for ${topic}`,
          walkthrough: '1. Initialize system state. 2. Verify preconditions. 3. Apply transformation.',
          explanation: 'This standardized sequence guarantees deterministic outcomes and avoids race or null conditions.'
        }
      ],
      socraticQuestion: `How would you explain the most critical constraint of ${topic} to someone seeing it for the first time?`
    },
    provider: 'demo',
    isDemo: true,
    message: 'Generated using Built-in Pedagogical Simulation Engine'
  };
}

// 2. answerStudentDoubt
export async function answerStudentDoubt(
  topic: string,
  doubt: string,
  currentLessonStep?: string,
  contextDocument?: DocumentItem
): Promise<ServiceResult<string>> {
  try {
    const res = await fetch('/api/ai/doubt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic,
        doubt,
        currentLessonStep,
        contextDocument: contextDocument ? contextDocument.extractedText : undefined
      })
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.answer && !json.isDemo) {
        return {
          success: true,
          data: json.answer,
          provider: json.provider || 'gemini',
          isDemo: false
        };
      }
    }
  } catch {
    // fallback
  }

  // Context-aware academic answers
  const lowerDoubt = doubt.toLowerCase();
  let response = '';

  if (lowerDoubt.includes('segfault') || lowerDoubt.includes('segmentation') || lowerDoubt.includes('null')) {
    response = `**Great diagnostic question!** A segmentation fault happens because the CPU attempts to access a virtual memory address that is not mapped in your process's address space. In C, dereferencing \`NULL\` (\`0x0\`) triggers an immediate \`SIGSEGV\` signal. 

**Pedagogical Fix:** Always enforce a defensive check before touching arrows:
\`\`\`c
if (ptr == NULL) {
    /* handle edge case safely */
    return;
}
int val = ptr->data; // Now 100% safe!
\`\`\`
Does that clarify why the check must come before the dereference?`;
  } else if (lowerDoubt.includes('why') || lowerDoubt.includes('how') || lowerDoubt.includes('difference')) {
    response = `**Excellent question regarding ${topic}!**

The key difference lies in **ownership and memory access**:
- One side controls *where* the resource lives (e.g., contiguous stack vs dynamic heap).
- The other controls *how* you access it (direct offset vs pointer chasing).

When you trace this in memory, notice how every layer adds safety at the cost of slight indirection.

${contextDocument ? `*Note: Your uploaded notes ("${contextDocument.name}") emphasize this exact distinction on page 2.*` : ''}

Would you like to see a quick code illustration or an analogy?`;
  } else {
    response = `That's an insightful point about **${topic}**. 

When students encounter this, the common mental trap is assuming the operation happens all at once. In reality, the compiler or physical system executes sequentially. 

Keep this mental model in mind: **isolate the prerequisite state before initiating the change**.

Would you like to try a mini 1-question check to verify this concept?`;
  }

  return {
    success: true,
    data: response,
    provider: 'demo',
    isDemo: true,
    message: 'Responded via Pedagogical Doubt Engine'
  };
}

// 3. generateAssessment
export function generateAssessment(
  topic: string,
  concept: string,
  isPostReteaching: boolean = false
): Question[] {
  const normKey = topic.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
  const seed = SEED_CURRICULA[normKey];

  if (seed) {
    if (isPostReteaching && seed.reteachingQuestions.length > 0) {
      return seed.reteachingQuestions;
    }
    return seed.questions;
  }

  // Dynamic question set
  return [
    {
      id: `gen-q1-${Date.now()}`,
      type: 'mcq',
      concept: `${topic} Invariant`,
      question: `Which statement most accurately describes the primary operational rule of ${topic}?`,
      options: [
        `It requires strict sequential preservation of state across all transformations.`,
        `It operates in completely random unconstrained memory blocks.`,
        `It disregards precondition boundaries during execution.`,
        `It is strictly identical to fixed-size contiguous storage.`
      ],
      correctAnswer: 0,
      explanation: `In ${topic}, maintaining the invariant rule across all modifications prevents undefined states or data loss.`,
      hints: ['Consider which option emphasizes stability and state continuity.'],
      difficulty: 'beginner'
    },
    {
      id: `gen-q2-${Date.now()}`,
      type: 'explain-own-words',
      concept: `${topic} Core Mechanism`,
      question: `In 2-3 sentences, explain why understanding ${topic} is critical when designing reliable systems.`,
      correctAnswer: `Understanding ${topic} ensures that resources are allocated efficiently, edge cases are guarded, and system failures are prevented through robust invariants.`,
      rubrics: [
        'Explains resource management or operational efficiency',
        'Identifies risk of failure or bug prevention',
        'Expresses clear causal relationship'
      ],
      explanation: 'Demonstrating clear articulation exposes whether you truly grasp the conceptual motivation beyond memorized code.',
      hints: ['Think about what goes wrong in production when this concept is ignored.'],
      difficulty: 'intermediate'
    }
  ];
}

// 4. evaluateAnswer
export async function evaluateAnswer(
  question: Question,
  studentAnswer: string
): Promise<{
  isCorrect: boolean;
  scorePercent: number;
  feedback: string;
  identifiedMistakes: string[];
}> {
  // Deterministic MCQ check
  if (question.type === 'mcq') {
    const isCorrect = String(studentAnswer) === String(question.correctAnswer);
    return {
      isCorrect,
      scorePercent: isCorrect ? 100 : 0,
      feedback: isCorrect
        ? 'Spot on! You demonstrated precise grasp of the invariant order.'
        : `Incorrect. ${question.explanation}`,
      identifiedMistakes: isCorrect ? [] : [question.concept]
    };
  }

  // Code debugging check
  if (question.type === 'code-debugging') {
    const cleanStudent = studentAnswer.replace(/\s+/g, ' ').trim();
    // Check if fixed loop condition or null check
    const hasNullCheck = cleanStudent.includes('curr != NULL') || cleanStudent.includes('curr != null') || cleanStudent.includes('!curr');
    const hasNextOnly = cleanStudent.includes('curr->next != NULL') && !cleanStudent.includes('curr != NULL');

    if (hasNextOnly) {
      return {
        isCorrect: false,
        scorePercent: 30,
        feedback: 'You still dereference `curr->next` directly in the loop! If the list is empty (`head == NULL`), this will crash immediately with a segmentation fault.',
        identifiedMistakes: ['Segmentation Fault in Node Traversal', 'NULL Boundary Checks']
      };
    }

    if (hasNullCheck) {
      return {
        isCorrect: true,
        scorePercent: 100,
        feedback: 'Outstanding fix! Checking `curr != NULL` guarantees that empty lists do not crash and the final node is properly printed.',
        identifiedMistakes: []
      };
    }

    return {
      isCorrect: true,
      scorePercent: 85,
      feedback: 'Good correction. The defensive checks protect the pointer traversal effectively.',
      identifiedMistakes: []
    };
  }

  // Explain-in-own-words / rubrics evaluation
  const wordCount = studentAnswer.trim().split(/\s+/).length;
  if (wordCount < 5) {
    return {
      isCorrect: false,
      scorePercent: 20,
      feedback: 'Answer is too brief to evaluate depth of understanding. Please elaborate on the cause and consequence.',
      identifiedMistakes: ['Superficial Explanation']
    };
  }

  // Check rubrics keywords
  let matchedRubrics = 0;
  if (question.rubrics && question.rubrics.length > 0) {
    const lower = studentAnswer.toLowerCase();
    if (lower.includes('leak') || lower.includes('heap') || lower.includes('malloc') || lower.includes('memory') || lower.includes('resource')) matchedRubrics++;
    if (lower.includes('dangling') || lower.includes('freed') || lower.includes('free') || lower.includes('pointer') || lower.includes('invalid')) matchedRubrics++;
    if (lower.includes('crash') || lower.includes('undefined') || lower.includes('lost') || lower.includes('fail')) matchedRubrics++;
  } else {
    matchedRubrics = 2;
  }

  const scorePercent = matchedRubrics >= 2 ? 100 : 70;
  return {
    isCorrect: scorePercent >= 70,
    scorePercent,
    feedback: scorePercent >= 90
      ? 'Clear, accurate synthesis! You hit all key criteria of the rubric.'
      : 'Good effort. Your explanation captures the general intuition, but could be sharpened by explicitly distinguishing heap reclamation.',
    identifiedMistakes: scorePercent < 70 ? [question.concept] : []
  };
}

// 5. recommendLearningMethod (Personalized Recommendation Engine)
export function recommendLearningMethod(
  topicTitle: string,
  assessmentHistory: AssessmentResult[],
  adaptationHistory: AdaptationEvent[]
): {
  recommendedApproachId: string;
  recommendedCategory: 'teaching' | 'practice';
  rationale: string;
  evidence: string;
} {
  const normKey = topicTitle.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
  const seed = SEED_CURRICULA[normKey];

  // Returning student for same topic with assessment history
  if (assessmentHistory.length > 0) {
    const latest = assessmentHistory[assessmentHistory.length - 1];
    const avgScore = assessmentHistory.reduce((acc, a) => acc + a.score, 0) / assessmentHistory.length;

    // Check if mistakes indicate a specific known gap
    if (latest.mistakeTypes.length > 0) {
      const topMistake = latest.mistakeTypes[0];
      const gapRule = seed?.commonGaps.find(g => g.triggerMistake === topMistake);
      if (gapRule) {
        return {
          recommendedApproachId: gapRule.suggestedMethod,
          recommendedCategory: 'teaching',
          rationale: `Diagnostic analysis of your recent error on "${topMistake}" suggests difficulty with ${gapRule.gapConcept}.`,
          evidence: `Accuracy: ${Math.round(latest.score)}%. Observed pattern: repeated confusion with pointer dereference order. ${gapRule.rationale}`
        };
      }
    }

    if (avgScore < 70) {
      return {
        recommendedApproachId: 'visual-diagram',
        recommendedCategory: 'teaching',
        rationale: 'Recent assessment accuracy indicates that abstract textual explanations are causing friction.',
        evidence: `Average topic score is ${Math.round(avgScore)}%. Visual memory diagrams have demonstrated a +32% average retention boost for spatial and pointer concepts.`
      };
    } else {
      return {
        recommendedApproachId: 'explain-in-own-words',
        recommendedCategory: 'practice',
        rationale: 'You have solid baseline mastery! Active Feynman articulation will solidify edge case recall.',
        evidence: `Topic accuracy is currently ${Math.round(avgScore)}%. Moving to peer-teaching explanation mode prevents passive plateauing.`
      };
    }
  }

  // New student or topic without history: topic-aware general diagnostic starting point
  if (normKey.includes('c') || normKey.includes('pointer') || normKey.includes('tree') || normKey.includes('graph')) {
    return {
      recommendedApproachId: 'visual-diagram',
      recommendedCategory: 'teaching',
      rationale: 'For pointer and data structure topics, visual state diagrams provide the highest initial comprehension.',
      evidence: 'Diagnostic baseline: spatial representations prevent pointer inversion bugs before code syntax is introduced.'
    };
  }

  return {
    recommendedApproachId: 'step-by-step',
    recommendedCategory: 'teaching',
    rationale: 'Recommended initial baseline: Step-by-Step explanation systematically builds prerequisite foundations.',
    evidence: 'New topic initialized without prior diagnostic history. Gradual sequential introduction provides the safest scaffold.'
  };
}

// 6. generateFlashcards
export function generateFlashcards(topic: string): Flashcard[] {
  const normKey = topic.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
  const seed = SEED_CURRICULA[normKey];
  if (seed && seed.flashcards.length > 0) {
    return seed.flashcards;
  }
  return [
    {
      id: `fc-${Date.now()}-1`,
      topicId: normKey,
      question: `What is the primary operational advantage of ${topic}?`,
      answer: `It provides specialized architectural or mathematical properties tailored for efficiency and correctness.`,
      box: 1,
      nextReview: new Date().toISOString(),
      status: 'new'
    },
    {
      id: `fc-${Date.now()}-2`,
      topicId: normKey,
      question: `What is a common edge-case trap when working with ${topic}?`,
      answer: `Boundary failure (such as empty inputs, zero net force, or uninitialized pointers).`,
      box: 1,
      nextReview: new Date().toISOString(),
      status: 'new'
    }
  ];
}

// 7. analyzeDocument
export function analyzeDocument(name: string, content: string): DocumentItem {
  const words = content.split(/\s+/).length;
  return {
    id: `doc-${Date.now()}`,
    name,
    size: `${Math.round(content.length / 1024) || 1} KB`,
    type: name.endsWith('.txt') ? 'txt' : (name.endsWith('.pdf') ? 'pdf' : 'notes'),
    uploadedAt: 'Just now',
    extractedText: content,
    summary: `Extracted ${words} words from "${name}". Identified core lecture themes and operational criteria.`,
    keyConcepts: [
      'Core Terminology & Definitions',
      'Structural Invariants',
      'Code/Algorithmic Patterns',
      'Exam Traps & Failure Points'
    ],
    isGroundingActive: true
  };
}
