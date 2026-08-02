import React, { useState, useEffect } from 'react';
import { FileText, Save, Check, Sparkles, BookOpen } from 'lucide-react';

const SAMPLE_CONTEXTS = [
  {
    title: "Intro to Neural Networks",
    content: `Neural networks are computing systems inspired by the biological neural networks that constitute animal brains. An Artificial Neural Network (ANN) is based on a collection of connected units or nodes called artificial neurons, which loosely model the neurons in a biological brain. 

Each connection, like the synapses in a biological brain, can transmit a signal to other neurons. An artificial neuron receives signals, processes them and can signal neurons connected to it. The "signal" at a connection is a real number, and the output of each neuron is computed by some non-linear function of the sum of its inputs. The connections are called edges. Neurons and edges typically have a weight that adjusts as learning proceeds. The weight increases or decreases the strength of the signal at a connection. 

Typically, neurons are aggregated into layers. Different layers may perform different transformations on their inputs. Signals travel from the first layer (the input layer), to the last layer (the output layer), possibly after traversing the layers multiple times.`
  },
  {
    title: "Photosynthesis Explained",
    content: `Photosynthesis is a process used by plants and other organisms to convert light energy into chemical energy that, through cellular respiration, can later be released to fuel the organism's activities. This chemical energy is stored in carbohydrate molecules, such as sugars and starches, which are synthesized from carbon dioxide and water.

The process is divided into two main stages:
1. Light-dependent reactions: These reactions capture the energy of light and use it to make the energy-storage molecules ATP and NADPH. These reactions take place in the thylakoid membranes of chloroplasts. Oxygen gas is released as a waste product.
2. Light-independent reactions (Calvin Cycle): These reactions use the ATP and NADPH produced in the first stage to capture and chemically reduce carbon dioxide to synthesize carbohydrates. This takes place in the stroma of the chloroplasts.`
  }
];

export default function ContextPanel({ contextText = '', onSaveContext }) {
  const [text, setText] = useState(contextText || '');
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedAnimation, setShowSavedAnimation] = useState(false);

  useEffect(() => {
    setText(contextText || '');
  }, [contextText]);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onSaveContext(text);
      setIsSaving(false);
      setShowSavedAnimation(true);
      setTimeout(() => setShowSavedAnimation(false), 2000);
    }, 600);
  };

  const loadSample = (sampleText) => {
    setText(sampleText);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', width: '100%', height: '100%' }}>
      {/* Introduction Card */}
      <div className="glass-card" style={{ padding: 'var(--space-5)', display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
        <div style={{
          background: 'var(--gradient-primary)',
          width: '48px',
          height: '48px',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <BookOpen size={24} color="white" />
        </div>
        <div>
          <h2 style={{ fontSize: 'var(--font-lg)', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>Course Context Ingestion</h2>
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Paste the lecture transcript, textbook section, or syllabus topics you are currently studying. Edu-Path's AI will use this content to answer your doubts and generate target-specific practice quizzes.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 'var(--space-6)', flexGrow: 1, alignItems: 'start' }} className="context-grid">
        {/* Input Panel */}
        <div className="glass-card" style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--font-sm)', fontWeight: '600', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <FileText size={16} color="var(--accent-indigo)" />
              Syllabus / Lecture Materials
            </span>
            <span style={{ fontSize: 'var(--font-xs)', color: text.length > 5000 ? 'var(--accent-amber)' : 'var(--text-secondary)' }}>
              {text.length.toLocaleString()} characters
            </span>
          </div>

          <textarea
            className="input textarea"
            placeholder="Paste your course content here (e.g. transcript, article, notes, or copy-paste from a slide)..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ minHeight: '300px', flexGrow: 1 }}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
            <button
              onClick={handleSave}
              className={`btn ${showSavedAnimation ? 'btn-success' : 'btn-primary'}`}
              disabled={isSaving || !text.trim()}
              style={{ minWidth: '140px' }}
            >
              {isSaving ? (
                <>
                  <div className="spinner" />
                  <span>Saving...</span>
                </>
              ) : showSavedAnimation ? (
                <>
                  <Check size={16} />
                  <span>Context Saved!</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save Context</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Demo Content Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="glass-card" style={{ padding: 'var(--space-5)' }}>
            <h3 style={{ fontSize: 'var(--font-md)', fontWeight: '700', color: 'var(--text-primary)', marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Sparkles size={16} color="var(--accent-purple)" />
              Try a Quick Demo
            </h3>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)', lineHeight: '1.5' }}>
              Don't have material ready? Load one of our curated topic samples to test how the remedial tutoring chatbot and quiz generation works.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {SAMPLE_CONTEXTS.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => loadSample(sample.content)}
                  className="btn btn-ghost"
                  style={{
                    width: '100%',
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    padding: 'var(--space-3)',
                    whiteSpace: 'normal',
                    lineHeight: '1.4'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <strong style={{ fontSize: 'var(--font-sm)', color: 'var(--text-primary)' }}>{sample.title}</strong>
                    <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{sample.content.substring(0, 70)}...</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {contextText && (
            <div className="glass-card" style={{ padding: 'var(--space-4)', background: 'rgba(16, 185, 129, 0.04)', borderColor: 'rgba(16, 185, 129, 0.15)' }}>
              <span style={{ fontSize: 'var(--font-xs)', color: 'var(--accent-emerald)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Check size={14} />
                ACTIVE CONTEXT
              </span>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: '1.5' }}>
                Your saved context is loaded and active. You can now toggle to the <strong>Doubt Chatbot</strong> to ask questions, or the <strong>One-Click Quiz</strong> to test yourself.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
