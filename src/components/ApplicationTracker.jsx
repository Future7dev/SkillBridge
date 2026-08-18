import React from 'react';
import { 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Briefcase, 
  Layers,
  ChevronRight
} from 'lucide-react';

const STAGES = ["Applied", "Under Review", "Interview", "Offer"];

export default function ApplicationTracker({ applications, setApplications }) {
  
  const updateStage = (appId, newStatus) => {
    setApplications(prev => prev.map(a => {
      if (a.id === appId) {
        return { ...a, status: newStatus };
      }
      return a;
    }));
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-3">
            <Send className="w-6 h-6 text-indigo-400" />
            <span>Student Application Tracker</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track recruitment stage progress, interview status, and explainable TF-IDF screening results.
          </p>
        </div>
      </div>

      {/* Applications List */}
      {applications.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center space-y-4">
          <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-300">No Applications Submitted Yet</h3>
          <p className="text-xs text-slate-500">Explore open postings in the Job Explorer tab to apply.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => {
            const currentStageIdx = STAGES.indexOf(app.status);

            return (
              <div 
                key={app.id}
                className="glass-panel p-6 rounded-2xl space-y-6 glass-panel-hover"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      {app.company}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1">{app.jobTitle}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Applied on {app.appliedDate}</p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block font-medium">Match Score</span>
                      <span className="text-2xl font-black text-indigo-400">{app.matchScore}%</span>
                    </div>

                    {/* Stage selector toggle */}
                    <select
                      value={app.status}
                      onChange={(e) => updateStage(app.id, e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-white text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
                    >
                      {STAGES.map(stg => (
                        <option key={stg} value={stg}>{stg}</option>
                      ))}
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                {/* Visual Recruitment Pipeline Steps */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                  {STAGES.map((stg, sIdx) => {
                    const isPassed = sIdx <= currentStageIdx && app.status !== "Rejected";
                    const isCurrent = sIdx === currentStageIdx && app.status !== "Rejected";

                    return (
                      <div 
                        key={stg}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          isCurrent 
                            ? 'bg-indigo-600/20 border-indigo-500/50 text-white shadow-glow-indigo font-bold'
                            : isPassed
                            ? 'bg-slate-900/80 border-slate-700 text-emerald-400'
                            : 'bg-slate-950/40 border-slate-800 text-slate-600'
                        }`}
                      >
                        <span className="text-[10px] font-mono block">Step 0{sIdx + 1}</span>
                        <span className="text-xs">{stg}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Stage Notes */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300">
                  <strong className="text-indigo-400">Recruiter Notes:</strong> {app.stageNotes}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
