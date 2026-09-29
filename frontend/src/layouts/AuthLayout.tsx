import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-surface px-6 py-16 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10">
        <div className="max-w-2xl text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Resume Intelligence</p>
          <h1 className="mt-4 text-4xl font-semibold text-white">Secure access to your career intelligence workspace</h1>
          <p className="mt-4 text-slate-300">Sign in or create an account to track your resume progress, explore role fit, and build a reward-driven roadmap.</p>
        </div>
        <div className="w-full max-w-3xl rounded-[32px] border border-white/10 bg-surface2/90 p-8 shadow-glow">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
