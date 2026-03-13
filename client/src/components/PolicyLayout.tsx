"use client";

import { useState } from 'react';
import { fetchApi } from '@/lib/api';

export default function PolicyLayout({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic mb-12 border-b-8 border-slate-900 dark:border-white pb-4 inline-block">{title}</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 font-medium leading-relaxed space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}
