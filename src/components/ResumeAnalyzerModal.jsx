import React, { useState, useRef } from 'react';
import {
  X,
  BrainCircuit,
  CheckCircle2,
  FileText,
  Zap,
  RefreshCw,
  Upload,
  FileUp,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { extractSkillsFromText, calculateTfidfCosineSimilarity } from '../services/nlpEngine';

/**
 * Extract all text from a PDF file using PDF.js (pdfjs-dist).
 * Reads every page and concatenates the text content.
 */
async function extractTextFromPDF(file) {
  // Dynamically import pdfjs-dist to keep the bundle lean
  const pdfjsLib = await import('pdfjs-dist');

  // Point the worker to the bundled worker script (Vite serves it from node_modules)
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString();

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = '';
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(' ');
    fullText += pageText + '\n';
  }

  return fullText.trim();
}

export default function ResumeAnalyzerModal({
  isOpen,
  onClose,
  student,
  setStudent,
  jobs
}) {
  if (!isOpen) return null;

  const fileInputRef = useRef(null);

  const [uploadedFile, setUploadedFile] = useState(null);
  const [extractedText, setExtractedText] = useState(student.resumeText || '');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState('');

  const [selectedJobId, setSelectedJobId] = useState(jobs[0]?.id || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const targetJob = jobs.find(j => j.id === selectedJobId) || jobs[0];

  // ─── Handle PDF file selection ───────────────────────────────────────────
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setExtractError('Please upload a PDF file (.pdf)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setExtractError('File too large. Please upload a PDF under 10 MB.');
      return;
    }

    setUploadedFile(file);
    setExtractError('');
    setAnalysisResult(null);
    setIsExtracting(true);

    try {
      const text = await extractTextFromPDF(file);
      if (!text || text.length < 30) {
        setExtractError('Could not read text from this PDF. It may be scanned/image-based. Try a text-based PDF.');
        setExtractedText('');
      } else {
        setExtractedText(text);
      }
    } catch (err) {
      setExtractError('Failed to read PDF: ' + (err.message || 'Unknown error'));
      setExtractedText('');
    } finally {
      setIsExtracting(false);
    }
  };

  // ─── Handle drag & drop ──────────────────────────────────────────────────
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      // Simulate the file input change
      const dt = new DataTransfer();
      dt.items.add(file);
      fileInputRef.current.files = dt.files;
      handleFileChange({ target: { files: dt.files } });
    }
  };

  // ─── Run skill analysis on extracted text ────────────────────────────────
  const handleRunAnalysis = () => {
    if (!extractedText.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const extracted = extractSkillsFromText(extractedText);
      const tfidfScore = calculateTfidfCosineSimilarity(
        extractedText,
        targetJob?.description || ''
      );
      setAnalysisResult({
        extractedSkills: extracted,
        tfidfScore,
        targetJobTitle: targetJob?.title || ''
      });
      setIsAnalyzing(false);
    }, 700);
  };

  // ─── Sync detected skills back to student profile ────────────────────────
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
            notes: `Detected from resume PDF (matched: "${extracted.matchedTerm}")`
          });
        }
      });

      return {
        ...prev,
        resumeText: extractedText,
        skills: Array.from(currentMap.values())
      };
    });

    onClose();
  };

  const canAnalyze = extractedText.trim().length > 20 && !isExtracting && !isAnalyzing;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-3xl rounded-2xl border border-indigo-500/30 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto relative">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <BrainCircuit className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Resume Skill Scanner</h2>
            <p className="text-xs text-slate-400">
              Upload your resume as a PDF — we'll automatically extract your skills and calculate how well you match a job posting.
            </p>
          </div>
        </div>

        {/* Target Job Selector */}
        <div className="space-y-1.5 text-xs">
          <label className="text-slate-300 font-semibold block">Target Job for Match Score:</label>
          <select
            value={selectedJobId}
            onChange={e => setSelectedJobId(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-indigo-500"
          >
            {jobs.map(j => (
              <option key={j.id || j.jobId} value={j.id || j.jobId}>
                {j.title || j.jobTitle} — {j.company || j.companyName}
              </option>
            ))}
          </select>
        </div>

        {/* PDF Upload Area */}
        <div className="space-y-3 text-xs">
          <label className="text-slate-300 font-semibold block">Upload Resume PDF:</label>

          {/* Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all group ${
              uploadedFile
                ? 'border-emerald-500/50 bg-emerald-500/5'
                : 'border-slate-700 hover:border-indigo-500/60 bg-slate-900/40 hover:bg-indigo-500/5'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            {isExtracting ? (
              <div className="flex flex-col items-center space-y-3 text-indigo-400">
                <RefreshCw className="w-10 h-10 animate-spin" />
                <span className="font-semibold text-sm">Reading PDF...</span>
                <span className="text-slate-500 text-[11px]">Extracting text from all pages</span>
              </div>
            ) : uploadedFile ? (
              <div className="flex flex-col items-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{uploadedFile.name}</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    {(uploadedFile.size / 1024).toFixed(1)} KB
                    {extractedText && ` · ${extractedText.split(/\s+/).length} words extracted`}
                  </p>
                </div>
                <span className="text-indigo-400 text-[11px] font-medium group-hover:underline">
                  Click to replace PDF
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-3 text-slate-500">
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center group-hover:border-indigo-500/50 group-hover:text-indigo-400 transition-all">
                  <FileUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-slate-300 text-sm">Drop your resume PDF here</p>
                  <p className="text-[11px] mt-0.5">or click to browse files</p>
                </div>
                <span className="text-[10px] px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-500">
                  Supported: PDF · Max 10 MB
                </span>
              </div>
            )}
          </div>

          {/* Error Banner */}
          {extractError && (
            <div className="flex items-start space-x-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="text-[11px] leading-relaxed">{extractError}</span>
            </div>
          )}

          {/* Extracted Text Preview (collapsed, read-only) */}
          {extractedText && !isExtracting && (
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-semibold flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Text extracted successfully</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {extractedText.length.toLocaleString()} characters
                </span>
              </div>
              <pre className="text-[10px] text-slate-400 font-mono leading-relaxed max-h-24 overflow-y-auto whitespace-pre-wrap break-words">
                {extractedText.slice(0, 400)}{extractedText.length > 400 ? '...' : ''}
              </pre>
            </div>
          )}
        </div>

        {/* Analyse Button */}
        <button
          onClick={handleRunAnalysis}
          disabled={!canAnalyze}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs transition-all flex items-center justify-center space-x-2 shadow-glow-indigo disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing resume...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              <span>Detect Skills & Calculate Match Score</span>
            </>
          )}
        </button>

        {/* Analysis Results */}
        {analysisResult && (
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-indigo-500/30 space-y-4 text-xs animate-fadeIn">

            {/* Score Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                  Match Score vs. {analysisResult.targetJobTitle}
                </span>
                <div className="text-3xl font-black text-white mt-0.5">
                  {analysisResult.tfidfScore}%
                </div>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1.5 rounded-xl font-bold text-sm ${
                  analysisResult.tfidfScore >= 70 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  analysisResult.tfidfScore >= 45 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                  'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>
                  {analysisResult.tfidfScore >= 70 ? 'Strong Match' :
                   analysisResult.tfidfScore >= 45 ? 'Partial Match' : 'Needs Work'}
                </span>
                <p className="text-slate-500 text-[10px] mt-1">
                  {analysisResult.extractedSkills.length} skills detected
                </p>
              </div>
            </div>

            {/* Detected Skills Grid */}
            <div className="space-y-2">
              <span className="text-slate-300 font-bold flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Skills Detected in Your Resume</span>
              </span>

              {analysisResult.extractedSkills.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center text-slate-500">
                  No recognizable skills found. Try uploading a more detailed resume.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {analysisResult.extractedSkills.map(sk => (
                    <div
                      key={sk.skillId}
                      className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-white block">{sk.skillName}</span>
                        <span className="text-[10px] text-slate-500">
                          matched: &ldquo;{sk.matchedTerm}&rdquo;
                        </span>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-bold text-[10px] block">
                          Level {sk.detectedProficiency}
                        </span>
                        <span className="text-[9px] text-slate-600">
                          {sk.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sync Button */}
            {analysisResult.extractedSkills.length > 0 && (
              <button
                onClick={handleSyncToProfile}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center justify-center space-x-1.5 shadow-glow-emerald"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Add Detected Skills to My Profile & Generate Roadmap</span>
              </button>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
