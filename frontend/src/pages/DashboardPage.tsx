import { useEffect, useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowUpRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import StatRing from '../components/StatRing';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { fetchDashboard } from '../services/resumeService';
import type { DashboardSummary } from '../utils/types';

const colors = ['#8b5cf6', '#22d3ee', '#84cc16', '#f472b6'];

export default function DashboardPage() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard().then((result) => {
      setData(result);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return <Loader />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Intelligence Center"
        description="Your latest resume analysis, role fit metrics, and prioritized recommendations in one polished workspace."
        action={
          <button className="rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]">
            Export report
          </button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="space-y-5">
            <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Resume Score</p>
            <div className="flex items-end gap-4">
              <div>
                <p className="text-6xl font-semibold text-white">{data.resumeScore}</p>
                <p className="mt-2 text-sm text-slate-400">Overall performance of your current resume profile.</p>
              </div>
              <div className="rounded-full bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">+12 since last review</div>
            </div>
          </Card>
          <StatRing label="Skill Match" value={data.skillMatchScore} accent="cyan" />
          <StatRing label="Industry Readiness" value={data.readinessScore} accent="purple" />
          <StatRing label="Role Fit" value={data.roleFitScore} accent="lime" />
        </div>

        <Card className="grid gap-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Growth summary</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Your improvement path</h2>
            </div>
            <ArrowUpRight className="h-5 w-5 text-cyan-300" />
          </div>
          <div className="grid gap-4 rounded-[28px] border border-white/10 bg-surface/90 p-4">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>Resume strengths</span>
              <span>{data.strengths.length} items</span>
            </div>
            <div className="grid gap-3">
              {data.strengths.map((item) => (
                <span key={item} className="rounded-3xl bg-white/5 px-4 py-3 text-sm text-slate-200">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="grid gap-4 rounded-[28px] border border-white/10 bg-surface/90 p-4">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>Key recommendations</span>
              <span>{data.recommendations.length} tactics</span>
            </div>
            <div className="space-y-3">
              {data.recommendations.map((item: string) => (
                <div key={item} className="rounded-3xl bg-white/5 px-4 py-3 text-sm text-slate-200">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_0.75fr]">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Radar view</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Resume intelligence spectrum</h2>
            </div>
          </div>
          <div className="mt-8 h-[420px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={data.radarData} outerRadius="80%">
                <PolarGrid stroke="rgba(148,163,184,0.22)" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                <Radar name="Score" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Skill distribution</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Core competencies</h2>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.distribution}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={100}
                  paddingAngle={3}
                >
                  {data.distribution.map((entry, rowIndex) => (
                    <Cell key={entry.name} fill={colors[rowIndex % colors.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid gap-3">
            {data.distribution.map((entry) => (
              <div key={entry.name} className="flex items-center justify-between rounded-3xl bg-surface/80 px-4 py-3 text-sm text-slate-300">
                <span>{entry.name}</span>
                <span className="font-semibold text-white">{entry.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
