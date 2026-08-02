import { BookOpen, MessageCircle, BrainCircuit, Layers, Compass, Network, BarChart3 } from 'lucide-react';

const navItems = [
  { id: 'context', label: 'Context', icon: BookOpen },
  { id: 'chat', label: 'Chat', icon: MessageCircle },
  { id: 'quiz', label: 'Quiz', icon: BrainCircuit },
  { id: 'flashcards', label: 'Cards', icon: Layers },
  { id: 'roadmap', label: 'Roadmap', icon: Compass },
  { id: 'mindmap', label: 'MindMap', icon: Network },
  { id: 'analytics', label: 'Stats', icon: BarChart3 },
];

export default function MobileNav({ activeView, onViewChange, hasContext }) {
  return (
    <nav className="mobile-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeView === item.id;
        const isDisabled = item.id !== 'context' && !hasContext;

        return (
          <button
            key={item.id}
            className={`mobile-nav-btn ${isActive ? 'mobile-active' : ''} ${isDisabled ? 'mobile-disabled' : ''}`}
            onClick={() => !isDisabled && onViewChange(item.id)}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </button>
        );
      })}

      <style>{`
        .mobile-nav {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(10, 10, 26, 0.95);
          backdrop-filter: blur(16px);
          border-top: 1px solid var(--surface-border);
          padding: var(--space-2) var(--space-4);
          z-index: 100;
          justify-content: space-around;
        }
        .mobile-nav-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: var(--space-2) var(--space-4);
          background: none;
          border: none;
          color: var(--text-muted);
          font-family: var(--font-family);
          font-size: var(--font-xs);
          font-weight: 500;
          cursor: pointer;
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }
        .mobile-active {
          color: var(--accent-indigo) !important;
        }
        .mobile-disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        @media (max-width: 768px) {
          .mobile-nav { display: flex; }
        }
      `}</style>
    </nav>
  );
}
