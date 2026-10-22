export type MethodCategory = 'teaching' | 'practice' | 'schedule';

export interface MethodOption {
  id: string;
  name: string;
  category: MethodCategory;
  description: string;
  howItHelps: string;
  badge?: string;
  isRecommended?: boolean;
  recommendationReason?: string;
}

export type QuestionType =
  | 'mcq'
  | 'short-answer'
  | 'explain-own-words'
  | 'code-debugging'
  | 'problem-solving';

export interface Question {
  id: string;
  type: QuestionType;
  concept: string;
  question: string;
  options?: string[];
  correctAnswer: string | number; // index or string
  explanation: string;
  hints: string[];
  starterCode?: string;
  targetBugDescription?: string;
  rubrics?: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface QuestionAttempt {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  scorePercent: number; // 0 - 100
  hintsUsed: number;
  attemptsCount: number;
  confidenceRating?: number; // 1 to 5
  feedback: string;
  identifiedMistakes?: string[];
}

export interface AssessmentResult {
  id: string;
  topicId: string;
  timestamp: string;
  score: number; // 0 - 100
  questionsAnswered: number;
  totalQuestions: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  mistakeTypes: string[];
  hintsRequested: number;
  confidenceAverage: number;
  isPostReteaching: boolean;
  methodUsed: string;
  attempts: QuestionAttempt[];
}

export interface AdaptationEvent {
  id: string;
  topicId: string;
  timestamp: string;
  triggeredReason: string;
  diagnosedGap: string;
  previousMethod: string;
  suggestedMethod: string;
  status: 'pending' | 'accepted' | 'rejected' | 'overridden';
  overriddenMethod?: string;
  preAdaptationScore: number;
  postAdaptationScore?: number;
  improvementMeasured?: number; // e.g. +28%
}

export interface Flashcard {
  id: string;
  topicId: string;
  question: string;
  answer: string;
  category?: string;
  box: number; // Spaced repetition Leitner box 1-5
  nextReview: string;
  lastReviewed?: string;
  status: 'new' | 'learning' | 'mastered';
}

export interface LessonExample {
  title: string;
  walkthrough: string;
  codeSnippet?: string;
  explanation: string;
}

export interface ConceptLesson {
  id: string;
  topicId: string;
  title: string;
  subtitle: string;
  teachingApproach: string;
  introduction: string;
  explanation: string;
  keyTakeaways: string[];
  examples: LessonExample[];
  visualDiagram?: {
    type: 'ascii' | 'svg' | 'flow';
    title: string;
    caption: string;
    diagram: string;
  };
  socraticQuestion?: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'notes' | 'txt' | 'image';
  uploadedAt: string;
  extractedText: string;
  summary: string;
  keyConcepts: string[];
  isGroundingActive: boolean;
}

export interface TopicChat {
  id: string;
  title: string;
  category: string;
  createdAt: string;
  lastActiveAt: string;
  currentConceptIndex: number;
  selectedMethods: {
    teaching: string;
    practice: string;
    schedule: string;
  };
  uploadedDocs: DocumentItem[];
  estimatedMastery: number; // 0 - 100 (estimated Bayesian/heuristic mastery)
  assessmentAccuracy: number; // 0 - 100 (measured quiz accuracy)
  studyTimeMinutes: number;
  revisionCount: number;
  adaptationEvents: AdaptationEvent[];
  assessmentHistory: AssessmentResult[];
  flashcards: Flashcard[];
  conversationLog: {
    id: string;
    sender: 'user' | 'assistant' | 'system';
    text: string;
    timestamp: string;
    isDoubt?: boolean;
  }[];
}

export interface AIProviderConfig {
  provider: 'demo' | 'gemini' | 'openai';
  apiKey?: string;
  geminiModel?: string;
  openaiModel?: string;
}
