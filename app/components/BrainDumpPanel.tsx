'use client';
import { useState } from 'react';
import { Zap, X, Loader2 } from 'lucide-react';
import { useCanvasStore, BrainNode, NodeCategory } from '../store/canvasStore';

export function BrainDumpPanel({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const addNode = useCanvasStore((s) => s.addNode);

  const handleDump = async () => {
    if (!text.trim()) return;
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/braindump', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');

      const positions: Record<string, { x: number; y: number }> = {
        'urgent-important': { x: 150, y: 150 },
        'not-urgent-important': { x: 550, y: 150 },
        'urgent-not-important': { x: 150, y: 450 },
        'not-urgent-not-important': { x: 550, y: 450 },
      };

      Object.entries(data.matrix).forEach(([cat, items]: [string, any]) => {
        const base = positions[cat] || { x: 300, y: 300 };
        items.forEach((item: any, i: number) => {
          const node: BrainNode = { id: `brain-${Date.now()}-${Math.random()}`, title: item.title, description: item.description, category: cat as NodeCategory, deadline: item.deadline, tags: item.tags, createdAt: new Date().toISOString() };
          addNode(node, { x: base.x + (i % 2) * 240, y: base.y + Math.floor(i / 2) * 150 });
        });
      });
      setText(''); onClose();
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="animate-slide-in" style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: 420, background: 'var(--bg-secondary)', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', zIndex: 100 }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: 'var(--accent-green-dim)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={16} color="var(--accent-green-light)" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Smart Brain-Dump</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>AI sorts into Eisenhower Matrix</div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={18} /></button>
      </div>

      <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[['DO NOW', '#c0392b', 'Urgent & Important'], ['SCHEDULE', '#e67e22', 'Not Urgent, Important'], ['DELEGATE', '#2980b9', 'Urgent, Not Important'], ['ELIMINATE', '#4a7c59', 'Not Urgent, Not Important']].map(([label, color, desc]) => (
            <div key={label} style={{ padding: '6px 8px', background: 'var(--bg-card)', borderRadius: 6, borderLeft: `3px solid ${color}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, color }}>{label}</div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{desc}</div>
            </div>
          ))}
        </div>

        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.06em' }}>DUMP EVERYTHING ON YOUR MIND</label>
        <textarea
          value={text} onChange={(e) => setText(e.target.value)}
          placeholder="Submit assignment by Friday, learn React hooks, reply to professor urgently, fix critical bug in production, watch Netflix later..."
          style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 13, padding: 14, resize: 'none', outline: 'none', lineHeight: 1.6, fontFamily: 'inherit' }}
          onFocus={(e) => { e.target.style.borderColor = 'var(--accent-green)'; }}
          onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
        />
        {error && <div style={{ padding: '10px 14px', background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.3)', borderRadius: 6, fontSize: 12, color: '#e74c3c' }}>{error}</div>}
      </div>

      <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)' }}>
        <button onClick={handleDump} disabled={loading || !text.trim()} style={{ width: '100%', padding: '12px 0', background: loading || !text.trim() ? 'var(--bg-hover)' : 'var(--accent-green)', border: 'none', borderRadius: 8, color: loading || !text.trim() ? 'var(--text-muted)' : '#fff', fontSize: 13, fontWeight: 700, cursor: loading || !text.trim() ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {loading ? <><Loader2 size={14} /> ANALYZING...</> : <><Zap size={14} /> GENERATE NODES</>}
        </button>
      </div>
    </div>
  );
}