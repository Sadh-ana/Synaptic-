import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Synaptic — Visual Second Brain',
  description: 'Infinite AI-powered canvas for organizing your goals, tasks, and learning roadmaps.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}