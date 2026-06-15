/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Star, MessageSquare, Info, FolderMinus, Sparkles, CheckCircle, CheckCircle2, DollarSign, X } from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface OrdersTabProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onCancelOrder: (orderId: string) => void;
  onNavigateHome: () => void;
  onOpenChatWithSeller: (sellerName: string) => void;
  onReorderService: (orderId: string) => void;
}

export default function OrdersTab({
  orders,
  onUpdateOrderStatus,
  onCancelOrder,
  onNavigateHome,
  onOpenChatWithSeller,
  onReorderService
}: OrdersTabProps) {
  const [filter, setFilter] = useState<'active' | 'completed'>('active');
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);

  // Divide orders
  const activeOrders = orders.filter(o => o.status !== 'Selesai');
  const completedOrders = orders.filter(o => o.status === 'Selesai');

  const displayedOrders = filter === 'active' ? activeOrders : completedOrders;

  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case 'Sedang Berjalan':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Menunggu Review':
        return 'bg-green-100/90 text-green-800 border-green-200';
      case 'Menunggu Konfirmasi':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Selesai':
        return 'bg-gray-200 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Title Header */}
      <div>
        <h2 className="font-extrabold text-[#1A1A1A] text-xl md:text-2xl tracking-tighter uppercase font-sans">Kelola Pesanan</h2>
        <p className="text-[10px] font-mono text-[#1A1A1A]/60 uppercase tracking-widest mt-0.5">Lacak kolaborasi akademik dan pengiriman layanan Anda.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b-2 border-[#1A1A1A] no-scrollbar overflow-x-auto">
        <button 
          type="button"
          onClick={() => setFilter('active')}
          className={`px-6 py-3 font-mono font-bold text-xs tracking-wider uppercase transition-all relative ${filter === 'active' ? 'text-[#FF3E00] border-b-4 border-[#FF3E00] -mb-[2px]' : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A]'}`}
        >
          <span>Aktif</span>
          {activeOrders.length > 0 && (
            <span className="ml-2 px-1.5 py-0.5 bg-[#FF3E00] text-white text-[9px] font-mono font-bold border border-[#1A1A1A]">
              {activeOrders.length}
            </span>
          )}
        </button>

        <button 
          type="button"
          onClick={() => setFilter('completed')}
          className={`px-6 py-3 font-mono font-bold text-xs tracking-wider uppercase transition-all relative ${filter === 'completed' ? 'text-[#FF3E00] border-b-4 border-[#FF3E00] -mb-[2px]' : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A]'}`}
        >
          <span>Selesai</span>
          {completedOrders.length > 0 && (
            <span className="ml-2 px-1.5 py-0.5 bg-[#1A1A1A] text-white text-[9px] font-mono font-bold border border-[#1A1A1A]">
              {completedOrders.length}
            </span>
          )}
        </button>
      </div>

      {/* Display Order Cards */}
      {displayedOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white border-2 border-[#1A1A1A] p-8 shadow-[4px_4px_0px_#1A1A1A]">
          <div className="w-20 h-20 bg-[#F4F1EA] border-2 border-[#1A1A1A] flex items-center justify-center text-[#1A1A1A] mb-5 relative">
            <FolderMinus className="w-10 h-10" />
            <div className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#FF3E00] border-2 border-[#1A1A1A]" />
          </div>
          <h3 className="font-bold text-[#1A1A1A] text-xs font-mono uppercase tracking-widest">Tidak ada pesanan</h3>
          <p className="text-[#1A1A1A]/75 text-xs max-w-sm mt-1 leading-normal uppercase">
            Sepertinya Anda belum memulai pertukaran skill. Jelajahi layanan yang tersedia untuk kolaborasi berikutnya.
          </p>
          <button 
            type="button" 
            onClick={onNavigateHome}
            className="mt-6 px-6 py-3 bg-[#FF3E00] text-white border-2 border-[#1A1A1A] font-mono font-bold text-xs uppercase tracking-widest shadow-[2px_2px_0px_#1A1A1A] hover:bg-black transition-colors"
          >
            Jelajahi Marketplace
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {displayedOrders.map((order) => (
            <div 
              key={order.id}
              className="bg-white p-5 border-2 border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] hover:border-[#FF3E00] transition-colors"
            >
              {/* Card Header information */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex gap-3 min-w-0">
                  <div className="w-16 h-16 border-2 border-[#1A1A1A] bg-[#F4F1EA] overflow-hidden shrink-0">
                    <img alt={order.serviceTitle} className="w-full h-full object-cover" src={order.serviceImage} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-[#1A1A1A] text-xs uppercase font-mono tracking-tight leading-tight truncate">
                      {order.serviceTitle}
                    </h3>
                    <div className="flex items-center gap-1 text-[10px] text-[#1A1A1A]/70 mt-1 font-mono">
                      <Star className="w-3.5 h-3.5 text-[#FF3E00] fill-[#FF3E00] shrink-0" />
                      <span className="truncate uppercase font-bold">{order.ratingText}</span>
                    </div>
                  </div>
                </div>

                <span className="px-2 py-0.5 text-[9px] font-mono font-bold border-2 border-[#1A1A1A] bg-[#FF3E00]/10 text-[#FF3E00] uppercase tracking-wider shrink-0">
                  {order.status}
                </span>
              </div>

              {/* Transaction Specs Board */}
              <div className="grid grid-cols-2 gap-4 py-3 border-y border-[#1A1A1A]/20 mb-4 text-xs">
                <div>
                  <p className="text-[9px] font-bold text-[#1A1A1A]/50 uppercase tracking-widest font-mono">{order.dateLabel}</p>
                  <p className="font-bold text-[#1A1A1A] mt-0.5 font-mono uppercase text-[10px]">{order.dateValue}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-bold text-[#1A1A1A]/50 uppercase tracking-widest font-mono">Total Harga</p>
                  <p className="font-extrabold text-xs text-[#FF3E00] mt-0.5 font-mono">${order.price.toFixed(2)}</p>
                </div>
              </div>

              {/* Inner Actions based on states */}
              <div className="flex gap-2">
                {order.status === 'Sedang Berjalan' && (
                  <>
                    <button 
                      type="button" 
                      onClick={() => alert(`Memeriksa spesifikasi pelacakan untuk ${order.serviceTitle}.\nKontak teman sekelas tercantum. Hasil unggahan akan diberitahukan.`)}
                      className="flex-1 py-3 bg-[#FF3E00] text-white font-mono font-bold text-xs uppercase tracking-wider border-2 border-[#1A1A1A] hover:bg-[#FF3E00]/90 active:scale-95 transition-all cursor-pointer shadow-[2px_2px_0px_#1A1A1A]"
                    >
                      Lihat Detail
                    </button>
                    <button 
                      type="button" 
                      onClick={() => onOpenChatWithSeller(order.sellerName)}
                      className="px-4 py-3 bg-white border-2 border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#F4F1EA] transition-all cursor-pointer"
                      title="Pesan Penjual"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </>
                )}

                {order.status === 'Menunggu Review' && (
                  <>
                    <button 
                      type="button" 
                      onClick={() => onUpdateOrderStatus(order.id, 'Selesai')}
                      className="flex-1 py-3 bg-[#FF3E00] text-white font-mono font-bold text-xs uppercase tracking-wider border-2 border-[#1A1A1A] hover:bg-black transition-all cursor-pointer shadow-[2px_2px_0px_#1A1A1A]"
                    >
                      Setuju &amp; Bayar
                    </button>
                    <button 
                      type="button" 
                      onClick={() => alert('Pengiriman Teman: Binary dan anotasi terlampir. Terverifikasi aman di bawah protokol peer.')}
                      className="px-4 py-3 bg-white border-2 border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#F4F1EA] font-mono font-bold text-xs uppercase tracking-wider cursor-pointer"
                    >
                      Review File
                    </button>
                  </>
                )}

                {order.status === 'Menunggu Konfirmasi' && (
                  <>
                    <button 
                      type="button" 
                      onClick={() => onCancelOrder(order.id)}
                      className="flex-1 py-3 bg-white hover:bg-red-50 text-red-600 border-2 border-[#1A1A1A] font-mono font-bold text-xs uppercase tracking-wider cursor-pointer active:scale-95 transition-transform"
                    >
                      Batalkan Pesanan
                    </button>
                    <button 
                      type="button" 
                      onClick={() => alert('Detail Pesanan: Menunggu konfirmasi dari tutor/ahli. Revisi dapat terjadi.')}
                      className="px-4 py-3 bg-white border-2 border-[#1A1A1A] text-[#1A1A1A] hover:bg-neutral-100 transition-all cursor-pointer"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </>
                )}

                {order.status === 'Selesai' && (
                  <>
                    <button 
                      type="button" 
                      onClick={() => setSelectedReceiptOrder(order)}
                      className="flex-1 py-3 bg-white border-2 border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#F4F1EA] font-mono font-bold text-xs uppercase tracking-wider cursor-pointer font-bold"
                    >
                      Lihat Resi
                    </button>
                    <button 
                      type="button" 
                      onClick={() => onReorderService(order.id)}
                      className="flex-1 py-3 bg-[#FF3E00] text-white font-mono font-bold text-xs uppercase tracking-widest border-2 border-[#1A1A1A] hover:bg-black cursor-pointer shadow-[2px_2px_0px_#1A1A1A]"
                    >
                      Pesan Lagi
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View PDF / Receipt detailed popup */}
      {selectedReceiptOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#1A1A1A]/40 backdrop-blur-sm" onClick={() => setSelectedReceiptOrder(null)} />
          <div className="relative w-full max-w-sm bg-[#F4F1EA] border-2 border-[#1A1A1A] p-6 shadow-none">
            <button 
              type="button" 
              onClick={() => setSelectedReceiptOrder(null)}
              className="absolute top-4 right-4 text-[#1A1A1A] hover:text-[#FF3E00] p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex flex-col items-center text-center space-y-4 pt-2">
              <div className="w-12 h-12 bg-white border-2 border-[#1A1A1A] flex items-center justify-center text-[#FF3E00]">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-extrabold text-[#1A1A1A] text-xs font-mono uppercase tracking-widest">Ringkasan Resi</h4>
                <p className="text-[9px] font-mono text-[#1A1A1A]/65 mt-0.5">ID Pesanan #{selectedReceiptOrder.id.toUpperCase()}</p>
              </div>

              <div className="w-full border-t border-dashed border-[#1A1A1A] py-3 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#1A1A1A]/50 font-mono text-[10px] uppercase font-bold">Item Layanan:</span>
                  <span className="font-extrabold text-[#1A1A1A] text-right font-mono text-[10px] max-w-[180px] truncate uppercase">{selectedReceiptOrder.serviceTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#1A1A1A]/50 font-mono text-[10px] uppercase font-bold">Teman Sekelas:</span>
                  <span className="font-bold text-[#1A1A1A] font-mono text-[10px] uppercase">{selectedReceiptOrder.sellerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#1A1A1A]/50 font-mono text-[10px] uppercase font-bold">Saluran Pembayaran:</span>
                  <span className="font-bold text-[#1A1A1A] font-mono text-[10px] uppercase">Escrow Campus Skill</span>
                </div>
                <div className="flex justify-between border-t border-[#1A1A1A] pt-2 font-bold text-sm">
                  <span className="text-[#1A1A1A] uppercase font-mono text-xs">Dibayar:</span>
                  <span className="text-[#FF3E00] font-mono font-bold text-sm">${selectedReceiptOrder.price.toFixed(2)}</span>
                </div>
              </div>

              <div className="w-full bg-[#1A1A1A] text-white p-3 text-[9px] font-mono font-bold uppercase tracking-wider leading-relaxed">
                Pertukaran terverifikasi dan tersinkronisasi dengan catatan institusi.
              </div>

              <button 
                type="button" 
                onClick={() => setSelectedReceiptOrder(null)}
                className="w-full py-3 bg-[#FF3E00] text-white border-2 border-[#1A1A1A] font-mono font-bold text-xs uppercase tracking-widest hover:bg-black cursor-pointer shadow-[2px_2px_0px_#1A1A1A]"
              >
                Tutup Resi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
