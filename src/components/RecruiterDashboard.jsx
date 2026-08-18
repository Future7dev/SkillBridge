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
  FileText,
  Trash2,
  Send,
  UserCheck,
  Building,
  Check,
  X,
  Filter,
  UserMinus
} from 'lucide-react';
import { CANONICAL_SKILLS } from '../data/skillsData';
import { calculateJobMatch } from '../services/matchingEngine';
import { calculateTfidfCosineSimilarity } from '../services/nlpEngine';
import { createJobPosting, deleteJobPosting, updateApplicationStatusApi, deleteApplicationApi } from '../services/api';

export default function RecruiterDashboard({ 
  jobs, 
  setJobs, 
  student, 
  applications,
  setApplications,
  refreshJobsFromDatabase,
  refreshApplicationsFromDatabase
}) {
  const [selectedJobId, setSelectedJobId] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Job Creation Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('TechBridge Systems Inc.');
  const [newLocation, setNewLocation] = useState('Remote / Hybrid');
  const [newType, setNewType] = useState('Internship');
  const [newDesc, setNewDesc] = useState('');
  
  // Custom skills requirement builder state for new job
  const [jobSkillReqs, setJobSkillReqs] = useState([
    { skillId: 'csharp', skillName: 'C#', requiredProficiency: 3, weight: 25, importance: 'Required' },
    { skillId: 'aspnet_core', skillName: 'ASP.NET Core', requiredProficiency: 3, weight: 25, importance: 'Required' },
    { skillId: 'sql_server', skillName: 'SQL Server', requiredProficiency: 3, weight: 20, importance: 'Required' }
  ]);
  const [addingSkillId, setAddingSkillId] = useState(CANONICAL_SKILLS[0].id);

  const activeJob = jobs.find(j => String(j.id || j.jobId) === String(selectedJobId));

  // Applications filtering: If 'all' is selected or job matches, show candidate applications
  const filteredApplicants = applications.filter(a => {
    if (selectedJobId === 'all' || !selectedJobId) return true;
    if (!activeJob) return true;
    const aId = String(a.jobId || '');
    const targetId1 = String(activeJob.id || '');
    const targetId2 = String(activeJob.jobId || '');
    return aId === targetId1 || aId === targetId2 || a.jobTitle === (activeJob.title || activeJob.jobTitle);
  });

  // Remove / Delete Job Opening Handler
  const handleDeleteJobOpening = async (targetJobId) => {
    if (!window.confirm("Are you sure you want to remove and close this job opening?")) return;

    const updatedJobs = jobs.filter(j => String(j.id || j.jobId) !== String(targetJobId));
    setJobs(updatedJobs);
    localStorage.setItem('skillbridge_jobs', JSON.stringify(updatedJobs));

    if (selectedJobId === targetJobId) {
      setSelectedJobId('all');
    }

    try {
      if (!isNaN(targetJobId)) {
        await deleteJobPosting(targetJobId);
      }
    } catch (err) {
      console.warn("Backend job delete note:", err);
    }
  };

  // Reject candidate handler (Deletes application from MySQL DB & state)
  const handleRejectCandidate = async (appId) => {
    setApplications(prev => {
      const updated = prev.filter(app => app.id !== appId);
      localStorage.setItem('skillbridge_apps', JSON.stringify(updated));
      return updated;
    });

    if (!isNaN(appId)) {
      try {
        await deleteApplicationApi(appId);
        if (refreshApplicationsFromDatabase) await refreshApplicationsFromDatabase();
      } catch (err) {
        console.warn("MySQL DB delete application note:", err);
      }
    }
  };

  // Update applicant stage status (Shortlist, Interview, Offer in MySQL DB & state)
  const handleUpdateApplicantStatus = async (appId, newStatus) => {
    setApplications(prev => {
      const updated = prev.map(app => {
        if (app.id === appId) {
          return {
            ...app,
            status: newStatus,
            stageNotes: `Stage updated to ${newStatus} by Recruiter on ${new Date().toISOString().split('T')[0]}`
          };
        }
        return app;
      });
      localStorage.setItem('skillbridge_apps', JSON.stringify(updated));
      return updated;
    });

    if (!isNaN(appId)) {
      try {
        await updateApplicationStatusApi(appId, newStatus, `Stage updated to ${newStatus}`);
        if (refreshApplicationsFromDatabase) await refreshApplicationsFromDatabase();
      } catch (err) {
        console.warn("MySQL DB application status update note:", err);
      }
    }
  };

  // Add skill requirement row to new job form
  const handleAddSkillToJob = () => {
    if (jobSkillReqs.some(s => s.skillId === addingSkillId)) return;
    const canonical = CANONICAL_SKILLS.find(c => c.id === addingSkillId);
    setJobSkillReqs(prev => [
      ...prev,
      {
        skillId: addingSkillId,
        skillName: canonical ? canonical.name : addingSkillId,
        requiredProficiency: 3,
        weight: 15,
        importance: 'Required'
      }
    ]);
  };

  const handleRemoveSkillFromJob = (skId) => {
    setJobSkillReqs(prev => prev.filter(s => s.skillId !== skId));
  };

  // Submit New Job Handler
  const handleCreateJob = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || jobSkillReqs.length === 0) return;

    const newJobId = `job-${Date.now()}`;
    const publishedJob = {
      id: newJobId,
      jobId: newJobId,
      title: newTitle,
      jobTitle: newTitle,
      company: newCompany,
      companyName: newCompany,
      location: newLocation,
      type: newType,
      employmentType: newType,
      postedDate: new Date().toISOString().split('T')[0],
      description: newDesc,
      skillsRequired: jobSkillReqs,
      jobSkills: jobSkillReqs,
      isNew: true
    };

    const updatedJobsList = [publishedJob, ...jobs];
    setJobs(updatedJobsList);
    localStorage.setItem('skillbridge_jobs', JSON.stringify(updatedJobsList));

    setSelectedJobId(newJobId);
    setShowCreateModal(false);

    try {
      await createJobPosting({
        jobTitle: newTitle,
        companyName: newCompany,
        location: newLocation,
        employmentType: newType,
        description: newDesc,
        skills: jobSkillReqs.map(s => ({
          skillId: s.skillId,
          skillName: s.skillName,
          requiredProficiency: s.requiredProficiency,
          weight: s.weight,
          importance: s.importance
        }))
      });
      if (refreshJobsFromDatabase) await refreshJobsFromDatabase();
    } catch (err) {
      console.warn("MySQL DB save note:", err);
    }

    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Recruiter & Talent Portal
            </span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1 flex items-center space-x-3">
            <Users className="w-6 h-6 text-cyan-400" />
            <span>Recruiter Candidate Management & Applicant Tracking</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage job postings, review student applications, and update recruitment stages.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-extrabold text-xs transition-all shadow-glow-cyan"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Job Posting</span>
        </button>
      </div>

      {/* SECTION 1: MANAGE JOB OPENINGS */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Briefcase className="w-5 h-5 text-cyan-400" />
            <span>Active Job Openings ({jobs.length} Positions)</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((j) => {
            const jId = j.id || j.jobId;
            return (
              <div key={jId} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-sm text-white">{j.title || j.jobTitle}</h3>
                  <p className="text-xs text-slate-400">{j.company || j.companyName} • {j.location}</p>
                  <span className="text-[10px] text-slate-500 font-mono">Posted: {j.postedDate}</span>
                </div>

                <button
                  onClick={() => handleDeleteJobOpening(jId)}
                  className="p-2 rounded-lg bg-rose-600/10 text-rose-400 border border-rose-500/20 hover:bg-rose-600 hover:text-white transition-all text-xs flex items-center space-x-1 font-semibold"
                  title="Remove Job Opening"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remove Opening</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: CANDIDATE APPLICANTS LIST */}
      <div className="glass-panel p-6 rounded-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-cyan-400" />
              <span>Job Applicants & Candidates ({filteredApplicants.length} Submissions)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Review all student applications for your job postings.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white text-xs font-semibold rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">View All Applied Candidates ({applications.length})</option>
              {jobs.map(j => (
                <option key={j.id || j.jobId} value={j.id || j.jobId}>
                  {j.title || j.jobTitle} ({j.company || j.companyName})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* APPLICANTS TABLE */}
        <div className="space-y-4">
          {filteredApplicants.length === 0 ? (
            <div className="p-8 rounded-xl bg-slate-950/60 border border-slate-800 text-center space-y-3">
              <Users className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="text-sm font-bold text-slate-300">No Applications Submitted for this Filter</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Students can browse and apply to positions from the Job Explorer tab.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Candidate Name</th>
                    <th className="p-3.5">Applied Position</th>
                    <th className="p-3.5">Degree & Institution</th>
                    <th className="p-3.5">Applied Date</th>
                    <th className="p-3.5 text-center">Fit Score %</th>
                    <th className="p-3.5 text-center">Current Status</th>
                    <th className="p-3.5 text-right">Recruiter Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredApplicants.map(app => (
                    <tr key={app.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-white text-sm">{app.studentName || "Student Applicant"}</div>
                        <span className="text-[11px] text-slate-400">{app.studentEmail || "student@university.edu"}</span>
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-cyan-400">{app.jobTitle}</div>
                        <span className="text-[10px] text-slate-400">{app.company}</span>
                      </td>
                      <td className="p-3.5 text-slate-300">
                        <div>{app.degree || "B.S. Computer Science"}</div>
                        <span className="text-[10px] text-slate-400">{app.institution || "State Institute of Technology"}</span>
                      </td>
                      <td className="p-3.5 text-slate-300 font-mono">{app.appliedDate}</td>
                      <td className="p-3.5 text-center font-mono">
                        <span className="text-lg font-black text-cyan-400">{app.matchScore}%</span>
                      </td>
                      <td className="p-3.5 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          app.status === 'Offer' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          app.status === 'Interview' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                          app.status === 'Shortlisted' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                          'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-1.5">
                        <button
                          onClick={() => handleUpdateApplicantStatus(app.id, 'Shortlisted')}
                          className="px-2.5 py-1 rounded-lg bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-semibold hover:bg-cyan-600/30"
                        >
                          Shortlist
                        </button>
                        <button
                          onClick={() => handleUpdateApplicantStatus(app.id, 'Interview')}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-semibold hover:bg-indigo-600/30"
                        >
                          Interview
                        </button>
                        <button
                          onClick={() => handleUpdateApplicantStatus(app.id, 'Offer')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold hover:bg-emerald-600/30"
                        >
                          Offer
                        </button>
                        <button
                          onClick={() => handleRejectCandidate(app.id)}
                          className="px-2 py-1 rounded-lg bg-rose-600/20 text-rose-300 border border-rose-500/30 text-[11px] font-semibold hover:bg-rose-600 hover:text-white flex-inline items-center space-x-1"
                          title="Reject and Remove Candidate"
                        >
                          <UserMinus className="w-3.5 h-3.5 inline mr-1" />
                          <span>Reject & Remove</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* MODAL: POST NEW JOB POSITION */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel w-full max-w-3xl rounded-2xl border border-cyan-500/30 p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto relative">
            
            <button 
              onClick={() => setShowCreateModal(false)}
              className="absolute top-6 right-6 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Publish New Job / Internship Posting</h2>
                <p className="text-xs text-slate-400">Newly posted jobs will be published and visible to all students immediately.</p>
              </div>
            </div>
            
            <form onSubmit={handleCreateJob} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Job Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. C# & ASP.NET Core Backend Intern"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Location</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Employment Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Job Description (Scanned by TF-IDF Model)</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Paste detailed job description and requirements for text similarity parsing..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 leading-relaxed font-mono text-[11px]"
                />
              </div>

              {/* SKILL REQUIREMENTS BUILDER */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">Required Skills & Weighting Matrix</span>
                  <div className="flex items-center space-x-2">
                    <select
                      value={addingSkillId}
                      onChange={(e) => setAddingSkillId(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white text-[11px]"
                    >
                      {CANONICAL_SKILLS.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={handleAddSkillToJob}
                      className="px-3 py-1 rounded-lg bg-cyan-600 text-white font-semibold text-[11px]"
                    >
                      Add Skill
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {jobSkillReqs.map((sk) => (
                    <div key={sk.skillId} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs gap-3">
                      <span className="font-bold text-white w-32">{sk.skillName}</span>
                      <div className="flex items-center space-x-3 text-[11px]">
                        <label>Req Level (1-5):</label>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={sk.requiredProficiency}
                          onChange={(e) => {
                            const val = parseInt(e.target.value || 1, 10);
                            setJobSkillReqs(prev => prev.map(s => s.skillId === sk.skillId ? { ...s, requiredProficiency: val } : s));
                          }}
                          className="w-12 bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-center font-bold"
                        />

                        <label>Weight:</label>
                        <input
                          type="number"
                          min="5"
                          max="50"
                          value={sk.weight}
                          onChange={(e) => {
                            const val = parseInt(e.target.value || 10, 10);
                            setJobSkillReqs(prev => prev.map(s => s.skillId === sk.skillId ? { ...s, weight: val } : s));
                          }}
                          className="w-14 bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-center font-bold"
                        />

                        <select
                          value={sk.importance}
                          onChange={(e) => {
                            const val = e.target.value;
                            setJobSkillReqs(prev => prev.map(s => s.skillId === sk.skillId ? { ...s, importance: val } : s));
                          }}
                          className="bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-[11px]"
                        >
                          <option value="Required">Required</option>
                          <option value="Preferred">Preferred</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveSkillFromJob(sk.skillId)}
                        className="text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-glow-cyan flex items-center space-x-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Publish Job Posting to All Students</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
