import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import StudentDashboard from './components/StudentDashboard';
import JobExplorer from './components/JobExplorer';
import RoadmapVisualizer from './components/RoadmapVisualizer';
import RecruiterDashboard from './components/RecruiterDashboard';
import MentorDashboard from './components/MentorDashboard';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ApplicationTracker from './components/ApplicationTracker';
import ResumeAnalyzerModal from './components/ResumeAnalyzerModal';
import AuthModal from './components/AuthModal';

import { 
  INITIAL_STUDENT, 
  INITIAL_JOBS, 
  INITIAL_APPLICATIONS 
} from './data/skillsData';
import { logoutUser, fetchJobs, fetchApplications } from './services/api';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('skillbridge_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState('student-dashboard');
  const [student, setStudent] = useState(INITIAL_STUDENT);
  
  // Persist jobs list in state & localStorage
  const [jobs, setJobs] = useState(() => {
    const savedJobs = localStorage.getItem('skillbridge_jobs');
    if (savedJobs) {
      try {
        const parsed = JSON.parse(savedJobs);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { }
    }
    return INITIAL_JOBS;
  });

  // Persist applications list in state & localStorage
  const [applications, setApplications] = useState(() => {
    const savedApps = localStorage.getItem('skillbridge_apps');
    if (savedApps) {
      try {
        const parsed = JSON.parse(savedApps);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { }
    }
    return INITIAL_APPLICATIONS;
  });

  // Fetch real jobs from MySQL Backend Database
  const refreshJobsFromDatabase = async () => {
    try {
      const dbJobs = await fetchJobs();
      if (dbJobs && Array.isArray(dbJobs) && dbJobs.length > 0) {
        setJobs(dbJobs);
        localStorage.setItem('skillbridge_jobs', JSON.stringify(dbJobs));
      }
    } catch (err) {
      console.warn("Fallback to local jobs state:", err);
    }
  };

  // Fetch real applications from MySQL Backend Database
  const refreshApplicationsFromDatabase = async () => {
    try {
      const dbApps = await fetchApplications();
      if (dbApps && Array.isArray(dbApps) && dbApps.length > 0) {
        setApplications(dbApps);
        localStorage.setItem('skillbridge_apps', JSON.stringify(dbApps));
      }
    } catch (err) {
      console.warn("Fallback to local applications state:", err);
    }
  };

  useEffect(() => {
    refreshJobsFromDatabase();
    refreshApplicationsFromDatabase();
  }, []);

  const [selectedJobForRoadmap, setSelectedJobForRoadmap] = useState(null);
  
  // Modals & Auth state
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalDefaultRole, setAuthModalDefaultRole] = useState('Student');

  // Sync applications to localStorage whenever applications state changes
  useEffect(() => {
    localStorage.setItem('skillbridge_apps', JSON.stringify(applications));
  }, [applications]);

  // Synchronize student profile object with logged-in user whenever currentUser changes
  useEffect(() => {
    if (currentUser) {
      setStudent(prev => ({
        ...prev,
        id: currentUser.userId || prev.id,
        name: currentUser.fullName || prev.name,
        email: currentUser.email || prev.email,
        degree: currentUser.profileDetails?.degree || prev.degree,
        university: currentUser.profileDetails?.institution || currentUser.profileDetails?.university || prev.university
      }));
    }
  }, [currentUser]);

  const openAuthModalWithRole = (role = 'Student') => {
    setAuthModalDefaultRole(role);
    setIsAuthModalOpen(true);
  };

  // Handle successful authentication (Login or Register)
  const handleAuthSuccess = (userData) => {
    setCurrentUser(userData);
    refreshJobsFromDatabase();
    refreshApplicationsFromDatabase();

    // Update student name & details dynamically
    setStudent(prev => ({
      ...prev,
      id: userData.userId || prev.id,
      name: userData.fullName || prev.name,
      email: userData.email || prev.email,
      degree: userData.profileDetails?.degree || prev.degree,
      university: userData.profileDetails?.institution || userData.profileDetails?.university || prev.university
    }));

    if (userData.role === 'Recruiter') setActiveTab('recruiter');
    else if (userData.role === 'Mentor') setActiveTab('mentor');
    else setActiveTab('student-dashboard');
  };

  // Handle logout (returns to Landing Page)
  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setActiveTab('student-dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#0b0f19] text-slate-100 selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navbar */}
      {currentUser && (
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentUser={currentUser}
          onOpenAuthModal={() => openAuthModalWithRole('Student')}
          onLogout={handleLogout}
        />
      )}

      {/* Main Content Area - Expanded to full display width */}
      <main className="flex-1 w-full">
        {!currentUser ? (
          /* Render Landing Page when user is logged out / visitor */
          <LandingPage
            onOpenAuthModal={openAuthModalWithRole}
          />
        ) : (
          /* Render Active User Dashboard View with expanded width */
          <div className="w-full max-w-[1650px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {activeTab === 'student-dashboard' && (
              <StudentDashboard
                student={student}
                setStudent={setStudent}
                currentUser={currentUser}
                jobs={jobs}
                setActiveTab={setActiveTab}
                openResumeModal={() => setIsResumeModalOpen(true)}
                setSelectedJobForRoadmap={setSelectedJobForRoadmap}
              />
            )}

            {activeTab === 'job-explorer' && (
              <JobExplorer
                jobs={jobs}
                student={student}
                applications={applications}
                setApplications={setApplications}
                setActiveTab={setActiveTab}
                setSelectedJobForRoadmap={setSelectedJobForRoadmap}
                refreshApplicationsFromDatabase={refreshApplicationsFromDatabase}
              />
            )}

            {activeTab === 'roadmap' && (
              <RoadmapVisualizer
                student={student}
                setStudent={setStudent}
                selectedJobForRoadmap={selectedJobForRoadmap}
                jobs={jobs}
              />
            )}

            {activeTab === 'recruiter' && (
              <RecruiterDashboard
                jobs={jobs}
                setJobs={setJobs}
                student={student}
                applications={applications}
                setApplications={setApplications}
                refreshJobsFromDatabase={refreshJobsFromDatabase}
                refreshApplicationsFromDatabase={refreshApplicationsFromDatabase}
              />
            )}

            {activeTab === 'mentor' && (
              <MentorDashboard
                student={student}
                jobs={jobs}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsDashboard
                student={student}
                jobs={jobs}
              />
            )}

            {activeTab === 'applications' && (
              <ApplicationTracker
                applications={applications}
                setApplications={setApplications}
                refreshApplicationsFromDatabase={refreshApplicationsFromDatabase}
              />
            )}
          </div>
        )}
      </main>

      {/* Resume Analyzer Modal */}
      <ResumeAnalyzerModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        student={student}
        setStudent={setStudent}
        jobs={jobs}
      />

      {/* Role-Based Authentication Portal Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        defaultRole={authModalDefaultRole}
      />

      {/* Footer - Full Display Width */}
      {currentUser && (
        <footer className="w-full border-t border-slate-800/80 bg-[#070a12] py-6 mt-12">
          <div className="w-full max-w-[1650px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              <span className="font-bold text-slate-300">SkillBridge</span> — Smart Internship & Career Readiness Platform
              <span className="block sm:inline text-slate-600 sm:ml-2">Understand your skills. Find your gaps. Build your career.</span>
            </div>
            <div className="flex items-center space-x-3 text-[11px] font-mono">
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-indigo-400">Smart Matching</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-400">Secure Database</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400">AI Resume Analysis</span>
            </div>
          </div>
        </footer>
      )}

    </div>
  );
}
