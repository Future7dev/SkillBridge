import React, { useState } from 'react';
import { 
  Compass, 
  UserCheck, 
  Briefcase, 
  GitFork, 
  BarChart3, 
  Send, 
  Users, 
  Sparkles,
  LogOut,
  LogIn,
  Menu,
  X
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  currentUser, 
  onOpenAuthModal, 
  onLogout 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentRole = currentUser?.role || 'Student';

  const navItems = [
    { id: 'student-dashboard', label: 'Profile & Skills', icon: UserCheck, roleRequired: null },
    { id: 'job-explorer', label: 'Job Explorer', icon: Briefcase, roleRequired: null },
    { id: 'roadmap', label: 'Learning Roadmap', icon: GitFork, roleRequired: null },
    { id: 'applications', label: 'Applications', icon: Send, roleRequired: null },
    { id: 'recruiter', label: 'Recruiter Hub', icon: Users, roleRequired: 'Recruiter', highlight: 'cyan' },
    { id: 'mentor', label: 'Mentor Workspace', icon: Sparkles, roleRequired: 'Mentor', highlight: 'emerald' },
    { id: 'analytics', label: 'Analytics & ML', icon: BarChart3, roleRequired: null }
  ];

  const visibleNavItems = navItems.filter(item => {
    if (!item.roleRequired) return true;
    return currentRole === item.roleRequired;
  });

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 glass-panel backdrop-blur-xl bg-[#0b0f19]/90 shadow-2xl">
      <div className="w-full max-w-[1650px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Tagline */}
          <div 
            className="flex items-center space-x-3 cursor-pointer flex-shrink-0"
            onClick={() => setActiveTab('student-dashboard')}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-glow-indigo flex items-center justify-center">
              <div className="w-full h-full bg-[#0b0f19] rounded-[9px] flex items-center justify-center">
                <Compass className="w-5 h-5 text-indigo-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-300">
                  SkillBridge
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hidden lg:inline-block">
                  MySQL & .NET 8
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Nav Tabs (Spacious & Non-Overlapping) */}
          <nav className="hidden lg:flex items-center space-x-1.5 overflow-x-auto py-1">
            {visibleNavItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? item.highlight === 'cyan'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                        : item.highlight === 'emerald'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-indigo-600/25 text-indigo-300 border border-indigo-500/40 shadow-glow-indigo'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${item.highlight === 'cyan' ? 'text-cyan-400' : item.highlight === 'emerald' ? 'text-emerald-400' : 'text-indigo-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Profile & Auth Actions */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            {currentUser ? (
              <div className="flex items-center space-x-3 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5 text-xs shadow-inner">
                <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
                  {currentUser.fullName ? currentUser.fullName.charAt(0) : 'U'}
                </div>
                <div className="hidden sm:block">
                  <div className="font-bold text-white leading-tight text-xs">{currentUser.fullName}</div>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                    currentUser.role === 'Recruiter' ? 'text-cyan-400 bg-cyan-500/10' :
                    currentUser.role === 'Mentor' ? 'text-emerald-400 bg-emerald-500/10' :
                    'text-indigo-400 bg-indigo-500/10'
                  }`}>
                    {currentUser.role}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  title="Logout User Session"
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors ml-1"
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

            {/* Mobile / Tablet Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#0b0f19] px-4 py-3 space-y-2 animate-fadeIn">
          {visibleNavItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-indigo-600/25 text-indigo-300 border border-indigo-500/40'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4 text-indigo-400" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
