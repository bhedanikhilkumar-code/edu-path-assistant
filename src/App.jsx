import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import ContextPanel from './components/ContextPanel';
import ChatInterface from './components/ChatInterface';
import QuizModule from './components/QuizModule';
import ApiKeyModal from './components/ApiKeyModal';
import { initializeGemini } from './services/gemini';

const API_KEY_STORAGE = 'edu-path-api-key';
const CONTEXT_STORAGE = 'edu-path-context';
const HISTORY_STORAGE = 'edu-path-chat-history';
const LANGUAGE_STORAGE = 'edu-path-language';

export default function App() {
  const [currentView, setCurrentView] = useState('context');
  const [contextText, setContextText] = useState(() => localStorage.getItem(CONTEXT_STORAGE) || '');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(API_KEY_STORAGE) || '');
  const [language, setLanguage] = useState(() => localStorage.getItem(LANGUAGE_STORAGE) || 'English');
  const [chatHistory, setChatHistory] = useState([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Load initial configurations from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem(HISTORY_STORAGE);
    if (savedHistory) {
      try {
        setChatHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error parsing chat history:', e);
      }
    }

    if (apiKey) {
      initializeGemini(apiKey);
    } else {
      setIsSettingsOpen(true);
    }
  }, [apiKey]);

  const handleSaveContext = (newContext) => {
    setContextText(newContext);
    localStorage.setItem(CONTEXT_STORAGE, newContext);
  };

  const handleSaveApiKey = (newKey) => {
    setApiKey(newKey);
    localStorage.setItem(API_KEY_STORAGE, newKey);
    initializeGemini(newKey);
    setIsSettingsOpen(false);
  };

  const handleChangeLanguage = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem(LANGUAGE_STORAGE, newLang);
  };

  const handleAddMessage = (newMsg) => {
    const updatedHistory = [...chatHistory, newMsg];
    setChatHistory(updatedHistory);
    localStorage.setItem(HISTORY_STORAGE, JSON.stringify(updatedHistory));
  };

  const handleClearHistory = () => {
    setChatHistory([]);
    localStorage.removeItem(HISTORY_STORAGE);
  };

  const hasContext = contextText.trim().length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      {/* Header */}
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        language={language}
        onChangeLanguage={handleChangeLanguage}
        hasKey={!!apiKey}
      />

      <div style={{ display: 'flex', flexGrow: 1, position: 'relative' }}>
        {/* Sidebar */}
        <Sidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          hasContext={hasContext}
        />

        {/* Main Content Area */}
        <main style={{
          flexGrow: 1,
          padding: 'var(--space-6)',
          overflowY: 'auto',
          position: 'relative',
          zIndex: 1,
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%'
        }}>
          {currentView === 'context' && (
            <ContextPanel
              contextText={contextText}
              onSaveContext={handleSaveContext}
            />
          )}
          {currentView === 'chat' && (
            <ChatInterface
              context={contextText}
            />
          )}
          {currentView === 'quiz' && (
            <QuizModule
              context={contextText}
            />
          )}
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav
        activeView={currentView}
        onViewChange={setCurrentView}
        hasContext={hasContext}
      />

      {/* Settings Modal */}
      <ApiKeyModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveApiKey}
      />
    </div>
  );
}
