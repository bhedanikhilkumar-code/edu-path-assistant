import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Lightbulb, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { askDoubt } from '../services/gemini';

const SUGGESTED_QUESTIONS = [
  'Explain the main concept in simple terms',
  'What are the key differences between the topics mentioned?',
  'Give me a real-world analogy for this concept',
  'What are the most important points to remember?',
];

export default function ChatInterface({ context, language }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    const userMessage = { role: 'user', content: text.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError('');

    try {
      const response = await askDoubt(context, text.trim(), language);
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestionClick = (q) => {
    sendMessage(q);
  };

  return (
    <div className="chat-interface animate-fade-in">
      <div className="chat-messages">
        {messages.length === 0 && !isLoading && (
          <div className="chat-empty">
            <div className="empty-icon-wrapper">
              <Bot size={36} />
            </div>
            <h3>Ready to Help! 🎓</h3>
            <p>Ask me anything about your course material. I'll explain it in simple, easy-to-understand language.</p>
            <div className="suggestions">
              <span className="suggestions-label">
                <Lightbulb size={14} /> Try asking:
              </span>
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  className="suggestion-chip"
                  onClick={() => handleSuggestionClick(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message message-${msg.role}`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="message-avatar">
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className="message-bubble">
              {msg.role === 'assistant' ? (
                <div className="markdown-content">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <p>{msg.content}</p>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="message message-assistant animate-fade-in">
            <div className="message-avatar">
              <Bot size={16} />
            </div>
            <div className="message-bubble">
              <div className="typing-dots">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="chat-error animate-fade-in">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-bar" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          className="input chat-input"
          placeholder="Ask your doubt here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          autoFocus
        />
        <button
          type="submit"
          className="btn btn-primary btn-icon send-btn"
          disabled={!input.trim() || isLoading}
        >
          <Send size={18} />
        </button>
      </form>

      <style>{`
        .chat-interface {
          display: flex;
          flex-direction: column;
          height: calc(100vh - var(--header-height));
          max-width: 900px;
          margin: 0 auto;
          width: 100%;
        }
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: var(--space-6);
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .chat-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          flex: 1;
          padding: var(--space-8);
          animation: fadeIn 0.5s ease-out;
        }
        .empty-icon-wrapper {
          width: 72px;
          height: 72px;
          border-radius: var(--radius-xl);
          background: var(--gradient-subtle);
          border: 1px solid rgba(99,102,241,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-indigo);
          margin-bottom: var(--space-5);
          animation: float 3s ease-in-out infinite;
        }
        .chat-empty h3 {
          font-size: var(--font-xl);
          font-weight: 700;
          margin-bottom: var(--space-2);
        }
        .chat-empty p {
          color: var(--text-secondary);
          font-size: var(--font-sm);
          max-width: 400px;
          margin-bottom: var(--space-6);
        }
        .suggestions {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
          justify-content: center;
          max-width: 500px;
        }
        .suggestions-label {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-1);
          font-size: var(--font-xs);
          color: var(--text-muted);
          margin-bottom: var(--space-1);
        }
        .suggestion-chip {
          padding: var(--space-2) var(--space-4);
          background: var(--surface-glass);
          border: 1px solid var(--surface-border);
          border-radius: var(--radius-full);
          color: var(--text-secondary);
          font-size: var(--font-xs);
          font-family: var(--font-family);
          cursor: pointer;
          transition: all var(--transition-base);
        }
        .suggestion-chip:hover {
          background: var(--gradient-subtle);
          border-color: rgba(99,102,241,0.3);
          color: var(--text-primary);
          transform: translateY(-1px);
        }

        /* Messages */
        .message {
          display: flex;
          gap: var(--space-3);
          animation: slideInUp 0.3s ease-out forwards;
          max-width: 85%;
        }
        .message-user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }
        .message-assistant {
          align-self: flex-start;
        }
        .message-avatar {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .message-user .message-avatar {
          background: var(--gradient-primary);
          color: white;
        }
        .message-assistant .message-avatar {
          background: var(--surface-glass-active);
          color: var(--accent-indigo);
          border: 1px solid var(--surface-border);
        }
        .message-bubble {
          padding: var(--space-4) var(--space-5);
          border-radius: var(--radius-lg);
          line-height: 1.7;
          font-size: var(--font-base);
        }
        .message-user .message-bubble {
          background: var(--gradient-primary);
          color: white;
          border-bottom-right-radius: var(--space-1);
        }
        .message-assistant .message-bubble {
          background: var(--surface-glass);
          border: 1px solid var(--surface-border);
          color: var(--text-primary);
          border-bottom-left-radius: var(--space-1);
        }

        .chat-error {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-3) var(--space-4);
          background: rgba(244,63,94,0.1);
          border: 1px solid rgba(244,63,94,0.2);
          border-radius: var(--radius-md);
          color: var(--accent-rose);
          font-size: var(--font-sm);
        }

        /* Input Bar */
        .chat-input-bar {
          display: flex;
          gap: var(--space-3);
          padding: var(--space-4) var(--space-6);
          border-top: 1px solid var(--surface-border);
          background: rgba(10, 10, 26, 0.6);
          backdrop-filter: blur(12px);
        }
        .chat-input {
          flex: 1;
          border-radius: var(--radius-lg);
          padding: var(--space-4) var(--space-5);
        }
        .send-btn {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-lg);
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}
