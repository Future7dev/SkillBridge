import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  FileText, 
  Award, 
  Code2, 
  HelpCircle,
  BarChart,
  ArrowUpRight,
  BrainCircuit,
  Info
} from 'lucide-react';
import { CANONICAL_SKILLS } from '../data/skillsData';
import { calculateJobMatch, generatePersonalizedRoadmap, getEffectiveProficiency } from '../services/matchingEngine';

const PROFICIENCY_LABELS = [
  { level: 0, label: 'No Knowledge', color: 'text-slate-500 bg-slate-500/10' },
  { level: 1, label: 'Beginner', color: 'text-rose-400 bg-rose-400/10' },
  { level: 2, label: 'Basic', color: 'text-amber-400 bg-amber-400/10' },
  { level: 3, label: 'Intermediate', color: 'text-cyan-400 bg-cyan-400/10' },
  { level: 4, label: 'Advanced', color: 'text-indigo-400 bg-indigo-400/10' },
  { level: 5, label: 'Expert', color: 'text-emerald-400 bg-emerald-400/10' }
];

export default function StudentDashboard({ 
  student, 
  setStudent, 
  currentUser,
  jobs, 
  setActiveTab, 
  openResumeModal,
  setSelectedJobForRoadmap
}) {
  const [selectedJobId, setSelectedJobId] = useState(jobs[0]?.id || '');
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectTech, setNewProjectTech] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [selectedNewSkill, setSelectedNewSkill] = useState(CANONICAL_SKILLS[0].id);

  const activeJob = jobs.find(j => j.id === selectedJobId) || jobs[0];
  const matchResult = calculateJobMatch(student, activeJob);
  const roadmapData = generatePersonalizedRoadmap(student, activeJob);

  const displayName = currentUser?.fullName || student.name || 'Student';

  // Handle skill assessment slider change
  const handleSkillChange = (skillId, val) => {
    const numericVal = parseInt(val, 10);
    setStudent(prev => {
      const updatedSkills = prev.skills.map(s => {
        if (s.skillId === skillId) {
          return { ...s, selfAssessment: numericVal };
        }
        return s;
      });
      return { ...prev, skills: updatedSkills };
    });
  };

  // Add project evidence bonus
  const handleAddProject = (e) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;

    const newProj = {
      id: `proj-${Date.now()}`,
      title: newProjectTitle,
      tech: newProjectTech.split(',').map(t => t.trim()),
      description: newProjectDesc
    };

    setStudent(prev => ({
      ...prev,
      projects: [...prev.projects, newProj]
    }));

    setNewProjectTitle('');
    setNewProjectTech('');
    setNewProjectDesc('');
  };

  // Add skill to student profile
  const handleAddSkillToProfile = () => {
    if (student.skills.some(s => s.skillId === selectedNewSkill)) return;
    const skillObj = CANONICAL_SKILLS.find(s => s.id === selectedNewSkill);
    
    setStudent(prev => ({
      ...prev,
      skills: [
        ...prev.skills,
        { skillId: selectedNewSkill, selfAssessment: 2, projectBonus: 0, notes: "Added from catalog" }
      ]
    }));
    setShowAddSkill(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome back, {displayName}!
              </h1>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Active Student
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-2xl">
              {student.degree} • {student.university} (Graduating {student.graduationYear})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={openResumeModal}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-sm transition-all shadow-glow-indigo"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>Parse Resume with NLP</span>
            </button>
          </div>
        </div>
      </div>

      {/* Target Job Selector & Overall Match Summary Cards */}
      <div className="glass-panel p-6 rounded-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <BarChart className="w-5 h-5 text-indigo-400" />
              <span>Target Internship / Role Readiness</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Selecting a target position dynamically evaluates your skill proficiencies against required weights.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-xs text-slate-400 font-medium">Select Target Job:</label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
            >
              {jobs.map(j => (
                <option key={j.id} value={j.id}>{j.title} ({j.company})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Readiness Dashboard Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Overall Match Score */}
          <div className="glass-card p-5 rounded-xl border border-indigo-500/20 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Job Match</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                {matchResult.summaryLabel}
              </span>
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">
                {matchResult.jobMatchScore}%
              </span>
              <span className="text-xs text-slate-400 font-medium">Readiness Index</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${matchResult.jobMatchScore}%` }}
              ></div>
            </div>
          </div>

          {/* Strong Skills */}
          <div className="glass-card p-5 rounded-xl border border-emerald-500/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Strong Skills</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-white">{matchResult.strongSkills.length}</span>
              <span className="text-xs text-emerald-400 font-medium">Met / Exceeded</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 truncate">
              {matchResult.strongSkills.map(s => s.skillName).join(', ') || 'None satisfied yet'}
            </p>
          </div>

          {/* High Skill Gaps */}
          <div className="glass-card p-5 rounded-xl border border-rose-500/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">High Gaps (≥3)</span>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-rose-400">{matchResult.highGaps.length}</span>
              <span className="text-xs text-slate-400">Critical Gaps</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 truncate">
              {matchResult.highGaps.map(s => s.skillName).join(', ') || 'No critical gaps!'}
            </p>
          </div>

          {/* Top Recommendation */}
          <div className="glass-card p-5 rounded-xl border border-cyan-500/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Top Recommendation</span>
                <BrainCircuit className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-xs text-slate-200 font-medium mt-2 leading-relaxed line-clamp-2">
                {roadmapData.topRecommendation}
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedJobForRoadmap(activeJob);
                setActiveTab('roadmap');
              }}
              className="mt-3 text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
            >
              <span>View Full Roadmap</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* Main Grid: Student Skill Matrix & Projects / Evidence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Skill Matrix Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Code2 className="w-5 h-5 text-indigo-400" />
                  <span>Student Skill & Proficiency Matrix</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Adjust your self-assessment levels (0=No Knowledge, 5=Expert). Effective proficiency includes verified project evidence.
                </p>
              </div>

              <button
                onClick={() => setShowAddSkill(!showAddSkill)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold hover:bg-indigo-600/30 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Skill</span>
              </button>
            </div>

            {/* Add Skill Dropdown */}
            {showAddSkill && (
              <div className="p-4 rounded-xl bg-slate-900/90 border border-indigo-500/30 flex items-center space-x-3 animate-fadeIn">
                <select
                  value={selectedNewSkill}
                  onChange={(e) => setSelectedNewSkill(e.target.value)}
                  className="bg-slate-800 text-white text-xs font-medium rounded-lg px-3 py-2 border border-slate-700 flex-1"
                >
                  {CANONICAL_SKILLS.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
                  ))}
                </select>
                <button
                  onClick={handleAddSkillToProfile}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs"
                >
                  Confirm Add
                </button>
              </div>
            )}

            {/* Skill Matrix List */}
            <div className="space-y-4">
              {student.skills.map((record) => {
                const canonical = CANONICAL_SKILLS.find(c => c.id === record.skillId) || { name: record.skillId, category: 'General' };
                const reqInJob = activeJob.skillsRequired.find(r => r.skillId === record.skillId);
                const effective = getEffectiveProficiency(record);
                const profMeta = PROFICIENCY_LABELS[record.selfAssessment] || PROFICIENCY_LABELS[0];

                return (
                  <div 
                    key={record.skillId} 
                    className="p-4 rounded-xl glass-card border border-slate-800/80 hover:border-slate-700 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-white text-sm">{canonical.name}</span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                              {canonical.category}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            {record.notes}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 text-xs">
                        {reqInJob && (
                          <span className="text-slate-400 font-medium">
                            Req Level: <strong className="text-indigo-400 font-bold">{reqInJob.requiredProficiency}</strong>
                          </span>
                        )}
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${profMeta.color}`}>
                          Level {effective} / 5 ({profMeta.label})
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center pt-2 border-t border-slate-800/50">
                      <div className="sm:col-span-8 flex items-center space-x-3">
                        <span className="text-[11px] text-slate-400 font-mono w-16">Self: {record.selfAssessment}/5</span>
                        <input
                          type="range"
                          min="0"
                          max="5"
                          step="1"
                          value={record.selfAssessment}
                          onChange={(e) => handleSkillChange(record.skillId, e.target.value)}
                          className="flex-1 cursor-pointer"
                        />
                      </div>

                      <div className="sm:col-span-4 text-right text-[11px] text-slate-400">
                        {reqInJob ? (
                          <span>
                            Gap: <strong className={reqInJob.requiredProficiency - effective > 0 ? "text-rose-400" : "text-emerald-400"}>
                              {Math.max(reqInJob.requiredProficiency - effective, 0)}
                            </strong> | Weight: {reqInJob.weight}
                          </span>
                        ) : (
                          <span className="text-slate-500">Not required for active job</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Evidence & Projects */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-5">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Award className="w-4 h-4 text-cyan-400" />
              <span>Project Evidence & Proof</span>
            </h3>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {student.projects.map((proj) => (
                <div key={proj.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{proj.title}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-semibold">
                      Verified
                    </span>
                  </div>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    {proj.description}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {proj.tech.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddProject} className="space-y-3 pt-3 border-t border-slate-800">
              <span className="text-xs font-semibold text-slate-300 block">Add New Project Evidence</span>
              <input
                type="text"
                placeholder="Project Title (e.g. C# E-Commerce API)"
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                placeholder="Technologies used (comma separated)"
                value={newProjectTech}
                onChange={(e) => setNewProjectTech(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <textarea
                rows="2"
                placeholder="Brief description of implementation..."
                value={newProjectDesc}
                onChange={(e) => setNewProjectDesc(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white font-semibold text-xs transition-all shadow-glow-indigo"
              >
                Save Project Evidence
              </button>
            </form>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-indigo-500/20 text-xs space-y-3">
            <div className="flex items-center space-x-2 text-indigo-400 font-bold">
              <Info className="w-4 h-4" />
              <span>How Your Match Score Works</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Your readiness score is calculated transparently:
            </p>
            <div className="p-3 rounded-lg bg-slate-900/90 text-[11px] space-y-1.5 text-slate-300 border border-slate-800">
              <div>• Gap = how far you are from what the job needs</div>
              <div>• Match = your level vs. required level (0–100%)</div>
              <div>• Score = weighted average across all required skills</div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
