import { useEffect, useState } from 'react';
import { Settings2, Target, UserCircle } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { getProfile, type AuthUser } from '../services/authService';

export default function ProfilePage() {
  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then(setProfile)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !profile) {
    return <Loader />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Profile & Settings"
        description="Your personal information, target role, and career goals, stored in one polished place."
      />

      <div className="grid gap-6 lg:grid-cols-[0.85fr_0.75fr]">
        <Card className="space-y-6">
          <div className="flex items-center gap-4">
            <UserCircle className="h-6 w-6 text-cyan-300" />
            <h2 className="text-2xl font-semibold text-white">Personal details</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-surface/90 p-5">
              <p className="text-sm text-slate-400">Name</p>
              <p className="mt-2 text-lg font-semibold text-white">{profile.full_name}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-surface/90 p-5">
              <p className="text-sm text-slate-400">Email</p>
              <p className="mt-2 text-lg font-semibold text-white">{profile.email}</p>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-surface/90 p-5">
            <p className="text-sm text-slate-400">Location</p>
            <p className="mt-2 text-lg font-semibold text-white">Not provided</p>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="space-y-6">
            <div className="flex items-center gap-4">
              <Target className="h-6 w-6 text-violet-300" />
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Target role</p>
                <p className="mt-2 text-2xl font-semibold text-white">Not set</p>
              </div>
            </div>
            <p className="text-slate-300">Upload a resume and run an analysis to define your career goals.</p>
          </Card>

          <Card className="space-y-6">
            <div className="flex items-center gap-4">
              <Settings2 className="h-6 w-6 text-cyan-300" />
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Account settings</p>
                <p className="mt-2 text-base text-slate-300">Manage your notifications, privacy, and career preferences.</p>
              </div>
            </div>
            <div className="space-y-4">
              {['Weekly analysis digest', 'Role change alerts', 'Partner recommendations'].map((item) => (
                <div key={item} className="flex items-center justify-between rounded-3xl border border-white/10 bg-surface/90 px-4 py-4 text-sm text-slate-200">
                  <span>{item}</span>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.28em] text-slate-300">Enabled</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
