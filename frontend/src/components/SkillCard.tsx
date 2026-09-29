interface SkillCardProps {
  name: string;
  level: number;
}

export default function SkillCard({ name, level }: SkillCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-surface2/90 p-5">
      <div className="flex items-center justify-between text-sm text-slate-300">
        <span>{name}</span>
        <span className="font-semibold text-white">{level}%</span>
      </div>
      <div className="mt-4 h-3 rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" style={{ width: `${level}%` }} />
      </div>
    </div>
  );
}
