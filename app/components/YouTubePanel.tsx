'use client';
import { useState } from 'react';
import { Video, X, Loader2 } from 'lucide-react';
import { useCanvasStore, BrainNode } from '../store/canvasStore';

export function YouTubePanel({ onClose }: { onClose: () => void }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const addNode = useCanvasStore((s) => s.addNode);

  const handleExtract = async () => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (!match) { setError('Invalid YouTube URL'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/youtube', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ videoId: match[1], url }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');

      const rootNode: BrainNode = { id: `yt-root-${Date.now()}`, title: data.title || 'YouTube Roadmap', description: url, category: 'roadmap', tags: ['youtube'], createdAt: new Date().toISOString() };
      addNode(rootNode, { x: 400, y: 150 });

      data.steps.forEach((step: any, i: number) => {
        const node: BrainNode = { id: `yt-${Date.now()}-${i}`, title: `${step.order}. ${step.title}`, description: step.description, category: 'roadmap', tags: ['roadmap'], createdAt: new Date().toISOString() };
        addNode(node, { x: 150 + i * 260, y: 320 });
      });
      setUrl(''); onClose();
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="animate-slide-in" style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: 400, background: 'var(--bg-secondary)', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', zIndex: 100 }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: 'rgba(139,26,26,0.2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Video size={16} color="#ff6b6b" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>YouTube Action-Extractor</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Convert video into roadmap nodes</div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={18} /></button>
      </div>

      <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.06em' }}>YOUTUBE URL</label>
        <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..."
          style={{ padding: '10px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
          onFocus={(e) => { e.target.style.borderColor = 'var(--accent-green)'; }}
          onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
        />

        <div style={{ padding: 14, background: 'var(--bg-card)', borderRadius: 8, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 10 }}>How it works</div>
          {['Fetches video transcript', 'AI extracts actionable steps', 'Creates connected roadmap nodes'].map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent-green)', background: 'var(--accent-green-dim)', width: 18, height: 18, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{step}</span>
            </div>
          ))}
        </div>

        {error && <div style={{ padding: '10px 14px', background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.3)', borderRadius: 6, fontSize: 12, color: '#e74c3c' }}>{error}</div>}
        <div style={{ fontSize: 11, color: 'var(--text-muted)', padding: '10px 12px', background: 'var(--bg-card)', borderRadius: 6 }}>💡 Works best with tutorial or educational videos that have captions enabled.</div>
      </div>

      <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)' }}>
        <button onClick={handleExtract} disabled={loading || !url.trim()} style={{ width: '100%', padding: '12px 0', background: loading || !url.trim() ? 'var(--bg-hover)' : '#8b1a1a', border: 'none', borderRadius: 8, color: loading || !url.trim() ? 'var(--text-muted)' : '#fff', fontSize: 13, fontWeight: 700, cursor: loading || !url.trim() ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {loading ? <><Loader2 size={14} /> EXTRACTING...</> : <><Video size={14} /> EXTRACT ROADMAP</>}
        </button>
      </div>
    </div>
  );
}