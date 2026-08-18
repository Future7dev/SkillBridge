import React, { useState } from 'react';
import { 
  X, 
  UserCheck, 
  Briefcase, 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight,
  AlertTriangle,
  UserPlus
} from 'lucide-react';
import { loginUser, registerStudent, registerRecruiter, registerMentor } from '../services/api';

export default function AuthModal({ 
  isOpen, 
  onClose, 
  onAuthSuccess, 
  defaultRole = 'Student' 
}) {
  if (!isOpen) return null;

  const [activeRoleTab, setActiveRoleTab] = useState(defaultRole); // Student | Recruiter | Mentor | Admin
  const [authMode, setAuthMode] = useState('login'); // login | register
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Common Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Student Registration Form State
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [studentDegree, setStudentDegree] = useState('B.S. Computer Science');
  const [studentUniversity, setStudentUniversity] = useState('State Institute of Technology');
  const [studentGradYear, setStudentGradYear] = useState(2027);
  const [studentTargetRoles, setStudentTargetRoles] = useState('Backend Engineer Intern, .NET Developer');

  // Recruiter Registration Form State
  const [recruiterName, setRecruiterName] = useState('');
  const [recruiterEmail, setRecruiterEmail] = useState('');
  const [recruiterPassword, setRecruiterPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyIndustry, setCompanyIndustry] = useState('Enterprise Cloud Solutions');
  const [companyWebsite, setCompanyWebsite] = useState('https://techbridge.io');

  // Mentor Registration Form State
  const [mentorName, setMentorName] = useState('');
  const [mentorEmail, setMentorEmail] = useState('');
  const [mentorPassword, setMentorPassword] = useState('');
  const [mentorInstitution, setMentorInstitution] = useState('Department of Computer Science');
  const [mentorBio, setMentorBio] = useState('Senior Cloud Architect & Academic Mentor.');
  const [mentorExpertise, setMentorExpertise] = useState('C#, ASP.NET Core, SQL Server');

  // Quick Demo One-Click Fill Handler for Seed Users
  const handleQuickDemoFill = (role) => {
    setActiveRoleTab(role);
    setAuthMode('login');
    setErrorMessage('');
    if (role === 'Student') {
      setLoginEmail('alex.rivera@university.edu');
      setLoginPassword('Student123!');
    } else if (role === 'Recruiter') {
      setLoginEmail('sarah.j@techbridge.io');
      setLoginPassword('Recruiter123!');
    } else if (role === 'Mentor') {
      setLoginEmail('marcus.vance@university.edu');
      setLoginPassword('Mentor123!');
    } else if (role === 'Admin') {
      setLoginEmail('admin@skillbridge.io');
      setLoginPassword('Admin123!');
    }
  };

  // Submit Handler with STRICT NON-EXISTENT USER REJECTION
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      let result = null;

      if (authMode === 'login') {
        result = await loginUser(loginEmail, loginPassword, activeRoleTab);
      } else {
        if (activeRoleTab === 'Student') {
          result = await registerStudent({
            fullName: studentName,
            email: studentEmail,
            password: studentPassword,
            degree: studentDegree,
            university: studentUniversity,
            graduationYear: parseInt(studentGradYear, 10),
            targetRoles: studentTargetRoles.split(',').map(r => r.trim())
          });
        } else if (activeRoleTab === 'Recruiter') {
          result = await registerRecruiter({
            fullName: recruiterName,
            email: recruiterEmail,
            password: recruiterPassword,
            companyName,
            industry: companyIndustry,
            companyWebsite
          });
        } else if (activeRoleTab === 'Mentor') {
          result = await registerMentor({
            fullName: mentorName,
            email: mentorEmail,
            password: mentorPassword,
            institution: mentorInstitution,
            bio: mentorBio,
            expertiseAreas: mentorExpertise.split(',').map(e => e.trim())
          });
        } else if (activeRoleTab === 'Admin') {
          result = await loginUser(loginEmail, loginPassword, 'Admin');
        }
      }

      setIsLoading(false);
      onAuthSuccess(result);
      onClose();
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Account does not exist or credentials are invalid. Please register first.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-indigo-500/30 p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto relative shadow-2xl">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-300">
            SkillBridge Portal Authentication
          </h2>
          <p className="text-xs text-slate-400">
            {authMode === 'login' ? 'Sign in to your registered account' : `Create a new ${activeRoleTab} account`}
          </p>
        </div>

        {/* Role Selector Tabs (Student, Recruiter, Mentor, Admin) */}
        <div className="grid grid-cols-4 gap-1.5 p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
          
          <button
            onClick={() => { setActiveRoleTab('Student'); setErrorMessage(''); }}
            className={`py-2 px-2 rounded-lg font-bold flex items-center justify-center space-x-1.5 transition-all ${
              activeRoleTab === 'Student' 
                ? 'bg-indigo-600 text-white shadow-glow-indigo' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Student</span>
          </button>

          <button
            onClick={() => { setActiveRoleTab('Recruiter'); setErrorMessage(''); }}
            className={`py-2 px-2 rounded-lg font-bold flex items-center justify-center space-x-1.5 transition-all ${
              activeRoleTab === 'Recruiter' 
                ? 'bg-cyan-600 text-white shadow-glow-cyan' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Recruiter</span>
          </button>

          <button
            onClick={() => { setActiveRoleTab('Mentor'); setErrorMessage(''); }}
            className={`py-2 px-2 rounded-lg font-bold flex items-center justify-center space-x-1.5 transition-all ${
              activeRoleTab === 'Mentor' 
                ? 'bg-emerald-600 text-white shadow-glow-emerald' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mentor</span>
          </button>

          <button
            onClick={() => { setActiveRoleTab('Admin'); setErrorMessage(''); }}
            className={`py-2 px-2 rounded-lg font-bold flex items-center justify-center space-x-1.5 transition-all ${
              activeRoleTab === 'Admin' 
                ? 'bg-rose-600 text-white' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin</span>
          </button>

        </div>

        {/* Mode Toggle (Sign In vs Create Account) */}
        {activeRoleTab !== 'Admin' && (
          <div className="flex items-center justify-center space-x-4 border-b border-slate-800 pb-3 text-xs font-semibold">
            <button
              onClick={() => { setAuthMode('login'); setErrorMessage(''); }}
              className={`pb-1 border-b-2 transition-all ${
                authMode === 'login' 
                  ? 'border-indigo-400 text-indigo-400 font-bold' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In Existing User
            </button>
            <button
              onClick={() => { setAuthMode('register'); setErrorMessage(''); }}
              className={`pb-1 border-b-2 transition-all ${
                authMode === 'register' 
                  ? 'border-indigo-400 text-indigo-400 font-bold' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Register New {activeRoleTab} Account
            </button>
          </div>
        )}

        {/* Seed Account Shortcut */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
            <span>⚡ Quick Demo Login:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoFill('Student')}
              className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 text-[11px] font-medium"
            >
              Seed Student (alex.rivera@university.edu)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoFill('Recruiter')}
              className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 text-[11px] font-medium"
            >
              Seed Recruiter (sarah.j@techbridge.io)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoFill('Mentor')}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 text-[11px] font-medium"
            >
              Seed Mentor (marcus.vance@university.edu)
            </button>
          </div>
        </div>

        {/* STRICT ERROR NOTIFICATION BANNER */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs space-y-2 animate-fadeIn">
            <div className="flex items-center space-x-2 font-bold text-rose-400">
              <AlertTriangle className="w-4 h-4" />
              <span>Authentication Error</span>
            </div>
            <p className="leading-relaxed">{errorMessage}</p>
            {authMode === 'login' && activeRoleTab !== 'Admin' && (
              <button
                type="button"
                onClick={() => {
                  setStudentEmail(loginEmail);
                  setRecruiterEmail(loginEmail);
                  setMentorEmail(loginEmail);
                  setAuthMode('register');
                  setErrorMessage('');
                }}
                className="mt-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 underline cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Account does not exist? Click here to register a new account now</span>
              </button>
            )}
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* LOGIN FORM */}
          {authMode === 'login' ? (
            <>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder={`Enter your ${activeRoleTab.toLowerCase()} email...`}
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    placeholder="Enter password..."
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </>
          ) : (
            /* REGISTRATION FORMS */
            <>
              {activeRoleTab === 'Student' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alex Rivera"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Student Email</label>
                      <input
                        type="email"
                        required
                        placeholder="alex@university.edu"
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Minimum 6 characters..."
                      value={studentPassword}
                      onChange={(e) => setStudentPassword(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="text-slate-300 font-semibold block mb-1">Degree Program</label>
                      <input
                        type="text"
                        value={studentDegree}
                        onChange={(e) => setStudentDegree(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Grad Year</label>
                      <input
                        type="number"
                        value={studentGradYear}
                        onChange={(e) => setStudentGradYear(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Target Roles (comma separated)</label>
                    <input
                      type="text"
                      value={studentTargetRoles}
                      onChange={(e) => setStudentTargetRoles(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>
              )}

              {activeRoleTab === 'Recruiter' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Recruiter Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sarah Jenkins"
                        value={recruiterName}
                        onChange={(e) => setRecruiterName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Work Email</label>
                      <input
                        type="email"
                        required
                        placeholder="sarah@company.com"
                        value={recruiterEmail}
                        onChange={(e) => setRecruiterEmail(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Password</label>
                    <input
                      type="password"
                      required
                      value={recruiterPassword}
                      onChange={(e) => setRecruiterPassword(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Company Name</label>
                      <input
                        type="text"
                        required
                        placeholder="TechBridge Systems"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Industry Sector</label>
                      <input
                        type="text"
                        value={companyIndustry}
                        onChange={(e) => setCompanyIndustry(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeRoleTab === 'Mentor' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Mentor Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Dr. Marcus Vance"
                        value={mentorName}
                        onChange={(e) => setMentorName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Academic Email</label>
                      <input
                        type="email"
                        required
                        placeholder="marcus@university.edu"
                        value={mentorEmail}
                        onChange={(e) => setMentorEmail(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Password</label>
                    <input
                      type="password"
                      required
                      value={mentorPassword}
                      onChange={(e) => setMentorPassword(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Institution / Department</label>
                    <input
                      type="text"
                      value={mentorInstitution}
                      onChange={(e) => setMentorInstitution(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Key Expertise (comma separated)</label>
                    <input
                      type="text"
                      value={mentorExpertise}
                      onChange={(e) => setMentorExpertise(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-xl text-white font-bold text-xs transition-all flex items-center justify-center space-x-2 shadow-lg ${
              activeRoleTab === 'Recruiter'
                ? 'bg-cyan-600 hover:bg-cyan-500 shadow-glow-cyan'
                : activeRoleTab === 'Mentor'
                ? 'bg-emerald-600 hover:bg-emerald-500 shadow-glow-emerald'
                : activeRoleTab === 'Admin'
                ? 'bg-rose-600 hover:bg-rose-500'
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-glow-indigo'
            }`}
          >
            {isLoading ? (
              <span>Verifying credentials...</span>
            ) : (
              <>
                <span>
                  {authMode === 'login' ? `Sign In as ${activeRoleTab}` : `Register New ${activeRoleTab}`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
}
