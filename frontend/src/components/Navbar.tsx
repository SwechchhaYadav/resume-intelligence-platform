import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { label: 'Product', href: '#product' },
  { label: 'Features', href: '#features' },
  { label: 'Workflow', href: '#workflow' },
  { label: 'Testimonials', href: '#testimonials' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-surface/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="inline-flex items-center gap-3 text-lg font-semibold">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-violet-300 shadow-glow">
            <Sparkles className="h-5 w-5" />
          </span>
          Resume Intelligence
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="text-sm text-slate-300 transition hover:text-white">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <button
              type="button"
              onClick={handleSignOut}
              className="hidden items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/20 hover:text-white lg:inline-flex"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          )}
          <Link
            to="/login"
            className="hidden rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/20 hover:text-white lg:inline-flex"
          >
            Sign in
          </Link>
          <Link
            to="/app"
            className="hidden rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01] lg:inline-flex"
          >
            Start analyzing
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
