import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import PageHeader from '../components/PageHeader';
import TimelineItem from '../components/TimelineItem';
import Loader from '../components/Loader';
import { fetchHistory } from '../services/resumeService';
import type { HistoryRecord } from '../utils/types';

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory().then((result) => {
      setHistory(result);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Resume History"
        description="Review how your resume scores have improved over time, and compare past analyses side by side."
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_0.75fr]">
        <div className="space-y-6">
          {history.map((record) => (
            <TimelineItem key={record.id} date={record.id} title={record.title} summary={record.summary} score={record.score} growth={record.skillGrowth} />
          ))}
        </div>

        <div className="rounded-[32px] border border-white/10 bg-surface2/90 p-8 shadow-glow">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Score progression</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Historic resume performance</h2>
          </div>
          <div className="mt-8 h-[340px] rounded-[28px] bg-surface/90 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis dataKey="title" stroke="#94a3b8" tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" domain={[60, 90]} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#0b1120', border: '1px solid rgba(148,163,184,0.18)' }} />
                <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={4} dot={{ r: 4, fill: '#22d3ee' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
