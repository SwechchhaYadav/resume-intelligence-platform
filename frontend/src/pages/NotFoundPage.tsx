import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-6 text-center text-white">
      <div className="max-w-xl rounded-[36px] border border-white/10 bg-surface2/90 p-12 shadow-glow">
        <p className="text-sm uppercase tracking-[0.36em] text-cyan-300/80">Page not found</p>
        <h1 className="mt-6 text-5xl font-semibold">404</h1>
        <p className="mt-4 text-slate-300">The page you are looking for doesn’t exist yet — but your career insights do.</p>
        <Link to="/" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]">
          <ArrowLeft className="h-4 w-4" />
          Back to homepage
        </Link>
      </div>
    </div>
  );
}
