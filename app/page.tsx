'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Toolbar } from './components/Toolbar';
import { BrainDumpPanel } from './components/BrainDumpPanel';
import { YouTubePanel } from './components/YouTubePanel';
import { NodeEditor } from './components/NodeEditor';
import { useCanvasStore } from './store/canvasStore';

const Canvas = dynamic(() => import('./components/Canvas').then(m => ({ default: m.Canvas })), { ssr: false });

export default function Home() {
  const [showBrainDump, setShowBrainDump] = useState(false);
  const [showYouTube, setShowYouTube] = useState(false);
  const { sidebarOpen, selectedNode } = useCanvasStore();

  const openBrainDump = () => { setShowYouTube(false); setShowBrainDump(true); };
  const openYouTube = () => { setShowBrainDump(false); setShowYouTube(true); };

  return (
    <main>
      <Toolbar onBrainDump={openBrainDump} onYouTube={openYouTube} />
      <Canvas />
      {showBrainDump && <BrainDumpPanel onClose={() => setShowBrainDump(false)} />}
      {showYouTube && <YouTubePanel onClose={() => setShowYouTube(false)} />}
      {sidebarOpen && selectedNode && <NodeEditor />}
    </main>
  );
}