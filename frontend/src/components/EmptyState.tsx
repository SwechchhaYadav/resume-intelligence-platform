import { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon: ReactNode;
}

export default function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="rounded-[32px] border border-white/10 bg-white/5 p-10 text-center text-slate-300 shadow-glow">
      <div className="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-white/5 text-cyan-300">
        {icon}
      </div>
      <h2 className="text-2xl font-semibold text-white">{title}</h2>
      <p className="mt-3 max-w-xl mx-auto text-sm leading-7 text-slate-400">{description}</p>
    </div>
  );
}
