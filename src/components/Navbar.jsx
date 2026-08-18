import React from 'react';
import { 
  Compass, 
  UserCheck, 
  Briefcase, 
  GitFork, 
  BarChart3, 
  Send, 
  Users, 
  Sparkles,
  FileText,
  LogOut,
  LogIn,
  User,
  ShieldCheck
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  currentUser, 
  onOpenAuthModal, 
  onLogout 
}) {
  const currentRole = currentUser?.role || 'Student';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 glass-panel backdrop-blur-xl bg-[#0b0f19]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Tagline */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('student-dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-glow-indigo flex items-center justify-center">
              <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
                <Compass className="w-5 h-5 text-indigo-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-300">
                  SkillBridge
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  .NET 8 Web API
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Understand skills. Find gaps. Build your career.
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('student-dashboard')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'student-dashboard'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Profile & Skills</span>
            </button>

            <button
              onClick={() => setActiveTab('job-explorer')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'job-explorer'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Job Explorer</span>
            </button>

            <button
              onClick={() => setActiveTab('roadmap')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'roadmap'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <GitFork className="w-4 h-4" />
              <span>Learning Roadmap</span>
            </button>

            <button
              onClick={() => setActiveTab('applications')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'applications'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Applications</span>
            </button>

            {currentRole === 'Recruiter' && (
              <button
                onClick={() => setActiveTab('recruiter')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'recruiter'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Recruiter Hub</span>
              </button>
            )}

            {currentRole === 'Mentor' && (
              <button
                onClick={() => setActiveTab('mentor')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'mentor'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Mentor Workspace</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'analytics'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics & ML</span>
            </button>
          </nav>

          {/* User Auth Info & Actions */}
          <div className="flex items-center space-x-3">
            {currentUser ? (
              <div className="flex items-center space-x-3 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5 text-xs">
                <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
                  {currentUser.fullName ? currentUser.fullName.charAt(0) : 'U'}
                </div>
                <div className="hidden sm:block">
                  <div className="font-bold text-white leading-tight">{currentUser.fullName}</div>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                    currentUser.role === 'Recruiter' ? 'text-cyan-400 bg-cyan-500/10' :
                    currentUser.role === 'Mentor' ? 'text-emerald-400 bg-emerald-500/10' :
                    currentUser.role === 'Admin' ? 'text-rose-400 bg-rose-500/10' :
                    'text-indigo-400 bg-indigo-500/10'
                  }`}>
                    {currentUser.role}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  title="Logout User Session"
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs transition-all shadow-glow-indigo"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
