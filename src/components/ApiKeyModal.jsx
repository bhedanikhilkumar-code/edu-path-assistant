import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, ExternalLink, ShieldAlert, Check } from 'lucide-react';

export default function ApiKeyModal({ isOpen, onClose, onSave }) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const storedKey = localStorage.getItem('edu-path-api-key') || '';
      setApiKey(storedKey);
      setError('');
      setIsSaved(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    const trimmedKey = apiKey.trim();

    if (!trimmedKey) {
      setError('API Key cannot be empty');
      return;
    }

    // Gemini API keys usually start with AIzaSy and are about 39 characters
    if (!trimmedKey.startsWith('AIzaSy')) {
      setError('Invalid API Key format. It should start with "AIzaSy"');
      return;
    }

    if (trimmedKey.length < 30) {
      setError('API Key is too short');
      return;
    }

    localStorage.setItem('edu-path-api-key', trimmedKey);
    onSave(trimmedKey);
    setIsSaved(true);
    setError('');
    setTimeout(() => {
      onClose();
    }, 800);
  };

  return (
    <div className="modal-overlay">
      <div className="glass-card animate-scale-in" style={{ padding: 'var(--space-6)', maxWidth: '480px', width: '90%', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
          <div style={{ background: 'var(--gradient-primary)', padding: '10px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Key size={24} color="white" />
          </div>
          <div>
            <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: '700', color: 'var(--text-primary)' }}>Gemini API Configuration</h2>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>Secure, client-side only storage</p>
          </div>
        </div>

        <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-5)', lineHeight: '1.6' }}>
          Edu-Path requires a Gemini API Key to explain concepts and generate interactive quizzes. Your key is stored locally in your browser's <code>localStorage</code> and never sent to any backend servers.
        </p>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ position: 'relative' }}>
            <input
              type={showKey ? 'text' : 'password'}
              className="input"
              placeholder="Enter your Gemini API Key (AIzaSy...)"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setError('');
              }}
              style={{ paddingRight: '48px' }}
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--accent-rose)', fontSize: 'var(--font-xs)', background: 'rgba(244,63,94,0.1)', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-sm)' }}>
              <ShieldAlert size={16} />
              <span>{error}</span>
            </div>
          )}

          {isSaved && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--accent-emerald)', fontSize: 'var(--font-xs)', background: 'rgba(16,185,129,0.1)', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-sm)' }}>
              <Check size={16} />
              <span>API Key saved successfully! Closing...</span>
            </div>
          )}

          <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={isSaved}
            >
              {isSaved ? 'Saved' : 'Save Key'}
            </button>
            
            {localStorage.getItem('edu-path-api-key') && (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={onClose}
                disabled={isSaved}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div style={{ marginTop: 'var(--space-5)', borderTop: '1px solid var(--surface-border)', paddingTop: 'var(--space-4)', display: 'flex', justifyContent: 'center' }}>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-1)',
              fontSize: 'var(--font-xs)',
              color: 'var(--accent-indigo)',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'color var(--transition-fast)'
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--accent-violet)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--accent-indigo)'}
          >
            Get a free API key from Google AI Studio
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
