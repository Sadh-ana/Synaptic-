'use client';
import { ReactFlow, Background, Controls, MiniMap, BackgroundVariant, Panel } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCanvasStore } from '../store/canvasStore';
import { BrainNodeComponent } from './BrainNode';

const nodeTypes = { brainNode: BrainNodeComponent };

export function Canvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useCanvasStore();
  return (
    <div style={{ position: 'fixed', inset: 0, top: 56 }}>
      <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} nodeTypes={nodeTypes} fitView proOptions={{ hideAttribution: true }} defaultEdgeOptions={{ animated: true, style: { stroke: '#4a7c59', strokeWidth: 1.5 } }}>
        <Background variant={BackgroundVariant.Dots} gap={24} size={1.5} color="#2a302a" />
        <Controls style={{ bottom: 24, left: 24 }} />
        <MiniMap style={{ bottom: 24, right: 24 }} zoomable pannable />
        {nodes.length === 0 && (
          <Panel position="top-center" style={{ marginTop: 80 }}>
            <div style={{ textAlign: 'center', padding: '48px 40px', background: 'var(--bg-card)', border: '1px dashed var(--border-accent)', borderRadius: 16, maxWidth: 480 }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>🧠</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Your Synaptic Canvas is empty</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 24 }}>
                Click <strong style={{ color: 'var(--accent-green-light)' }}>Smart Dump</strong> to let AI sort your tasks, or paste a <strong style={{ color: '#ff6b6b' }}>YouTube URL</strong> to extract a roadmap.
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                {['⚡ Brain-Dump → Eisenhower Matrix', '🎥 YouTube → Roadmap Nodes', '🔗 Drag to connect nodes', '⚠️ Deadline conflict detection'].map((tip) => (
                  <div key={tip} style={{ fontSize: 11, color: 'var(--text-secondary)', background: 'var(--bg-hover)', padding: '4px 10px', borderRadius: 20, border: '1px solid var(--border)' }}>{tip}</div>
                ))}
              </div>
            </div>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
}