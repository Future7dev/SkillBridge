import React, { useState } from 'react';
import { 
  X, 
  BrainCircuit, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  Zap, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { extractSkillsFromText, calculateTfidfCosineSimilarity } from '../services/nlpEngine';
import { CANONICAL_SKILLS } from '../data/skillsData';

export default function ResumeAnalyzerModal({ 
  isOpen, 
  onClose, 
  student, 
  setStudent, 
  jobs 
}) {
  if (!isOpen) return null;

  const [resumeText, setResumeText] = useState(student.resumeText || '');
  const [selectedJobId, setSelectedJobId] = useState(jobs[0]?.id || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const targetJob = jobs.find(j => j.id === selectedJobId) || jobs[0];

  const handleRunNlpAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const extracted = extractSkillsFromText(resumeText);
      const tfidfScore = calculateTfidfCosineSimilarity(resumeText, targetJob.description);

      setAnalysisResult({
        extractedSkills: extracted,
        tfidfScore,
        targetJobTitle: targetJob.title
      });
      setIsAnalyzing(false);
    }, 600);
  };

  const handleSyncToProfile = () => {
    if (!analysisResult) return;

    setStudent(prev => {
      const currentMap = new Map(prev.skills.map(s => [s.skillId, s]));

      analysisResult.extractedSkills.forEach(extracted => {
        if (!currentMap.has(extracted.skillId)) {
          currentMap.set(extracted.skillId, {
            skillId: extracted.skillId,
            selfAssessment: extracted.detectedProficiency,
            projectBonus: 0,
            notes: `Extracted via NLP NER from resume (matched: "${extracted.matchedTerm}")`
          });
        }
      });

      return {
        ...prev,
        resumeText: resumeText,
        skills: Array.from(currentMap.values())
      };
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-3xl rounded-2xl border border-indigo-500/30 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <BrainCircuit className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">NLP Resume & Skill Extraction Service</h2>
            <p className="text-xs text-slate-400">
              Scans unstructured resume text for canonical skills using dictionary NER and calculates TF-IDF vector relevance.
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-semibold">Target Job for TF-IDF Cosine Similarity Benchmark:</label>
            </div>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium"
            >
              {jobs.map(j => (
                <option key={j.id} value={j.id}>{j.title} ({j.company})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Paste Resume / Project Text:</label>
            <textarea
              rows="6"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste student resume text, GitHub project descriptions, or coursework details..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 font-mono text-[11px] leading-relaxed"
            />
          </div>

          <button
            onClick={handleRunNlpAnalysis}
            disabled={isAnalyzing || !resumeText.trim()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs transition-all flex items-center justify-center space-x-2 shadow-glow-indigo disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running NLP Pipeline (Tokenize → TF-IDF → NER)...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Extract Skills & Compute TF-IDF Cosine Similarity</span>
              </>
            )}
          </button>
        </div>

        {/* Analysis Results Display */}
        {analysisResult && (
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-indigo-500/30 space-y-4 text-xs animate-fadeIn">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">TF-IDF Similarity Score</span>
                <div className="text-2xl font-black text-white">{analysisResult.tfidfScore}% Match</div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold text-[11px]">
                {analysisResult.extractedSkills.length} Skills Detected
              </span>
            </div>

            {/* Extracted Skills List */}
            <div className="space-y-2">
              <span className="text-slate-300 font-bold block">Extracted Canonical Entities:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {analysisResult.extractedSkills.map(sk => (
                  <div key={sk.skillId} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white block">{sk.skillName}</span>
                      <span className="text-[10px] text-slate-400">Matched term: "{sk.matchedTerm}"</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-mono font-bold text-[10px]">
                      Lvl {sk.detectedProficiency}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sync Button */}
            <button
              onClick={handleSyncToProfile}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center justify-center space-x-1.5 shadow-glow-emerald"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Sync Extracted Skills to Student Profile</span>
            </button>

          </div>
        )}

      </div>
    </div>
  );
}
