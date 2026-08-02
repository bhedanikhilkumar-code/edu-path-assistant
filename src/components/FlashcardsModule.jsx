import React, { useState } from 'react';
import { Layers, RotateCw, Sparkles, Loader2, ChevronLeft, ChevronRight, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { generateFlashcards, getFriendlyErrorMessage } from '../services/gemini';

export default function FlashcardsModule({ context }) {
  const [cards, setCards] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [masteredIds, setMasteredIds] = useState(new Set());
  const [reviewIds, setReviewIds] = useState(new Set());

  const handleGenerate = async () => {
    if (!context || !context.trim()) {
      setError("No course context found! Please go to the 'Course Context' tab and save your lecture notes/materials first.");
      return;
    }

    setIsGenerating(true);
    setError('');
    setCards(null);
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredIds(new Set());
    setReviewIds(new Set());

    try {
      const generatedCards = await generateFlashcards(context);
      setCards(generatedCards);
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNext = () => {
    if (!cards) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    if (!cards) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const markMastered = (id) => {
    setMasteredIds((prev) => new Set(prev).add(id));
    setReviewIds((prev) => {
      const updated = new Set(prev);
      updated.delete(id);
      return updated;
    });
    handleNext();
  };

  const markReview = (id) => {
    setReviewIds((prev) => new Set(prev).add(id));
    setMasteredIds((prev) => {
      const updated = new Set(prev);
      updated.delete(id);
      return updated;
    });
    handleNext();
  };

  const currentCard = cards ? cards[currentIndex] : null;

  return (
    <div className="flashcards-module animate-fade-in">
      {/* Start state */}
      {!cards && !isGenerating && (
        <div className="flashcards-start">
          <div className="flashcards-start-icon">
            <Layers size={40} />
          </div>
          <h2>AI Revision Flashcards</h2>
          <p>Generate smart, 3D interactive flashcards to memorize core concepts and formulas from your course notes.</p>
          <button className="btn btn-primary flashcards-btn" onClick={handleGenerate}>
            <Sparkles size={18} />
            Generate Flashcard Deck
          </button>
          {error && (
            <div className="flashcards-error">
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}
        </div>
      )}

      {/* Loading state */}
      {isGenerating && (
        <div className="flashcards-loading">
          <Loader2 size={40} className="spinning" />
          <h3>Building Your Revision Deck...</h3>
          <p>Analyzing course context & extracting core terms</p>
        </div>
      )}

      {/* Flashcard deck view */}
      {cards && currentCard && (
        <div className="deck-container">
          <div className="deck-header">
            <div className="progress-text">
              <span>Card {currentIndex + 1} of {cards.length}</span>
              <span className="stats-badges">
                <span className="badge badge-success">✓ {masteredIds.size} Mastered</span>
                <span className="badge badge-warning">⚡ {reviewIds.size} Need Review</span>
              </span>
            </div>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
              />
            </div>
          </div>

          {/* 3D Flip Card */}
          <div
            className={`flip-card ${isFlipped ? 'flipped' : ''}`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className="flip-card-inner">
              {/* Front side */}
              <div className="flip-card-front glass-card">
                <span className="card-label">CONCEPT / QUESTION</span>
                <h3>{currentCard.concept}</h3>
                <div className="flip-hint">
                  <RotateCw size={14} /> Click card to flip answer
                </div>
              </div>

              {/* Back side */}
              <div className="flip-card-back glass-card">
                <span className="card-label">EXPLANATION & TAKEAWAY</span>
                <p className="card-explanation">{currentCard.explanation}</p>
                <div className="key-takeaway">
                  <strong>💡 Key Memory Hook:</strong>
                  <p>{currentCard.keyTakeaway}</p>
                </div>
                <div className="flip-hint">
                  <RotateCw size={14} /> Click to flip back
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="deck-actions">
            <button className="btn btn-ghost btn-icon" onClick={handlePrev} title="Previous Card">
              <ChevronLeft size={20} />
            </button>

            <div className="grade-buttons">
              <button
                className={`btn btn-secondary ${reviewIds.has(currentCard.id) ? 'active-review' : ''}`}
                onClick={(e) => { e.stopPropagation(); markReview(currentCard.id); }}
              >
                <AlertTriangle size={16} /> Need Practice
              </button>
              <button
                className={`btn btn-success ${masteredIds.has(currentCard.id) ? 'active-mastered' : ''}`}
                onClick={(e) => { e.stopPropagation(); markMastered(currentCard.id); }}
              >
                <CheckCircle size={16} /> Mastered
              </button>
            </div>

            <button className="btn btn-ghost btn-icon" onClick={handleNext} title="Next Card">
              <ChevronRight size={20} />
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-6)' }}>
            <button className="btn btn-ghost" onClick={handleGenerate}>
              <RefreshCw size={14} /> Generate New Deck
            </button>
          </div>
        </div>
      )}

      <style>{`
        .flashcards-module {
          max-width: 750px;
          margin: 0 auto;
          padding: var(--space-6);
        }
        .flashcards-start {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: var(--space-12) var(--space-6);
        }
        .flashcards-start-icon {
          width: 80px;
          height: 80px;
          border-radius: var(--radius-xl);
          background: var(--gradient-subtle);
          border: 1px solid rgba(99,102,241,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-indigo);
          margin-bottom: var(--space-6);
          animation: float 3s ease-in-out infinite;
        }
        .flashcards-start h2 {
          font-size: var(--font-2xl);
          font-weight: 700;
          margin-bottom: var(--space-2);
        }
        .flashcards-start p {
          color: var(--text-secondary);
          font-size: var(--font-base);
          max-width: 440px;
          margin-bottom: var(--space-8);
        }
        .flashcards-btn {
          padding: var(--space-4) var(--space-8);
          font-size: var(--font-md);
        }
        .flashcards-error {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-top: var(--space-4);
          color: var(--accent-rose);
          font-size: var(--font-sm);
        }

        .flashcards-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: var(--space-12);
          color: var(--accent-indigo);
        }
        .flashcards-loading .spinning { animation: spin 1s linear infinite; }
        .flashcards-loading h3 {
          margin-top: var(--space-5);
          font-size: var(--font-lg);
          color: var(--text-primary);
        }
        .flashcards-loading p {
          color: var(--text-secondary);
          font-size: var(--font-sm);
          margin-top: var(--space-2);
        }

        /* 3D Deck styles */
        .deck-container {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }
        .deck-header {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }
        .progress-text {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: var(--font-sm);
          font-weight: 600;
          color: var(--text-secondary);
        }
        .stats-badges {
          display: flex;
          gap: var(--space-2);
        }
        .badge {
          font-size: 11px;
          padding: 3px 8px;
          border-radius: var(--radius-full);
          font-weight: 600;
        }
        .badge-success { background: rgba(16,185,129,0.15); color: var(--accent-emerald); }
        .badge-warning { background: rgba(245,158,11,0.15); color: var(--accent-amber); }

        .progress-bar-bg {
          height: 6px;
          background: rgba(255,255,255,0.08);
          border-radius: 3px;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          background: var(--gradient-primary);
          transition: width 0.3s ease;
        }

        /* 3D Flip Card Animation */
        .flip-card {
          background-color: transparent;
          width: 100%;
          height: 320px;
          perspective: 1000px;
          cursor: pointer;
        }
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
        }
        .flip-card.flipped .flip-card-inner {
          transform: rotateY(180deg);
        }
        .flip-card-front, .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--space-8);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-lg);
        }
        .flip-card-front {
          background: var(--surface-glass);
          border: 1px solid var(--surface-border);
        }
        .flip-card-back {
          background: var(--gradient-subtle);
          border: 1px solid rgba(99,102,241,0.3);
          transform: rotateY(180deg);
        }
        .card-label {
          font-size: 10px;
          letter-spacing: 1px;
          font-weight: 700;
          color: var(--accent-indigo);
          margin-bottom: var(--space-4);
          text-transform: uppercase;
        }
        .flip-card-front h3 {
          font-size: var(--font-xl);
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.4;
        }
        .card-explanation {
          font-size: var(--font-base);
          color: var(--text-primary);
          line-height: 1.6;
          margin-bottom: var(--space-4);
        }
        .key-takeaway {
          background: rgba(0,0,0,0.25);
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-md);
          font-size: var(--font-xs);
          color: var(--text-secondary);
          text-align: left;
          width: 100%;
          border: 1px solid var(--surface-border);
        }
        .key-takeaway strong { color: var(--accent-amber); }
        .flip-hint {
          margin-top: auto;
          display: flex;
          align-items: center;
          gap: var(--space-1);
          font-size: 11px;
          color: var(--text-tertiary);
        }

        .deck-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-4);
        }
        .grade-buttons {
          display: flex;
          gap: var(--space-3);
          flex: 1;
          justify-content: center;
        }
        .btn-success {
          background: rgba(16,185,129,0.15);
          color: var(--accent-emerald);
          border: 1px solid rgba(16,185,129,0.3);
        }
        .btn-success:hover {
          background: rgba(16,185,129,0.25);
        }
        .btn-secondary {
          background: rgba(245,158,11,0.15);
          color: var(--accent-amber);
          border: 1px solid rgba(245,158,11,0.3);
        }
        .btn-secondary:hover {
          background: rgba(245,158,11,0.25);
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
