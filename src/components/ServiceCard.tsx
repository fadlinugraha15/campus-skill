/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Star } from 'lucide-react';
import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  onClick: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group art-card overflow-hidden hover:border-[#FF3E00] active:scale-[0.98] transition-all duration-300 cursor-pointer flex flex-col h-full bg-white"
    >
      {/* Service Header Image */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-50 border-b-2 border-[#1A1A1A]">
        <img 
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          src={service.image} 
          referrerPolicy="no-referrer"
        />
        {/* Rating Floating Tag */}
        <div className="absolute top-3 right-3 bg-white border-2 border-[#1A1A1A] px-2.5 py-1 flex items-center gap-1 font-mono">
          <Star className="w-3.5 h-3.5 text-[#FF3E00] fill-[#FF3E00]" />
          <span className="font-bold text-xs text-[#1A1A1A]">{service.rating.toFixed(1)}</span>
        </div>
        {/* Category tag */}
        <div className="absolute bottom-3 left-3 bg-[#FF3E00] text-white font-extrabold text-[9px] uppercase tracking-wider px-2 py-0.5 border border-[#1A1A1A] font-mono">
          {service.category}
        </div>
      </div>

      {/* Service Body Contents */}
      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          <h3 className="font-bold text-[#1A1A1A] group-hover:text-[#FF3E00] transition-colors text-base line-clamp-2 uppercase tracking-tight leading-tight">
            {service.title}
          </h3>
          
          {/* Seller Micro-Profile */}
          <div className="flex items-center gap-2 mt-3 text-gray-600">
            {service.seller.avatar ? (
              <img 
                alt={service.seller.name}
                className="w-6 h-6 rounded-none object-cover border border-[#1A1A1A]" 
                src={service.seller.avatar}
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-6 h-6 rounded-none bg-white text-[#1A1A1A] flex items-center justify-center text-[10px] font-bold border border-[#1A1A1A]">
                {service.seller.name.charAt(0)}
              </div>
            )}
            <span className="text-[10px] font-mono font-bold uppercase text-[#1A1A1A]/70 truncate">{service.seller.name}</span>
          </div>

          <p className="text-xs text-[#1A1A1A]/60 font-normal line-clamp-2 mt-2 leading-relaxed">
            {service.description}
          </p>
        </div>

        {/* Pricing Area */}
        <div className="mt-4 pt-4 border-t border-[#1A1A1A]/20 flex justify-between items-center text-sm">
          <span className="text-[9px] text-[#1A1A1A]/50 font-bold tracking-widest uppercase font-mono">Mulai dari</span>
          <span className="text-lg font-bold text-[#1A1A1A] font-mono tracking-tight group-hover:text-[#FF3E00]">
            ${service.price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
