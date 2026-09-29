interface TimelineItemProps {
  date: string;
  title: string;
  summary: string;
  score: number;
  growth: number;
}

export default function TimelineItem({ date, title, summary, score, growth }: TimelineItemProps) {
  return (
    <div className="grid gap-4 rounded-[32px] border border-white/10 bg-surface2/90 p-6 shadow-glow sm:grid-cols-[1fr_1fr]">
      <div>
        <p className="text-sm uppercase tracking-[0.32em] text-slate-500">{date}</p>
        <h3 className="mt-3 text-xl font-semibold text-white">{title}</h3>
        <p className="mt-2 text-sm leading-7 text-slate-300">{summary}</p>
      </div>
      <div className="flex flex-col justify-center gap-4 border-t border-white/10 pt-4 text-sm text-slate-300 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Score</p>
          <p className="mt-2 text-3xl font-semibold text-white">{score}%</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Skill growth</p>
          <p className="mt-2 text-3xl font-semibold text-white">+{growth}%</p>
        </div>
      </div>
    </div>
  );
}
