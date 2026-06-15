'use client';
import { useState, useEffect } from 'react';
import { X, Trash2, Save, Tag, Calendar, FileText, Layers, AlertTriangle } from 'lucide-react';
import { useCanvasStore, NodeCategory } from '../store/canvasStore';

const categories = [
  { value: 'urgent-important' as NodeCategory, label: 'DO NOW', desc: 'Urgent & Important', color: '#c0392b' },
  { value: 'not-urgent-important' as NodeCategory, label: 'SCHEDULE', desc: 'Not Urgent, Important', color: '#e67e22' },
  { value: 'urgent-not-important' as NodeCategory, label: 'DELEGATE', desc: 'Urgent, Not Important', color: '#2980b9' },
  { value: 'not-urgent-not-important' as NodeCategory, label: 'ELIMINATE', desc: 'Not Urgent, Not Important', color: '#4a7c59' },
  { value: 'roadmap' as NodeCategory, label: 'ROADMAP', desc: 'Learning / Project Step', color: '#8e44ad' },
  { value: 'free' as NodeCategory, label: 'FREE NOTE', desc: 'Unstructured note', color: '#4a5568' },
];

export function NodeEditor() {
  const { nodes, selectedNode, updateNode, deleteNode, setSelectedNode, setSidebarOpen } = useCanvasStore();
  const node = nodes.find((n) => n.id === selectedNode);
  const d = node?.data as any;
  const [form, setForm] = useState({ title: '', description: '', category: 'free' as NodeCategory, deadline: '', tags: '' });

  useEffect(() => {
    if (d) setForm({ title: d.title || '', description: d.description || '', category: d.category || 'free', deadline: d.deadline || '', tags: (d.tags || []).join(', ') });
  }, [selectedNode]);

  if (!node) return null;

  const handleSave = () => {
    updateNode(node.id, { title: form.title, description: form.description, category: form.category, deadline: form.deadline || undefined, tags: form.tags ? form.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [] });
    setSidebarOpen(false); setSelectedNode(null);
  };

  const selectedCat = categories.find((c) => c.value === form.category);
  const inp = { width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 13, outline: 'none', fontFamily: 'inherit' } as any;

  return (
    <div className="animate-slide-in" style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: 360, background: 'var(--bg-secondary)', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', zIndex: 90 }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 4, height: 32, background: selectedCat?.color, borderRadius: 2 }} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: selectedCat?.color }}>{selectedCat?.label}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Edit node</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => deleteNode(node.id)} style={{ background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.2)', borderRadius: 6, padding: '6px 8px', cursor: 'pointer', color: '#e74c3c', display: 'flex' }}><Trash2 size={14} /></button>
          <button onClick={() => { setSidebarOpen(false); setSelectedNode(null); }} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6, padding: '6px 8px', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}><X size={14} /></button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}><FileText size={11} /> TITLE</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={{ ...inp, fontWeight: 600 }} onFocus={(e) => { e.target.style.borderColor = 'var(--accent-green)'; }} onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }} />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}><Layers size={11} /> DESCRIPTION</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} style={{ ...inp, resize: 'vertical', lineHeight: 1.5 }} onFocus={(e) => { e.target.style.borderColor = 'var(--accent-green)'; }} onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }} />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, display: 'block' }}>QUADRANT</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {categories.map((cat) => (
              <button key={cat.value} onClick={() => setForm({ ...form, category: cat.value })} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: form.category === cat.value ? `${cat.color}15` : 'var(--bg-card)', border: `1px solid ${form.category === cat.value ? cat.color : 'var(--border)'}`, borderLeft: `3px solid ${cat.color}`, borderRadius: 6, cursor: 'pointer', textAlign: 'left' }}>
                <div><div style={{ fontSize: 11, fontWeight: 700, color: cat.color }}>{cat.label}</div><div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{cat.desc}</div></div>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}><Calendar size={11} /> DEADLINE</label>
          <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} style={{ ...inp, colorScheme: 'dark' }} onFocus={(e) => { e.target.style.borderColor = 'var(--accent-green)'; }} onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }} />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}><Tag size={11} /> TAGS <span style={{ fontWeight: 400 }}>(comma-separated)</span></label>
          <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="study, urgent, project" style={inp} onFocus={(e) => { e.target.style.borderColor = 'var(--accent-green)'; }} onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }} />
        </div>
        {d?.hasConflict && (
          <div style={{ padding: '10px 14px', background: 'rgba(142,28,28,0.15)', border: '1px solid rgba(142,28,28,0.4)', borderRadius: 6 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#e74c3c', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}><AlertTriangle size={12} /> Deadline Conflict</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Another node has a deadline within 24 hours of this one.</div>
          </div>
        )}
      </div>

      <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)' }}>
        <button onClick={handleSave} style={{ width: '100%', padding: '12px 0', background: 'var(--accent-green)', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Save size={14} /> SAVE CHANGES
        </button>
      </div>
    </div>
  );
}