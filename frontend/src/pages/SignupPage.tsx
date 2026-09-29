import { FormEvent, useState } from 'react';
import { Eye, EyeOff, Github, Globe } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!fullName || !email || !password) {
      setError('Provide your name, email, and password to continue.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      await signUp({ full_name: fullName, email, password });
      navigate('/app');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unable to create account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3 text-center">
        <p className="text-sm uppercase tracking-[0.36em] text-cyan-300/80">Create your account</p>
        <h1 className="text-4xl font-semibold text-white">Start a smarter career journey</h1>
        <p className="max-w-xl mx-auto text-slate-400">Sign up to get personalized resume scoring, skill gap maps, and role-specific preparation plans.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-start">
        <div className="rounded-[32px] border border-white/10 bg-surface2/90 p-8 shadow-glow">
          <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Fast onboarding</p>
          <div className="mt-6 grid gap-4">
            <button className="inline-flex w-full items-center justify-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10">
              <Globe className="h-4 w-4" />
              Sign up with Google
            </button>
            <button className="inline-flex w-full items-center justify-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10">
              <Github className="h-4 w-4" />
              Sign up with GitHub
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-[32px] border border-white/10 bg-surface2/90 p-8 shadow-glow">
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-200">Full name</label>
            <input
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition focus:border-cyan-300/80"
              placeholder="Jane Doe"
            />
          </div>
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-200">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition focus:border-cyan-300/80"
              placeholder="hello@example.com"
            />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm font-medium text-slate-200">Password</label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-4 pr-14 text-white outline-none transition focus:border-cyan-300/80"
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-rose-300">{error}</p>}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Create account'}
          </Button>
          <p className="text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-white hover:text-cyan-200">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
