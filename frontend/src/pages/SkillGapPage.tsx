import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { Activity, Search, Zap } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SkillCard from '../components/SkillCard';
import Button from '../components/Button';
import Loader from '../components/Loader';
import { fetchAvailableRoles, getLatestResume, matchRoleWithResume } from '../services/resumeService';
import { useAnalysis } from '../contexts/AnalysisContext';
import type { MatchRoleResponse, RoleKey, RoleProfile, Resume } from '../utils/types';

export default function SkillGapPage() {
  const {
  role: ctxRole,
  setAnalysisId: setCtxAnalysisId,
  setRole: setCtxRole,
  setLatestResume: setCtxLatestResume,
  } = useAnalysis(); 
  const [role, setRole] = useState<RoleKey>(
  (ctxRole as RoleKey) || 'Software Engineer'
  ); 
  const [profile, setProfile] = useState<RoleProfile | null>(null);
  const [options, setOptions] = useState<RoleKey[]>([]);
  const [latestResume, setLatestResume] = useState<Resume | null>(null);
   
  const [matchPercentage, setMatchPercentage] = useState('');
  const [recommendations, setRecommendations] = useState<MatchRoleResponse['recommendations']>([]);
  const [heatData, setHeatData] = useState<{ skill: string; score: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    Promise.all([fetchAvailableRoles(), getLatestResume()])
      .then(([roleList, resume]) => {
        setOptions(roleList);

        if (roleList.length && !ctxRole) {
          setRole(roleList[0]);
        }

        setLatestResume(resume);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [ctxRole]);
  const runAnalysis = () => {
  if (!latestResume) return;

  setLoading(true);

  matchRoleWithResume(latestResume.id, role)
    .then((result) => {
      setProfile({
        detected: result.matched_skills,
        missing: result.missing_skills,
        recommended: result.recommendations.flatMap((item) => item.skills),
      });

      setMatchPercentage(result.match_percentage);
      setRecommendations(result.recommendations);

      const dynamicHeatData = [
        ...result.matched_skills.map((skill) => ({
          skill,
          score: 80 + Math.floor(result.score / 10),
        })),
        ...result.missing_skills.map((skill) => ({
          skill,
          score: 20,
        })),
      ];

      setHeatData(dynamicHeatData);

      setCtxAnalysisId(result.analysis_id);
      setCtxRole(result.target_role);
      setCtxLatestResume(latestResume);

    })
    .finally(() => {
      setLoading(false);
    });
};
  useEffect(() => {
  if (latestResume && !profile) {
    runAnalysis();
  }
  }, [latestResume]);

  if (loading) {
    return <Loader />;
  }

  if (!latestResume) {
    return (
      <div className="rounded-[32px] border border-white/10 bg-surface2/90 p-8 text-slate-200">
        <p className="text-lg font-semibold text-white">No resume uploaded yet.</p>
        <p className="mt-2 text-sm">Upload a resume to analyze your role fit and skill gaps.</p>
      </div>
    );
  }

  if (!profile) {
    return <Loader />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Skill Gap Analysis"
        description="Compare your detected skills to target role expectations and discover what matters most for your next career move."
        action={
          <div className="flex flex-col gap-4 sm:flex-row">
            <select
              value={role}
              onChange={(event) => setRole(event.target.value as RoleKey)}
              className="rounded-3xl border border-white/10 bg-surface/90 px-4 py-3 text-sm text-white outline-none"
            >
              {options.map((option) => (
                <option key={option} value={option} className="bg-surface2/90 text-white">
                  {option}
                </option>
              ))}
            </select>
            <Button className="w-full sm:w-auto"onClick={runAnalysis}>Refresh analysis</Button>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_0.8fr]">
        <section className="space-y-6">
          <div className="rounded-[32px] border border-white/10 bg-surface2/90 p-8 shadow-glow">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Detected Skills</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Strengths currently on your resume</h2>
              </div>
              <Activity className="h-6 w-6 text-cyan-300" />
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {profile.detected.map((skill: string) => (
                <SkillCard key={skill} name={skill} level={72 + Math.floor(Math.random() * 18)} />
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-surface2/90 p-8 shadow-glow">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Missing Skills</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">What hiring managers want to see</h2>
              </div>
              <Search className="h-6 w-6 text-violet-300" />
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {profile.missing.map((skill: string) => (
                <div key={skill} className="rounded-3xl border border-white/10 bg-surface/90 p-4 text-sm text-slate-200">
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-[32px] border border-white/10 bg-surface2/90 p-8 shadow-glow">
            <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Competency Heatmap</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">How ready you are for {role}</h2>
            <div className="mt-4 flex items-center justify-between gap-4">
              <p className="text-sm text-slate-300">Match percentage</p>
              <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-cyan-200">
                {matchPercentage || 'N/A'}
              </span>
            </div>
            <div className="mt-8 space-y-3">
              {heatData.map((row) => (
                <div key={row.skill} className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>{row.skill}</span>
                    <span>{row.score}%</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" style={{ width: `${row.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-surface2/90 p-8 shadow-glow">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Recommended Skills</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">What to add next</h2>
              </div>
              <Zap className="h-6 w-6 text-lime-300" />
            </div>
            <div className="mt-8 grid gap-3">
              {profile.recommended.map((skill: string) => (
                <div key={skill} className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-200">
                  {skill}
                </div>
              ))}
            </div>
            {recommendations.length > 0 && (
              <div className="mt-6 space-y-4">
                {recommendations.map((item) => (
                  <div key={item.category} className="rounded-3xl border border-white/10 bg-surface/90 p-5 text-sm text-slate-200">
                    <p className="font-semibold text-white">{item.category}</p>
                    <p className="mt-2 text-slate-300">{item.reason}</p>
                    {item.skills && item.skills.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {item.skills.map((skill: string) => (
                          <span
                            key={skill}
                            className="inline-flex items-center rounded-full bg-gradient-to-r from-cyan-400/20 to-violet-500/20 border border-cyan-400/30 px-3 py-1 text-xs font-medium text-cyan-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="rounded-[32px] border border-white/10 bg-surface2/90 p-8 shadow-glow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Progress summary</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Your strongest opportunity areas</h2>
          </div>
          <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-cyan-200">Dynamic role view</span>
        </div>
        <div className="mt-8 h-[320px] rounded-[28px] border border-white/10 bg-surface/90 p-5">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={heatData} margin={{ top: 20, right: 10, left: 0, bottom: 10 }}>
              <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
              <XAxis dataKey="skill" stroke="#94a3b8" tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: '#0b1120', border: '1px solid rgba(148,163,184,0.18)' }} />
              <Bar dataKey="score" fill="#8b5cf6" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
