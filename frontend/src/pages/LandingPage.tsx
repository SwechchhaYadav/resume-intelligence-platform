import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import HeroVisualization from '../components/HeroVisualization';
import { features, heroStats, testimonials, workflow } from '../utils/data';

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-surface text-white">
      <header className="border-b border-white/10 bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/" className="text-lg font-semibold tracking-tight text-white">
            Resume Intelligence
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm text-slate-300 transition hover:text-white">
              Login
            </Link>
            <Link to="/signup" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:border-white/20 hover:bg-white/10">
              Create account
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-16 px-6 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <section className="space-y-8">
          <div className="max-w-xl space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-cyan-200 shadow-glow">
              <Sparkles className="h-4 w-4" />
              Premium AI career intelligence for students and early talent
            </span>
            <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">
              Understand Your Resume. Unlock Your Career.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300">
              Analyze skills, discover gaps, benchmark yourself against industry roles, and build a stronger path toward placements.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {heroStats.map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-white/10 bg-surface2/90 p-5 shadow-glow">
                <p className="text-sm uppercase tracking-[0.36em] text-slate-500">{stat.label}</p>
                <p className="mt-4 text-3xl font-semibold text-white">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link to="/signup" className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-6 py-4 text-base font-semibold text-slate-950 transition hover:scale-[1.01]">
              Start free analysis <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/app" className="text-sm text-slate-300 transition hover:text-white">View demo dashboard</Link>
          </div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="relative"
        >
          <HeroVisualization />
        </motion.section>
      </main>

      <section id="product" className="mx-auto max-w-7xl px-6 pb-16 text-slate-300">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.36em] text-cyan-300/80">What it does</p>
            <h2 className="mt-4 text-4xl font-semibold text-white">Precision feedback for every resume, backed by role-based intelligence.</h2>
            <p className="mt-4 max-w-xl leading-8 text-slate-400">
              Track your readiness for roles like Software Engineer, Data Scientist, or Frontend Developer with a platform designed for ambitious learners.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-[28px] border border-white/10 bg-surface2/90 p-6 shadow-glow">
                <p className="text-sm font-semibold text-white">{feature.title}</p>
                <p className="mt-3 text-sm text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="rounded-[36px] border border-white/10 bg-surface2/90 p-10 shadow-glow">
            <p className="text-sm uppercase tracking-[0.36em] text-cyan-300/80">Built for growth</p>
            <h2 className="mt-4 text-4xl font-semibold text-white">A modern AI experience with premium polish and practical workflow.</h2>
            <p className="mt-4 max-w-xl text-slate-400">Driven by smooth interactions, subtle gradients, and a clear place for every insight. Move from resume upload to roadmap in under a minute.</p>
          </div>
          <div className="grid gap-5">
            {workflow.map((item) => (
              <div key={item.step} className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-glow">
                <p className="text-sm uppercase tracking-[0.36em] text-cyan-300/80">{item.step}</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="mx-auto max-w-7xl px-6 pb-20">
        <p className="text-sm uppercase tracking-[0.36em] text-cyan-300/80">Trusted by high achievers</p>
        <h2 className="mt-4 text-4xl font-semibold text-white">Success stories from driven candidates.</h2>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {testimonials.map((item) => (
            <div key={item.name} className="rounded-[32px] border border-white/10 bg-surface2/90 p-8 shadow-glow">
              <p className="text-xl leading-8 text-slate-200">“{item.quote}”</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-cyan-400/10 text-cyan-200">{item.name.charAt(0)}</div>
                <div>
                  <p className="font-semibold text-white">{item.name}</p>
                  <p className="text-sm text-slate-400">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-[36px] border border-white/10 bg-surface2/90 p-10 text-center shadow-glow">
          <p className="text-sm uppercase tracking-[0.36em] text-cyan-300/80">Ready to move faster</p>
          <h2 className="mt-4 text-4xl font-semibold text-white">Start analyzing resumes with AI confidence.</h2>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link to="/signup" className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-7 py-4 text-base font-semibold text-slate-950 transition hover:scale-[1.01]">
              Create account <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/app" className="text-sm text-slate-300 transition hover:text-white">Explore the dashboard demo</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
