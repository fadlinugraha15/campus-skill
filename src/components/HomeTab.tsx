/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, ArrowRight, Plus } from 'lucide-react';
import { Service, ServiceCategory } from '../types';
import ServiceCard from './ServiceCard';

interface HomeTabProps {
  services: Service[];
  onServiceSelect: (service: Service) => void;
  onOpenCreateServiceModal: () => void;
}

export default function HomeTab({ services, onServiceSelect, onOpenCreateServiceModal }: HomeTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('All');

  const categories: ServiceCategory[] = ['All', 'Coding', 'Writing', 'Design', 'Tutoring', 'Business', 'Language'];

  // Filter conditions
  const filteredServices = services.filter((service) => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          service.seller.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-12 animate-fadeIn pb-12">
      {/* Search Section */}
      <section className="mt-4 relative">
        <span className="absolute -top-12 right-2 text-[60px] md:text-[80px] font-serif italic text-[#1A1A1A]/5 leading-none select-none pointer-events-none">01 // Search</span>
        <div className="relative group z-10">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500">
            <Search className="w-5 h-5 text-[#1A1A1A]" />
          </div>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for coding, design, or tutoring..."
            className="w-full h-14 pl-12 pr-4 bg-white border-2 border-[#1A1A1A] focus:border-[#FF3E00] focus:shadow-[4px_4px_0px_#1A1A1A] outline-none text-xs font-mono text-[#1A1A1A] transition-all duration-300 uppercase tracking-wider placeholder-[#1A1A1A]/40"
          />
        </div>
      </section>

      {/* Horizontal categories scroll list */}
      <section className="-mx-4 px-4 overflow-x-auto no-scrollbar scroll-smooth">
        <div className="flex gap-2 whitespace-nowrap pb-2">
          {categories.map((cat) => (
            <button 
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-none font-bold text-xs font-mono uppercase tracking-widest border-2 border-[#1A1A1A] transition-all duration-250 cursor-pointer ${selectedCategory === cat ? 'bg-[#FF3E00] text-white shadow-[2px_2px_0px_#1A1A1A]' : 'bg-white hover:bg-gray-100 text-[#1A1A1A]'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Grid of services heading */}
      <div className="relative pt-6">
        <span className="absolute -top-8 right-2 text-[60px] md:text-[80px] font-serif italic text-[#1A1A1A]/5 leading-none select-none pointer-events-none font-bold">02 // COLLECTION</span>
        <div className="flex justify-between items-end mb-6 border-b-2 border-[#1A1A1A] pb-3">
          <div>
            <h2 className="font-extrabold text-[#1A1A1A] text-lg uppercase tracking-wider">Top Services</h2>
            <p className="text-[10px] font-mono text-[#1A1A1A]/60 mt-0.5 uppercase tracking-widest">Recommended by classmate coordinators</p>
          </div>
          {filteredServices.length > 0 && (
            <button 
              type="button" 
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="text-[#FF3E00] hover:text-[#1A1A1A] font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>See all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dynamic Grid Results */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-16 bg-white border-2 border-[#1A1A1A] p-8 flex flex-col items-center">
            <div className="w-16 h-16 bg-white border-2 border-[#1A1A1A] flex items-center justify-center text-[#1A1A1A] mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-[#1A1A1A] text-xs font-mono uppercase tracking-widest">No services found</h3>
            <p className="text-[#1A1A1A]/70 text-xs max-w-sm mt-1 leading-normal uppercase">
              We couldn't match "{searchQuery}" under category "{selectedCategory}" in peer listings. Try broadening your keywords!
            </p>
            <button 
              type="button" 
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="mt-6 px-6 py-3 bg-[#FF3E00] text-white border-2 border-[#1A1A1A] font-mono font-bold text-xs uppercase tracking-wider shadow-[2px_2px_0px_#1A1A1A]"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                onClick={() => onServiceSelect(service)} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Become a Seller Bento Box banner */}
      <section className="bg-white border-2 border-[#1A1A1A] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 overflow-hidden relative shadow-[4px_4px_0px_#1A1A1A] transition-all duration-300">
        <span className="absolute -bottom-8 -left-5 text-[150px] font-serif italic text-[#1A1A1A]/5 leading-none select-none pointer-events-none">03</span>
        <div className="flex-1 z-10 text-left">
          <span className="text-[10px] uppercase font-bold text-[#FF3E00] mb-2 block tracking-widest font-mono">Service Program</span>
          <h2 className="font-extrabold text-2xl text-[#1A1A1A] mb-2 tracking-tight uppercase">Monetize Your Skills</h2>
          <p className="text-xs text-[#1A1A1A]/80 mb-6 max-w-md leading-relaxed uppercase tracking-tight">
            Join hundreds of tech studio peers earning an extra income by helping classmates with core coding, writing, and design specifications.
          </p>
          <button 
            type="button"
            onClick={onOpenCreateServiceModal}
            className="px-8 py-4 bg-[#FF3E00] text-white cursor-pointer hover:bg-[#1A1A1A] font-mono font-bold text-xs uppercase tracking-[0.2em] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]"
          >
            Start Selling // Listed Studio
          </button>
        </div>
        
        {/* Banner graphic image */}
        <div className="relative w-full md:w-1/2 h-52 bg-[#1A1A1A] border-2 border-[#1A1A1A] overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF3E00] to-black opacity-30 z-10 pointer-events-none" />
          <img 
            alt="Skills exchange students" 
            className="w-full h-full object-cover filter grayscale" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3E00EszV4DO4H_201bKP3d9vVVg1z7hxcN9FVoMeYZvM0SfKs5hN2QhfOP38VDoGCf7PLSpoZocG9bJmwySiEw9iuc4vi-eKq98i83kJ-BF_X0ZhFOy_b_YYACxFw-BpOLPeNRtTwg11JP_2vxQpMxMa8wA8OlObizcbJt1nhDoHxpzuy89RkHsxWCJFjzZ-UjBAnY8uwSqO_1sYTR9WbILWPz8iDcoHS2_sK7yPLgg9Htn_2kQVpKVCCU0h4dqZeQ9uK50c1Ww" 
          />
        </div>
      </section>

      {/* Mobile Floating Action Button FAB for easy service upload */}
      <button 
        type="button"
        onClick={onOpenCreateServiceModal}
        className="fixed bottom-24 right-5 w-14 h-14 bg-[#FF3E00] text-white border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] flex items-center justify-center md:hidden z-40 active:scale-95 transition-transform cursor-pointer"
        title="Create Service"
      >
        <Plus className="w-8 h-8 text-white" />
      </button>
    </div>
  );
}
