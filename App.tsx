
import React, { useState, useCallback } from 'react';
import { Job, ServeStatus, PortalView, Attempt } from './types';
import { Navbar, Footer } from './components/Layout';
import { LandingPage, IntakeWizard, TrackingPage } from './portals/CustomerPortal';
import { ServerPortal } from './portals/ServerPortal';

const INITIAL_JOBS: Job[] = [
  {
    id: 'SR-2025-00142',
    defendant: 'John David Smith',
    address: '1234 Peachtree St NE',
    unit: 'Apt 4B',
    city: 'Atlanta',
    state: 'GA',
    zip: '30309',
    county: 'Fulton',
    documentType: 'SUMMONS_COMPLAINT',
    documents: ['summons.pdf', 'complaint.pdf'],
    status: ServeStatus.IN_PROGRESS,
    receivedDate: '2025-01-07T14:18:00Z',
    dueDate: '2025-01-14T00:00:00Z',
    serverName: 'Marcus T.',
    attempts: [
      { id: '1', timestamp: '2025-01-08T18:47:00Z', type: 'NO_ANSWER', notes: 'Lights were off. No response to knock.', locationVerified: true }
    ],
    price: 85,
    contactEmail: 'attorney@smithlaw.com'
  }
];

const App: React.FC = () => {
  const [portal, setPortal] = useState<PortalView>(PortalView.LANDING);
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [activeTrackingJob, setActiveTrackingJob] = useState<Job | null>(null);

  const handleNewJob = (jobData: Partial<Job>) => {
    const newJob: Job = {
      ...jobData as Job,
      id: `SR-2025-${Math.floor(Math.random() * 90000) + 10000}`,
      status: ServeStatus.RECEIVED,
      receivedDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      attempts: [],
    };
    setJobs(prev => [newJob, ...prev]);
    setActiveTrackingJob(newJob);
    setPortal(PortalView.CUSTOMER_TRACKING);
  };

  const handleLogAttempt = (jobId: string, attempt: Partial<Attempt>) => {
    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        return {
          ...j,
          attempts: [...j.attempts, { ...attempt, id: Math.random().toString() } as Attempt],
          status: ServeStatus.ATTEMPTED
        };
      }
      return j;
    }));
  };

  const handleComplete = (jobId: string) => {
    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        return {
          ...j,
          status: ServeStatus.COMPLETE,
          completedDate: new Date().toISOString()
        };
      }
      return j;
    }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar activePortal={portal} onPortalChange={setPortal} />
      
      <main className="flex-grow">
        {portal === PortalView.LANDING && (
          <LandingPage 
            onStart={() => setPortal(PortalView.CUSTOMER_INTAKE)} 
            onTrack={() => {
              setActiveTrackingJob(jobs[0]);
              setPortal(PortalView.CUSTOMER_TRACKING);
            }} 
          />
        )}

        {portal === PortalView.CUSTOMER_INTAKE && (
          <IntakeWizard onSubmit={handleNewJob} onCancel={() => setPortal(PortalView.LANDING)} />
        )}

        {portal === PortalView.CUSTOMER_TRACKING && activeTrackingJob && (
          <TrackingPage job={jobs.find(j => j.id === activeTrackingJob.id) || activeTrackingJob} />
        )}

        {portal === PortalView.SERVER_MOBILE && (
          <ServerPortal 
            jobs={jobs} 
            onLogAttempt={handleLogAttempt} 
            onComplete={handleComplete} 
          />
        )}

        {portal === PortalView.ADMIN_DASHBOARD && (
          <div className="p-12 max-w-7xl mx-auto space-y-8">
            <h1 className="text-4xl font-bold serif">Admin Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Active Jobs', val: jobs.filter(j => j.status !== ServeStatus.COMPLETE).length },
                { label: 'Completed (MTD)', val: jobs.filter(j => j.status === ServeStatus.COMPLETE).length },
                { label: 'Revenue (MTD)', val: '$' + jobs.reduce((acc, j) => acc + j.price, 0) },
                { label: 'Active Servers', val: 12 }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-[#1a2b4a]">{stat.val}</p>
                </div>
              ))}
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="p-4 font-bold text-xs uppercase text-gray-400">ID</th>
                    <th className="p-4 font-bold text-xs uppercase text-gray-400">Defendant</th>
                    <th className="p-4 font-bold text-xs uppercase text-gray-400">County</th>
                    <th className="p-4 font-bold text-xs uppercase text-gray-400">Status</th>
                    <th className="p-4 font-bold text-xs uppercase text-gray-400">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map(job => (
                    <tr key={job.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="p-4 mono text-sm font-medium">{job.id}</td>
                      <td className="p-4 font-bold">{job.defendant}</td>
                      <td className="p-4 text-sm text-gray-600">{job.county}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                          job.status === ServeStatus.COMPLETE ? 'bg-emerald-100 text-emerald-700' : 'bg-teal-100 text-teal-700'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <button 
                          onClick={() => { setActiveTrackingJob(job); setPortal(PortalView.CUSTOMER_TRACKING); }}
                          className="text-[#0d9488] font-bold text-xs uppercase hover:underline"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {portal !== PortalView.SERVER_MOBILE && <Footer />}
      
      {/* Portal Switcher for Demo */}
      <div className="fixed bottom-4 left-4 flex gap-2 z-[9999] bg-white/80 backdrop-blur p-2 rounded-full shadow-2xl border border-gray-200">
        <button onClick={() => setPortal(PortalView.SERVER_MOBILE)} className="w-10 h-10 bg-[#0d9488] text-white rounded-full text-xs font-bold">App</button>
        <button onClick={() => setPortal(PortalView.ADMIN_DASHBOARD)} className="w-10 h-10 bg-[#1a2b4a] text-white rounded-full text-xs font-bold">Adm</button>
        <button onClick={() => setPortal(PortalView.LANDING)} className="w-10 h-10 bg-gray-400 text-white rounded-full text-xs font-bold">Home</button>
      </div>
    </div>
  );
};

export default App;
