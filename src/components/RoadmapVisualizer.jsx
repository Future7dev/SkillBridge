import React, { useState } from 'react';
import { 
  GitFork, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink, 
  BookOpen, 
  Sparkles,
  Info,
  Clock,
  Layers,
  Award
} from 'lucide-react';
import { generatePersonalizedRoadmap } from '../services/matchingEngine';
import { LEARNING_RESOURCES } from '../data/skillsData';

export default function RoadmapVisualizer({ 
  student, 
  setStudent, 
  selectedJobForRoadmap, 
  jobs 
}) {
  const activeJob = selectedJobForRoadmap || jobs[0];
  const roadmapData = generatePersonalizedRoadmap(student, activeJob);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  // Mark step complete handler (updates student skill assessment in live state)
  const toggleStepComplete = (skillId, targetLevel) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      if (next.has(skillId)) next.delete(skillId);
      else next.add(skillId);
      return next;
    });

    // Optionally update student profile level
    setStudent(prev => {
      const updated = prev.skills.map(s => {
        if (s.skillId === skillId) {
          return { ...s, selfAssessment: targetLevel };
        }
        return s;
      });
      return { ...prev, skills: updated };
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Prerequisite Graph Engine
            </span>
            <span className="text-xs text-slate-400 font-medium">Target: {activeJob.title}</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1 flex items-center space-x-3">
            <GitFork className="w-6 h-6 text-indigo-400" />
            <span>Personalized Learning Roadmap</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Prerequisites are ordered automatically using skill dependency graphs (e.g. C# → ASP.NET Core → Entity Framework → Docker → Azure).
          </p>
        </div>

        {/* Top Recommendation Box */}
        <div className="p-4 rounded-xl glass-card border border-indigo-500/30 max-w-xs space-y-1 text-xs">
          <span className="text-indigo-400 font-bold flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Priority Recommendation</span>
          </span>
          <p className="text-slate-300 font-medium text-[11px] leading-relaxed">
            {roadmapData.topRecommendation}
          </p>
        </div>
      </div>

      {/* Visual Prerequisite Architecture Diagram Card */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Platform Skill Dependency Graph</span>
        </h3>
        <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30">C#</span>
          <ArrowRight className="w-4 h-4 text-slate-600" />
          <span className="px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30">ASP.NET Core</span>
          <ArrowRight className="w-4 h-4 text-slate-600" />
          <span className="px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30">Entity Framework</span>
          <ArrowRight className="w-4 h-4 text-slate-600" />
          <span className="px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30">Docker</span>
          <ArrowRight className="w-4 h-4 text-slate-600" />
          <span className="px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30">Azure</span>
        </div>
      </div>

      {/* Step-by-Step Learning Timeline */}
      {roadmapData.isComplete ? (
        <div className="glass-panel p-12 rounded-2xl text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">All Prerequisites & Gaps Satisfied!</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Your current effective proficiencies meet or exceed all requirements for {activeJob.title}.
          </p>
        </div>
      ) : (
        <div className="space-y-6 relative before:absolute before:left-6 sm:before:left-8 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-800">
          {roadmapData.roadmap.map((step, index) => {
            const isDone = completedSteps.has(step.skillId);
            const resources = LEARNING_RESOURCES[step.skillId] || [];

            return (
              <div 
                key={step.skillId} 
                className="relative pl-14 sm:pl-20 animate-fadeIn"
              >
                {/* Node Number Circle */}
                <div 
                  className={`absolute left-0 top-0 w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm border shadow-lg transition-all ${
                    isDone 
                      ? 'bg-emerald-500 text-white border-emerald-400' 
                      : 'bg-slate-900 text-indigo-400 border-indigo-500/40'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-6 h-6" /> : index + 1}
                </div>

                {/* Step Card Content */}
                <div className={`glass-panel p-6 rounded-2xl border space-y-4 transition-all ${
                  isDone ? 'border-emerald-500/30 bg-emerald-950/10' : 'border-indigo-500/20'
                }`}>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-extrabold text-white">{step.skillName}</h3>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          Gap: -{step.gap} Levels
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Current Level: <span className="text-white font-bold">{step.currentLevel}</span> → Target Level: <span className="text-indigo-400 font-bold">{step.targetLevel}</span>
                      </p>
                    </div>

                    <button
                      onClick={() => toggleStepComplete(step.skillId, step.targetLevel)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                        isDone
                          ? 'bg-slate-800 text-slate-400 hover:text-white'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow-indigo'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isDone ? 'Mark Incomplete' : 'Complete Milestone'}</span>
                    </button>
                  </div>

                  {/* Reason & Prerequisite info */}
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-1">
                    <p><strong className="text-indigo-400">Why Recommended:</strong> {step.reason}</p>
                    {step.prerequisites.length > 0 && (
                      <p><strong className="text-slate-400">Prerequisites:</strong> {step.prerequisites.join(', ')}</p>
                    )}
                  </div>

                  {/* Curated Learning Resources */}
                  {resources.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Recommended Curated Learning Modules</span>
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {resources.map((res, rIdx) => (
                          <a
                            key={rIdx}
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all flex items-center justify-between text-xs group"
                          >
                            <div className="space-y-1">
                              <span className="font-semibold text-slate-200 group-hover:text-indigo-300 block">
                                {res.title}
                              </span>
                              <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                                <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-mono">
                                  {res.type}
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{res.duration}</span>
                                </span>
                              </div>
                            </div>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
