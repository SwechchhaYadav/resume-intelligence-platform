import { motion } from 'framer-motion';
import { Sparkles, PieChart } from 'lucide-react';

export default function HeroVisualization() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
      className="relative w-full overflow-hidden rounded-[36px] border border-white/10 bg-white/5 p-7 shadow-glow"
    >
      <div className="absolute inset-0 bg-hero-grid opacity-60" />
      <div className="relative grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-cyan-100">
            <Sparkles className="h-4 w-4 text-cyan-200" />
            Resume insights in real time
          </div>
          <h3 className="text-3xl font-semibold text-white">See your resume readiness at a glance.</h3>
          <p className="max-w-xl text-slate-300">
            The platform surfaces your strongest achievements, highlights missing skills, and shows how your profile maps to your ambitions.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {['82% Fit', '15 Gaps', '4 Roles'].map((metric) => (
              <div key={metric} className="rounded-3xl bg-surface2/95 p-4 text-center">
                <p className="text-2xl font-semibold text-white">{metric.split(' ')[0]}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.32em] text-slate-500">{metric.split(' ')[1]}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative flex items-center justify-center">
          <div className="absolute -right-8 -top-10 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="rounded-[32px] border border-white/10 bg-surface2/95 p-6 text-white shadow-glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Career Pulse</p>
                <p className="mt-2 text-3xl font-semibold text-white">82</p>
              </div>
              <div className="rounded-3xl bg-white/5 p-3 text-cyan-300">
                <PieChart className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-6 grid gap-4">
              <div className="rounded-3xl bg-surface/90 p-4">
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>Skill match</span>
                  <span>74%</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white/10">
                  <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" />
                </div>
              </div>
              <div className="rounded-3xl bg-surface/90 p-4">
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>Role fit</span>
                  <span>81%</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white/10">
                  <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-lime-400 to-cyan-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
