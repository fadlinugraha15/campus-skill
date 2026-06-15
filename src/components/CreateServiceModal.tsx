/**
 * @licenseçç
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Send, Sparkles, AlertCircle, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { Service, ServiceCategory } from '../types';

interface CreateServiceModalProps {
  onClose: () => void;
  onSubmit: (newService: Partial<Service>) => void;
}

// Predefined background samples
const SAMPLE_IMAGES = [
  { id: 'img-c1', name: 'MacBook Coding', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCl8lAblvCfFMdiGf7V8aR5eydkK3HDTSrAEvXZ4wbI9KV-_Y4iR6tw7Xx1El9XzLzGoIvzwawuT0pALf0m0sPGhMQ0eeHoylbiIKugDR3yis9jCO-RJteXb-6UwZVTcR4tI6ozWYgN4u6iaHlNiJmq9T4zqhPutSiLA2SnUT0qo_v4E1l0jzP0pDyASohl-jbS7leFTkGe0Z2tbfOhjyJAvvL9XaS14kL9pswFmdtmbzHfSIpBPfj3DxaBFlu6XVoOdlnGyPiaYw' },
  { id: 'img-c2', name: 'Pen & Essay Stack', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJGUuvg6wz0YnVYrkyyjIYsaAdHbPoEcDsW86pB-Nre8AsI_lL2g0NQ8jktRy8ii0U7vd2ShZVEJoIVFMCYnM2FPeUq6d06CMAnYdmyodsJLUsTerZNdBr6o1ik36vYWU_JNCaJdEGF5STNLGTHVK7BgFwLL6sTXUwJaj0aN2aEctU9ca633CCHhsom9PcTzPpyAkc4nSrkCORin0dd6BxWBI8amhpEqrWHQliA4GvB3lHyQnuTYDfGfEpTNojwduqXPxK9T_gKg' },
  { id: 'img-c3', name: 'Design / Figma Deck', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAs3xLHLph7rXm2KEZYLnlMQnJNfpZhAsZsNmmauK3uAprHpPq-rOJ8ChSygQ7axoErzO63EDLqiTz4QrphwOGszQGT8KY9wFrNDOmX5zEQ69NpfNB-lSQo3HikHdHD8QDkxFwBAvzNCaf5RpOc8Q9M9BQ813xVD3tZPAAMKiLbHdhAOJ64HLeyNfJSY8yIUWeHkZkrN64b6M1yQUUdL4IGSuUXOEP5glPzvZ3uZCQEvQYDtm7I95jz7Ub8Gv6Li4RotTkSZeD32w' },
  { id: 'img-c4', name: 'Study Room Classmates', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3E00EszV4DO4H_201bKP3d9vVVg1z7hxcN9FVoMeYZvM0SfKs5hN2QhfOP38VDoGCf7PLSpoZocG9bJmwySiEw9iuc4vi-eKq98i83kJ-BF_X0ZhFOy_b_YYACxFw-BpOLPeNRtTwg11JP_2vxQpMxMa8wA8OlObizcbJt1nhDoHxpzuy89RkHsxWCJFjzZ-UjBAnY8uwSqO_1sYTR9WbILWPz8iDcoHS2_sK7yPLgg9Htn_2kQVpKVCCU0h4dqZeQ9uK55c1Ww' },
];

export default function CreateServiceModal({ onClose, onSubmit }: CreateServiceModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('Semua');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('20');
  const [imageUrl, setImageUrl] = useState(SAMPLE_IMAGES[0].url);
  const [dragActive, setDragActive] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorText, setErrorText] = useState('');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Mock File Upload: We grab a temporary random school unsplash image so it matches actual visual standards
      const randomCategoryPics = [
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=600'
      ];
      const index = Math.floor(Math.random() * randomCategoryPics.length);
      setImageUrl(randomCategoryPics[index]);
    }
  };

  const handleFileSelect = () => {
    // Mimic folder dialog trigger
    const randomCategoryPics = [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=600'
    ];
    const index = Math.floor(Math.random() * randomCategoryPics.length);
    setImageUrl(randomCategoryPics[index]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setErrorText('Harap masukkan judul untuk layanan Anda!');
      return;
    }
    if (category === 'Semua') {
      setErrorText('Silakan pilih kategori spesifik (mis. Pemrograman, Desain)!');
      return;
    }
    if (description.trim().length < 15) {
      setErrorText('Deskripsi layanan minimal 15 karakter, jelaskan apa yang Anda tawarkan!');
      return;
    }
    
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setErrorText('Harap masukkan jumlah harga yang valid dan positif!');
      return;
    }

    onSubmit({
      title,
      category,
      price: parsedPrice,
      description,
      image: imageUrl,
    });

    setSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Dark overlay backdrop */}
      <div 
        className="fixed inset-0 bg-[#1A1A1A]/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-lg bg-white rounded-none shadow-none border-2 border-[#1A1A1A] z-10 transition-all">
        {/* Header bar */}
        <div className="px-6 py-4 border-b-2 border-[#1A1A1A] flex justify-between items-center bg-[#F4F1EA]">
          <div className="flex items-center gap-1.5 text-[#1A1A1A]">
            <Sparkles className="w-5 h-5 text-[#FF3E00]" />
            <h3 className="font-extrabold text-[#1A1A1A] text-sm uppercase tracking-wider font-mono">Monetisasi Skill-mu</h3>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="text-[#1A1A1A] hover:text-[#FF3E00] p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 flex flex-col items-center text-center space-y-4 bg-[#F4F1EA]">
            <div className="w-16 h-16 bg-white border-2 border-[#1A1A1A] flex items-center justify-center text-[#FF3E00] animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h4 className="font-extrabold text-[#1A1A1A] text-base font-mono uppercase tracking-widest">Layanan Diterbitkan!</h4>
            <p className="text-[#1A1A1A]/75 text-xs max-w-sm font-mono uppercase leading-relaxed">
              Listing akademik Anda sekarang terlihat di seluruh jaringan. Mari bersiap untuk permintaan kolaborasi masuk!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5 max-h-[75vh] overflow-y-auto bg-white">
            {errorText && (
              <div className="bg-red-50 border-2 border-[#1A1A1A] text-red-800 p-3 rounded-none text-xs flex items-center gap-2 font-mono">
                <AlertCircle className="w-4 h-4 text-[#FF3E00] shrink-0" />
                <span className="font-bold uppercase tracking-wide">{errorText}</span>
              </div>
            )}

            {/* Title Entry */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-[#1A1A1A]/60 uppercase tracking-widest font-mono">Judul Layanan</label>
              <input 
                type="text"
                value={title}
                onChange={(e) => { setTitle(e.target.value); setErrorText(''); }}
                placeholder="Mis: Bimbingan Kalkulus, Tugas Data Sains Python"
                className="w-full px-4 py-3 bg-[#F4F1EA]/50 border-2 border-[#1A1A1A] text-xs font-mono uppercase tracking-wide text-[#1A1A1A] focus:bg-white outline-none transition-all placeholder-[#1A1A1A]/40 rounded-none focus:shadow-[2px_2px_0px_#1A1A1A]"
              />
            </div>

            {/* Category & Pricing Board */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-[#1A1A1A]/60 uppercase tracking-widest font-mono">Kategori</label>
                <select 
                  value={category}
                  onChange={(e) => { setCategory(e.target.value as ServiceCategory); setErrorText(''); }}
                  className="w-full px-4 py-3 bg-[#F4F1EA]/50 border-2 border-[#1A1A1A] text-xs font-mono uppercase tracking-wide text-[#1A1A1A] focus:bg-white outline-none cursor-pointer rounded-none"
                >
                  <option value="Semua">Pilih...</option>
                  <option value="Pemrograman">Pemrograman</option>
                  <option value="Menulis">Menulis</option>
                  <option value="Desain">Desain</option>
                  <option value="Bimbingan">Bimbingan</option>
                  <option value="Bisnis">Bisnis</option>
                  <option value="Bahasa">Bahasa</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-[#1A1A1A]/60 uppercase tracking-widest font-mono">Harga (USD)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1A1A1A]/60 font-bold text-xs font-mono">$</span>
                  <input 
                    type="number"
                    value={price}
                    onChange={(e) => { setPrice(e.target.value); setErrorText(''); }}
                    min="1"
                    className="w-full pl-7 pr-3 py-3 bg-[#F4F1EA]/50 border-2 border-[#1A1A1A] text-xs font-mono uppercase tracking-wide text-[#1A1A1A] focus:bg-white outline-none transition-all rounded-none focus:shadow-[2px_2px_0px_#1A1A1A]"
                  />
                </div>
              </div>
            </div>

            {/* Description Body */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-[#1A1A1A]/60 uppercase tracking-widest font-mono">Deskripsi</label>
              <textarea 
                value={description}
                onChange={(e) => { setDescription(e.target.value); setErrorText(''); }}
                placeholder="Sebutkan tugas atau proyek yang akan diselesaikan, detail timeline, dan keahlian Anda..."
                rows={3}
                className="w-full px-4 py-3 bg-[#F4F1EA]/50 border-2 border-[#1A1A1A] text-xs font-mono uppercase tracking-wide text-[#1A1A1A] focus:bg-white outline-none transition-all placeholder-[#1A1A1A]/40 rounded-none focus:shadow-[2px_2px_0px_#1A1A1A]"
              />
            </div>

            {/* Banner Background selector */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-[#1A1A1A]/60 uppercase tracking-widest font-mono">Gambar Banner</label>
              
              {/* Hotlink Image preview */}
              <div className="h-28 w-full border-2 border-[#1A1A1A] overflow-hidden bg-[#F4F1EA] relative rounded-none">
                <img 
                  alt="Pratinjau Banner" 
                  className="w-full h-full object-cover" 
                  src={imageUrl} 
                />
                <div className="absolute inset-x-0 bottom-0 bg-[#1A1A1A]/85 text-white py-1 px-3 text-[9px] font-mono truncate uppercase tracking-widest border-t border-[#1A1A1A]">
                  {imageUrl}
                </div>
              </div>

              {/* Sample Library cards */}
              <div className="grid grid-cols-4 gap-2">
                {SAMPLE_IMAGES.map((img) => (
                  <button 
                    key={img.id}
                    type="button" 
                    onClick={() => setImageUrl(img.url)}
                    className={`h-11 overflow-hidden border-2 relative select-none cursor-pointer rounded-none ${imageUrl === img.url ? 'border-[#FF3E00] shadow-[2px_2px_0px_#1A1A1A]' : 'border-[#1A1A1A]/40'}`}
                  >
                    <img alt={img.name} className="w-full h-full object-cover" src={img.url} />
                  </button>
                ))}
              </div>

              {/* Drag and Drop Box */}
              <div 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={handleFileSelect}
                className={`border-2 border-dashed rounded-none p-4 text-center cursor-pointer transition-all ${dragActive ? 'border-[#FF3E00] bg-[#FF3E00]/5' : 'border-[#1A1A1A] hover:bg-[#F4F1EA]/30'}`}
              >
                <div className="flex flex-col items-center gap-1.5">
                  <ImageIcon className="w-6 h-6 text-[#1A1A1A]" />
                  <p className="text-[10px] font-mono text-[#1A1A1A] uppercase tracking-wide">
                    Seret & lepas atau <span className="text-[#FF3E00] font-bold underline">cari file</span> untuk unggah gambar kustom
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t-2 border-[#1A1A1A]/10 flex justify-end gap-2">
              <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2.5 bg-white border-2 border-[#1A1A1A] hover:bg-[#F4F1EA] text-[#1A1A1A] font-mono font-bold text-xs uppercase tracking-widest rounded-none transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button 
                type="submit"
                className="px-5 py-2.5 bg-[#FF3E00] text-white border-2 border-[#1A1A1A] font-mono font-bold text-xs uppercase tracking-widest rounded-none transition-colors hover:bg-black cursor-pointer shadow-[2px_2px_0px_#1A1A1A]"
              >
                <Send className="w-3.5 h-3.5 inline mr-1" />
                <span>Terbitkan Listing</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
