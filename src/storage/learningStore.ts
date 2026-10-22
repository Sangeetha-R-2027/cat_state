import { TopicChat, AssessmentResult, AdaptationEvent, Flashcard, DocumentItem } from '../types';
import { SEED_CURRICULA } from '../data/seedCourses';

const STORAGE_KEY = 'academic_learning_assistant_chats_v1';
const ACTIVE_CHAT_KEY = 'academic_learning_assistant_active_id_v1';

export function initializeStorage(): TopicChat[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse stored chats, seeding default:', e);
  }

  // Create default preloaded topic: "Linked Lists in C" with realistic rich history
  const seedTopic: TopicChat = {
    id: 'linked-lists-in-c',
    title: 'Linked Lists in C',
    category: 'Computer Science & Data Structures',
    createdAt: '2026-10-20T10:00:00.000Z',
    lastActiveAt: new Date().toISOString(),
    currentConceptIndex: 0,
    selectedMethods: {
      teaching: 'step-by-step',
      practice: 'guided-problem-solving',
      schedule: 'pomodoro',
    },
    uploadedDocs: SEED_CURRICULA['linked-lists-in-c'].sampleDocument
      ? [SEED_CURRICULA['linked-lists-in-c'].sampleDocument]
      : [],
    estimatedMastery: 72,
    assessmentAccuracy: 67,
    studyTimeMinutes: 45,
    revisionCount: 3,
    adaptationEvents: [],
    assessmentHistory: [
      {
        id: 'init-assess-1',
        topicId: 'linked-lists-in-c',
        timestamp: '2026-10-20T10:45:00.000Z',
        score: 67,
        questionsAnswered: 3,
        totalQuestions: 3,
        difficulty: 'intermediate',
        mistakeTypes: ['Pointer Reassignment Order', 'Segmentation Fault on Traversal'],
        hintsRequested: 2,
        confidenceAverage: 3.2,
        isPostReteaching: false,
        methodUsed: 'step-by-step',
        attempts: [
          {
            questionId: 'll-q1',
            userAnswer: '0',
            isCorrect: false,
            scorePercent: 0,
            hintsUsed: 1,
            attemptsCount: 2,
            confidenceRating: 2,
            feedback: 'Selected head = newNode before saving next pointer.',
            identifiedMistakes: ['Pointer Reassignment Order']
          },
          {
            questionId: 'll-q2',
            userAnswer: 'void printList(struct Node* head) { ... }',
            isCorrect: true,
            scorePercent: 100,
            hintsUsed: 1,
            attemptsCount: 1,
            confidenceRating: 4,
            feedback: 'Correctly checked curr != NULL loop invariant.'
          },
          {
            questionId: 'll-q3',
            userAnswer: 'Memory leaks are unfree memory; dangling points to freed memory.',
            isCorrect: true,
            scorePercent: 100,
            hintsUsed: 0,
            attemptsCount: 1,
            confidenceRating: 4,
            feedback: 'Accurately articulated conceptual contrast.'
          }
        ]
      }
    ],
    flashcards: SEED_CURRICULA['linked-lists-in-c'].flashcards,
    conversationLog: [
      {
        id: 'msg-1',
        sender: 'assistant',
        text: 'Welcome to Linked Lists in C! I will be your academic guide. We will build rock-solid pointer intuition together.',
        timestamp: '2026-10-20T10:00:15.000Z'
      }
    ]
  };

  const initialList = [seedTopic];
  saveAllChats(initialList);
  return initialList;
}

export function getAllChats(): TopicChat[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return initializeStorage();
    return JSON.parse(data);
  } catch {
    return initializeStorage();
  }
}

export function saveAllChats(chats: TopicChat[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  } catch (err) {
    console.error('Failed to save to localStorage', err);
  }
}

export function getChatById(id: string): TopicChat | undefined {
  const chats = getAllChats();
  return chats.find(c => c.id === id);
}

export function saveChat(chat: TopicChat): void {
  const chats = getAllChats();
  const index = chats.findIndex(c => c.id === chat.id);
  if (index >= 0) {
    chats[index] = { ...chat, lastActiveAt: new Date().toISOString() };
  } else {
    chats.unshift({ ...chat, lastActiveAt: new Date().toISOString() });
  }
  saveAllChats(chats);
}

export function createNewChat(topicTitle: string, selectedMethods?: { teaching: string; practice: string; schedule: string }): TopicChat {
  const normalizedId = topicTitle.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
  const existing = getChatById(normalizedId);
  if (existing) {
    return existing;
  }

  // Check if topic exists in seed curricula
  const seed = SEED_CURRICULA[normalizedId];

  const newChat: TopicChat = {
    id: normalizedId || `topic-${Date.now()}`,
    title: topicTitle.trim(),
    category: seed ? seed.category : 'Academic Concept',
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    currentConceptIndex: 0,
    selectedMethods: selectedMethods || {
      teaching: 'step-by-step',
      practice: 'guided-problem-solving',
      schedule: 'spaced-repetition',
    },
    uploadedDocs: seed?.sampleDocument ? [seed.sampleDocument] : [],
    estimatedMastery: 20, // initial estimate
    assessmentAccuracy: 0,
    studyTimeMinutes: 0,
    revisionCount: 0,
    adaptationEvents: [],
    assessmentHistory: [],
    flashcards: seed ? seed.flashcards : [
      {
        id: `fc-${Date.now()}-1`,
        topicId: normalizedId,
        question: `What is the core definition of ${topicTitle}?`,
        answer: `A foundational academic concept in this field.`,
        box: 1,
        nextReview: new Date().toISOString(),
        status: 'new'
      }
    ],
    conversationLog: [
      {
        id: `init-${Date.now()}`,
        sender: 'assistant',
        text: `Welcome to our study session on "${topicTitle}". I have tailored our lesson using the ${selectedMethods?.teaching || 'Step-by-Step'} approach. Feel free to ask doubts at any point or press "Check my understanding" when you are ready to evaluate!`,
        timestamp: new Date().toISOString()
      }
    ]
  };

  saveChat(newChat);
  setActiveChatId(newChat.id);
  return newChat;
}

export function deleteChat(id: string): void {
  const chats = getAllChats().filter(c => c.id !== id);
  saveAllChats(chats);
  if (getActiveChatId() === id) {
    const nextId = chats.length > 0 ? chats[0].id : '';
    setActiveChatId(nextId);
  }
}

export function getActiveChatId(): string {
  return localStorage.getItem(ACTIVE_CHAT_KEY) || 'linked-lists-in-c';
}

export function setActiveChatId(id: string): void {
  localStorage.setItem(ACTIVE_CHAT_KEY, id);
}
