import { NavLink } from 'react-router-dom';
import {
  Home,
  Upload,
  Layers,
  Compass,
  Clock3,
  User,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/app', icon: Home },
  { label: 'Resume Upload', path: '/app/upload', icon: Upload },
  { label: 'Skill Gap', path: '/app/skill-gap', icon: Layers },
  { label: 'Career Roadmap', path: '/app/roadmap', icon: Compass },
  { label: 'History', path: '/app/history', icon: Clock3 },
  { label: 'Profile', path: '/app/profile', icon: User },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-80 shrink-0 space-y-8 border-r border-white/10 bg-surface/70 p-6 lg:block">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Workspace</p>
        <h2 className="text-2xl font-semibold text-white">Career Center</h2>
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-3xl px-4 py-3 text-sm transition ${
                  isActive
                    ? 'bg-white/10 text-white shadow-[0_20px_50px_rgba(124,92,255,0.16)]'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <p className="text-sm text-slate-400">Weekly focus</p>
        <p className="mt-3 text-lg font-semibold text-white">Complete your AI resume review and update 3 skills.</p>
      </div>
    </aside>
  );
}
