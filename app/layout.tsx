
import React from 'react';
import '@/app/globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JengaPrompts Pro - AI Prompt Enhancement Tool',
  description: 'Transform your ideas into powerful, detailed prompts across multiple modalities with AI-powered enhancement.',
  keywords: 'AI, prompts, enhancement, text generation, image prompts, video prompts, audio prompts, code generation',
  authors: [{ name: 'JengaPrompts Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'JengaPrompts Pro',
    description: 'AI-powered prompt enhancement tool for creators and developers',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
