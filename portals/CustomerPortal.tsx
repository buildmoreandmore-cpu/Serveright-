
import React, { useState, useEffect } from 'react';
import { Job, ServeStatus, PortalView } from '../types';
import { COUNTY_RATES, COLORS } from '../constants';
import { getAIStatusExplanation } from '../services/geminiService';

// --- LANDING PAGE ---
export const LandingPage: React.FC<{ onStart: () => void; onTrack: () => void }> = ({ onStart, onTrack }) => (
  <div className="min-h-screen">
    {/* Hero Section */}
    <section className="pt-24 pb-32 px-6 relative overflow-hidden bg-gradient-to-br from-[#1a2b4a] to-[#2d3e61] text-white">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#0d9488]/5 -skew-x-12 transform translate-x-1/4 transition-opacity duration-1000"></div>
      <div className="max-w-5xl mx-auto relative z-10 text-center">
        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 animate-fade-up stagger-1">
          Process Serving <br/><span className="text-[#0d9488]">Without the Guesswork</span>
        </h1>
        <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-2xl mx-auto font-light animate-fade-up stagger-2">
          Real-time tracking. County-wide coverage. <br className="hidden md:block"/> Vetted servers. Papers served right.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-up stagger-3">
          <button 
            onClick={onStart}
            className="w-full sm:w-auto bg-[#0d9488] hover:bg-[#097a6f] text-white px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-xl shadow-[#0d9488]/30 btn-active"
          >
            Get a Quote
          </button>
          <button 
            onClick={onTrack}
            className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/20 px-8 py-4 rounded-lg font-bold text-lg transition-all backdrop-blur-sm btn-active"
          >
            Track Your Serve
          </button>
        </div>
      </div>
    </section>

    {/* Trust Signals */}
    <section className="py-16 bg-white border-b border-gray-100 px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-8 md:gap-24 opacity-60 animate-fade-up stagger-4">
        {['5-7 Day Guarantee', 'Real-Time Updates', 'Metro Atlanta Experts', 'Secure Affidavit Delivery'].map((text, i) => (
          <div key={i} className="text-center font-bold text-gray-400 uppercase tracking-widest text-xs">{text}</div>
        ))}
      </div>
    </section>

    {/* How it works */}
    <section className="py-24 px-6 bg-[#fafafa]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16 serif">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { step: '01', title: 'Submit Request', desc: 'Provide defendant details and upload your documents through our secure portal.' },
            { step: '02', title: 'Vetted Assignment', desc: 'We instantly assign the best local server for your specific county and case type.' },
            { step: '03', title: 'Real-Time Track', desc: 'Watch every attempt in real-time. Get notified immediately upon service completion.' }
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center card-hover">
              <span className="text-[#0d9488] font-black text-5xl opacity-10 mb-4">{item.step}</span>
              <h3 className="text-xl font-bold mb-4">{item.title}</h3>
              <p className="text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

// --- INTAKE WIZARD ---
export const IntakeWizard: React.FC<{ onSubmit: (job: Partial<Job>) => void; onCancel: () => void }> = ({ onSubmit, onCancel }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Job>>({
    defendant: '',
    aliases: '',
    description: '',
    address: '',
    unit: '',
    city: '',
    state: 'GA',
    zip: '',
    county: 'Fulton',
    documentType: 'SUMMONS_COMPLAINT',
    documents: [],
    price: 85,
    contactEmail: ''
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === 'county') {
        newData.price = COUNTY_RATES[value] || 85;
      }
      return newData;
    });
  };

  return (
    <div className="min-h-screen pt-12 pb-24 px-6 bg-[#f3f4f6]">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-up">
        <div className="h-2 bg-gray-100">
          <div 
            className="h-full bg-[#0d9488] transition-all duration-500 ease-out" 
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        <div className="p-10">
          <div key={step} className="animate-fade-up">
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold serif">Who needs to be served?</h2>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
                  <input 
                    type="text" name="defendant" value={formData.defendant} onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0d9488] focus:border-transparent outline-none transition-all"
                    placeholder="e.g. John David Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Known Aliases (optional)</label>
                  <input 
                    type="text" name="aliases" value={formData.aliases} onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0d9488] outline-none"
                    placeholder="e.g. Johnny Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description (optional)</label>
                  <textarea 
                    name="description" value={formData.description} onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-lg h-24 focus:ring-2 focus:ring-[#0d9488] outline-none"
                    placeholder="e.g. White male, approx 45, drives blue Ford"
                  />
                </div>
                <div className="pt-4 flex justify-end">
                  <button onClick={nextStep} className="bg-[#1a2b4a] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#2d3e61] transition-all btn-active">Continue →</button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold serif">Where should we serve?</h2>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Street Address *</label>
                  <input 
                    type="text" name="address" value={formData.address} onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0d9488] outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">City *</label>
                    <input 
                      type="text" name="city" value={formData.city} onChange={handleInputChange}
                      className="w-full p-3 border border-gray-200 rounded-lg outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">ZIP *</label>
                    <input 
                      type="text" name="zip" value={formData.zip} onChange={handleInputChange}
                      className="w-full p-3 border border-gray-200 rounded-lg outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">County *</label>
                  <select 
                    name="county" value={formData.county} onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-lg outline-none"
                  >
                    {Object.keys(COUNTY_RATES).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="p-4 bg-[#0d9488]/5 border border-[#0d9488]/20 rounded-lg animate-fade-up">
                  <p className="text-[#0d9488] font-bold text-lg">Standard serve: ${formData.price}</p>
                  <p className="text-xs text-[#0d9488]/70">Flat rate includes up to 4 attempts.</p>
                </div>
                <div className="pt-4 flex justify-between">
                  <button onClick={prevStep} className="text-gray-400 font-bold hover:text-gray-600 transition-colors">← Back</button>
                  <button onClick={nextStep} className="bg-[#1a2b4a] text-white px-8 py-3 rounded-lg font-bold btn-active">Continue →</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold serif">Documents & Types</h2>
                <div className="border-2 border-dashed border-gray-200 rounded-2xl py-12 px-6 text-center cursor-pointer hover:border-[#0d9488] transition-all group">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">📄</div>
                  <p className="font-bold text-gray-700">Drag files here or click to browse</p>
                  <p className="text-xs text-gray-400 mt-2">PDF, DOC, DOCX (max 25MB)</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Document Type *</label>
                  <div className="grid grid-cols-1 gap-3">
                    {['Summons & Complaint', 'Subpoena', 'Eviction Notice', 'Other'].map(type => (
                      <label key={type} className="flex items-center gap-3 p-4 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="docType" className="w-5 h-5 text-[#0d9488]" />
                        <span className="text-sm font-medium">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="pt-4 flex justify-between">
                  <button onClick={prevStep} className="text-gray-400 font-bold">← Back</button>
                  <button onClick={nextStep} className="bg-[#1a2b4a] text-white px-8 py-3 rounded-lg font-bold btn-active">Continue →</button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold serif">Review & Information</h2>
                <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs uppercase tracking-wider font-bold text-gray-400">Defendant</p>
                      <p className="font-bold text-lg">{formData.defendant}</p>
                      <p className="text-sm text-gray-500">{formData.address}, {formData.city}, {formData.county} County</p>
                    </div>
                    <button onClick={() => setStep(1)} className="text-[#0d9488] text-xs font-bold uppercase underline">Edit</button>
                  </div>
                  <div className="pt-4 border-t border-gray-200 flex justify-between">
                    <span className="font-bold text-gray-600">Total Price</span>
                    <span className="font-bold text-xl">${formData.price}.00</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Your Email Address *</label>
                  <input 
                    type="email" name="contactEmail" value={formData.contactEmail} onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#0d9488]"
                    placeholder="attorney@lawfirm.com"
                  />
                </div>
                <div className="pt-4 flex justify-between items-center">
                  <button onClick={prevStep} className="text-gray-400 font-bold">← Back</button>
                  <button 
                    onClick={() => onSubmit(formData)} 
                    className="bg-[#0d9488] text-white px-10 py-4 rounded-lg font-bold text-lg shadow-lg shadow-[#0d9488]/20 btn-active transition-all"
                  >
                    Pay & Submit →
                  </button>
                </div>
                <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
                  🔒 Secure checkout powered by Stripe
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- TRACKING PAGE ---
export const TrackingPage: React.FC<{ job: Job }> = ({ job }) => {
  const [aiExplanation, setAiExplanation] = useState<string>('');
  const [visibleSteps, setVisibleSteps] = useState(0);

  useEffect(() => {
    getAIStatusExplanation(job).then(setAiExplanation);
    
    // Animate the timeline steps one by one
    const timer = setInterval(() => {
      setVisibleSteps(v => v < 5 ? v + 1 : v);
    }, 400);
    return () => clearInterval(timer);
  }, [job]);

  const steps = [
    { label: 'Received', completed: true, date: job.receivedDate },
    { label: 'Assigned', completed: !!job.serverName, date: job.receivedDate },
    { label: 'Attempt 1', completed: job.attempts.length >= 1, date: job.attempts[0]?.timestamp },
    { label: 'Attempt 2', completed: job.attempts.length >= 2, date: job.attempts[1]?.timestamp },
    { label: 'Complete', completed: job.status === ServeStatus.COMPLETE, date: job.completedDate }
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] pt-12 pb-24 px-6 animate-fade-up">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Tracking Number</p>
            <h1 className="text-3xl font-bold mono">{job.id}</h1>
          </div>
          <div className={`px-4 py-2 rounded-full font-bold text-sm border transition-colors duration-500 ${
            job.status === ServeStatus.COMPLETE ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-teal-50 text-teal-700 border-teal-200'
          }`}>
            STATUS: {job.status.replace('_', ' ')}
          </div>
        </div>

        {/* AI Concierge Message */}
        <div className="bg-[#1a2b4a] text-white p-8 rounded-2xl shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
            </svg>
          </div>
          <div className="relative z-10">
            <h3 className="text-[#0d9488] font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0d9488] animate-pulse"></span>
              Live Case Concierge
            </h3>
            <p className={`text-lg leading-relaxed text-white/90 italic transition-opacity duration-700 ${aiExplanation ? 'opacity-100' : 'opacity-40'}`}>
              "{aiExplanation || 'Analyzing current case status...'}"
            </p>
          </div>
        </div>

        {/* Progress Stepper with Animation */}
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          <div className="flex justify-between items-start min-w-[600px] relative">
            {/* The Connecting Line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-100 z-0">
               <div 
                className="h-full bg-[#0d9488] transition-all duration-1000 ease-in-out" 
                style={{ width: `${Math.max(0, (visibleSteps - 1) / 4) * 100}%` }}
              />
            </div>
            {steps.map((s, i) => (
              <div key={i} className={`relative z-10 flex flex-col items-center flex-1 transition-all duration-500 ${i < visibleSteps ? 'opacity-100' : 'opacity-0 scale-90'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                  s.completed ? 'bg-[#0d9488] border-[#0d9488]/20 text-white' : 'bg-white border-gray-100 text-gray-300'
                } ${i === visibleSteps - 1 && s.completed ? 'animate-node' : ''}`}>
                  {s.completed ? '✓' : i + 1}
                </div>
                <p className={`mt-3 font-bold text-xs uppercase tracking-tight ${s.completed ? 'text-gray-900' : 'text-gray-400'}`}>{s.label}</p>
                <p className="text-[10px] text-gray-400 mt-1">{s.date ? new Date(s.date).toLocaleDateString() : '--'}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 card-hover">
            <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400 mb-6 pb-2 border-b border-gray-50">Serve Details</h3>
            <dl className="space-y-4">
              <div className="flex justify-between">
                <dt className="text-gray-400 text-sm">Defendant</dt>
                <dd className="font-bold text-sm text-right">{job.defendant}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-400 text-sm">Address</dt>
                <dd className="font-bold text-sm text-right max-w-[200px]">{job.address}, {job.unit ? job.unit + ',' : ''} {job.city}, GA</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-400 text-sm">County</dt>
                <dd className="font-bold text-sm text-right">{job.county}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 card-hover">
            <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400 mb-6 pb-2 border-b border-gray-50">Activity Log</h3>
            <div className="space-y-6">
              {job.attempts.length === 0 && (
                <p className="text-gray-400 text-sm italic">No attempts logged yet. Server is being dispatched.</p>
              )}
              {job.attempts.map((attempt, i) => (
                <div key={i} className="pl-4 border-l-2 border-[#0d9488] space-y-1 animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <p className="text-xs font-bold text-[#0d9488]">{new Date(attempt.timestamp).toLocaleString()}</p>
                  <p className="text-sm font-bold">{attempt.type.replace('_', ' ')}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{attempt.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {job.status === ServeStatus.COMPLETE && (
          <div className="bg-emerald-600 text-white p-8 rounded-2xl shadow-lg shadow-emerald-200 flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-up">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2 serif">Your Affidavit is Ready</h3>
              <p className="text-emerald-50">Service completed and notarized on {new Date(job.completedDate || '').toLocaleDateString()}.</p>
            </div>
            <button className="bg-white text-emerald-700 px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-50 transition-all btn-active shadow-lg">
              <span className="text-xl">📄</span> Download Affidavit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
