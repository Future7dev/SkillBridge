import React, { useState } from 'react';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  Layers, 
  Send,
  X,
  PieChart,
  GitFork,
  Star,
  LogOut
} from 'lucide-react';
import { calculateJobMatch } from '../services/matchingEngine';
import { createApplicationApi, deleteApplicationApi } from '../services/api';

export default function JobExplorer({ 
  jobs, 
  student, 
  applications, 
  setApplications, 
  setActiveTab,
  setSelectedJobForRoadmap,
  refreshApplicationsFromDatabase
}) {
  const [selectedJobForModal, setSelectedJobForModal] = useState(null);

  // Apply to job handler (Stores candidate details in MySQL Database & state!)
  const handleApply = async (job, matchScore) => {
    const targetJobId = String(job.id || job.jobId);
    const existing = applications.find(a => String(a.jobId) === targetJobId);
    if (existing) return;

    const applicantName = student.name || "Student Applicant";
    const applicantEmail = student.email || "student@university.edu";

    const newApp = {
      id: `app-${Date.now()}`,
      jobId: targetJobId,
      jobTitle: job.title || job.jobTitle,
      company: job.company || job.companyName,
      studentId: student.id || `student-${Date.now()}`,
      studentName: applicantName,
      studentEmail: applicantEmail,
      degree: student.degree || "B.S. Computer Science",
      institution: student.university || "State Institute of Technology",
      appliedDate: new Date().toISOString().split('T')[0],
      status: "Under Review",
      matchScore: matchScore,
      stageNotes: "Application submitted and saved directly to MySQL database."
    };

    // 1. Immediately update local state & localStorage
    setApplications(prev => {
      const updated = [newApp, ...prev];
      localStorage.setItem('skillbridge_apps', JSON.stringify(updated));
      return updated;
    });

    setSelectedJobForModal(null);
    setActiveTab('applications');

    // 2. Persist directly into MySQL Database via ASP.NET Core API
    try {
      const parsedUserId = parseInt(student.id || 1, 10);
      const parsedJobId = parseInt(targetJobId || 1, 10);

      await createApplicationApi({
        userId: !isNaN(parsedUserId) ? parsedUserId : 1,
        jobId: !isNaN(parsedJobId) ? parsedJobId : 1,
        matchScorePct: matchScore,
        status: "Under Review",
        notes: `Submitted by ${applicantName} (${applicantEmail})`
      });

      if (refreshApplicationsFromDatabase) {
        await refreshApplicationsFromDatabase();
      }
    } catch (err) {
      console.warn("MySQL application save note:", err);
    }
  };

  // Withdraw / Opt Out handler (Deletes from MySQL Database & state)
  const handleOptOut = async (targetJobId) => {
    const stringId = String(targetJobId);
    const targetApp = applications.find(a => String(a.jobId) === stringId);

    setApplications(prev => {
      const updated = prev.filter(a => String(a.jobId) !== stringId);
      localStorage.setItem('skillbridge_apps', JSON.stringify(updated));
      return updated;
    });

    if (targetApp && !isNaN(targetApp.id)) {
      try {
        await deleteApplicationApi(targetApp.id);
      } catch (err) {
        console.warn("MySQL application delete note:", err);
      }
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-3">
            <Briefcase className="w-6 h-6 text-indigo-400" />
            <span>Internship & Job Postings ({jobs.length} Open Positions)</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time weighted skill matching automatically computes your fit score for each role.
          </p>
        </div>
      </div>

      {/* Job Postings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => {
          const jobId = String(job.id || job.jobId);
          const matchResult = calculateJobMatch(student, job);
          const isApplied = applications.some(a => String(a.jobId) === jobId);

          return (
            <div 
              key={jobId} 
              className={`glass-panel p-6 rounded-2xl flex flex-col justify-between glass-panel-hover group relative overflow-hidden ${
                job.isNew ? 'border-2 border-cyan-500/50 shadow-glow-cyan' : ''
              }`}
            >
              <div className="space-y-4">
                
                {/* Header & Match Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        {job.type || job.employmentType || 'Internship'}
                      </span>
                      {job.isNew && (
                        <span className="text-[10px] font-extrabold text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded-full border border-cyan-500/30 flex items-center space-x-1 animate-pulse">
                          <Star className="w-3 h-3 fill-cyan-300 text-cyan-300" />
                          <span>NEW POSITION</span>
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-lg text-white mt-1 group-hover:text-indigo-300 transition-colors">
                      {job.title || job.jobTitle}
                    </h3>
                    <p className="text-xs font-semibold text-slate-300">{job.company || job.companyName}</p>
                  </div>

                  {/* Calculated Score Pill */}
                  <div className="text-right">
                    <div className="px-3 py-1 rounded-xl bg-slate-900 border border-indigo-500/30 flex flex-col items-center">
                      <span className="text-lg font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                        {matchResult.jobMatchScore}%
                      </span>
                      <span className="text-[9px] font-semibold text-slate-400 uppercase">Match</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-xs text-slate-400">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{job.location}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{job.postedDate}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {job.description}
                </p>

                {/* Skill Pills preview */}
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-slate-300 block">Required Skills & Gaps:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {matchResult.skillBreakdown.slice(0, 5).map((sk) => (
                      <span 
                        key={sk.skillId}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center space-x-1 border ${
                          sk.gap === 0 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : sk.gap >= 3
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}
                      >
                        <span>{sk.skillName}</span>
                        {sk.gap > 0 && <span className="font-bold text-[9px]">(-{sk.gap})</span>}
                      </span>
                    ))}
                    {matchResult.skillBreakdown.length > 5 && (
                      <span className="text-[10px] text-slate-500 font-mono">+{matchResult.skillBreakdown.length - 5} more</span>
                    )}
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedJobForModal(job)}
                  className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center justify-center space-x-1"
                >
                  <PieChart className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Gap Analysis</span>
                </button>

                {isApplied ? (
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Applied</span>
                    </span>
                    <button
                      onClick={() => handleOptOut(jobId)}
                      className="px-2.5 py-2 rounded-xl bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/20 text-xs font-semibold transition-all"
                      title="Opt Out / Withdraw Application"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleApply(job, matchResult.jobMatchScore)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all flex items-center space-x-1 shadow-glow-indigo"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Apply</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Modal: Full Gap Analysis */}
      {selectedJobForModal && (() => {
        const modalJob = selectedJobForModal;
        const res = calculateJobMatch(student, modalJob);
        const jobId = String(modalJob.id || modalJob.jobId);
        const isApplied = applications.some(a => String(a.jobId) === jobId);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="glass-panel w-full max-w-3xl rounded-2xl max-h-[90vh] overflow-y-auto border border-indigo-500/30 p-6 sm:p-8 space-y-6 shadow-2xl relative">
              
              <button 
                onClick={() => setSelectedJobForModal(null)}
                className="absolute top-6 right-6 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{modalJob.company || modalJob.companyName}</span>
                  <h2 className="text-2xl font-black text-white">{modalJob.title || modalJob.jobTitle}</h2>
                  <p className="text-xs text-slate-400 mt-1">{modalJob.location} • {modalJob.type || modalJob.employmentType}</p>
                </div>

                <div className="flex items-center space-x-3 bg-slate-900/90 p-4 rounded-xl border border-indigo-500/30">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-medium">Weighted Job Match</span>
                    <span className="text-2xl font-black text-indigo-400">{res.jobMatchScore}%</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-sm">
                    {res.summaryLabel.slice(0, 8)}
                  </div>
                </div>
              </div>

              {/* Explainable Skill Breakdown Table */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span>Explainable Skill Gap Breakdown</span>
                  </h3>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="p-3">Skill</th>
                        <th className="p-3">Importance</th>
                        <th className="p-3 text-center">Required</th>
                        <th className="p-3 text-center">Student</th>
                        <th className="p-3 text-center">Gap</th>
                        <th className="p-3 text-center">Weight</th>
                        <th className="p-3 text-center">Skill Match</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {res.skillBreakdown.map((item) => (
                        <tr key={item.skillId} className="hover:bg-slate-900/40">
                          <td className="p-3 font-bold text-white">{item.skillName}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              item.importance === 'Required' || item.isRequired
                                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                                : 'bg-slate-800 text-slate-400'
                            }`}>
                              {item.importance || (item.isRequired ? 'Required' : 'Preferred')}
                            </span>
                          </td>
                          <td className="p-3 text-center font-mono font-bold text-indigo-300">{item.requiredProficiency}</td>
                          <td className="p-3 text-center font-mono font-bold text-white">{item.studentProficiency}</td>
                          <td className="p-3 text-center font-mono font-bold">
                            {item.gap === 0 ? (
                              <span className="text-emerald-400">0 (Match)</span>
                            ) : (
                              <span className={item.gap >= 3 ? "text-rose-400" : "text-amber-400"}>
                                -{item.gap}
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-center font-mono text-slate-400">{item.weight}</td>
                          <td className="p-3 text-center font-mono font-bold text-cyan-400">
                            {(item.skillMatchRatio * 100).toFixed(0)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
                <button
                  onClick={() => {
                    setSelectedJobForRoadmap(modalJob);
                    setSelectedJobForModal(null);
                    setActiveTab('roadmap');
                  }}
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
                >
                  <GitFork className="w-4 h-4 text-indigo-400" />
                  <span>Generate Roadmap for Job</span>
                </button>

                {!isApplied ? (
                  <button
                    onClick={() => handleApply(modalJob, res.jobMatchScore)}
                    className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-glow-indigo"
                  >
                    <Send className="w-4 h-4" />
                    <span>Confirm Application</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleOptOut(jobId);
                      setSelectedJobForModal(null);
                    }}
                    className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Opt Out / Withdraw Application</span>
                  </button>
                )}
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
}
