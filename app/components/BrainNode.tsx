'use client';
import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { AlertTriangle, Clock, Tag } from 'lucide-react';
import { useCanvasStore } from '../store/canvasStore';

const categoryLabels: Record<string, string> = {
  'urgent-important': 'DO NOW',
  'not-urgent-important': 'SCHEDULE',
  'urgent-not-important': 'DELEGATE',
  'not-urgent-not-important': 'ELIMINATE',
  'roadmap': 'ROADMAP',
  'free': 'NOTE',
};

export const BrainNodeComponent = memo(({ data, selected, id }: any) => {
  const setSelectedNode = useCanvasStore((s) => s.setSelectedNode);
  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div
      onClick={() => setSelectedNode(id)}
      style={{
        background: 'var(--bg-card)',
        border: `1.5px solid ${data.hasConflict ? '#8e1c1c' : selected ? data.color : 'var(--border)'}`,
        borderLeft: `4px solid ${data.color}`,
        boxShadow: selected ? `0 0 0 2px ${data.color}40, 0 8px 32px rgba(0,0,0,0.4)` : '0 4px 16px rgba(0,0,0,0.3)',
        borderRadius: '8px', minWidth: '220px', maxWidth: '280px',
        cursor: 'pointer', transition: 'all 0.15s ease',
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: data.color, border: 'none', width: 8, height: 8 }} />
      <div style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', color: data.color, background: `${data.color}20`, padding: '2px 6px', borderRadius: '3px' }}>
            {categoryLabels[data.category] || 'NOTE'}
          </span>
          {data.hasConflict && <AlertTriangle size={11} color="#e74c3c" />}
        </div>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: 6, wordBreak: 'break-word' }}>
          {data.title}
        </div>
        {data.description && (
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 8, wordBreak: 'break-word' }}>
            {data.description.length > 80 ? data.description.slice(0, 80) + '…' : data.description}
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {data.deadline && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '10px', color: data.hasConflict ? '#e74c3c' : 'var(--text-muted)' }}>
              <Clock size={9} />{formatDate(data.deadline)}
            </span>
          )}
          {(data.tags || []).slice(0, 2).map((tag: string) => (
            <span key={tag} style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '10px', color: 'var(--text-muted)', background: 'var(--bg-hover)', padding: '1px 5px', borderRadius: '3px' }}>
              <Tag size={8} />{tag}
            </span>
          ))}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: data.color, border: 'none', width: 8, height: 8 }} />
    </div>
  );
});
BrainNodeComponent.displayName = 'BrainNodeComponent';