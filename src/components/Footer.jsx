import React from 'react';
import { Globe } from 'lucide-react';
import Logo from '../assets/Logo.png';

const Footer = () => {
  return (
    <footer className="bg-[#f8faff] border-t border-gray-200 py-10 px-4 md:px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 lg:gap-10">
        
        {/* Left Section - Brand & Bio */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-xs">
          <img 
            src={Logo} 
            alt="Brand Logo" 
            className="h-8 w-auto object-contain mb-3" 
          />
          <p className="text-[11px] md:text-xs text-gray-500 leading-relaxed font-medium">
            Empowering the next generation of African trade through digital efficiency and trust-based logistics.
          </p>
        </div>

        {/* Middle Section - Links */}
        <div className="flex flex-col items-center gap-4 w-full lg:w-auto">
          <div className="flex flex-wrap justify-center gap-x-4 md:gap-x-6 gap-y-3 text-[10px] sm:text-[11px] font-bold text-slate-700 uppercase tracking-wider">
            <a href="#" className="hover:text-green-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-green-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-green-600 transition-colors">Buyer Protection</a>
          </div>
          <div className="flex justify-center text-[10px] sm:text-[11px] font-bold text-slate-700 uppercase tracking-wider">
            <a href="#" className="hover:text-green-600 transition-colors">Contact Support</a>
          </div>
        </div>

        {/* Right Section - Language & Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-6 mt-2 lg:mt-0">
          <button className="flex items-center gap-1.5 px-4 py-1.5 border border-gray-300 rounded-full text-[11px] text-gray-600 hover:bg-gray-100 transition-colors bg-transparent">
            <Globe size={14} className="text-gray-500 shrink-0" />
            <span className="font-medium">English (US)</span>
          </button>
          <div className="text-[10px] text-gray-500 leading-tight text-center sm:text-left">
            <p>© 2024</p>
            <p>TradeSphere Inc.</p>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;