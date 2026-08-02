import React, { useState } from 'react';
import { BookOpen, MessageSquare, HelpCircle, Layers, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Sidebar({ currentView, onViewChange, hasContext }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'context', label: 'Course Context', icon: BookOpen, description: 'Paste syllabus/content' },
    { id: 'chat', label: 'Doubt Chatbot', icon: MessageSquare, description: 'Ask questions' },
    { id: 'quiz', label: 'One-Click Quiz', icon: HelpCircle, description: 'Test your learning' },
    { id: 'flashcards', label: 'Revision Cards', icon: Layers, description: '3D Concept deck' },
  ];

  return (
    <aside style={{
      width: isCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
      height: 'calc(100vh - var(--header-height))',
      borderRight: '1px solid var(--surface-border)',
      background: 'rgba(15, 14, 36, 0.6)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      transition: 'width var(--transition-spring)',
      zIndex: 90,
      flexShrink: 0
    }}>
      {/* Navigation Items */}
      <nav style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', flexGrow: 1 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className="btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                gap: 'var(--space-3)',
                width: '100%',
                padding: 'var(--space-3) var(--space-4)',
                background: isActive ? 'var(--gradient-glow)' : 'transparent',
                border: '1px solid',
                borderColor: isActive ? 'var(--surface-border-hover)' : 'transparent',
                borderRadius: 'var(--radius-md)',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                boxShadow: isActive ? 'var(--shadow-glow-indigo)' : 'none',
                cursor: 'pointer',
                textAlign: 'left',
                position: 'relative',
                transition: 'all var(--transition-base)'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.background = 'var(--surface-glass)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <Icon size={20} style={{
                color: isActive ? 'var(--accent-indigo)' : 'inherit',
                filter: isActive ? 'drop-shadow(0 0 4px var(--accent-indigo))' : 'none',
                flexShrink: 0
              }} />
              
              {!isCollapsed && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: '1.2' }}>
                  <span style={{ fontSize: 'var(--font-sm)', fontWeight: '600' }}>{item.label}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontWeight: 'normal', marginTop: '2px' }}>{item.description}</span>
                </div>
              )}

              {/* View Status indicator for Context (e.g. green dot/badge) */}
              {item.id === 'context' && (
                <div style={{
                  position: 'absolute',
                  right: isCollapsed ? '4px' : '12px',
                  top: isCollapsed ? '4px' : '50%',
                  transform: isCollapsed ? 'none' : 'translateY(-50%)'
                }}>
                  {hasContext ? (
                    <CheckCircle2 size={12} color="var(--accent-emerald)" />
                  ) : (
                    <AlertCircle size={12} color="var(--accent-amber)" />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Context Badge in Collapsed State */}
      {!isCollapsed && (
        <div style={{
          padding: 'var(--space-4)',
          borderTop: '1px solid var(--surface-border)',
          background: 'rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: 'var(--space-2) var(--space-3)',
            borderRadius: 'var(--radius-sm)',
            background: hasContext ? 'rgba(16,185,129,0.05)' : 'rgba(245,158,11,0.05)',
            border: `1px solid ${hasContext ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)'}`
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: hasContext ? 'var(--accent-emerald)' : 'var(--accent-amber)',
              boxShadow: `0 0 8px ${hasContext ? 'var(--accent-emerald)' : 'var(--accent-amber)'}`
            }} />
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '500' }}>
              {hasContext ? 'Context Loaded' : 'No Context Pasted'}
            </span>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '-14px',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          border: '1px solid var(--surface-border)',
          background: 'var(--bg-secondary)',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-md)',
          zIndex: 100,
          transition: 'all var(--transition-base)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--text-primary)';
          e.currentTarget.style.borderColor = 'var(--surface-border-hover)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--text-secondary)';
          e.currentTarget.style.borderColor = 'var(--surface-border)';
        }}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
}
