import React from 'react';
import { Settings, Key, Globe, Sparkles } from 'lucide-react';

export default function Header({ onOpenSettings, language, onChangeLanguage, hasKey }) {
  return (
    <header style={{
      height: 'var(--header-height)',
      borderBottom: '1px solid var(--surface-border)',
      background: 'rgba(10, 10, 26, 0.4)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 var(--space-6)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Branding */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <div style={{
          background: 'var(--gradient-primary)',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-glow-indigo)'
        }}>
          <Sparkles size={16} color="white" />
        </div>
        <div>
          <h1 style={{
            fontSize: 'var(--font-lg)',
            fontWeight: '800',
            background: 'linear-gradient(90deg, #f1f5f9, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
            margin: 0
          }}>
            Edu-Path
          </h1>
          <span style={{
            fontSize: '9px',
            color: 'var(--text-secondary)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            display: 'block',
            lineHeight: '1',
            marginTop: '2px'
          }}>
            Remedial AI Assistant
          </span>
        </div>
      </div>

      {/* Control Area */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        {/* Language Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Globe size={14} color="var(--text-secondary)" />
          <select
            value={language}
            onChange={(e) => onChangeLanguage(e.target.value)}
            style={{
              background: 'var(--surface-glass)',
              border: '1px solid var(--surface-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              fontSize: 'var(--font-xs)',
              padding: '4px 24px 4px 8px',
              outline: 'none',
              cursor: 'pointer',
              fontWeight: '500',
              backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='white' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 4px center',
              backgroundSize: '16px',
              WebkitAppearance: 'none'
            }}
          >
            <option value="English" style={{ background: 'var(--bg-secondary)', color: 'white' }}>English</option>
            <option value="Hinglish" style={{ background: 'var(--bg-secondary)', color: 'white' }}>Hinglish (mix)</option>
            <option value="Hindi" style={{ background: 'var(--bg-secondary)', color: 'white' }}>Hindi (हिंदी)</option>
          </select>
        </div>

        {/* API Key Status Indicator */}
        <button
          onClick={onOpenSettings}
          className="btn btn-ghost"
          style={{
            padding: 'var(--space-2) var(--space-3)',
            height: '34px',
            fontSize: 'var(--font-xs)',
            gap: 'var(--space-2)',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          <Key size={14} color={hasKey ? 'var(--accent-emerald)' : 'var(--accent-rose)'} />
          <span style={{ color: 'var(--text-secondary)' }}>
            {hasKey ? 'API Key Active' : 'Configure Key'}
          </span>
          <Settings size={14} style={{ marginLeft: '4px' }} />
        </button>
      </div>
    </header>
  );
}
