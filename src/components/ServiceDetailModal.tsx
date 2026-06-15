/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Star, Calendar, ShieldCheck, Mail, MessageSquare, Zap } from 'lucide-react';
import { Service } from '../types';

interface ServiceDetailModalProps {
  service: Service;
  onClose: () => void;
  onHire: (service: Service) => void;
  onMessageSeller: (service: Service) => void;
}

export default function ServiceDetailModal({ service, onClose, onHire, onMessageSeller }: ServiceDetailModalProps) {
  // Mock points included in this peer skill-share
  const features = service.category === 'Pemrograman' 
    ? ['Pengiriman kode beranotasi berkualitas tinggi', 'Panduan langsung atau kalibrasi Zoom', 'Termasuk file sumber dan pengaturan lingkungan', '2 revisi struktural termasuk']
    : service.category === 'Menulis'
    ? ['Laporan pemeriksaan plagiarisme', 'Penyesuaian APA/MLA/Harvard', 'Pemeriksaan tata bahasa, format & nada', 'Draf kerangka lengkap pra-review']
    : service.category === 'Desain'
    ? ['Akses file Figma berlapis penuh', 'Prototipe desktop/mobile interaktif', 'Ekspor aset (PNG, SVG, PDF)', 'Panduan tipografi & warna termasuk']
    : ['Panduan interaktif langkah demi langkah', 'Contoh UTS dan lembar review', 'Penjelasan konsep yang disederhanakan', 'Rekaman video ringkasan review'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Dark overlay backdrop */}
      <div 
        className="fixed inset-0 bg-[#1A1A1A]/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Modal panel */}
        <div className="relative w-full max-w-2xl bg-white rounded-none border-2 border-[#1A1A1A] flex flex-col max-h-[90vh] shadow-[6px_6px_0px_#1A1A1A]">
          {/* Main Content Area (Scrollable) */}
          <div className="overflow-y-auto flex-1 pb-20">
            {/* Header image with close button */}
            <div className="relative h-60 w-full bg-gray-150 border-b-2 border-[#1A1A1A]">
              <img 
                alt={service.title} 
                className="w-full h-full object-cover" 
                src={service.image} 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/60 via-transparent to-transparent" />
              
              <button 
                type="button" 
                onClick={onClose}
                className="absolute top-4 right-4 bg-white border-2 border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#FF3E00] hover:text-white p-2 cursor-pointer transition-colors"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 text-white pr-4">
                <span className="bg-[#FF3E00] border border-white font-mono font-bold text-[9px] uppercase tracking-widest px-2.5 py-1 text-white inline-block mb-2">
                  {service.category}
                </span>
                <h2 className="text-xl md:text-2xl font-extrabold uppercase font-sans tracking-tight text-white leading-tight drop-shadow-sm">
                  {service.title}
                </h2>
              </div>
            </div>

            {/* Service & Seller Profile Details */}
            <div className="p-6 md:p-8 space-y-6">
              {/* Seller Micro-Profile Board */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#F4F1EA] border-2 border-[#1A1A1A]">
                <div className="flex items-center gap-3">
                  {service.seller.avatar ? (
                    <img 
                      alt={service.seller.name}
                      className="w-12 h-12 rounded-none border-2 border-[#1A1A1A] object-cover" 
                      src={service.seller.avatar}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-none border-2 border-[#1A1A1A] bg-[#FF3E00] flex items-center justify-center text-white font-mono font-extrabold text-lg">
                      {service.seller.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-extrabold text-[#1A1A1A] text-xs font-mono uppercase tracking-widest leading-none">{service.seller.name}</h4>
                    <span className="text-[10px] text-[#FF3E00] font-mono font-bold uppercase mt-1 inline-block">{service.seller.level}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono font-bold text-[#1A1A1A]">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-[#FF3E00] fill-[#FF3E00]" />
                    <span className="text-[#1A1A1A] font-bold">{service.rating.toFixed(1)} RATING</span>
                  </span>
                  <div className="w-1 h-1 bg-[#1A1A1A] rounded-none" />
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-[#FF3E00]" />
                    <span className="text-[#1A1A1A]">TERVERIFIKASI</span>
                  </span>
                </div>
              </div>

              {/* Service Description */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-[#1A1A1A] text-xs font-mono uppercase tracking-widest border-b-2 border-[#1A1A1A] pb-1">Tentang Skill Kampus Ini</h4>
                <p className="text-[#1A1A1A]/80 text-sm leading-relaxed whitespace-pre-line font-sans font-medium">
                  {service.description}
                </p>
              </div>

              {/* What is Included Bullet List */}
              <div className="space-y-3 pt-2">
                <h4 className="font-extrabold text-[#1A1A1A] text-xs font-mono uppercase tracking-widest border-b-2 border-[#1A1A1A] pb-1">Yang Termasuk</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#1A1A1A]/85 font-mono uppercase font-bold leading-normal">
                      <Zap className="w-4 h-4 text-[#FF3E00] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guarantees Box */}
              <div className="border-2 border-[#1A1A1A] bg-white p-4 flex items-start gap-3 shadow-[3px_3px_0px_#1A1A1A]">
                <Calendar className="w-6 h-6 text-[#FF3E00] shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-extrabold text-[#1A1A1A] text-xs font-mono uppercase tracking-wider">Kontrak Penjadwalan Dinamis</h5>
                  <p className="text-[10px] text-[#1A1A1A]/70 uppercase tracking-wide font-mono mt-0.5 leading-relaxed">
                    Teman sekelas Anda menjamin jadwal pengiriman tentatif. Pembayaran tetap diamankan dalam escrow hingga tanda terima akhir.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Fixed bottom interactive drawer bar */}
          <div className="absolute bottom-0 left-0 w-full bg-[#F4F1EA] border-t-2 border-[#1A1A1A] px-6 py-4 flex justify-between items-center z-10 gap-3">
            <div className="flex flex-col text-left">
              <span className="text-[9px] uppercase font-bold text-[#1A1A1A]/60 tracking-widest font-mono">Harga</span>
              <span className="text-2xl font-extrabold font-mono text-[#FF3E00] leading-none">${service.price.toFixed(2)}</span>
            </div>

            <div className="flex gap-2 shrink-0">
              <button 
                type="button" 
                onClick={() => onMessageSeller(service)}
                className="px-4 py-3 border-2 border-[#1A1A1A] bg-white hover:bg-[#F4F1EA] text-[#1A1A1A] font-extrabold text-xs uppercase tracking-widest font-mono transition-colors cursor-pointer"
              >
                <Mail className="w-4 h-4 inline mr-1" />
                <span>Pesan</span>
              </button>

              <button 
                type="button" 
                onClick={() => onHire(service)}
                className="px-6 py-3 bg-[#FF3E00] text-white border-2 border-[#1A1A1A] hover:bg-black font-extrabold text-xs uppercase tracking-widest font-mono transition-colors cursor-pointer shadow-[3px_3px_0px_#1A1A1A]"
              >
                <MessageSquare className="w-4 h-4 inline mr-1" />
                <span>Pesan Layanan</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
