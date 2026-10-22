import { MethodOption } from '../types';

export const TEACHING_APPROACHES: MethodOption[] = [
  {
    id: 'step-by-step',
    name: 'Step-by-Step Explanation',
    category: 'teaching',
    description: 'Breaks complex academic concepts into logical sequential steps with immediate reinforcement.',
    howItHelps: 'Prevents cognitive overload and builds foundational understanding before moving to edge cases.',
    badge: 'Foundation',
  },
  {
    id: 'worked-examples',
    name: 'Worked Examples First',
    category: 'teaching',
    description: 'Presents fully solved, concrete problems before explaining abstract general rules.',
    howItHelps: 'Reduces inductive reasoning friction; excellent for algorithmic and mathematical mastery.',
    badge: 'Problem-Solving',
  },
  {
    id: 'visual-diagram',
    name: 'Visual & Diagram-Based',
    category: 'teaching',
    description: 'Uses memory layouts, state transitions, structural graphs, and flow diagrams.',
    howItHelps: 'Ideal for spatial understanding, data structures (pointers, trees), and physical systems.',
    badge: 'Intuition',
  },
  {
    id: 'analogy-based',
    name: 'Analogy-Based Teaching',
    category: 'teaching',
    description: 'Anchors unfamiliar technical mechanics to real-world intuitive models.',
    howItHelps: 'Demystifies abstract concepts quickly by bridging prior everyday knowledge.',
    badge: 'Conceptual',
  },
  {
    id: 'socratic',
    name: 'Socratic Questioning',
    category: 'teaching',
    description: 'Guides the student to discover principles through targeted, thought-provoking prompts.',
    howItHelps: 'Fosters deep metacognition and active mental engagement rather than passive reading.',
    badge: 'Deep Thinking',
  },
  {
    id: 'simplified-increasing',
    name: 'Simplified to Increasing Complexity',
    category: 'teaching',
    description: 'Begins with an ultra-simple mental model ("ELI5"), then progressively introduces rigorous nuances.',
    howItHelps: 'Builds student confidence early and systematically reveals system complexity without intimidation.',
    badge: 'Progressive',
  },
];

export const PRACTICE_APPROACHES: MethodOption[] = [
  {
    id: 'retrieval',
    name: 'Retrieval Practice',
    category: 'practice',
    description: 'Requires actively recalling information from memory through low-stakes flash quizzes.',
    howItHelps: 'Strengthens neural memory traces and identifies subtle knowledge gaps before high-stakes exams.',
    badge: 'Memory Retention',
  },
  {
    id: 'guided-problem-solving',
    name: 'Guided Problem-Solving',
    category: 'practice',
    description: 'Provides scaffolded prompts with graduated hints whenever you encounter a roadblock.',
    howItHelps: 'Prevents frustration while maintaining active problem-solving momentum.',
    badge: 'Scaffolded',
  },
  {
    id: 'independent-exercises',
    name: 'Independent Exercises',
    category: 'practice',
    description: 'Unscaffolded exam-level challenges designed to test self-sufficiency and mastery.',
    howItHelps: 'Verifies whether understanding transfers seamlessly to novel, unassisted contexts.',
    badge: 'Mastery Verification',
  },
  {
    id: 'explain-in-own-words',
    name: 'Explain-in-Your-Own-Words (Feynman)',
    category: 'practice',
    description: 'You articulate the concept as if teaching it to a peer, and the AI evaluates your conceptual gaps.',
    howItHelps: 'Exposes superficial illusion of competence and solidifies core understanding.',
    badge: 'Feynman Technique',
  },
  {
    id: 'error-analysis',
    name: 'Error Analysis & Debugging',
    category: 'practice',
    description: 'Analyze flawed code snippets or erroneous proofs and diagnose the root misconception.',
    howItHelps: 'Develops critical evaluation and troubleshooting instincts essential for engineering subjects.',
    badge: 'Analytical',
  },
];

export const STUDY_SCHEDULES: MethodOption[] = [
  {
    id: 'pomodoro',
    name: 'Pomodoro Study Sessions',
    category: 'schedule',
    description: 'Structured 25-minute focused bursts paired with 5-minute cognitive rest intervals.',
    howItHelps: 'Maximizes sustained attention, prevents mental fatigue, and maintains high motivation.',
    badge: 'Focus',
  },
  {
    id: 'spaced-repetition',
    name: 'Spaced Repetition (Leitner Intervals)',
    category: 'schedule',
    description: 'Schedules review cards at expanding time intervals (1 day, 3 days, 1 week) based on recall difficulty.',
    howItHelps: 'Flattens the Ebbinghaus forgetting curve for durable, long-term conceptual retention.',
    badge: 'Long-Term Recall',
  },
  {
    id: 'scheduled-revision',
    name: 'Scheduled Topic Check-ins',
    category: 'schedule',
    description: 'Automated milestone reviews after completing learning modules.',
    howItHelps: 'Ensures cumulative retention across multi-week course units.',
    badge: 'Milestones',
  },
];

export function getMethodById(id: string): MethodOption | undefined {
  return [...TEACHING_APPROACHES, ...PRACTICE_APPROACHES, ...STUDY_SCHEDULES].find(m => m.id === id);
}
