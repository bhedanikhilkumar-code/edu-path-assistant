import { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import ContextPanel from './components/ContextPanel';
import ChatInterface from './components/ChatInterface';
import QuizModule from './components/QuizModule';
import ApiKeyModal from './components/ApiKeyModal';
import { initializeGemini } from './services/gemini';

const API_KEY_STORAGE = 'edupath_gemini_key';
const CONTEXT_STORAGE = 'edupath_context';

export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(API_KEY_STORAGE) || '');
  const [showApiModal, setShowApiModal] = useState(false);
  const [activeView, setActiveView] = useState('context');
  const [context, setContext] = useState(() => localStorage.getItem(CONTEXT_STORAGE) || '');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Initialize Gemini on load if key exists
  useEffect(() => {
    if (apiKey) {
      initializeGemini(apiKey);
    } else {
      setShowApiModal(true);
    }
  }, [apiKey]);

  const handleSaveApiKey = (key) => {
    localStorage.setItem(API_KEY_STORAGE, key);
    setApiKey(key);
    initializeGemini(key);
    setShowApiModal(false);
  };

  const handleSaveContext = (text) => {
    setContext(text);
    if (text) {
      localStorage.setItem(CONTEXT_STORAGE, text);
    } else {
      localStorage.removeItem(CONTEXT_STORAGE);
    }
  };

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  const hasContext = context.trim().length > 0;

  return (
    <div className="app">
      <Header onSettingsClick={() => setShowApiModal(true)} />

      <div className="app-layout">
        <Sidebar
          activeView={activeView}
          onViewChange={handleViewChange}
          hasContext={hasContext}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <main className="app-main">
          {activeView === 'context' && (
            <ContextPanel context={context} onSaveContext={handleSaveContext} />
          )}
          {activeView === 'chat' && (
            <ChatInterface context={context} />
          )}
          {activeView === 'quiz' && (
            <QuizModule context={context} />
          )}
        </main>
      </div>

      <MobileNav
        activeView={activeView}
        onViewChange={handleViewChange}
        hasContext={hasContext}
      />

      {showApiModal && (
        <ApiKeyModal onSave={handleSaveApiKey} />
      )}

      <style>{`
        .app {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .app-layout {
          display: flex;
          flex: 1;
        }
        .app-main {
          flex: 1;
          min-width: 0;
          overflow-y: auto;
        }
        @media (max-width: 768px) {
          .app-main {
            padding-bottom: 72px;
          }
        }
      `}</style>
    </div>
  );
}
