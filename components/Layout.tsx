
import React from 'react';
import { PortalView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activePortal: PortalView;
  onPortalChange: (portal: PortalView) => void;
}

export const Navbar: React.FC<LayoutProps> = ({ activePortal, onPortalChange }) => {
  const isMobilePortal = activePortal === PortalView.SERVER_MOBILE;

  if (isMobilePortal) return null; // Mobile portal has its own header

  return (
    <nav className="bg-[#1a2b4a] text-white py-4 px-6 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => onPortalChange(PortalView.LANDING)}
        >
          <div className="w-8 h-8 bg-[#0d9488] rounded-md flex items-center justify-center font-bold text-lg">S</div>
          <span className="text-xl font-bold serif tracking-tight">ServeRight <span className="font-light opacity-80 text-sm tracking-widest uppercase hidden sm:inline ml-1">Network</span></span>
        </div>
        
        <div className="hidden md:flex gap-6 text-sm font-medium">
          <button onClick={() => onPortalChange(PortalView.LANDING)} className="hover:text-[#0d9488] transition-colors">Home</button>
          <button onClick={() => onPortalChange(PortalView.CUSTOMER_DASHBOARD)} className="hover:text-[#0d9488] transition-colors">Client Portal</button>
          <button onClick={() => onPortalChange(PortalView.ADMIN_DASHBOARD)} className="hover:text-[#0d9488] transition-colors">Admin</button>
          <button onClick={() => onPortalChange(PortalView.SERVER_MOBILE)} className="bg-white/10 px-3 py-1 rounded-full text-xs border border-white/20">Switch to Server View</button>
        </div>

        <button 
          onClick={() => onPortalChange(PortalView.CUSTOMER_INTAKE)}
          className="bg-[#0d9488] hover:bg-[#097a6f] text-white px-5 py-2 rounded font-semibold text-sm transition-all active:scale-95 shadow-lg shadow-[#0d9488]/20"
        >
          New Serve
        </button>
      </div>
    </nav>
  );
};

export const Footer: React.FC = () => (
  <footer className="bg-[#1a2b4a] text-white/60 py-12 px-6 border-t border-white/10">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="col-span-1 md:col-span-2">
        <h3 className="text-white text-xl font-bold serif mb-4">ServeRight Network</h3>
        <p className="text-sm max-w-sm">
          A modern approach to process serving. Built on transparency, 
          real-time communication, and the Atlanta Metro legal community.
        </p>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Service Areas</h4>
        <ul className="text-sm space-y-2">
          <li>Fulton County</li>
          <li>DeKalb County</li>
          <li>Gwinnett County</li>
          <li>Cobb County</li>
          <li>Clayton & Henry</li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
        <p className="text-sm">support@serveright.network</p>
        <p className="text-sm">(470) 555-0123</p>
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-xs text-center">
      &copy; {new Date().getFullYear()} ServeRight Network. All rights reserved. Vetted Atlanta Process Servers.
    </div>
  </footer>
);
