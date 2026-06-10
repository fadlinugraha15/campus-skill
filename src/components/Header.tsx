/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { GraduationCap, Bell, CheckCircle } from 'lucide-react';

interface HeaderProps {
  onTabChange: (tab: 'home' | 'orders' | 'inbox' | 'profile') => void;
  activeTab: 'home' | 'orders' | 'inbox' | 'profile';
  unreadMessagesCount: number;
  activeOrdersCount: number;
}

export default function Header({ onTabChange, activeTab, unreadMessagesCount, activeOrdersCount }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 'n-1',
      title: 'New Message from Sarah',
      text: '"Can we meet at the library to discuss the Python project?"',
      time: '12m ago',
      read: false,
    },
    {
      id: 'n-2',
      title: 'Order Status Update',
      text: 'Advanced Calculus Tutoring has been marked In Progress.',
      time: '1h ago',
      read: true,
    },
    {
      id: 'n-3',
      title: 'Welcome to SkillSwap!',
      text: 'Start exploring academic services offered by your university peers.',
      time: '1d ago',
      read: true,
    }
  ]);

  const hasUnreadNotifications = notifications.some(n => !n.read);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-[#F4F1EA] backdrop-blur-md border-b-2 border-[#1A1A1A] transition-all duration-300">
      <div className="flex justify-between items-center h-20 px-4 md:px-8 w-full max-w-7xl mx-auto">
        {/* Brand Logo & Name */}
        <div 
          className="flex items-center gap-3 cursor-pointer group active:scale-95 transition-transform"
          onClick={() => onTabChange('home')}
        >
          <div className="w-10 h-10 bg-[#FF3E00] flex items-center justify-center text-white border-2 border-[#1A1A1A] text-lg font-bold uppercase tracking-tighter">
            SS
          </div>
          <div>
            <span className="font-extrabold text-xl md:text-2xl text-[#1A1A1A] tracking-tighter uppercase block leading-none">SkillSwap</span>
            <span className="text-[9px] text-[#1A1A1A] font-mono hidden md:block tracking-widest uppercase font-bold mt-1">Studio // Campus Exchange</span>
          </div>
        </div>

        {/* Desktop Header Links */}
        <div className="hidden md:flex gap-8 items-center">
          <button 
            type="button"
            onClick={() => onTabChange('home')}
            className={`font-semibold text-xs uppercase tracking-widest transition-all relative py-1 ${activeTab === 'home' ? 'text-[#FF3E00] after:content-[""] after:absolute after:-bottom-7 after:left-0 after:w-full after:h-1 after:bg-[#FF3E00]' : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A]'}`}
          >
            Collection
          </button>
          <button 
            type="button"
            onClick={() => onTabChange('orders')}
            className={`font-semibold text-xs uppercase tracking-widest transition-all relative py-1 flex items-center gap-1.5 ${activeTab === 'orders' ? 'text-[#FF3E00] after:content-[""] after:absolute after:-bottom-7 after:left-0 after:w-full after:h-1 after:bg-[#FF3E00]' : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A]'}`}
          >
            Orders
            {activeOrdersCount > 0 && (
              <span className="bg-[#FF3E00] border border-[#1A1A1A] text-white text-[9px] font-bold px-1.5 py-0.5 font-mono">
                {activeOrdersCount}
              </span>
            )}
          </button>
          <button 
            type="button"
            onClick={() => onTabChange('inbox')}
            className={`font-semibold text-xs uppercase tracking-widest transition-all relative py-1 flex items-center gap-1.5 ${activeTab === 'inbox' ? 'text-[#FF3E00] after:content-[""] after:absolute after:-bottom-7 after:left-0 after:w-full after:h-1 after:bg-[#FF3E00]' : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A]'}`}
          >
            Inbox
            {unreadMessagesCount > 0 && (
              <span className="bg-[#1A1A1A] text-white text-[9px] font-bold px-1.5 py-0.5 font-mono">
                {unreadMessagesCount}
              </span>
            )}
          </button>
          <button 
            type="button"
            onClick={() => onTabChange('profile')}
            className={`font-semibold text-xs uppercase tracking-widest transition-all relative py-1 ${activeTab === 'profile' ? 'text-[#FF3E00] after:content-[""] after:absolute after:-bottom-7 after:left-0 after:w-full after:h-1 after:bg-[#FF3E00]' : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A]'}`}
          >
            Archive
          </button>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-3 relative">
          <button 
            id="notification-bell"
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 flex items-center justify-center rounded-none text-[#1A1A1A] hover:bg-[#1A1A1A]/5 border border-[#1A1A1A] active:scale-95 transition-all relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-[#1A1A1A]" />
            {hasUnreadNotifications && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FF3E00] border border-[#1A1A1A]" />
            )}
          </button>

          {/* Quick Avatar Dropdown trigger */}
          <div 
            onClick={() => onTabChange('profile')}
            className="w-10 h-10 rounded-none overflow-hidden border-2 border-[#1A1A1A] cursor-pointer hover:border-[#FF3E00] transition-colors ml-1 active:scale-95 duration-150"
            title="View Profile"
          >
            <img 
              alt="Profile" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0f-CwmEe-drZtPOdLjuC8Ea1yj4XZS6XpO6AICIBGDWqFQcgmTrCMnwj302RparN7l9Xq-JmeyEq-8Dn2dUtZ2H2WO5jr9MI6_213pVFZZDhuvqzMLgKHLXaRJGQFrztmUFRDasBUyU07Bivlhv40SNaFLG7b0HNCkYTVeCJlrlpFJXt92_Z4fYR9Keknsifczz_jQnmTqIuIaWXJb-J180E33E9NFIO7ZR8O_BrD5tFDMqDdTRaVPjd5fhk7fmF7zE2-S8nw5Q" 
            />
          </div>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowNotifications(false)} 
              />
              <div className="absolute right-0 top-14 w-80 bg-[#F4F1EA] rounded-none border-2 border-[#1A1A1A] z-50 py-3 flex flex-col gap-1 max-h-[400px] overflow-y-auto shadow-none">
                <div className="px-4 pb-2 border-b border-[#1A1A1A] flex justify-between items-center">
                  <h3 className="font-bold text-[#1A1A1A] text-xs uppercase tracking-wider">Notifications</h3>
                  {hasUnreadNotifications && (
                    <button 
                      type="button" 
                      onClick={markAllAsRead}
                      className="text-[10px] text-[#FF3E00] hover:underline font-bold uppercase tracking-wider"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <div className="flex flex-col">
                  {notifications.map(n => (
                    <div 
                      key={n.id} 
                      className={`px-4 py-3 border-b border-[#1A1A1A]/10 flex flex-col gap-1 transition-colors hover:bg-[#1A1A1A]/5 cursor-pointer ${!n.read ? 'bg-[#FF3E00]/5' : ''}`}
                      onClick={() => {
                        setNotifications(prev => prev.map(notif => notif.id === n.id ? { ...notif, read: true } : notif));
                        if (n.id === 'n-1') onTabChange('inbox');
                        if (n.id === 'n-2') onTabChange('orders');
                        setShowNotifications(false);
                      }}
                    >
                      <div className="flex justify-between items-start gap-1">
                        <span className={`font-bold text-xs leading-tight uppercase tracking-tight ${!n.read ? 'text-[#FF3E00]' : 'text-[#1A1A1A]'}`}>
                          {n.title}
                        </span>
                        <span className="text-[9px] font-mono text-[#1A1A1A]/60">{n.time}</span>
                      </div>
                      <p className="text-xs text-[#1A1A1A]/80 line-clamp-2 leading-tight py-1">{n.text}</p>
                      {!n.read && (
                        <div className="flex items-center gap-1 mt-0.5 text-[9px] font-mono font-bold uppercase text-[#FF3E00]">
                          <span className="w-1.5 h-1.5 bg-[#FF3E00] inline-block" /> Active Alert
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
