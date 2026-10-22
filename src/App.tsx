import React, { useState, useEffect } from 'react';
import './styles/theme.css';
import {
  TopicChat,
  ConceptLesson,
  AssessmentResult,
  AdaptationEvent,
  DocumentItem
} from './types';
import {
  getAllChats,
  saveChat,
  createNewChat,
  deleteChat,
  getActiveChatId,
  setActiveChatId,
  initializeStorage
} from './storage/learningStore';
import {
  explainConcept,
  generateAssessment,
  getProviderStatus
} from './services/aiService';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { WelcomeScreen } from './components/WelcomeScreen';
import { MethodSelectionModal } from './components/MethodSelectionModal';
import { LessonWorkspace } from './components/LessonWorkspace';
import { AssessmentView } from './components/AssessmentView';
import { DashboardView } from './components/DashboardView';
import { FlashcardsView } from './components/FlashcardsView';
import { DocumentUploadModal } from './components/DocumentUploadModal';
import { SettingsModal } from './components/SettingsModal';

export const App: React.FC = () => {
  const [chats, setChats] = useState<TopicChat[]>([]);
  const [activeChatId, setActiveChatIdState] = useState<string>('');
  const [currentView, setCurrentView] = useState<'welcome' | 'lesson' | 'assessment' | 'dashboard' | 'flashcards'>('lesson');
  const [currentLesson, setCurrentLesson] = useState<ConceptLesson | null>(null);
  const [isLessonLoading, setIsLessonLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isDemoMode, setIsDemoMode] = useState(true);

  // Modals
  const [isMethodModalOpen, setIsMethodModalOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [pendingTopicTitle, setPendingTopicTitle] = useState<string | null>(null);
  const [pendingAttachedDoc, setPendingAttachedDoc] = useState<DocumentItem | null>(null);

  // Load initial chats & provider status
  useEffect(() => {
    const loadedChats = initializeStorage();
    setChats(loadedChats);

    const activeId = getActiveChatId();
    const chat = loadedChats.find(c => c.id === activeId) || loadedChats[0];
    if (chat) {
      setActiveChatIdState(chat.id);
      loadLessonForChat(chat, chat.selectedMethods.teaching);
    } else {
      setCurrentView('welcome');
    }

    getProviderStatus().then(status => {
      setIsDemoMode(status.isDemo);
    });
  }, []);

  const activeChat = chats.find(c => c.id === activeChatId);

  // Helper to load lesson for a given chat and method
  const loadLessonForChat = async (chat: TopicChat, teachingMethod: string) => {
    setIsLessonLoading(true);
    try {
      const doc = chat.uploadedDocs.length > 0 ? chat.uploadedDocs[0] : undefined;
      const res = await explainConcept(
        chat.title,
        teachingMethod,
        'intermediate',
        doc,
        {
          assessmentAccuracy: chat.assessmentAccuracy,
          mistakePatterns: chat.assessmentHistory.flatMap(a => a.mistakeTypes)
        }
      );
      setCurrentLesson(res.data);
    } catch (err) {
      console.error('Failed to load lesson', err);
    } finally {
      setIsLessonLoading(false);
    }
  };

  // Switch chat
  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    setActiveChatIdState(id);
    const chat = chats.find(c => c.id === id);
    if (chat) {
      loadLessonForChat(chat, chat.selectedMethods.teaching);
      setCurrentView('lesson');
    }
  };

  // Start new topic flow from Welcome Screen
  const handleStartTopicFromWelcome = (topicTitle: string, attachedDoc?: DocumentItem) => {
    setPendingTopicTitle(topicTitle);
    setPendingAttachedDoc(attachedDoc || null);
    setIsMethodModalOpen(true);
  };

  // Apply selected methods & create or update chat
  const handleApplyMethods = (methods: { teaching: string; practice: string; schedule: string }) => {
    setIsMethodModalOpen(false);

    if (pendingTopicTitle) {
      // Creating a new topic chat
      const newChat = createNewChat(pendingTopicTitle, methods);
      if (pendingAttachedDoc) {
        newChat.uploadedDocs = [pendingAttachedDoc];
      }
      saveChat(newChat);

      const updatedChats = getAllChats();
      setChats(updatedChats);
      setActiveChatId(newChat.id);
      setActiveChatIdState(newChat.id);
      setPendingTopicTitle(null);
      setPendingAttachedDoc(null);

      loadLessonForChat(newChat, methods.teaching);
      setCurrentView('lesson');
    } else if (activeChat) {
      // Updating current topic chat method
      const updatedChat: TopicChat = {
        ...activeChat,
        selectedMethods: methods
      };
      saveChat(updatedChat);
      setChats(getAllChats());
      loadLessonForChat(updatedChat, methods.teaching);
    }
  };

  // Delete chat
  const handleDeleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteChat(id);
    const remaining = getAllChats();
    setChats(remaining);
    if (activeChatId === id) {
      if (remaining.length > 0) {
        handleSelectChat(remaining[0].id);
      } else {
        setActiveChatIdState('');
        setCurrentView('welcome');
      }
    }
  };

  // Toggle Dark/Light theme
  const handleToggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  // Quick Lesson Actions
  const handleMakeEasier = () => {
    if (!activeChat) return;
    handleApplyMethods({
      ...activeChat.selectedMethods,
      teaching: 'simplified-increasing'
    });
  };

  const handleHarderExample = () => {
    if (!activeChat) return;
    handleApplyMethods({
      ...activeChat.selectedMethods,
      teaching: 'worked-examples'
    });
  };

  const handleSummarize = () => {
    if (!activeChat) return;
    alert(`Summary of ${activeChat.title}:\n\n• Core Invariant Rule: Protect integrity and sequential state.\n• Memory Mechanics: Avoid dereferencing NULL or lost pointers.\n• Primary Method in Use: ${activeChat.selectedMethods.teaching}.`);
  };

  const handleRevise = () => {
    setCurrentView('flashcards');
  };

  // Complete Assessment & Record Adaptation
  const handleCompleteAssessment = (result: AssessmentResult, triggeredAdaptation?: AdaptationEvent) => {
    if (!activeChat) return;

    // Bayesian/heuristic mastery update
    const newAccuracy = Math.round(
      (activeChat.assessmentAccuracy * activeChat.assessmentHistory.length + result.score) /
        (activeChat.assessmentHistory.length + 1)
    );
    const newMastery = Math.min(100, Math.round(newAccuracy * 0.85 + (result.hintsRequested === 0 ? 15 : 5)));

    const updatedEvents = triggeredAdaptation
      ? [...activeChat.adaptationEvents, triggeredAdaptation]
      : activeChat.adaptationEvents;

    const updatedChat: TopicChat = {
      ...activeChat,
      assessmentAccuracy: newAccuracy,
      estimatedMastery: newMastery,
      studyTimeMinutes: activeChat.studyTimeMinutes + 12,
      assessmentHistory: [...activeChat.assessmentHistory, result],
      adaptationEvents: updatedEvents
    };

    saveChat(updatedChat);
    setChats(getAllChats());
  };

  // Accept Adaptation (e.g. switch to Visual-Diagram and reteach)
  const handleAcceptAdaptation = (adaptation: AdaptationEvent) => {
    if (!activeChat) return;

    const updatedAdaptation: AdaptationEvent = {
      ...adaptation,
      status: 'accepted'
    };

    const updatedChat: TopicChat = {
      ...activeChat,
      selectedMethods: {
        ...activeChat.selectedMethods,
        teaching: adaptation.suggestedMethod
      },
      adaptationEvents: activeChat.adaptationEvents.map(e =>
        e.id === adaptation.id ? updatedAdaptation : e
      )
    };

    saveChat(updatedChat);
    setChats(getAllChats());
    loadLessonForChat(updatedChat, adaptation.suggestedMethod);
    setCurrentView('lesson');
  };

  // Reject Adaptation
  const handleRejectAdaptation = (adaptation: AdaptationEvent) => {
    if (!activeChat) return;
    const updatedChat: TopicChat = {
      ...activeChat,
      adaptationEvents: activeChat.adaptationEvents.map(e =>
        e.id === adaptation.id ? { ...e, status: 'rejected' } : e
      )
    };
    saveChat(updatedChat);
    setChats(getAllChats());
  };

  // Flashcard rating update
  const handleUpdateFlashcard = (cardId: string, boxLevel: number) => {
    if (!activeChat) return;
    const updatedCards = activeChat.flashcards.map(c =>
      c.id === cardId
        ? {
            ...c,
            box: boxLevel,
            status: boxLevel >= 4 ? ('mastered' as const) : ('learning' as const),
            lastReviewed: new Date().toISOString()
          }
        : c
    );

    const updatedChat: TopicChat = {
      ...activeChat,
      flashcards: updatedCards,
      revisionCount: activeChat.revisionCount + 1
    };
    saveChat(updatedChat);
    setChats(getAllChats());
  };

  // Reset all data to factory seed
  const handleResetData = () => {
    localStorage.clear();
    const fresh = initializeStorage();
    setChats(fresh);
    if (fresh.length > 0) {
      handleSelectChat(fresh[0].id);
    }
  };

  // Attach Document
  const handleAttachDoc = (doc: DocumentItem) => {
    if (activeChat) {
      const updatedChat: TopicChat = {
        ...activeChat,
        uploadedDocs: [doc]
      };
      saveChat(updatedChat);
      setChats(getAllChats());
    } else {
      setPendingAttachedDoc(doc);
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={() => {
          setPendingTopicTitle(null);
          setCurrentView('welcome');
        }}
        onDeleteChat={handleDeleteChat}
        currentView={currentView === 'welcome' ? 'lesson' : currentView}
        onNavigateView={(view) => setCurrentView(view)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        isDemoMode={isDemoMode}
      />

      {/* Main Viewport */}
      <div className="main-viewport">
        {activeChat && currentView !== 'welcome' && (
          <Header
            chat={activeChat}
            currentView={currentView}
            onNavigateView={(view) => setCurrentView(view)}
            onOpenMethodModal={() => setIsMethodModalOpen(true)}
            onOpenDocModal={() => setIsDocModalOpen(true)}
          />
        )}

        {/* Viewport Content */}
        <main className="content-scrollable">
          {currentView === 'welcome' && (
            <WelcomeScreen
              onStartTopic={handleStartTopicFromWelcome}
              recentChats={chats}
              onOpenDocModal={() => setIsDocModalOpen(true)}
              attachedDocName={pendingAttachedDoc?.name}
            />
          )}

          {currentView === 'lesson' && activeChat && (
            isLessonLoading ? (
              <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <h3>Adapting curriculum using {activeChat.selectedMethods.teaching}...</h3>
              </div>
            ) : currentLesson ? (
              <LessonWorkspace
                lesson={currentLesson}
                chat={activeChat}
                onStartAssessment={() => setCurrentView('assessment')}
                onChangeMethod={(methodId) => {
                  handleApplyMethods({
                    ...activeChat.selectedMethods,
                    teaching: methodId
                  });
                }}
                onMakeEasier={handleMakeEasier}
                onHarderExample={handleHarderExample}
                onSummarize={handleSummarize}
                onRevise={handleRevise}
                attachedDoc={activeChat.uploadedDocs.length > 0 ? activeChat.uploadedDocs[0] : undefined}
              />
            ) : null
          )}

          {currentView === 'assessment' && activeChat && (
            <AssessmentView
              chat={activeChat}
              questions={generateAssessment(activeChat.title, currentLesson?.title || 'Foundations')}
              onCompleteAssessment={handleCompleteAssessment}
              onAcceptAdaptation={handleAcceptAdaptation}
              onRejectAdaptation={handleRejectAdaptation}
              onOverrideAdaptation={() => setIsMethodModalOpen(true)}
              isPostReteaching={activeChat.adaptationEvents.some(e => e.status === 'accepted')}
            />
          )}

          {currentView === 'dashboard' && activeChat && (
            <DashboardView
              chat={activeChat}
              onNavigateToRevision={() => setCurrentView('flashcards')}
              onRetakeAssessment={() => setCurrentView('assessment')}
            />
          )}

          {currentView === 'flashcards' && activeChat && (
            <FlashcardsView
              chat={activeChat}
              onUpdateFlashcard={handleUpdateFlashcard}
            />
          )}
        </main>
      </div>

      {/* Method Selection Modal */}
      <MethodSelectionModal
        topicTitle={pendingTopicTitle || activeChat?.title || 'New Topic'}
        existingChat={activeChat}
        initialTeachingMethod={activeChat?.selectedMethods.teaching || 'step-by-step'}
        initialPracticeMethod={activeChat?.selectedMethods.practice || 'guided-problem-solving'}
        initialScheduleMethod={activeChat?.selectedMethods.schedule || 'pomodoro'}
        onApply={handleApplyMethods}
        onClose={() => setIsMethodModalOpen(false)}
        isOpen={isMethodModalOpen}
      />

      {/* Document Upload Modal */}
      <DocumentUploadModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        onAttachDocument={handleAttachDoc}
        currentDoc={activeChat?.uploadedDocs.length ? activeChat.uploadedDocs[0] : pendingAttachedDoc || undefined}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onResetData={handleResetData}
        isDemoMode={isDemoMode}
      />
    </div>
  );
};

export default App;
