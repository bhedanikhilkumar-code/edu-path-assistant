import React, { useState } from 'react';
import { Network, Sparkles, Loader2, RefreshCw, AlertCircle, Share2, Layers } from 'lucide-react';
import { generateMindMap, getFriendlyErrorMessage } from '../services/gemini';

const BRANCH_COLORS = [
  'var(--accent-indigo)',
  'var(--accent-purple)',
  'var(--accent-emerald)',
  'var(--accent-amber)',
  'var(--accent-rose)'
];

export default function MindMapModule({ context }) {
  const [mindmap, setMindmap] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [activeBranch, setActiveBranch] = useState(null);

  const handleGenerate = async () => {
    if (!context || !context.trim()) {
      setError("No course context found! Please go to the 'Course Context' tab and save your lecture notes/materials first.");
      return;
    }

    setIsGenerating(true);
    setError('');
    setMindmap(null);
    setActiveBranch(null);

    try {
      const data = await generateMindMap(context);
      setMindmap(data);
      if (data.branches && data.branches.length > 0) {
        setActiveBranch(data.branches[0]);
      }
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mindmap-module animate-fade-in">
      {/* Initial State */}
      {!mindmap && !isGenerating && (
        <div className="mindmap-start">
          <div className="mindmap-start-icon">
            <Network size={40} />
          </div>
          <h2>AI Concept Mind Map</h2>
          <p>Visualize complex lecture topics with an interactive knowledge node graph.</p>
          <button className="btn btn-primary mindmap-btn" onClick={handleGenerate}>
            <Sparkles size={18} />
            Generate Visual Mind Map
          </button>
          {error && (
            <div className="mindmap-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
        </div>
      )}

      {/* Loading */}
      {isGenerating && (
        <div className="mindmap-loading">
          <Loader2 size={40} className="spinning" />
          <h3>Generating Knowledge Graph...</h3>
          <p>Structuring relationships between core concepts & subtopics</p>
        </div>
      )}

      {/* Mind Map Layout */}
      {mindmap && (
        <div className="mindmap-container">
          <div className="mindmap-header glass-card">
            <div>
              <span className="mindmap-badge">VISUAL KNOWLEDGE GRAPH</span>
              <h2>{mindmap.rootTopic}</h2>
            </div>
            <button className="btn btn-ghost" onClick={handleGenerate}>
              <RefreshCw size={16} /> Generate New Map
            </button>
          </div>

          {/* Central Root Node Banner */}
          <div className="central-node glass-card">
            <div className="root-icon">
              <Network size={28} color="white" />
            </div>
            <div>
              <h3>{mindmap.rootTopic}</h3>
              <p>Click on any branch below to inspect sub-concepts</p>
            </div>
          </div>

          {/* Branches Grid */}
          <div className="branches-grid">
            {mindmap.branches.map((branch, idx) => {
              const color = BRANCH_COLORS[idx % BRANCH_COLORS.length];
              const isSelected = activeBranch?.name === branch.name;

              return (
                <div
                  key={idx}
                  className={`branch-card glass-card ${isSelected ? 'branch-selected' : ''}`}
                  onClick={() => setActiveBranch(branch)}
                  style={{ borderColor: isSelected ? color : 'var(--surface-border)' }}
                >
                  <div className="branch-header">
                    <span className="branch-dot" style={{ background: color, boxShadow: `0 0 10px ${color}` }} />
                    <h4 style={{ color: 'var(--text-primary)' }}>{branch.name}</h4>
                  </div>
                  <p className="branch-desc">{branch.description}</p>
                  
                  <div className="nodes-list">
                    {branch.nodes.map((node, nIdx) => (
                      <span key={nIdx} className="node-chip" style={{ borderLeft: `3px solid ${color}` }}>
                        {node}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Branch Inspector Drawer */}
          {activeBranch && (
            <div className="inspector-card glass-card animate-fade-in">
              <div className="inspector-header">
                <span className="badge" style={{ background: 'var(--gradient-primary)', color: 'white' }}>SELECTED BRANCH</span>
                <h3>{activeBranch.name}</h3>
              </div>
              <p className="inspector-desc">{activeBranch.description}</p>
              
              <div className="inspector-nodes">
                <strong>Sub-Concepts & Key Details:</strong>
                <ul>
                  {activeBranch.nodes.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        .mindmap-module {
          max-width: 950px;
          margin: 0 auto;
          padding: var(--space-6);
        }
        .mindmap-start {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: var(--space-12) var(--space-6);
        }
        .mindmap-start-icon {
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
        .mindmap-start h2 {
          font-size: var(--font-2xl);
          font-weight: 700;
          margin-bottom: var(--space-2);
        }
        .mindmap-start p {
          color: var(--text-secondary);
          font-size: var(--font-base);
          max-width: 440px;
          margin-bottom: var(--space-8);
        }
        .mindmap-btn {
          padding: var(--space-4) var(--space-8);
          font-size: var(--font-md);
        }
        .mindmap-error {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-top: var(--space-4);
          color: var(--accent-rose);
          font-size: var(--font-sm);
        }

        .mindmap-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: var(--space-12);
          color: var(--accent-indigo);
        }
        .mindmap-loading .spinning { animation: spin 1s linear infinite; }
        .mindmap-loading h3 {
          margin-top: var(--space-5);
          font-size: var(--font-lg);
          color: var(--text-primary);
        }
        .mindmap-loading p {
          color: var(--text-secondary);
          font-size: var(--font-sm);
          margin-top: var(--space-2);
        }

        .mindmap-container {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }
        .mindmap-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-5);
        }
        .mindmap-badge {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
          color: var(--accent-indigo);
        }
        .mindmap-header h2 {
          font-size: var(--font-xl);
          font-weight: 700;
          margin-top: 2px;
        }

        .central-node {
          padding: var(--space-6);
          display: flex;
          align-items: center;
          gap: var(--space-5);
          background: var(--gradient-subtle);
          border: 1px solid rgba(99,102,241,0.3);
        }
        .root-icon {
          width: 56px;
          height: 56px;
          border-radius: var(--radius-lg);
          background: var(--gradient-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: var(--shadow-glow-indigo);
        }
        .central-node h3 {
          font-size: var(--font-lg);
          font-weight: 700;
          color: var(--text-primary);
        }
        .central-node p {
          font-size: var(--font-xs);
          color: var(--text-secondary);
          margin-top: 2px;
        }

        .branches-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--space-5);
        }
        .branch-card {
          padding: var(--space-5);
          cursor: pointer;
          transition: all var(--transition-base);
        }
        .branch-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        .branch-selected {
          background: rgba(99,102,241,0.08);
        }
        .branch-header {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-bottom: var(--space-2);
        }
        .branch-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .branch-header h4 {
          font-size: var(--font-md);
          font-weight: 700;
        }
        .branch-desc {
          font-size: var(--font-xs);
          color: var(--text-secondary);
          line-height: 1.4;
          margin-bottom: var(--space-4);
        }
        .nodes-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }
        .node-chip {
          background: rgba(0,0,0,0.25);
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          font-size: var(--font-xs);
          color: var(--text-primary);
          font-weight: 500;
        }

        .inspector-card {
          padding: var(--space-6);
          border-left: 4px solid var(--accent-indigo);
        }
        .inspector-header h3 {
          font-size: var(--font-lg);
          font-weight: 700;
          margin-top: 4px;
          color: var(--text-primary);
        }
        .inspector-desc {
          font-size: var(--font-sm);
          color: var(--text-secondary);
          margin-top: 4px;
          margin-bottom: var(--space-4);
        }
        .inspector-nodes strong {
          display: block;
          font-size: var(--font-xs);
          color: var(--accent-indigo);
          margin-bottom: var(--space-2);
        }
        .inspector-nodes ul {
          padding-left: var(--space-5);
          color: var(--text-primary);
          font-size: var(--font-sm);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
      `}</style>
    </div>
  );
}
