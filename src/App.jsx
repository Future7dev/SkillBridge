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
import { logoutUser } from './services/api';

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
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
  const [selectedJobForRoadmap, setSelectedJobForRoadmap] = useState(null);
  
  // Modals & Auth state
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalDefaultRole, setAuthModalDefaultRole] = useState('Student');

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
      
      {/* Top Navbar: ONLY rendered when a user is signed in! */}
      {currentUser && (
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentUser={currentUser}
          onOpenAuthModal={() => openAuthModalWithRole('Student')}
          onLogout={handleLogout}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {!currentUser ? (
          /* Render Landing Page when user is logged out / visitor */
          <LandingPage
            onOpenAuthModal={openAuthModalWithRole}
          />
        ) : (
          /* Render Active User Dashboard View */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

      {/* Footer */}
      {currentUser && (
        <footer className="w-full border-t border-slate-800/80 bg-[#070a12] py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              <span className="font-bold text-slate-300">SkillBridge</span> — ASP.NET Core Web API + MySQL Database
              <span className="block sm:inline text-slate-600 sm:ml-2">Understand your skills. Find your gaps. Build your career.</span>
            </div>
            <div className="flex items-center space-x-3 text-[11px] font-mono">
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-indigo-400">React 18</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-400">.NET 8 Web API</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400">MySQL DB</span>
            </div>
          </div>
        </footer>
      )}

    </div>
  );
}
