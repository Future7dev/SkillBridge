import React, { useState } from 'react';
import { 
  Sparkles, 
  UserCheck, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle,
  Send,
  BookOpen
} from 'lucide-react';
import { generatePersonalizedRoadmap } from '../services/matchingEngine';

export default function MentorDashboard({ student, jobs }) {
  const activeJob = jobs[0];
  const roadmapData = generatePersonalizedRoadmap(student, activeJob);
  
  const [feedbackNote, setFeedbackNote] = useState('');
  const [mentorNotes, setMentorNotes] = useState([
    {
      id: 1,
      date: '2026-08-15',
      author: 'Dr. Marcus Vance (Mentor)',
      text: 'Great progress on ASP.NET Core APIs! Prioritize Entity Framework Core tutorials next to bridge the relational mapping gap before attempting Docker containers.'
    }
  ]);

  const handlePostNote = (e) => {
    e.preventDefault();
    if (!feedbackNote.trim()) return;

    setMentorNotes(prev => [
      {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        author: 'Dr. Marcus Vance (Mentor)',
        text: feedbackNote
      },
      ...prev
    ]);
    setFeedbackNote('');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-3">
            <Sparkles className="w-6 h-6 text-emerald-400" />
            <span>Mentor Guidance Hub</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Review student learning progress, validate skill gap roadmaps, and leave personalized feedback.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Student Overview Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-lg">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">{student.name}</h3>
                  <p className="text-xs text-slate-400">{student.degree} • {student.university}</p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Assigned Student
              </span>
            </div>

            {/* Current Target Roadmap Review */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Active Target Roadmap Items</h4>
              <div className="space-y-2">
                {roadmapData.roadmap.map(item => (
                  <div key={item.skillId} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white">{item.skillName}</span>
                      <p className="text-[11px] text-slate-400">Target Level {item.targetLevel} (Gap: {item.gap})</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-mono text-[10px]">
                      {item.prerequisites.length > 0 ? `Prereq: ${item.prerequisites.join(', ')}` : 'Foundation'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Mentor Feedback Column */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-5">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Mentor Guidance Log</span>
            </h3>

            <form onSubmit={handlePostNote} className="space-y-3">
              <textarea
                rows="3"
                placeholder="Write mentor guidance or recommendations..."
                value={feedbackNote}
                onChange={(e) => setFeedbackNote(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all flex items-center justify-center space-x-1 shadow-glow-emerald"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post Guidance Note</span>
              </button>
            </form>

            <div className="space-y-3 pt-3 border-t border-slate-800 max-h-64 overflow-y-auto">
              {mentorNotes.map(n => (
                <div key={n.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-semibold text-emerald-400">{n.author}</span>
                    <span>{n.date}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{n.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
