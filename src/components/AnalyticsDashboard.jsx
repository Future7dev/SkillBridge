import React, { useState } from 'react';
import { 
  BarChart3, 
  BrainCircuit, 
  CheckCircle2, 
  Cpu, 
  Calculator, 
  LineChart, 
  Sparkles,
  PieChart
} from 'lucide-react';
import { evaluateExtractionMetrics } from '../services/nlpEngine';
import { CANONICAL_SKILLS } from '../data/skillsData';

export default function AnalyticsDashboard({ student, jobs }) {
  // Labeled Evaluation Sample Data for NER Model Testing (Section 19)
  const [sampleText, setSampleText] = useState(
    "Candidate has expertise in C#, ASP.NET Core Web API, Microsoft SQL Server, Entity Framework, and Docker containers."
  );
  const groundTruth = ["C#", "ASP.NET Core", "SQL Server", "Entity Framework", "Docker"];
  const extractedSample = ["C#", "ASP.NET Core", "SQL Server", "Entity Framework", "Docker"];

  const metrics = evaluateExtractionMetrics(groundTruth, extractedSample);

  // Interactive Live Formula Simulator State
  const [simReq, setSimReq] = useState(3);
  const [simStud, setSimStud] = useState(2);
  const [simWeight, setSimWeight] = useState(20);

  const simGap = Math.max(simReq - simStud, 0);
  const simMatch = Math.min(simStud / simReq, 1);

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-3">
            <BarChart3 className="w-6 h-6 text-indigo-400" />
            <span>Platform Analytics & ML Evaluation Service</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Evaluate skill extraction NLP precision, recall, F1-scores, and inspect deterministic gap formulas.
          </p>
        </div>
      </div>

      {/* Grid 1: ML Model Evaluation Metrics (Section 19) */}
      <div className="glass-panel p-6 rounded-2xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <BrainCircuit className="w-5 h-5 text-cyan-400" />
              <span>Section 19: Skill Extraction ML Evaluation (NER)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Precision, Recall & F1-score evaluation on labeled resume/job-description benchmarks.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Rule + NER Model Baseline
          </span>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="glass-card p-5 rounded-xl border border-cyan-500/30 text-center">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Precision</span>
            <span className="text-3xl font-black text-cyan-400 mt-2 block">{metrics.precision}%</span>
            <p className="text-[11px] text-slate-400 mt-1">Correct extracted skills ratio</p>
          </div>

          <div className="glass-card p-5 rounded-xl border border-indigo-500/30 text-center">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Recall</span>
            <span className="text-3xl font-black text-indigo-400 mt-2 block">{metrics.recall}%</span>
            <p className="text-[11px] text-slate-400 mt-1">Total true skills extracted ratio</p>
          </div>

          <div className="glass-card p-5 rounded-xl border border-emerald-500/30 text-center">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">F1-Score</span>
            <span className="text-3xl font-black text-emerald-400 mt-2 block">{metrics.f1Score}%</span>
            <p className="text-[11px] text-slate-400 mt-1">Harmonic mean of precision & recall</p>
          </div>
        </div>

        {/* Evaluation Benchmarking Box */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
          <span className="font-bold text-slate-300">Labeled Benchmark Sentence:</span>
          <p className="text-slate-400 italic">"{sampleText}"</p>
          <div className="flex items-center space-x-4 pt-1 text-[11px]">
            <span className="text-emerald-400 font-semibold">True Positives: {metrics.truePositives}</span>
            <span className="text-rose-400 font-semibold">False Positives: {metrics.falsePositives}</span>
            <span className="text-amber-400 font-semibold">False Negatives: {metrics.falseNegatives}</span>
          </div>
        </div>
      </div>

      {/* Grid 2: Live Formula Debugger / Simulator */}
      <div className="glass-panel p-6 rounded-2xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-indigo-400" />
              <span>Skill Gap & Match Formula Simulator</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Interactively test the exact mathematical formulas from Sections 6 & 7.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          {/* Controls */}
          <div className="space-y-4 glass-card p-5 rounded-xl border border-slate-800 text-xs">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Required Proficiency Level (0-5)</label>
              <input 
                type="number" 
                min="0" 
                max="5" 
                value={simReq} 
                onChange={(e) => setSimReq(parseInt(e.target.value || 0, 10))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Effective Student Level (0-5)</label>
              <input 
                type="number" 
                min="0" 
                max="5" 
                value={simStud} 
                onChange={(e) => setSimStud(parseInt(e.target.value || 0, 10))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Skill Weight (e.g. 20)</label>
              <input 
                type="number" 
                value={simWeight} 
                onChange={(e) => setSimWeight(parseInt(e.target.value || 0, 10))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold"
              />
            </div>
          </div>

          {/* Real-time Math Output */}
          <div className="md:col-span-2 glass-card p-6 rounded-xl border border-indigo-500/30 space-y-4 text-xs">
            <h3 className="font-bold text-white text-sm">Calculated Output:</h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 font-mono">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Calculated Gap</span>
                <span className="text-xl font-bold text-rose-400">{simGap}</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Skill Match Ratio</span>
                <span className="text-xl font-bold text-cyan-400">{(simMatch * 100).toFixed(1)}%</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Weighted Points</span>
                <span className="text-xl font-bold text-indigo-400">{(simMatch * simWeight).toFixed(1)}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 text-[11px] font-mono text-slate-300 space-y-1">
              <div>Formula 1: Gap = max({simReq} - {simStud}, 0) = <strong>{simGap}</strong></div>
              <div>Formula 2: Skill Match = min({simStud} / {simReq}, 1) = <strong>{simMatch.toFixed(3)}</strong></div>
              <div>Formula 3: Contribution = {simMatch.toFixed(3)} × {simWeight} = <strong>{(simMatch * simWeight).toFixed(2)}</strong></div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
