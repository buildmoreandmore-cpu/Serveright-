
import React, { useState } from 'react';
import { Job, ServeStatus, PortalView, Attempt } from '../types';

export const ServerPortal: React.FC<{ jobs: Job[]; onLogAttempt: (jobId: string, attempt: Partial<Attempt>) => void; onComplete: (jobId: string) => void }> = ({ jobs, onLogAttempt, onComplete }) => {
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [view, setView] = useState<'HOME' | 'DETAILS' | 'LOG'>('HOME');

  const activeJobs = jobs.filter(j => j.status !== ServeStatus.COMPLETE);

  if (view === 'HOME') {
    return (
      <div className="bg-[#fafafa] min-h-screen pb-20 font-['Plus_Jakarta_Sans'] animate-fade-up">
        <header className="bg-[#1a2b4a] text-white p-6 pt-10 rounded-b-[2rem] shadow-lg animate-fade-up">
          <div className="flex justify-between items-center mb-6">
            <div className="animate-fade-up stagger-1">
              <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">Good evening,</p>
              <h1 className="text-2xl font-bold">Marcus</h1>
            </div>
            <div className="w-10 h-10 bg-[#0d9488] rounded-full flex items-center justify-center font-bold animate-node stagger-2">M</div>
          </div>
          <div className="grid grid-cols-2 gap-4 animate-fade-up stagger-3">
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10">
              <p className="text-3xl font-bold text-[#0d9488]">{activeJobs.length}</p>
              <p className="text-xs text-white/60 font-medium">Active Jobs</p>
            </div>
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10">
              <p className="text-3xl font-bold text-white">$405</p>
              <p className="text-xs text-white/60 font-medium">Next Payout</p>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          <h2 className="text-lg font-bold text-gray-900 px-1">Your Queue</h2>
          {activeJobs.map((job, i) => (
            <div 
              key={job.id} 
              onClick={() => { setActiveJob(job); setView('DETAILS'); }}
              className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer card-hover animate-fade-up"
              style={{ animationDelay: `${0.1 + i * 0.05}s` }}
            >
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{job.id}</p>
                <h3 className="font-bold text-gray-900">{job.defendant}</h3>
                <p className="text-xs text-gray-500 mt-1">{job.address}, {job.city}</p>
              </div>
              <div className="bg-[#0d9488]/10 text-[#0d9488] w-10 h-10 rounded-full flex items-center justify-center">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'DETAILS' && activeJob) {
    return (
      <div className="bg-[#fafafa] min-h-screen pb-20 font-['Plus_Jakarta_Sans'] animate-fade-up">
        <div className="bg-white p-6 sticky top-0 flex items-center gap-4 border-b border-gray-100 z-50">
          <button onClick={() => setView('HOME')} className="p-2 -ml-2 btn-active">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="font-bold text-lg">Job Detail</h1>
        </div>

        <div className="p-6 space-y-8 animate-fade-up stagger-1">
          <section className="space-y-2">
            <h2 className="text-2xl font-black text-gray-900">{activeJob.defendant}</h2>
            <p className="text-gray-500">{activeJob.address}, {activeJob.unit ? activeJob.unit + ',' : ''} {activeJob.city}, GA {activeJob.zip}</p>
            <div className="flex gap-2 pt-2">
              <button className="flex-1 bg-white border border-gray-200 py-3 rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-2 btn-active shadow-sm">
                <span>📍</span> Navigate
              </button>
              <button className="flex-1 bg-white border border-gray-200 py-3 rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-2 btn-active shadow-sm">
                <span>📄</span> View Docs
              </button>
            </div>
          </section>

          <section className="bg-[#1a2b4a] p-6 rounded-2xl text-white shadow-xl shadow-[#1a2b4a]/10 animate-fade-up stagger-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Instructions</h3>
              <span className="text-[#0d9488] font-bold text-xs">DEADLINE: {new Date(activeJob.dueDate).toLocaleDateString()}</span>
            </div>
            <p className="text-sm leading-relaxed text-white/80">
              {activeJob.description || "Gated community - code is #1234. Best times: evenings after 6pm."}
            </p>
          </section>

          <section className="space-y-4 animate-fade-up stagger-3">
            <h3 className="font-bold text-gray-900">Attempts</h3>
            {activeJob.attempts.length === 0 && <p className="text-gray-400 text-xs italic">No attempts logged yet.</p>}
            {activeJob.attempts.map((a, i) => (
              <div key={i} className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm animate-fade-up">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">{new Date(a.timestamp).toLocaleString()}</p>
                <p className="text-sm font-bold">{a.type}</p>
                <p className="text-xs text-gray-500 mt-1">{a.notes}</p>
              </div>
            ))}
            
            <div className="pt-4 space-y-3">
              <button 
                onClick={() => setView('LOG')}
                className="w-full bg-[#0d9488] text-white py-4 rounded-2xl font-bold shadow-lg shadow-[#0d9488]/20 btn-active transition-all"
              >
                Log Attempt
              </button>
              <button 
                onClick={() => {
                  onComplete(activeJob.id);
                  setView('HOME');
                }}
                className="w-full bg-[#1a2b4a] text-white py-4 rounded-2xl font-bold shadow-lg shadow-[#1a2b4a]/20 btn-active transition-all"
              >
                Mark Served
              </button>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (view === 'LOG' && activeJob) {
    return (
      <div className="bg-[#fafafa] min-h-screen font-['Plus_Jakarta_Sans'] p-6 animate-fade-up">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Log Attempt</h1>
          <button onClick={() => setView('DETAILS')} className="p-2 bg-gray-100 rounded-full btn-active transition-all">✕</button>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">What happened?</label>
            <div className="grid grid-cols-1 gap-3">
              {['No answer at door', 'Wrong address', 'Refused service', 'Gated / No access', 'Not the right person'].map((opt, i) => (
                <button 
                  key={opt}
                  style={{ animationDelay: `${i * 0.05}s` }}
                  onClick={() => {
                    onLogAttempt(activeJob.id, { 
                      type: 'NO_ANSWER' as any, 
                      notes: opt, 
                      timestamp: new Date().toISOString(),
                      locationVerified: true 
                    });
                    setView('DETAILS');
                  }}
                  className="w-full bg-white p-5 rounded-2xl border border-gray-100 text-left font-semibold active:bg-teal-50 active:border-[#0d9488] transition-all card-hover animate-fade-up shadow-sm"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
