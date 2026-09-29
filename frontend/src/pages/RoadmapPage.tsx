import { useEffect, useState } from 'react';
import { ArrowRight, CalendarDays } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import RoadmapStep from '../components/RoadmapStep';
import Loader from '../components/Loader';
import { fetchRoadmap, generateRoadmap } from '../services/resumeService';
import { useAnalysis } from '../contexts/AnalysisContext';
import type { RoadmapMilestone } from '../utils/types';

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<RoadmapMilestone[]>([]);
  const [loading, setLoading] = useState(true);

  const {
  analysisId,
  role: selectedRole,
} = useAnalysis();
  useEffect(() => {
    setLoading(true);

    const work = analysisId
      ? generateRoadmap(analysisId).then((res) => {
          const months = res.roadmap.roadmap_data.months;
          const mapped: RoadmapMilestone[] = months.map((m) => ({
            month: m.month,
            title: m.title,
            // Compatibility mapping: combine goals, milestones, and resources into `items`
            items: [...(m.goals || []), ...(m.milestones || []), ...(m.resources || [])],
          }));

          setRoadmap(mapped);
        })
      : fetchRoadmap().then((result) => setRoadmap(result));

    work.finally(() => setLoading(false));
  }, [analysisId]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Career Roadmap"
        description="A milestone-driven path from your current position to your target role, with monthly goals and learning objectives."
        action={
          <button className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]">
            Create milestone <ArrowRight className="h-4 w-4" />
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[0.7fr_0.3fr]">
        <div className="space-y-6">
          <div className="rounded-[32px] border border-white/10 bg-surface2/90 p-8 shadow-glow">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Your path</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Current position → target role</h2>
              </div>
              <CalendarDays className="h-6 w-6 text-cyan-300" />
            </div>
            <div className="mt-8 space-y-6">
              {roadmap.map((step, index) => (
                <RoadmapStep key={step.month} month={step.month} title={step.title} items={step.items} highlighted={index === 1} />
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-surface2/90 p-8 shadow-glow">
            <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Milestone guide</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">What success looks like each month</h2>
            <div className="mt-6 grid gap-4">
              <div className="rounded-3xl bg-white/5 p-4 text-slate-300">
                <p className="font-semibold text-white">Month 1</p>
                <p className="mt-2 text-sm">Build clarity on target role, improve your resume content, and validate core tech skills.</p>
              </div>
              <div className="rounded-3xl bg-white/5 p-4 text-slate-300">
                <p className="font-semibold text-white">Month 2</p>
                <p className="mt-2 text-sm">Grow portfolio impact through a project and prepare technical narratives that land interviews.</p>
              </div>
              <div className="rounded-3xl bg-white/5 p-4 text-slate-300">
                <p className="font-semibold text-white">Month 3</p>
                <p className="mt-2 text-sm">Close the loop with targeted applications, mock interviews, and documented success metrics.</p>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[32px] border border-white/10 bg-surface2/90 p-8 shadow-glow">
            <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/80">Target role</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">{selectedRole ?? "Software Engineer"}</h3>            
            <p className="mt-4 text-slate-300">A tailored plan that centers your resume, technical growth, and interview readiness across 90 days.</p>
          </div>
          <div className="rounded-[32px] border border-white/10 bg-surface2/90 p-8 shadow-glow">
            <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/80">Recommended projects</p>
            <ul className="mt-6 space-y-4 text-slate-300">
              <li className="rounded-3xl bg-white/5 px-4 py-4">
                <p className="font-semibold text-white">Design system dashboard</p>
                <p className="mt-2 text-sm">Build a modular UI system with reusable components and accessibility documentation.</p>
              </li>
              <li className="rounded-3xl bg-white/5 px-4 py-4">
                <p className="font-semibold text-white">API-backed portfolio</p>
                <p className="mt-2 text-sm">Create a full-stack case study demonstrating your architecture and deployment workflow.</p>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
