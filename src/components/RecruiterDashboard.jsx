import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Briefcase, 
  Award, 
  Search, 
  CheckCircle2, 
  AlertTriangle,
  BrainCircuit,
  FileText
} from 'lucide-react';
import { CANONICAL_SKILLS } from '../data/skillsData';
import { calculateJobMatch } from '../services/matchingEngine';
import { calculateTfidfCosineSimilarity } from '../services/nlpEngine';

export default function RecruiterDashboard({ 
  jobs, 
  setJobs, 
  student, 
  applications 
}) {
  const [selectedJobId, setSelectedJobId] = useState(jobs[0]?.id || '');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Job Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('TechBridge Systems');
  const [newLocation, setNewLocation] = useState('Remote');
  const [newType, setNewType] = useState('Internship');
  const [newDesc, setNewDesc] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([
    { skillId: 'csharp', requiredProficiency: 3, weight: 25, importance: 'Required' },
    { skillId: 'aspnet_core', requiredProficiency: 3, weight: 25, importance: 'Required' },
    { skillId: 'sql_server', requiredProficiency: 3, weight: 20, importance: 'Required' }
  ]);

  const activeJob = jobs.find(j => j.id === selectedJobId) || jobs[0];
  const activeJobMatch = calculateJobMatch(student, activeJob);
  const tfidfScore = calculateTfidfCosineSimilarity(student.resumeText, activeJob.description);

  // Add Job Handler
  const handleCreateJob = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const formattedSkills = selectedSkills.map(s => {
      const canonical = CANONICAL_SKILLS.find(c => c.id === s.skillId);
      return {
        ...s,
        skillName: canonical ? canonical.name : s.skillId
      };
    });

    const newJob = {
      id: `job-${Date.now()}`,
      title: newTitle,
      company: newCompany,
      location: newLocation,
      type: newType,
      postedDate: new Date().toISOString().split('T')[0],
      description: newDesc,
      skillsRequired: formattedSkills
    };

    setJobs(prev => [newJob, ...prev]);
    setSelectedJobId(newJob.id);
    setShowCreateModal(false);

    // Reset Form
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-3">
            <Users className="w-6 h-6 text-cyan-400" />
            <span>Recruiter Portal & Candidate Leaderboard</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Define weighted skill benchmarks and evaluate applicants using deterministic skill matching and NLP text similarity.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-all shadow-glow-cyan"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Internship / Job</span>
        </button>
      </div>

      {/* Select Active Job to View Candidates */}
      <div className="glass-panel p-6 rounded-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-cyan-400" />
              <span>Select Job Posting to Benchmark</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Review candidate match rankings and TF-IDF document similarity scores.
            </p>
          </div>

          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-white text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
          >
            {jobs.map(j => (
              <option key={j.id} value={j.id}>{j.title} ({j.company})</option>
            ))}
          </select>
        </div>

        {/* Candidate Leaderboard Table */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Candidate Talent Pool</h3>
          
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Candidate Name</th>
                  <th className="p-3.5">Education / Degree</th>
                  <th className="p-3.5 text-center">Weighted Skill Match</th>
                  <th className="p-3.5 text-center">TF-IDF Similarity</th>
                  <th className="p-3.5 text-center">Gap Status</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-3.5">
                    <div className="font-bold text-white text-sm">{student.name}</div>
                    <span className="text-[11px] text-slate-400">{student.email}</span>
                  </td>
                  <td className="p-3.5 text-slate-300">
                    <div>{student.degree}</div>
                    <span className="text-[10px] text-slate-400">{student.university}</span>
                  </td>
                  <td className="p-3.5 text-center font-mono">
                    <span className="text-lg font-black text-cyan-400">{activeJobMatch.jobMatchScore}%</span>
                  </td>
                  <td className="p-3.5 text-center font-mono">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-bold border border-indigo-500/20">
                      {tfidfScore}% TF-IDF
                    </span>
                  </td>
                  <td className="p-3.5 text-center font-mono">
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-semibold">
                      {activeJobMatch.highGaps.length} High Gaps
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-600/30">
                      Shortlist Candidate
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal: Create New Job Posting */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel w-full max-w-2xl rounded-2xl border border-cyan-500/30 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white">Create New Internship / Job Posting</h2>
            
            <form onSubmit={handleCreateJob} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ASP.NET Core & C# Backend Developer"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Location</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Employment Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Job Description</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Paste complete description for TF-IDF matching..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold shadow-glow-cyan"
                >
                  Publish Job Posting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
