import React, { useState, useEffect } from 'react';
import { BarChart3, Trophy, Target, CheckCircle2, AlertCircle, RefreshCw, Sparkles, Activity } from 'lucide-react';

export default function AnalyticsModule({ context }) {
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    history: []
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('edu-path-analytics');
      if (stored) {
        setStats(JSON.parse(stored));
      }
    } catch {}
  }, []);

  const handleReset = () => {
    localStorage.removeItem('edu-path-analytics');
    setStats({ totalQuizzes: 0, totalQuestions: 0, correctAnswers: 0, history: [] });
  };

  const accuracy = stats.totalQuestions > 0 ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100) : 0;

  const getRemedialAdvice = () => {
    if (stats.totalQuizzes === 0) {
      return "No quiz data recorded yet! Take a Conceptual Quiz to generate your personalized learning diagnosis.";
    }
    if (accuracy >= 85) {
      return "🌟 Outstanding Mastery! You have demonstrated exceptional clarity on this course material. Challenge yourself by generating Hard difficulty quizzes!";
    }
    if (accuracy >= 65) {
      return "👍 Solid Understanding! You understand most concepts well. Review your Revision Flashcards to solidify edge-case definitions.";
    }
    return "💡 Remedial Review Recommended! Your current accuracy suggests a few core conceptual gaps. Use the Study Roadmap tab to review misconceptions and step-by-step guidance.";
  };

  return (
    <div className="analytics-module animate-fade-in">
      <div className="glass-card analytics-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{ background: 'var(--gradient-primary)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
            <BarChart3 size={24} color="white" />
          </div>
          <div>
            <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: '700', color: 'var(--text-primary)' }}>Learning Analytics & Diagnosis</h2>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>Track your quiz performance, accuracy, and AI remedial feedback</p>
          </div>
        </div>
        {stats.totalQuizzes > 0 && (
          <button className="btn btn-ghost" onClick={handleReset} title="Reset Stats">
            <RefreshCw size={14} /> Reset Data
          </button>
        )}
      </div>

      {/* KPI Cards Grid */}
      <div className="stats-grid">
        {/* Accuracy Ring Card */}
        <div className="glass-card stat-card">
          <div className="stat-icon-bg bg-indigo">
            <Target size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Overall Accuracy</span>
            <span className="stat-value">{accuracy}%</span>
          </div>
        </div>

        {/* Total Quizzes Card */}
        <div className="glass-card stat-card">
          <div className="stat-icon-bg bg-purple">
            <Trophy size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Quizzes Completed</span>
            <span className="stat-value">{stats.totalQuizzes}</span>
          </div>
        </div>

        {/* Questions Answered Card */}
        <div className="glass-card stat-card">
          <div className="stat-icon-bg bg-emerald">
            <CheckCircle2 size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Correct Answers</span>
            <span className="stat-value">{stats.correctAnswers} / {stats.totalQuestions}</span>
          </div>
        </div>
      </div>

      {/* AI Diagnostic Advice Card */}
      <div className="glass-card diagnostic-card">
        <h3 style={{ fontSize: 'var(--font-md)', fontWeight: '700', color: 'var(--accent-indigo)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
          <Sparkles size={18} />
          AI Diagnostic Feedback
        </h3>
        <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-primary)', lineHeight: '1.6' }}>
          {getRemedialAdvice()}
        </p>
      </div>

      {/* Quiz History Table */}
      {stats.history.length > 0 && (
        <div className="glass-card history-card">
          <h3 style={{ fontSize: 'var(--font-md)', fontWeight: '700', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Activity size={18} color="var(--accent-purple)" />
            Recent Quiz Performance History
          </h3>
          <div className="table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Difficulty</th>
                  <th>Score</th>
                  <th>Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {stats.history.slice(-5).reverse().map((h, i) => (
                  <tr key={i}>
                    <td>{stats.history.length - i}</td>
                    <td>{h.date}</td>
                    <td><span className="diff-tag">{h.difficulty}</span></td>
                    <td>{h.score} / {h.total}</td>
                    <td>
                      <span className={`acc-tag ${h.percentage >= 70 ? 'acc-high' : h.percentage >= 50 ? 'acc-mid' : 'acc-low'}`}>
                        {h.percentage}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style>{`
        .analytics-module {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }
        .analytics-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-5);
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: var(--space-5);
        }
        .stat-card {
          padding: var(--space-5);
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }
        .stat-icon-bg {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        .bg-indigo { background: var(--gradient-primary); }
        .bg-purple { background: linear-gradient(135deg, #a855f7, #6366f1); }
        .bg-emerald { background: linear-gradient(135deg, #10b981, #059669); }
        
        .stat-content {
          display: flex;
          flex-direction: column;
        }
        .stat-label {
          font-size: var(--font-xs);
          color: var(--text-secondary);
          font-weight: 500;
        }
        .stat-value {
          font-size: var(--font-2xl);
          font-weight: 700;
          color: var(--text-primary);
        }

        .diagnostic-card {
          padding: var(--space-5);
          background: var(--gradient-subtle);
          border: 1px solid rgba(99,102,241,0.3);
        }

        .history-card {
          padding: var(--space-5);
        }
        .table-wrapper {
          overflow-x: auto;
        }
        .history-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: var(--font-sm);
        }
        .history-table th, .history-table td {
          padding: var(--space-3) var(--space-4);
          border-bottom: 1px solid var(--surface-border);
        }
        .history-table th {
          color: var(--text-secondary);
          font-weight: 600;
          font-size: var(--font-xs);
        }
        .diff-tag {
          padding: 2px 8px;
          border-radius: var(--radius-sm);
          background: rgba(255,255,255,0.08);
          font-size: 11px;
        }
        .acc-tag {
          padding: 2px 8px;
          border-radius: var(--radius-full);
          font-weight: 700;
          font-size: 11px;
        }
        .acc-high { background: rgba(16,185,129,0.15); color: var(--accent-emerald); }
        .acc-mid { background: rgba(245,158,11,0.15); color: var(--accent-amber); }
        .acc-low { background: rgba(244,63,94,0.15); color: var(--accent-rose); }
      `}</style>
    </div>
  );
}
