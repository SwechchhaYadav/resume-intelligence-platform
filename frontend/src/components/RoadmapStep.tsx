interface RoadmapStepProps {
  month: string;
  title: string;
  items: string[];
  highlighted?: boolean;
}

export default function RoadmapStep({ month, title, items, highlighted }: RoadmapStepProps) {
  return (
    <div className="rounded-[32px] border border-white/10 bg-surface2/90 p-6 shadow-glow">
      <div className="flex items-center justify-between gap-3 text-sm text-slate-400">
        <span className="font-semibold text-white">{month}</span>
        {highlighted && <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-cyan-200">Core focus</span>}
      </div>
      <h3 className="mt-4 text-xl font-semibold text-white">{title}</h3>
      <ul className="mt-4 space-y-3 text-slate-300">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span className="mt-1 h-2 w-2 rounded-full bg-cyan-400" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
