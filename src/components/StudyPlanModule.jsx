import React, { useState } from 'react';
import { Compass, Sparkles, Loader2, Download, Copy, Check, BookMarked, AlertCircle, CheckCircle2, ListOrdered } from 'lucide-react';
import { generateStudyPlan, getFriendlyErrorMessage } from '../services/gemini';

export default function StudyPlanModule({ context }) {
  const [plan, setPlan] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const handleGenerate = async () => {
    if (!context || !context.trim()) {
      setError("No course context found! Please go to the 'Course Context' tab and save your lecture notes/materials first.");
      return;
    }

    setIsGenerating(true);
    setError('');
    setPlan(null);

    try {
      const generatedPlan = await generateStudyPlan(context);
      setPlan(generatedPlan);
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMarkdownString = () => {
    if (!plan) return '';
    let md = `# 📚 Remedial Study Plan & Cheat Sheet: ${plan.topicTitle}\n\n`;
    md += `## 🎯 Core Takeaways\n`;
    plan.summaryPoints.forEach((p) => { md += `- ${p}\n`; });
    md += `\n## ⚠️ Common Misconceptions to Avoid\n`;
    plan.misconceptions.forEach((m) => { md += `- ${m}\n`; });
    md += `\n## 📖 Key Terms Glossary\n`;
    plan.glossary.forEach((g) => { md += `- **${g.term}**: ${g.definition}\n`; });
    md += `\n## 🚀 3-Phase Remedial Action Plan\n`;
    plan.remedialSteps.forEach((s) => { md += `### Phase ${s.step}: ${s.title}\n${s.description}\n\n`; });
    return md;
  };

  const handleCopyMarkdown = () => {
    const md = generateMarkdownString();
    navigator.clipboard.writeText(md);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const md = generateMarkdownString();
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${plan.topicTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}-study-plan.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="study-plan-module animate-fade-in">
      {/* Initial State */}
      {!plan && !isGenerating && (
        <div className="plan-start">
          <div className="plan-start-icon">
            <Compass size={40} />
          </div>
          <h2>AI Remedial Study Roadmap</h2>
          <p>Generate a hyper-personalized study plan, cheat sheet, glossary, and misconception guide tailored to your course material.</p>
          <button className="btn btn-primary plan-btn" onClick={handleGenerate}>
            <Sparkles size={18} />
            Generate Study Roadmap
          </button>
          {error && (
            <div className="plan-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
        </div>
      )}

      {/* Loading */}
      {isGenerating && (
        <div className="plan-loading">
          <Loader2 size={40} className="spinning" />
          <h3>Crafting Your Remedial Roadmap...</h3>
          <p>AI is structuring key takeaways, misconceptions, and step-by-step action items</p>
        </div>
      )}

      {/* Study Plan Output */}
      {plan && (
        <div className="plan-container">
          {/* Header Action Bar */}
          <div className="plan-header-card glass-card">
            <div>
              <span className="plan-badge">REMEDIAL CHEAT SHEET</span>
              <h2>{plan.topicTitle}</h2>
            </div>
            <div className="plan-actions">
              <button className="btn btn-ghost" onClick={handleCopyMarkdown}>
                {isCopied ? <Check size={16} color="var(--accent-emerald)" /> : <Copy size={16} />}
                <span>{isCopied ? 'Copied!' : 'Copy Plan'}</span>
              </button>
              <button className="btn btn-primary" onClick={handleDownloadMarkdown}>
                <Download size={16} />
                <span>Download .MD</span>
              </button>
            </div>
          </div>

          <div className="plan-grid">
            {/* Core Takeaways */}
            <div className="glass-card plan-section">
              <h3 className="section-title text-indigo">
                <CheckCircle2 size={20} /> Core Takeaways
              </h3>
              <ul className="plan-list">
                {plan.summaryPoints.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            </div>

            {/* Misconceptions to Avoid */}
            <div className="glass-card plan-section">
              <h3 className="section-title text-rose">
                <AlertCircle size={20} /> Common Misconceptions
              </h3>
              <ul className="plan-list list-warn">
                {plan.misconceptions.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Key Terms Glossary */}
          <div className="glass-card plan-section">
            <h3 className="section-title text-purple">
              <BookMarked size={20} /> Key Terms Glossary
            </h3>
            <div className="glossary-grid">
              {plan.glossary.map((item, i) => (
                <div key={i} className="glossary-item">
                  <strong>{item.term}</strong>
                  <p>{item.definition}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 3-Phase Action Plan */}
          <div className="glass-card plan-section">
            <h3 className="section-title text-emerald">
              <ListOrdered size={20} /> 3-Phase Remedial Action Plan
            </h3>
            <div className="roadmap-timeline">
              {plan.remedialSteps.map((step) => (
                <div key={step.step} className="timeline-step">
                  <div className="step-num">{step.step}</div>
                  <div className="step-content">
                    <h4>{step.title}</h4>
                    <p>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .study-plan-module {
          max-width: 900px;
          margin: 0 auto;
          padding: var(--space-6);
        }
        .plan-start {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: var(--space-12) var(--space-6);
        }
        .plan-start-icon {
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
        .plan-start h2 {
          font-size: var(--font-2xl);
          font-weight: 700;
          margin-bottom: var(--space-2);
        }
        .plan-start p {
          color: var(--text-secondary);
          font-size: var(--font-base);
          max-width: 440px;
          margin-bottom: var(--space-8);
        }
        .plan-btn {
          padding: var(--space-4) var(--space-8);
          font-size: var(--font-md);
        }
        .plan-error {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-top: var(--space-4);
          color: var(--accent-rose);
          font-size: var(--font-sm);
        }

        .plan-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: var(--space-12);
          color: var(--accent-indigo);
        }
        .plan-loading .spinning { animation: spin 1s linear infinite; }
        .plan-loading h3 {
          margin-top: var(--space-5);
          font-size: var(--font-lg);
          color: var(--text-primary);
        }
        .plan-loading p {
          color: var(--text-secondary);
          font-size: var(--font-sm);
          margin-top: var(--space-2);
        }

        .plan-container {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }
        .plan-header-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-6);
          flex-wrap: wrap;
          gap: var(--space-4);
        }
        .plan-badge {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
          color: var(--accent-indigo);
        }
        .plan-header-card h2 {
          font-size: var(--font-xl);
          font-weight: 700;
          margin-top: 4px;
        }
        .plan-actions {
          display: flex;
          gap: var(--space-3);
        }

        .plan-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-6);
        }
        @media (max-width: 768px) {
          .plan-grid { grid-template-columns: 1fr; }
        }

        .plan-section {
          padding: var(--space-6);
        }
        .section-title {
          font-size: var(--font-md);
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-bottom: var(--space-4);
        }
        .text-indigo { color: var(--accent-indigo); }
        .text-rose { color: var(--accent-rose); }
        .text-purple { color: var(--accent-purple); }
        .text-emerald { color: var(--accent-emerald); }

        .plan-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          padding-left: var(--space-4);
          color: var(--text-secondary);
          font-size: var(--font-sm);
          line-height: 1.5;
        }
        .list-warn li::marker { color: var(--accent-rose); }

        .glossary-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-4);
        }
        @media (max-width: 600px) {
          .glossary-grid { grid-template-columns: 1fr; }
        }
        .glossary-item {
          background: rgba(0,0,0,0.2);
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-md);
          border: 1px solid var(--surface-border);
        }
        .glossary-item strong {
          color: var(--text-primary);
          font-size: var(--font-sm);
          display: block;
          margin-bottom: 2px;
        }
        .glossary-item p {
          color: var(--text-secondary);
          font-size: var(--font-xs);
          line-height: 1.4;
        }

        .roadmap-timeline {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .timeline-step {
          display: flex;
          gap: var(--space-4);
          align-items: flex-start;
          background: rgba(16,185,129,0.04);
          padding: var(--space-4);
          border-radius: var(--radius-md);
          border: 1px solid rgba(16,185,129,0.15);
        }
        .step-num {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--gradient-primary);
          color: white;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: var(--font-sm);
        }
        .step-content h4 {
          font-size: var(--font-sm);
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 2px;
        }
        .step-content p {
          font-size: var(--font-xs);
          color: var(--text-secondary);
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
