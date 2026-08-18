import React from 'react';
import { 
  Sparkles, 
  UserCheck, 
  Briefcase, 
  GitFork, 
  BrainCircuit, 
  BarChart3, 
  Database, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Zap,
  LogIn
} from 'lucide-react';

export default function LandingPage({ onOpenAuthModal }) {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 selection:bg-indigo-500 selection:text-white flex flex-col justify-between">
      
      {/* LANDING PAGE HEADER (No Navbar tabs, only Brand logo + Sign In CTA) */}
      <header className="w-full border-b border-slate-800/80 glass-panel backdrop-blur-xl bg-[#0b0f19]/80 py-4 px-6 sm:px-12 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-glow-indigo flex items-center justify-center">
              <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-indigo-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-300">
                  SkillBridge
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  .NET 8 Web API
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Understand skills. Find gaps. Build your career.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => onOpenAuthModal('Student')}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs transition-all shadow-glow-indigo"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In / Register</span>
            </button>
          </div>

        </div>
      </header>

      {/* MAIN LANDING BODY */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20 flex-1">
        
        {/* HERO SECTION */}
        <section className="relative pt-6 pb-12 text-center space-y-8 max-w-5xl mx-auto px-4">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-cyan-500/15 to-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 shadow-glow-indigo">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span className="text-xs font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-cyan-300 to-emerald-300">
              ASP.NET Core Web API + SQLite Relational Database Engine
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none">
            Understand your skills.{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">
              Find your gaps.
            </span>{' '}
            Build your career.
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
            SkillBridge compares student profiles against real internship requirements. 
            Calculate explainable readiness scores, parse resumes using TF-IDF NLP vectorization, and follow prerequisite-aware learning roadmaps.
          </p>

          {/* Hero CTAs (No Guest mode, users must Sign In or Register) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onOpenAuthModal('Student')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-extrabold text-sm transition-all shadow-glow-indigo flex items-center justify-center space-x-2 group"
            >
              <span>Sign In as Student</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onOpenAuthModal('Recruiter')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-panel hover:bg-slate-800 text-white font-extrabold text-sm border border-slate-700 transition-all flex items-center justify-center space-x-2"
            >
              <Briefcase className="w-4 h-4 text-cyan-400" />
              <span>Recruiter & Company Portal</span>
            </button>

            <button
              onClick={() => onOpenAuthModal('Mentor')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-panel hover:bg-slate-800 text-white font-extrabold text-sm border border-slate-700 transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Mentor Workspace</span>
            </button>
          </div>

          <div className="pt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400 font-mono">
            <span className="px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800">React.js</span>
            <span className="px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-indigo-300">ASP.NET Core Web API</span>
            <span className="px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-cyan-300">SQLite SQL Database</span>
            <span className="px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-emerald-300">TF-IDF + Cosine Similarity</span>
          </div>
        </section>

        {/* EXPLAINABLE BENCHMARK PREVIEW */}
        <section className="glass-panel p-8 rounded-3xl border border-indigo-500/30 max-w-5xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">Explainable Skill Gap Engine</span>
              <h2 className="text-2xl font-black text-white mt-1">Deterministic Matching & Scoring</h2>
              <p className="text-xs text-slate-400 mt-1">
                Every match score is calculated transparently using exact required proficiencies and weights.
              </p>
            </div>

            <div className="flex items-center space-x-3 bg-slate-950/90 p-4 rounded-2xl border border-indigo-500/30">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Benchmark Algorithm</span>
                <span className="text-2xl font-black text-indigo-400">72% Job Match</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-xs text-center leading-tight">
                Strong Match
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">Skill Entity</th>
                  <th className="p-3 text-center">Required (0-5)</th>
                  <th className="p-3 text-center">Student Effective</th>
                  <th className="p-3 text-center">Gap</th>
                  <th className="p-3 text-center">Weight</th>
                  <th className="p-3 text-center">Formula Ratio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                <tr className="hover:bg-slate-900/40">
                  <td className="p-3 font-sans font-bold text-white">C#</td>
                  <td className="p-3 text-center text-indigo-300">3</td>
                  <td className="p-3 text-center text-white">4</td>
                  <td className="p-3 text-center text-emerald-400">0 (Match)</td>
                  <td className="p-3 text-center text-slate-400">20</td>
                  <td className="p-3 text-center text-cyan-400 font-bold">1.0 (100%)</td>
                </tr>
                <tr className="hover:bg-slate-900/40">
                  <td className="p-3 font-sans font-bold text-white">ASP.NET Core</td>
                  <td className="p-3 text-center text-indigo-300">3</td>
                  <td className="p-3 text-center text-white">4</td>
                  <td className="p-3 text-center text-emerald-400">0 (Match)</td>
                  <td className="p-3 text-center text-slate-400">25</td>
                  <td className="p-3 text-center text-cyan-400 font-bold">1.0 (100%)</td>
                </tr>
                <tr className="hover:bg-slate-900/40">
                  <td className="p-3 font-sans font-bold text-white">Entity Framework</td>
                  <td className="p-3 text-center text-indigo-300">3</td>
                  <td className="p-3 text-center text-white">0</td>
                  <td className="p-3 text-center text-rose-400">-3 (High Gap)</td>
                  <td className="p-3 text-center text-slate-400">15</td>
                  <td className="p-3 text-center text-rose-400 font-bold">0.0 (0%)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ROLE CHOICES CARDS */}
        <section className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-white">Choose Your Role to Authenticate</h2>
            <p className="text-sm text-slate-400">Existing users sign in; new users create a role-specific account.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Student Card */}
            <div className="glass-panel p-8 rounded-3xl border border-indigo-500/30 flex flex-col justify-between space-y-6 glass-panel-hover">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">For Students</h3>
                <ul className="space-y-2.5 text-xs text-slate-400">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    <span>Build skill matrix & evidence</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    <span>Parse resume text with NLP</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    <span>Generate learning roadmaps</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onOpenAuthModal('Student')}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-glow-indigo"
              >
                Sign In / Register as Student
              </button>
            </div>

            {/* Recruiter Card */}
            <div className="glass-panel p-8 rounded-3xl border border-cyan-500/30 flex flex-col justify-between space-y-6 glass-panel-hover">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">For Recruiters</h3>
                <ul className="space-y-2.5 text-xs text-slate-400">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>Post internship requirements</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>Evaluate candidate leaderboards</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>TF-IDF document similarity</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onOpenAuthModal('Recruiter')}
                className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-all shadow-glow-cyan"
              >
                Sign In / Register as Recruiter
              </button>
            </div>

            {/* Mentor Card */}
            <div className="glass-panel p-8 rounded-3xl border border-emerald-500/30 flex flex-col justify-between space-y-6 glass-panel-hover">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">For Mentors</h3>
                <ul className="space-y-2.5 text-xs text-slate-400">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Review assigned students</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Validate roadmap progress</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Post guidance notes</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onOpenAuthModal('Mentor')}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-glow-emerald"
              >
                Sign In / Register as Mentor
              </button>
            </div>

          </div>
        </section>

      </div>

      {/* LANDING FOOTER */}
      <footer className="w-full border-t border-slate-800/80 bg-[#070a12] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span className="font-bold text-slate-300">SkillBridge</span> — Smart Internship & Skill Gap Platform
            <span className="block sm:inline text-slate-600 sm:ml-2">Understand your skills. Find your gaps. Build your career.</span>
          </div>
          <div className="flex items-center space-x-3 text-[11px] font-mono">
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-indigo-400">React 18</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-400">.NET 8.0 Web API</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400">SQLite SQL DB</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
