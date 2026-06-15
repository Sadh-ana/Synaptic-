'use client';
import { Zap, Video, Plus, Trash2, AlertTriangle, Brain, GitBranch } from 'lucide-react';
import { useCanvasStore, BrainNode } from '../store/canvasStore';

interface Props { onBrainDump: () => void; onYouTube: () => void; }

export function Toolbar({ onBrainDump, onYouTube }: Props) {
  const { nodes, addNode, clearAll } = useCanvasStore();
  const conflictCount = nodes.filter((n) => n.data.hasConflict).length;

  const addBlankNode = () => {
    const node: BrainNode = { id: `node-${Date.now()}`, title: 'New Node', category: 'free', createdAt: new Date().toISOString() };
    addNode(node, { x: Math.random() * 500 + 200, y: Math.random() * 300 + 200 });
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 56, background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 0, zIndex: 50 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 24 }}>
        <div style={{ width: 30, height: 30, background: 'var(--accent-green-dim)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Brain size={16} color="var(--accent-green-light)" />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Synaptic</div>
          <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>SECOND BRAIN</div>
        </div>
      </div>

      <div style={{ width: 1, height: 28, background: 'var(--border)', marginRight: 20 }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={addBlankNode} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 7, cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 600 }}>
          <Plus size={13} /> New Node
        </button>
        <button onClick={onBrainDump} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'var(--accent-green-dim)', border: '1px solid var(--accent-green)', borderRadius: 7, cursor: 'pointer', color: 'var(--accent-green-light)', fontSize: 12, fontWeight: 700 }}>
          <Zap size={13} /> Smart Dump
        </button>
        <button onClick={onYouTube} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'rgba(139,26,26,0.15)', border: '1px solid rgba(139,26,26,0.4)', borderRadius: 7, cursor: 'pointer', color: '#ff6b6b', fontSize: 12, fontWeight: 700 }}>
          <Video size={13} /> YouTube Extract
        </button>
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <GitBranch size={12} color="var(--text-muted)" />
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{nodes.length} nodes</span>
        </div>
        {conflictCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', background: 'rgba(142,28,28,0.15)', border: '1px solid rgba(142,28,28,0.4)', borderRadius: 6 }}>
            <AlertTriangle size={11} color="#e74c3c" />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#e74c3c' }}>{conflictCount} conflicts</span>
          </div>
        )}
        <button onClick={clearAll} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', background: 'none', border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer', color: 'var(--text-muted)', fontSize: 11 }}>
          <Trash2 size={11} /> Clear
        </button>
      </div>
    </div>
  );
}