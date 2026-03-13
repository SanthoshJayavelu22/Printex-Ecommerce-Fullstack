'use client';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic mb-8">About Printex</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          <p className="text-lg font-bold text-slate-600 dark:text-slate-400 leading-relaxed italic">
            At Printex Labels, we believe every brand deserves to stand out with premium quality and professional design. Our journey started with a simple mission: to make high-end custom labeling accessible to everyone.
          </p>
          <div className="space-y-6">
            <h2 className="text-2xl font-black uppercase tracking-widest text-primary italic">Our Philosophy</h2>
            <p className="font-bold text-slate-500">We don't just print labels; we build visual identities. Every roll, every sheet, and every design is handled with extreme attention to detail.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
