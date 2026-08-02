import { useState } from 'react';
import { BrainCircuit, Loader2, RefreshCw, CheckCircle2, XCircle, Trophy, ChevronRight, Sparkles } from 'lucide-react';
import { generateQuiz, evaluateAnswers, getFriendlyErrorMessage } from '../services/gemini';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function QuizModule({ context }) {
  const [questions, setQuestions] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError('');
    setQuestions(null);
    setResults(null);
    setUserAnswers({});

    try {
      const quiz = await generateQuiz(context);
      setQuestions(quiz);
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectAnswer = (qId, optionIndex) => {
    if (results) return; // Don't allow changes after evaluation
    setUserAnswers((prev) => ({ ...prev, [qId]: optionIndex }));
  };

  const handleSubmit = () => {
    if (!questions) return;
    const evalResults = evaluateAnswers(questions, userAnswers);
    setResults(evalResults);
  };

  const allAnswered = questions && Object.keys(userAnswers).length === questions.length;

  return (
    <div className="quiz-module animate-fade-in">
      {/* Initial State */}
      {!questions && !isGenerating && (
        <div className="quiz-start">
          <div className="quiz-start-icon">
            <BrainCircuit size={40} />
          </div>
          <h2>Conceptual Quiz</h2>
          <p>Test your understanding with AI-generated MCQs based on your course material.</p>
          <button className="btn btn-primary quiz-generate-btn" onClick={handleGenerate}>
            <Sparkles size={18} />
            Generate 3 Questions
          </button>
          {error && (
            <div className="quiz-error">
              <XCircle size={16} />
              <span>{error}</span>
            </div>
          )}
        </div>
      )}

      {/* Loading */}
      {isGenerating && (
        <div className="quiz-loading">
          <Loader2 size={40} className="spinning" />
          <h3>Generating Questions...</h3>
          <p>AI is creating thoughtful MCQs from your course material</p>
        </div>
      )}

      {/* Questions */}
      {questions && (
        <div className="quiz-content">
          {/* Score Banner */}
          {results && (
            <div className={`score-banner ${results.percentage >= 70 ? 'score-great' : results.percentage >= 40 ? 'score-ok' : 'score-low'}`}>
              <div className="score-ring">
                <svg viewBox="0 0 80 80" className="score-svg">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                  <circle
                    cx="40" cy="40" r="34" fill="none"
                    stroke="currentColor" strokeWidth="6"
                    strokeDasharray={`${(results.percentage / 100) * 213.6} 213.6`}
                    strokeLinecap="round"
                    transform="rotate(-90 40 40)"
                    className="score-progress"
                  />
                </svg>
                <span className="score-text">{results.percentage}%</span>
              </div>
              <div className="score-details">
                <h3>
                  <Trophy size={20} />
                  {results.percentage >= 70 ? 'Excellent!' : results.percentage >= 40 ? 'Good Effort!' : 'Keep Practicing!'}
                </h3>
                <p>You got {results.score} out of {results.total} questions correct</p>
              </div>
            </div>
          )}

          {/* Question Cards */}
          {questions.map((q, i) => {
            const result = results?.results?.find((r) => r.id === q.id);
            return (
              <div
                key={q.id}
                className={`question-card glass-card ${result ? (result.isCorrect ? 'q-correct' : 'q-wrong') : ''}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="q-header">
                  <span className="q-number">Q{i + 1}</span>
                </div>
                <p className="q-text">{q.question}</p>

                <div className="q-options">
                  {q.options.map((optionText, optIdx) => {
                    const isSelected = userAnswers[q.id] === optIdx;
                    const isCorrectOption = result && optIdx === q.correctAnswerIndex;
                    const isWrongSelected = result && isSelected && !result.isCorrect;

                    return (
                      <button
                        key={optIdx}
                        className={`option-btn ${isSelected ? 'option-selected' : ''} ${isCorrectOption ? 'option-correct' : ''} ${isWrongSelected ? 'option-wrong' : ''}`}
                        onClick={() => handleSelectAnswer(q.id, optIdx)}
                        disabled={!!results}
                      >
                        <span className="option-key">{OPTION_LABELS[optIdx]}</span>
                        <span className="option-text">{optionText}</span>
                        {isCorrectOption && <CheckCircle2 size={16} className="option-icon-right" />}
                        {isWrongSelected && <XCircle size={16} className="option-icon-wrong" />}
                      </button>
                    );
                  })}
                </div>

                {result && (
                  <div className={`q-explanation ${result.isCorrect ? 'explain-correct' : 'explain-wrong'}`}>
                    <div className="explain-header">
                      {result.isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                      <strong>{result.isCorrect ? 'Correct!' : `Incorrect — Answer: ${OPTION_LABELS[q.correctAnswerIndex]}`}</strong>
                    </div>
                    <p>{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Actions */}
          <div className="quiz-actions">
            {!results ? (
              <button
                className="btn btn-primary quiz-submit-btn"
                onClick={handleSubmit}
                disabled={!allAnswered}
              >
                <ChevronRight size={18} /> Submit Answers
              </button>
            ) : (
              <button className="btn btn-primary quiz-submit-btn" onClick={handleGenerate}>
                <RefreshCw size={18} />
                Generate New Quiz
              </button>
            )}
            {!results && !allAnswered && questions && (
              <p className="quiz-hint">
                Answer all {questions.length} questions to submit
              </p>
            )}
          </div>
        </div>
      )}

      <style>{`
        .quiz-module {
          max-width: 800px;
          margin: 0 auto;
          padding: var(--space-8);
        }

        /* Start State */
        .quiz-start {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: var(--space-12) var(--space-6);
        }
        .quiz-start-icon {
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
        .quiz-start h2 {
          font-size: var(--font-2xl);
          font-weight: 700;
          margin-bottom: var(--space-2);
        }
        .quiz-start p {
          color: var(--text-secondary);
          font-size: var(--font-base);
          max-width: 420px;
          margin-bottom: var(--space-8);
        }
        .quiz-generate-btn {
          padding: var(--space-4) var(--space-8);
          font-size: var(--font-md);
        }
        .quiz-error {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-top: var(--space-4);
          color: var(--accent-rose);
          font-size: var(--font-sm);
        }

        /* Loading */
        .quiz-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: var(--space-12);
          color: var(--accent-indigo);
        }
        .quiz-loading .spinning { animation: spin 1s linear infinite; }
        .quiz-loading h3 {
          margin-top: var(--space-5);
          font-size: var(--font-lg);
          color: var(--text-primary);
        }
        .quiz-loading p {
          color: var(--text-secondary);
          font-size: var(--font-sm);
          margin-top: var(--space-2);
        }

        /* Score Banner */
        .score-banner {
          display: flex;
          align-items: center;
          gap: var(--space-6);
          padding: var(--space-6);
          border-radius: var(--radius-xl);
          margin-bottom: var(--space-6);
          animation: scaleIn 0.4s ease-out;
        }
        .score-great {
          background: linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(6,182,212,0.1) 100%);
          border: 1px solid rgba(16,185,129,0.25);
          color: var(--accent-emerald);
        }
        .score-ok {
          background: linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(251,191,36,0.1) 100%);
          border: 1px solid rgba(245,158,11,0.25);
          color: var(--accent-amber);
        }
        .score-low {
          background: linear-gradient(135deg, rgba(244,63,94,0.15) 0%, rgba(251,113,133,0.1) 100%);
          border: 1px solid rgba(244,63,94,0.25);
          color: var(--accent-rose);
        }
        .score-ring {
          position: relative;
          width: 80px;
          height: 80px;
          flex-shrink: 0;
        }
        .score-svg { width: 100%; height: 100%; }
        .score-progress {
          transition: stroke-dasharray 1s ease-out;
        }
        .score-text {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--font-xl);
          font-weight: 800;
          color: var(--text-primary);
        }
        .score-details h3 {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--font-lg);
          color: var(--text-primary);
        }
        .score-details p {
          font-size: var(--font-sm);
          color: var(--text-secondary);
          margin-top: var(--space-1);
        }

        /* Question Cards */
        .quiz-content {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }
        .question-card {
          padding: var(--space-6);
          animation: slideInUp 0.4s ease-out forwards;
        }
        .q-correct { border-color: rgba(16,185,129,0.25) !important; }
        .q-wrong { border-color: rgba(244,63,94,0.25) !important; }
        .q-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-3);
        }
        .q-number {
          font-size: var(--font-xs);
          font-weight: 700;
          color: var(--accent-indigo);
          background: rgba(99,102,241,0.15);
          padding: var(--space-1) var(--space-3);
          border-radius: var(--radius-full);
        }
        .q-text {
          font-size: var(--font-md);
          font-weight: 600;
          line-height: 1.6;
          margin-bottom: var(--space-5);
          color: var(--text-primary);
        }
        .q-options {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }
        .option-btn {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          background: var(--surface-glass);
          border: 1px solid var(--surface-border);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-family: var(--font-family);
          font-size: var(--font-sm);
          cursor: pointer;
          text-align: left;
          transition: all var(--transition-base);
          width: 100%;
        }
        .option-btn:hover:not(:disabled) {
          background: var(--surface-glass-hover);
          border-color: var(--surface-border-hover);
          color: var(--text-primary);
        }
        .option-btn:disabled { cursor: default; }
        .option-selected {
          background: var(--gradient-subtle) !important;
          border-color: rgba(99,102,241,0.35) !important;
          color: var(--text-primary) !important;
        }
        .option-correct {
          background: rgba(16,185,129,0.1) !important;
          border-color: rgba(16,185,129,0.35) !important;
          color: var(--accent-emerald) !important;
        }
        .option-wrong {
          background: rgba(244,63,94,0.1) !important;
          border-color: rgba(244,63,94,0.35) !important;
          color: var(--accent-rose) !important;
        }
        .option-key {
          width: 28px;
          height: 28px;
          border-radius: var(--radius-sm);
          background: rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: var(--font-xs);
          flex-shrink: 0;
        }
        .option-text { flex: 1; }
        .option-icon-right { color: var(--accent-emerald); margin-left: auto; }
        .option-icon-wrong { color: var(--accent-rose); margin-left: auto; }

        /* Explanation */
        .q-explanation {
          margin-top: var(--space-4);
          padding: var(--space-4);
          border-radius: var(--radius-md);
          font-size: var(--font-sm);
          line-height: 1.7;
          animation: slideInUp 0.3s ease-out;
        }
        .explain-correct {
          background: rgba(16,185,129,0.08);
          border: 1px solid rgba(16,185,129,0.2);
        }
        .explain-wrong {
          background: rgba(244,63,94,0.08);
          border: 1px solid rgba(244,63,94,0.2);
        }
        .explain-header {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-bottom: var(--space-2);
        }
        .explain-correct .explain-header { color: var(--accent-emerald); }
        .explain-wrong .explain-header { color: var(--accent-rose); }
        .q-explanation p {
          color: var(--text-secondary);
        }

        /* Actions */
        .quiz-actions {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-3);
          padding-top: var(--space-4);
        }
        .quiz-submit-btn {
          padding: var(--space-4) var(--space-10);
          font-size: var(--font-md);
        }
        .quiz-hint {
          font-size: var(--font-xs);
          color: var(--text-muted);
        }
        .spinning { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}
