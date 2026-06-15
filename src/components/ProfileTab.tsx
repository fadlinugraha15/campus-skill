/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Edit2, CheckCircle2, Star, Store, ChevronRight, 
  List, Wallet, Settings as SettingsIcon, HelpCircle, 
  LogOut, ShieldAlert, Sparkles, X, PlusCircle, Trash2
} from 'lucide-react';
import { UserProfile, Service } from '../types';

interface ProfileTabProps {
  userProfile: UserProfile;
  services: Service[];
  onOpenCreateServiceModal: () => void;
  onLogout: () => void;
  onDeleteService: (serviceId: string) => void;
}

export default function ProfileTab({ 
  userProfile, 
  services, 
  onOpenCreateServiceModal, 
  onLogout,
  onDeleteService
}: ProfileTabProps) {
  const [activeDialog, setActiveDialog] = useState<'my-services' | 'wallet' | 'settings' | 'help' | null>(null);

  // Stats or settings states
  const [walletDepositAmount, setWalletDepositAmount] = useState('50');
  const [profileNameInput, setProfileNameInput] = useState(userProfile.name);
  const [profileUniInput, setProfileUniInput] = useState(userProfile.university);
  const [profileBioInput, setProfileBioInput] = useState(userProfile.bio || '');

  // Filter services offered by Jordy
  const jordyServices = services.filter(s => s.seller.name.includes('Jordan') || s.id.startsWith('custom-'));

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    userProfile.name = profileNameInput;
    userProfile.university = profileUniInput;
    userProfile.bio = profileBioInput;
    alert('Pengaturan profil berhasil disimpan!');
    setActiveDialog(null);
  };

  const handleDeposit = () => {
    const amt = parseFloat(walletDepositAmount);
    if (isNaN(amt) || amt <= 0) return;
    userProfile.balance += amt;
    alert(`Berhasil deposit $${amt.toFixed(2)} ke dompet escrow kampus Anda!`);
    setWalletDepositAmount('50');
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Profile Header Center Block */}
      <section className="flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-none overflow-hidden border-2 border-[#1A1A1A] bg-white relative">
            <img 
              alt={userProfile.name} 
              className="w-full h-full object-cover" 
              src={userProfile.avatar} 
            />
          </div>
          <button 
            type="button" 
            onClick={() => setActiveDialog('settings')}
            className="absolute -bottom-1 -right-1 bg-[#FF3E00] text-white p-2 rounded-none border border-[#1A1A1A] shadow-none cursor-pointer hover:bg-black active:scale-90 transition-transform"
            title="Edit Profil"
          >
            <Edit2 className="w-4 h-4 text-white" />
          </button>
        </div>

        <div>
          <h1 className="font-extrabold text-[#1A1A1A] text-xl uppercase tracking-tighter leading-none">{userProfile.name}</h1>
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 bg-white text-[#1A1A1A] border border-[#1A1A1A] text-[9px] font-bold uppercase tracking-widest font-mono">
            <CheckCircle2 className="w-3 h-3 text-[#FF3E00]" />
            <span>{userProfile.university}</span>
          </div>
          {userProfile.bio && (
            <p className="text-xs text-[#1A1A1A]/80 font-normal max-w-sm mx-auto mt-3 leading-relaxed italic">
              "{userProfile.bio}"
            </p>
          )}
        </div>
      </section>

      {/* Stats row block */}
      <section className="grid grid-cols-3 gap-0 bg-white border-2 border-[#1A1A1A] divide-x-2 divide-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A]">
        <div className="flex flex-col items-center justify-center p-3">
          <span className="font-extrabold text-lg md:text-xl text-[#FF3E00] font-mono tracking-tight">{userProfile.servicesSold}</span>
                  <span className="text-[8px] font-bold text-[#1A1A1A] uppercase tracking-widest mt-1 text-center font-mono">Layanan Terjual</span>
        </div>
        <div className="flex flex-col items-center justify-center p-3">
          <div className="flex items-center gap-1 text-[#1A1A1A] font-extrabold font-mono">
            <span className="text-lg md:text-xl tracking-tight">{userProfile.rating.toFixed(1)}</span>
            <Star className="w-4 h-4 text-[#FF3E00] fill-[#FF3E00] shrink-0" />
          </div>
          <span className="text-[8px] font-bold text-[#1A1A1A] uppercase tracking-widest mt-1 text-center font-mono">Rating</span>
        </div>
        <div className="flex flex-col items-center justify-center p-3">
          <span className="font-extrabold text-lg md:text-xl text-[#1A1A1A] font-mono tracking-tight">${userProfile.earnings.toFixed(0)}</span>
          <span className="text-[8px] font-bold text-[#1A1A1A] uppercase tracking-widest mt-1 text-center font-mono">Penghasilan</span>
        </div>
      </section>

      {/* Actions link board */}
      <div className="space-y-4">
        {/* Prominent Seller Action button */}
        <button 
          type="button"
          onClick={onOpenCreateServiceModal}
          className="w-full flex items-center justify-between p-5 bg-[#FF3E00] text-white border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] cursor-pointer active:translate-y-0.5 transition-transform"
        >
          <div className="flex items-center gap-4 text-left">
            <div className="bg-white/10 p-2.5 border border-white/20">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-xs uppercase tracking-widest font-mono">Jadi Penjual</p>
              <p className="text-[9px] text-white/80 font-mono mt-0.5 leading-none font-bold uppercase">Publikasi daftar spesifikasi Anda</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-white shrink-0" />
        </button>

        {/* Flat navigation list links */}
        <nav className="bg-white border-2 border-[#1A1A1A] divide-y-2 divide-[#1A1A1A] overflow-hidden shadow-[4px_4px_0px_#1A1A1A]">
          {/* Link 1: My Services */}
          <button 
            type="button" 
            onClick={() => setActiveDialog('my-services')}
            className="w-full flex items-center justify-between p-4 hover:bg-[#F4F1EA] transition-colors group cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <List className="w-5 h-5 text-[#FF3E00] shrink-0" />
              <span className="text-[#1A1A1A] font-bold uppercase tracking-widest font-mono text-xs">Layanan Saya</span>
              <span className="text-[10px] bg-[#1A1A1A] text-white font-mono px-2 py-0.5 font-bold uppercase">
                {jordyServices.length}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#1A1A1A] group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Link 2: Wallet */}
          <button 
            type="button" 
            onClick={() => setActiveDialog('wallet')}
            className="w-full flex items-center justify-between p-4 hover:bg-[#F4F1EA] transition-colors group cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <Wallet className="w-5 h-5 text-[#FF3E00] shrink-0" />
              <div className="flex flex-col text-left">
                <span className="text-[#1A1A1A] font-bold uppercase tracking-widest font-mono text-xs">Dompet &amp; Pembayaran</span>
                <span className="text-[9px] text-[#FF3E00] font-bold font-mono mt-1 uppercase">Saldo Escrow: ${userProfile.balance.toFixed(2)}</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#1A1A1A] group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Link 3: Settings */}
          <button 
            type="button" 
            onClick={() => setActiveDialog('settings')}
            className="w-full flex items-center justify-between p-4 hover:bg-[#F4F1EA] transition-colors group cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <SettingsIcon className="w-5 h-5 text-[#FF3E00] shrink-0" />
              <span className="text-[#1A1A1A] font-bold uppercase tracking-widest font-mono text-xs">Kustomisasi Profil</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#1A1A1A] group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Link 4: FAQ Help */}
          <button 
            type="button" 
            onClick={() => setActiveDialog('help')}
            className="w-full flex items-center justify-between p-4 hover:bg-[#F4F1EA] transition-colors group cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-[#FF3E00] shrink-0" />
              <span className="text-[#1A1A1A] font-bold uppercase tracking-widest font-mono text-xs">Bantuan &amp; Dukungan</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#1A1A1A] group-hover:translate-x-1 transition-transform" />
          </button>
        </nav>

        {/* Logout interactive item */}
        <button 
          type="button" 
          onClick={onLogout}
          className="w-full mt-6 py-4 px-5 flex items-center justify-center gap-2 text-white border-2 border-[#1A1A1A] bg-[#1A1A1A] hover:bg-[#FF3E00] transition-all duration-150 leading-none cursor-pointer text-xs font-bold uppercase tracking-widest font-mono"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar</span>
        </button>
      </div>

      {/* Dialog: My Offered Services Details screen */}
      {activeDialog === 'my-services' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#1A1A1A]/40 backdrop-blur-sm" onClick={() => setActiveDialog(null)} />
          <div className="relative w-full max-w-md bg-[#F4F1EA] border-2 border-[#1A1A1A] p-6 shadow-none max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b-2 border-[#1A1A1A] pb-2">
              <h3 className="font-extrabold text-[#1A1A1A] text-xs uppercase tracking-wider font-mono">Listing Skill Saya</h3>
              <button type="button" onClick={() => setActiveDialog(null)} className="text-[#1A1A1A] hover:text-[#FF3E00] p-1"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3">
              {jordyServices.length === 0 ? (
                <div className="text-center py-8 text-[#1A1A1A]/60">
                  <p className="text-xs uppercase font-mono tracking-widest">Anda belum mendaftarkan layanan apapun.</p>
                  <button 
                    type="button"
                    onClick={() => { setActiveDialog(null); onOpenCreateServiceModal(); }}
                    className="mt-4 text-xs text-[#FF3E00] font-bold flex items-center gap-1.5 mx-auto uppercase tracking-wide hover:underline font-mono"
                  >
                    <PlusCircle className="w-4 h-4" /> Publikasi listing baru
                  </button>
                </div>
              ) : (
                jordyServices.map(s => (
                  <div key={s.id} className="p-3 border-2 border-[#1A1A1A] flex items-center justify-between gap-3 bg-white">
                    <img alt="" className="w-10 h-10 rounded-none object-cover border border-[#1A1A1A]" src={s.image} />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[#1A1A1A] text-xs truncate uppercase tracking-tight font-mono">{s.title}</h4>
                      <p className="font-extrabold text-[10px] text-[#FF3E00] font-mono mt-0.5">${s.price.toFixed(2)}</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => onDeleteService(s.id)}
                      className="p-2 text-[#1A1A1A] hover:text-[#FF3E00] cursor-pointer"
                      title="Hapus listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dialog: Escrow Wallet display */}
      {activeDialog === 'wallet' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#1A1A1A]/40 backdrop-blur-sm" onClick={() => setActiveDialog(null)} />
          <div className="relative w-full max-w-sm bg-[#F4F1EA] border-2 border-[#1A1A1A] p-6 shadow-none">
            <div className="flex justify-between items-center mb-4 border-b-2 border-[#1A1A1A] pb-2">
              <h3 className="font-extrabold text-[#1A1A1A] text-xs uppercase tracking-wider font-mono">Dompet Escrow</h3>
              <button type="button" onClick={() => setActiveDialog(null)} className="text-[#1A1A1A] hover:text-[#FF3E00] p-1"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4 text-center">
              <div className="bg-[#1A1A1A] p-5 border-2 border-[#1A1A1A] text-white">
                <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest font-mono block">Saldo Escrow Tersedia</span>
                <p className="text-3xl font-extrabold font-mono tracking-tighter mt-2 text-[#FF3E00]">${userProfile.balance.toFixed(2)}</p>
              </div>

              <div className="space-y-2 pt-2 text-left">
                <label className="block text-[9px] font-bold text-[#1A1A1A] uppercase tracking-widest font-mono">Simulasi Isi Ulang Saldo</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1A1A1A] font-bold font-mono">$</span>
                    <input 
                      type="number" 
                      value={walletDepositAmount}
                      onChange={(e) => setWalletDepositAmount(e.target.value)}
                      className="w-full pl-6 pr-2 py-2 bg-white border-2 border-[#1A1A1A] text-xs font-mono"
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={handleDeposit}
                    className="px-4 py-2 bg-[#FF3E00] text-white font-mono font-bold text-xs uppercase tracking-wider border-2 border-[#1A1A1A] hover:bg-black transition-colors"
                  >
                    Tambah
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dialog: Settings parameters customization */}
      {activeDialog === 'settings' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#1A1A1A]/40 backdrop-blur-sm" onClick={() => setActiveDialog(null)} />
          <div className="relative w-full max-w-md bg-[#F4F1EA] border-2 border-[#1A1A1A] p-6 shadow-none">
            <div className="flex justify-between items-center mb-4 border-b-2 border-[#1A1A1A] pb-2">
              <h3 className="font-extrabold text-[#1A1A1A] text-xs uppercase tracking-wider font-mono">Konfigurasi Pengaturan</h3>
              <button type="button" onClick={() => setActiveDialog(null)} className="text-[#1A1A1A] hover:text-[#FF3E00] p-1"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSettingsSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[9px] font-mono font-bold text-[#1A1A1A] uppercase tracking-widest">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={profileNameInput}
                  onChange={(e) => setProfileNameInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-[#1A1A1A] text-xs font-mono uppercase tracking-wide"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[9px] font-mono font-bold text-[#1A1A1A] uppercase tracking-widest">Universitas / Afiliasi</label>
                <input 
                  type="text" 
                  value={profileUniInput}
                  onChange={(e) => setProfileUniInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-[#1A1A1A] text-xs font-mono uppercase tracking-wide"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[9px] font-mono font-bold text-[#1A1A1A] uppercase tracking-widest">Bio Profil</label>
                <textarea 
                  value={profileBioInput}
                  onChange={(e) => setProfileBioInput(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-white border-2 border-[#1A1A1A] text-xs font-mono uppercase tracking-wide"
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-3 bg-[#FF3E00] text-white font-mono font-bold text-xs uppercase tracking-widest border-2 border-[#1A1A1A] hover:bg-black transition-colors cursor-pointer shadow-[2px_2px_0px_#1A1A1A]"
              >
                Simpan Pengaturan
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Dialog: Institutional Help & Peer Support */}
      {activeDialog === 'help' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#1A1A1A]/40 backdrop-blur-sm" onClick={() => setActiveDialog(null)} />
          <div className="relative w-full max-w-md bg-[#F4F1EA] border-2 border-[#1A1A1A] p-6 shadow-none max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b-2 border-[#1A1A1A] pb-2">
              <h3 className="font-extrabold text-[#1A1A1A] text-xs uppercase tracking-wider font-mono">Panduan FAQ &amp; Dukungan</h3>
              <button type="button" onClick={() => setActiveDialog(null)} className="text-[#1A1A1A] hover:text-[#FF3E00] p-1"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4 text-xs leading-relaxed text-[#1A1A1A]">
              <div className="p-4 bg-white border-2 border-[#1A1A1A]">
                <strong className="block text-xs font-extrabold uppercase font-mono tracking-wider text-[#FF3E00]">Apa itu perlindungan escrow kampus?</strong>
                <p className="mt-1 font-normal leading-normal uppercase text-[10px] font-mono text-[#1A1A1A]/80">
                  Pembayaran dikunci di escrow saat pemesanan. Dana hanya akan dirilis ke penjual setelah Anda mengonfirmasi penerimaan file di tab Pesanan.
                </p>
              </div>
              <div className="p-4 bg-white border-2 border-[#1A1A1A]">
                <strong className="block text-xs font-extrabold uppercase font-mono tracking-wider text-[#FF3E00]">Bagaimana cara mulai menjual skill?</strong>
                <p className="mt-1 font-normal leading-normal uppercase text-[10px] font-mono text-[#1A1A1A]/80">
                  Cukup klik "Jadi Penjual" atau "+" di layar ponsel, isi harga, spesifikasi, dan foto sampul, lalu tekan Terbitkan!
                </p>
              </div>
              <div className="p-4 bg-white border-2 border-[#1A1A1A]">
                <strong className="block text-xs font-extrabold uppercase font-mono tracking-wider text-[#FF3E00]">Bisakah saya mengajar teman di sains/matematika?</strong>
                <p className="mt-1 font-normal leading-normal uppercase text-[10px] font-mono text-[#1A1A1A]/80">
                  Ya, Campus Skill dibangun khusus untuk bimbingan teman, debugging skrip, terjemahan esai, pemeriksaan presentasi, dan purwarupa merek!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
