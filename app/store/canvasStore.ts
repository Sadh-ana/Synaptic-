import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Node, Edge, addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';

export type NodeCategory = 'urgent-important' | 'not-urgent-important' | 'urgent-not-important' | 'not-urgent-not-important' | 'roadmap' | 'free';

export interface BrainNode {
  id: string;
  title: string;
  description?: string;
  category: NodeCategory;
  deadline?: string;
  tags?: string[];
  createdAt: string;
  hasConflict?: boolean;
}

const categoryColors: Record<NodeCategory, string> = {
  'urgent-important': '#c0392b',
  'not-urgent-important': '#e67e22',
  'urgent-not-important': '#2980b9',
  'not-urgent-not-important': '#4a7c59',
  'roadmap': '#8e44ad',
  'free': '#4a5568',
};

function makeFlowNode(brain: BrainNode, position = { x: Math.random() * 600 + 100, y: Math.random() * 400 + 100 }): Node {
  return {
    id: brain.id,
    type: 'brainNode',
    position,
    data: { ...brain, color: categoryColors[brain.category] },
  };
}

interface CanvasState {
  nodes: Node[];
  edges: Edge[];
  selectedNode: string | null;
  sidebarOpen: boolean;
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: any) => void;
  addNode: (node: BrainNode, position?: { x: number; y: number }) => void;
  updateNode: (id: string, data: Partial<BrainNode>) => void;
  deleteNode: (id: string) => void;
  setSelectedNode: (id: string | null) => void;
  setSidebarOpen: (open: boolean) => void;
  detectConflicts: () => void;
  clearAll: () => void;
}

export const useCanvasStore = create<CanvasState>()(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      selectedNode: null,
      sidebarOpen: false,

      onNodesChange: (changes) => set((s) => ({ nodes: applyNodeChanges(changes, s.nodes) })),
      onEdgesChange: (changes) => set((s) => ({ edges: applyEdgeChanges(changes, s.edges) })),
      onConnect: (connection) => set((s) => ({ edges: addEdge({ ...connection, animated: true, style: { stroke: '#4a7c59' } }, s.edges) })),

      addNode: (brain, position) => {
        const flowNode = makeFlowNode(brain, position);
        set((s) => ({ nodes: [...s.nodes, flowNode] }));
        setTimeout(() => get().detectConflicts(), 100);
      },

      updateNode: (id, data) => {
        set((s) => ({
          nodes: s.nodes.map((n) =>
            n.id === id ? { ...n, data: { ...n.data, ...data, color: categoryColors[(data.category || n.data.category) as NodeCategory] } } : n
          ),
        }));
        setTimeout(() => get().detectConflicts(), 100);
      },

      deleteNode: (id) => set((s) => ({
        nodes: s.nodes.filter((n) => n.id !== id),
        edges: s.edges.filter((e) => e.source !== id && e.target !== id),
        selectedNode: s.selectedNode === id ? null : s.selectedNode,
      })),

      setSelectedNode: (id) => set({ selectedNode: id, sidebarOpen: id !== null }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      detectConflicts: () => {
        const { nodes } = get();
        const withDeadlines = nodes.filter((n) => n.data.deadline);
        const conflictIds = new Set<string>();
        for (let i = 0; i < withDeadlines.length; i++) {
          for (let j = i + 1; j < withDeadlines.length; j++) {
            const d1 = new Date(withDeadlines[i].data.deadline as string);
            const d2 = new Date(withDeadlines[j].data.deadline as string);
            if (Math.abs(d1.getTime() - d2.getTime()) / 36e5 <= 24) {
              conflictIds.add(withDeadlines[i].id);
              conflictIds.add(withDeadlines[j].id);
            }
          }
        }
        set((s) => ({ nodes: s.nodes.map((n) => ({ ...n, data: { ...n.data, hasConflict: conflictIds.has(n.id) } })) }));
      },

      clearAll: () => set({ nodes: [], edges: [], selectedNode: null, sidebarOpen: false }),
    }),
    { name: 'synaptic-canvas', partialize: (s) => ({ nodes: s.nodes, edges: s.edges }) }
  )
);