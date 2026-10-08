import React, { useState } from 'react';
import { Search, Bell, Home as HomeIcon, Menu, X } from 'lucide-react';
import Logo from '../assets/Logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <img 
            src={Logo} 
            alt="Brand Logo" 
            className="h-7 md:h-8 w-auto object-contain" 
          />
        </div>
        
        {/* Desktop Search */}
        <div className="hidden md:block flex-1 max-w-3xl mx-8 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border-none bg-green-50/50 rounded-full text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            placeholder="Search products, vendors, or services..."
          />
        </div>

        {/* Desktop Links & Profile */}
        <div className="hidden md:flex items-center space-x-8 shrink-0">
          <div className="flex items-center space-x-6 text-sm font-semibold text-gray-700">
            <a href="#" className="hover:text-green-600 transition-colors">Marketplace</a>
            <a href="#" className="hover:text-green-600 transition-colors">Logistics</a>
            <a href="#" className="hover:text-green-600 transition-colors">Support</a>
          </div>
          
          <div className="flex items-center space-x-5 border-l border-gray-200 pl-6">
            <button className="text-gray-500 hover:text-green-600"><HomeIcon className="h-5 w-5" /></button>
            <button className="text-gray-500 hover:text-green-600"><Bell className="h-5 w-5" /></button>
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="h-8 w-8 rounded-full bg-gray-200 border border-gray-300"></div>
              <span className="text-sm font-medium">John Doe</span>
            </div>
          </div>
        </div>

        {/* Mobile Toggle Button */}
        <button 
          className="md:hidden p-2 text-gray-600 hover:text-green-600 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

      </div>

      {/* Mobile Menu Expansion */}
      {isOpen && (
        <div className="md:hidden px-4 pb-5 pt-3 space-y-5 border-t border-gray-100 bg-white">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border-none bg-green-50/50 rounded-full text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="Search products, vendors, or services..."
            />
          </div>
          
          <div className="flex flex-col space-y-4 text-sm font-semibold text-gray-700">
            <a href="#" className="hover:text-green-600 transition-colors">Marketplace</a>
            <a href="#" className="hover:text-green-600 transition-colors">Logistics</a>
            <a href="#" className="hover:text-green-600 transition-colors">Support</a>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-5">
              <button className="text-gray-500 hover:text-green-600"><HomeIcon className="h-5 w-5" /></button>
              <button className="text-gray-500 hover:text-green-600"><Bell className="h-5 w-5" /></button>
            </div>
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="h-8 w-8 rounded-full bg-gray-200 border border-gray-300"></div>
              <span className="text-sm font-medium">John Doe</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;