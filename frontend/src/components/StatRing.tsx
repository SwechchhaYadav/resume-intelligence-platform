interface StatRingProps {
  label: string;
  value: number;
  accent: string;
}

const accentMap: Record<string, string> = {
  purple: 'from-violet-500 to-fuchsia-500',
  cyan: 'from-cyan-400 to-blue-500',
  lime: 'from-lime-400 to-cyan-400',
};

export default function StatRing({ label, value, accent }: StatRingProps) {
  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-surface2/90 p-6 text-center shadow-glow">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 via-cyan-400 to-sky-500 opacity-80" />
      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{label}</p>
      <div className="mt-4 flex items-center justify-center">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white/5">
          <span className="absolute inset-0 rounded-full border border-white/10" />
          <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${accentMap[accent] || accentMap.purple} opacity-20`} />
          <span className="text-3xl font-semibold text-white">{value}%</span>
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-400">AI calibrated performance score</p>
    </div>
  );
}
