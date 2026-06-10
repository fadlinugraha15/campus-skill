/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, ClipboardList, MessageSquare, User } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'orders' | 'inbox' | 'profile';
  onTabChange: (tab: 'home' | 'orders' | 'inbox' | 'profile') => void;
  unreadMessagesCount: number;
}

export default function Navbar({ activeTab, onTabChange, unreadMessagesCount }: NavbarProps) {
  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 h-[72px] bg-[#F4F1EA] border-t-2 border-[#1A1A1A] pb-safe">
      <div className="flex justify-around items-center h-full px-4 w-full">
        {/* Home Tab Navigation Link */}
        <button 
          type="button"
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center justify-center w-16 h-full transition-transform duration-200 active:scale-90 ${activeTab === 'home' ? 'text-[#FF3E00] relative after:content-[""] after:w-1.5 after:h-1.5 after:bg-[#FF3E00] after:mt-1 font-bold' : 'text-[#1A1A1A]/60'}`}
        >
          <Home className={`w-5 h-5`} />
          <span className="text-[9px] leading-[14px] uppercase tracking-wider font-mono font-bold mt-1">Collection</span>
        </button>

        {/* Orders Tab Navigation Link */}
        <button 
          type="button"
          onClick={() => onTabChange('orders')}
          className={`flex flex-col items-center justify-center w-16 h-full transition-transform duration-200 active:scale-90 ${activeTab === 'orders' ? 'text-[#FF3E00] relative after:content-[""] after:w-1.5 after:h-1.5 after:bg-[#FF3E00] after:mt-1 font-bold' : 'text-[#1A1A1A]/60'}`}
        >
          <ClipboardList className="w-5 h-5" />
          <span className="text-[9px] leading-[14px] uppercase tracking-wider font-mono font-bold mt-1">Orders</span>
        </button>

        {/* Inbox Tab Navigation Link with dynamic count */}
        <button 
          type="button"
          onClick={() => onTabChange('inbox')}
          className={`flex flex-col items-center justify-center w-16 h-full transition-transform duration-200 active:scale-90 relative ${activeTab === 'inbox' ? 'text-[#FF3E00] relative after:content-[""] after:w-1.5 after:h-1.5 after:bg-[#FF3E00] after:mt-1 font-bold' : 'text-[#1A1A1A]/60'}`}
        >
          <MessageSquare className={`w-5 h-5`} />
          <span className="text-[9px] leading-[14px] uppercase tracking-wider font-mono font-bold mt-1">Inbox</span>
          {unreadMessagesCount > 0 && (
            <span className="absolute top-1 right-2 bg-[#1A1A1A] text-white text-[9px] font-bold px-1 font-mono border border-white">
              {unreadMessagesCount}
            </span>
          )}
        </button>

        {/* Profile Tab Navigation Link */}
        <button 
          type="button"
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center justify-center w-16 h-full transition-transform duration-200 active:scale-90 ${activeTab === 'profile' ? 'text-[#FF3E00] relative after:content-[""] after:w-1.5 after:h-1.5 after:bg-[#FF3E00] after:mt-1 font-bold' : 'text-[#1A1A1A]/60'}`}
        >
          <User className="w-5 h-5" />
          <span className="text-[9px] leading-[14px] uppercase tracking-wider font-mono font-bold mt-1">Archive</span>
        </button>
      </div>
    </nav>
  );
}
