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
  Award,
  Youtube,
  Play,
  X
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
  const [activeVideoModal, setActiveVideoModal] = useState(null);

  // Mark step complete handler
  const toggleStepComplete = (skillId, targetLevel) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      if (next.has(skillId)) next.delete(skillId);
      else next.add(skillId);
      return next;
    });

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
            <span className="text-xs text-slate-400 font-medium">Target: {activeJob.title || activeJob.jobTitle}</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1 flex items-center space-x-3">
            <GitFork className="w-6 h-6 text-indigo-400" />
            <span>Personalized Learning Roadmap & YouTube Video Tutorials</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Prerequisites are ordered automatically using skill dependency graphs with curated YouTube video courses for every topic.
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
            Your current effective proficiencies meet or exceed all requirements for {activeJob.title || activeJob.jobTitle}.
          </p>
        </div>
      ) : (
        <div className="space-y-6 relative before:absolute before:left-6 sm:before:left-8 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-800">
          {roadmapData.roadmap.map((step, index) => {
            const isDone = completedSteps.has(step.skillId);
            const resources = LEARNING_RESOURCES[step.skillId] || [
              {
                title: `${step.skillName} Full Tutorial for Beginners`,
                channel: "YouTube Learning",
                type: "YouTube Video",
                duration: "2 Hours",
                level: "Beginner to Intermediate",
                url: `https://www.youtube.com/results?search_query=${encodeURIComponent(step.skillName + ' tutorial full course')}`,
                embedId: null
              }
            ];

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
                <div className={`glass-panel p-6 rounded-2xl border space-y-5 transition-all ${
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
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-1">
                    <p><strong className="text-indigo-400">Why Recommended:</strong> {step.reason}</p>
                    {step.prerequisites.length > 0 && (
                      <p><strong className="text-slate-400">Prerequisites:</strong> {step.prerequisites.join(', ')}</p>
                    )}
                  </div>

                  {/* 🎥 YOUTUBE VIDEO COURSES SECTION FOR EVERY TOPIC */}
                  <div className="space-y-3 pt-3 border-t border-slate-800/80">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 flex items-center space-x-2">
                        <Youtube className="w-4 h-4 text-red-500 fill-red-500/20" />
                        <span>Recommended YouTube Video Courses & Tutorials ({step.skillName})</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {resources.map((res, rIdx) => (
                        <div
                          key={rIdx}
                          className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-red-500/40 transition-all flex flex-col justify-between text-xs space-y-3 group"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 font-extrabold text-[10px] border border-red-500/20 flex items-center space-x-1">
                                <Youtube className="w-3 h-3 text-red-500" />
                                <span>{res.channel || 'YouTube Video'}</span>
                              </span>
                              <span className="text-[10px] text-slate-400 flex items-center space-x-1 font-mono">
                                <Clock className="w-3 h-3 text-slate-500" />
                                <span>{res.duration}</span>
                              </span>
                            </div>

                            <h4 className="font-bold text-white group-hover:text-red-300 transition-colors leading-snug">
                              {res.title}
                            </h4>
                          </div>

                          <div className="flex items-center space-x-2 pt-1">
                            {/* Watch Direct Link */}
                            <a
                              href={res.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 text-[11px] font-bold transition-all flex items-center justify-center space-x-1"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Watch on YouTube</span>
                            </a>

                            {/* Optional Embedded Video Preview Modal trigger */}
                            {res.embedId && (
                              <button
                                onClick={() => setActiveVideoModal(res)}
                                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-semibold transition-all flex items-center space-x-1"
                                title="Play Video Inside SkillBridge"
                              >
                                <Play className="w-3 h-3 text-red-400 fill-red-400" />
                                <span>Preview</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EMBEDDED YOUTUBE VIDEO PLAYER MODAL */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel w-full max-w-4xl rounded-2xl border border-red-500/30 p-6 space-y-4 relative shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Youtube className="w-5 h-5 text-red-500 fill-red-500" />
                <h3 className="text-base font-bold text-white">{activeVideoModal.title}</h3>
              </div>

              <button 
                onClick={() => setActiveVideoModal(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-800">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${activeVideoModal.embedId}?autoplay=1`}
                title={activeVideoModal.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span>Channel: <strong className="text-white">{activeVideoModal.channel}</strong></span>
              <a 
                href={activeVideoModal.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-red-400 font-bold hover:underline flex items-center space-x-1"
              >
                <span>Open in YouTube Tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
