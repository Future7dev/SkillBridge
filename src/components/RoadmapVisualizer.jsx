import React, { useState, useEffect } from 'react';
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
  X,
  FileText,
  BrainCircuit,
  Filter,
  Terminal,
  Cpu
} from 'lucide-react';
import { generatePersonalizedRoadmap } from '../services/matchingEngine';
import { LEARNING_RESOURCES } from '../data/skillsData';
import { analyzePythonNlp } from '../services/api';

export default function RoadmapVisualizer({ 
  student, 
  setStudent, 
  selectedJobForRoadmap, 
  jobs 
}) {
  const safeJobs = Array.isArray(jobs) && jobs.length > 0 ? jobs : [];
  const fallbackJob = selectedJobForRoadmap || safeJobs[0] || null;
  const [activeJobId, setActiveJobId] = useState(
    fallbackJob ? (fallbackJob.id || fallbackJob.jobId) : ''
  );

  const activeJob = safeJobs.find(j => String(j.id || j.jobId) === String(activeJobId)) || fallbackJob;
  const roadmapData = generatePersonalizedRoadmap(student, activeJob);
  
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [activeVideoModal, setActiveVideoModal] = useState(null);

  // Python NLP Analysis State
  const [pythonNlpResult, setPythonNlpResult] = useState(null);
  const [pythonLoading, setPythonLoading] = useState(false);

  // Execute Python 3.12 NLP Engine on job switch
  useEffect(() => {
    let isMounted = true;
    async function runPythonAnalysis() {
      setPythonLoading(true);
      try {
        const res = await analyzePythonNlp(student.resumeText || student.name || '', activeJob.description || '');
        if (isMounted && res) {
          setPythonNlpResult(res);
        }
      } catch (err) {
        console.warn("Python NLP Microservice note:", err);
      } finally {
        if (isMounted) setPythonLoading(false);
      }
    }

    runPythonAnalysis();
    return () => { isMounted = false; };
  }, [activeJobId, student]);

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

  if (!activeJob) {
    return (
      <div className="glass-panel p-16 rounded-2xl text-center space-y-4 animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
          <GitFork className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">No Job Postings Available</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          No jobs are currently posted. Ask a recruiter to post a job opening, or go to Job Explorer to browse opportunities.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner & Job Switcher */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>AI-Powered Roadmap</span>
            </span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1 flex items-center space-x-3">
            <GitFork className="w-6 h-6 text-indigo-400" />
            <span>Curated Learning Roadmap & Video Courses</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            SkillBridge analyzes the job description and your resume to identify skill gaps and build a personalized step-by-step learning roadmap.
          </p>
        </div>

        {/* Target Job Selector Dropdown */}
        <div className="flex flex-col space-y-1.5 w-full md:w-auto">
          <label className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            <span>Select Target Position for Roadmap Analysis:</span>
          </label>
          <select
            value={activeJobId}
            onChange={(e) => setActiveJobId(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-white text-xs font-semibold rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 shadow-lg"
          >
            {safeJobs.map(j => (
              <option key={j.id || j.jobId} value={j.id || j.jobId}>
                {j.title || j.jobTitle} ({j.company || j.companyName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 🐍 PYTHON 3.12 NLP ENGINE ANALYSIS STATUS PANEL */}
      <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-white">
                  AI Analysis: {activeJob.title || activeJob.jobTitle}
                </h2>
                {pythonLoading ? (
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 animate-pulse">
                    Analyzing...
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Analysis Ready
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">{activeJob.company || activeJob.companyName} • {activeJob.location}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-slate-900/90 p-3 rounded-xl border border-emerald-500/30">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-medium uppercase">Resume Match Score</span>
              <span className="text-xl font-black text-emerald-400">
                {pythonNlpResult ? `${pythonNlpResult.tfidfMatchScorePct}%` : `${roadmapData.tfidfScore}%`}
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 font-bold text-xs border border-emerald-500/20">
              AI Score
            </span>
          </div>
        </div>


        {/* Recommendation Priority Banner */}
        <div className="p-3.5 rounded-xl bg-indigo-600/10 border border-indigo-500/30 text-xs flex items-center space-x-2 text-indigo-200">
          <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0" />
          <span><strong>Recommendation:</strong> {roadmapData.topRecommendation}</span>
        </div>
      </div>

      {/* Dynamic Skill Learning Path */}
      {roadmapData.roadmap.length > 0 && (
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Skill Learning Path</span>
          </h3>
          <div className="flex flex-wrap items-center gap-2 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
            {roadmapData.roadmap.map((step, idx) => {
              const isDone = completedSteps.has(step.skillId);
              return (
                <React.Fragment key={step.skillId}>
                  <span className={`px-3 py-1.5 rounded-lg font-bold border transition-all ${
                    isDone
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : idx === 0
                      ? 'bg-indigo-600/30 text-indigo-200 border-indigo-500/50 shadow-glow-indigo'
                      : 'bg-slate-800/60 text-slate-400 border-slate-700/50'
                  }`}>
                    {isDone && <span className="mr-1">✓</span>}{step.skillName}
                  </span>
                  {idx < roadmapData.roadmap.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-slate-600 flex-shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-500">
            {completedSteps.size} of {roadmapData.roadmap.length} skills completed — highlighted in green · current focus in blue
          </p>
        </div>
      )}

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
                        {step.extractedFromDesc && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Python NLP Extracted
                          </span>
                        )}
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
                    {step.prerequisites && step.prerequisites.length > 0 && (
                      <p><strong className="text-slate-400">Prerequisites:</strong> {step.prerequisites.join(', ')}</p>
                    )}
                  </div>

                  {/* YOUTUBE VIDEO COURSES SECTION */}
                  <div className="space-y-3 pt-3 border-t border-slate-800/80">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 flex items-center space-x-2">
                        <Youtube className="w-4 h-4 text-red-500 fill-red-500/20" />
                        <span>Curated YouTube Video Courses for {step.skillName}</span>
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
                            <a
                              href={res.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 text-[11px] font-bold transition-all flex items-center justify-center space-x-1"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Watch on YouTube</span>
                            </a>

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
