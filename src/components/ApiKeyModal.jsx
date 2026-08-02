import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, ExternalLink, ShieldAlert, Check, Server, Cpu } from 'lucide-react';

export default function ApiKeyModal({ isOpen, onClose, onSave }) {
  const [apiProvider, setApiProvider] = useState('gemini');
  const [apiKey, setApiKey] = useState('');
  const [customBaseUrl, setCustomBaseUrl] = useState('');
  const [customModel, setCustomModel] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const storedProvider = localStorage.getItem('edu-path-api-provider') || 'gemini';
      const storedKey = localStorage.getItem('edu-path-api-key') || '';
      const storedBaseUrl = localStorage.getItem('edu-path-custom-base-url') || 'https://api.opencode.ai/v1';
      const storedModel = localStorage.getItem('edu-path-custom-model') || 'gemini-2.0-flash';
      
      setApiProvider(storedProvider);
      setApiKey(storedKey);
      setCustomBaseUrl(storedBaseUrl);
      setCustomModel(storedModel);
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

    if (apiProvider === 'gemini') {
      if (!trimmedKey.startsWith('AIzaSy') && !trimmedKey.startsWith('AQ')) {
        setError('Invalid API Key format. It should start with "AIzaSy" or "AQ"');
        return;
      }
      if (trimmedKey.length < 20) {
        setError('API Key is too short');
        return;
      }
    } else {
      if (!customBaseUrl.trim()) {
        setError('Base URL cannot be empty');
        return;
      }
      if (!customModel.trim()) {
        setError('Model name cannot be empty');
        return;
      }
    }

    localStorage.setItem('edu-path-api-provider', apiProvider);
    localStorage.setItem('edu-path-api-key', trimmedKey);
    localStorage.setItem('edu-path-custom-base-url', customBaseUrl.trim());
    localStorage.setItem('edu-path-custom-model', customModel.trim());
    
    onSave(trimmedKey);
    setIsSaved(true);
    setError('');
    setTimeout(() => {
      onClose();
    }, 800);
  };

  return (
    <div className="modal-overlay">
      <div className="glass-card animate-scale-in" style={{ padding: 'var(--space-6)', maxWidth: '520px', width: '90%', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
          <div style={{ background: 'var(--gradient-primary)', padding: '10px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Key size={24} color="white" />
          </div>
          <div>
            <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: '700', color: 'var(--text-primary)' }}>API Configuration</h2>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>Configure provider and credentials</p>
          </div>
        </div>

        {/* Provider Toggle Tabs */}
        <div style={{
          display: 'flex',
          background: 'rgba(0,0,0,0.2)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--surface-border)',
          marginBottom: 'var(--space-4)'
        }}>
          <button
            type="button"
            onClick={() => setApiProvider('gemini')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: apiProvider === 'gemini' ? 'var(--gradient-primary)' : 'transparent',
              color: 'white',
              fontSize: 'var(--font-sm)',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            Google Gemini (Official)
          </button>
          <button
            type="button"
            onClick={() => setApiProvider('custom')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: apiProvider === 'custom' ? 'var(--gradient-primary)' : 'transparent',
              color: 'white',
              fontSize: 'var(--font-sm)',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            Custom Proxy / OpenCode Zen
          </button>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* API Key field */}
          <div>
            <label style={{ display: 'block', fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)', fontWeight: '600' }}>
              API Key
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showKey ? 'text' : 'password'}
                className="input"
                placeholder={apiProvider === 'gemini' ? 'Enter Gemini API Key (AIzaSy...)' : 'Enter custom API token'}
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
          </div>

          {/* Render extra configuration inputs for Custom Provider */}
          {apiProvider === 'custom' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', animation: 'fadeIn 0.2s ease-out' }}>
              {/* Base URL */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)', fontWeight: '600' }}>
                  <Server size={14} color="var(--accent-indigo)" />
                  Base URL (API Endpoint)
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. https://api.opencode.ai/v1"
                  value={customBaseUrl}
                  onChange={(e) => {
                    setCustomBaseUrl(e.target.value);
                    setError('');
                  }}
                />
              </div>

              {/* Custom Model */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)', fontWeight: '600' }}>
                  <Cpu size={14} color="var(--accent-purple)" />
                  Model Name
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. gemini-2.0-flash or custom model identifier"
                  value={customModel}
                  onChange={(e) => {
                    setCustomModel(e.target.value);
                    setError('');
                  }}
                />
              </div>
            </div>
          )}

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--accent-rose)', fontSize: 'var(--font-xs)', background: 'rgba(244,63,94,0.1)', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-sm)' }}>
              <ShieldAlert size={16} />
              <span>{error}</span>
            </div>
          )}

          {isSaved && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--accent-emerald)', fontSize: 'var(--font-xs)', background: 'rgba(16,185,129,0.1)', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-sm)' }}>
              <Check size={16} />
              <span>Configuration saved successfully! Closing...</span>
            </div>
          )}

          <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={isSaved}
            >
              {isSaved ? 'Saved' : 'Save Config'}
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
          {apiProvider === 'gemini' ? (
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
                fontWeight: '600'
              }}
            >
              Get a free API key from Google AI Studio
              <ExternalLink size={12} />
            </a>
          ) : (
            <a
              href="https://opencode.ai"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-1)',
                fontSize: 'var(--font-xs)',
                color: 'var(--accent-purple)',
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              Learn more about OpenCode Zen
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
