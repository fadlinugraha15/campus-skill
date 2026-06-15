/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, type MouseEvent } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import HomeTab from './components/HomeTab';
import OrdersTab from './components/OrdersTab';
import InboxTab from './components/InboxTab';
import ProfileTab from './components/ProfileTab';
import ServiceDetailModal from './components/ServiceDetailModal';
import CreateServiceModal from './components/CreateServiceModal';
import AuthPage from './components/AuthPage';

import { Service, Order, ChatThread, UserProfile, OrderStatus, ServiceCategory } from './types';
import { initialUserProfile, initialServices, initialOrders, initialChatThreads } from './data';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'orders' | 'inbox' | 'profile'>('home');
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  // Core Persisted States
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [chatThreads, setChatThreads] = useState<ChatThread[]>(initialChatThreads);

  // Interactive UI Modal States
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showCreateService, setShowCreateService] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info'>('success');
  const [activeThreadId, setActiveThreadId] = useState<string>('th-1');

  // Parallax mouse tracking
  const [parallaxMouse, setParallaxMouse] = useState({ x: 0.5, y: 0.5 });

  const handleParallaxMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setParallaxMouse({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }, []);

  const parallaxLayer = (depth: number) => ({
    x: (parallaxMouse.x - 0.5) * depth,
    y: (parallaxMouse.y - 0.5) * depth,
  });

  // Load from local storage
  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem('campusskill_profile');
      const storedServices = localStorage.getItem('campusskill_services');
      const storedOrders = localStorage.getItem('campusskill_orders');
      const storedThreads = localStorage.getItem('campusskill_threads');
      const storedLoggedOut = localStorage.getItem('campusskill_loggedout');

      if (storedProfile) setUserProfile(JSON.parse(storedProfile));
      if (storedServices) setServices(JSON.parse(storedServices));
      if (storedOrders) setOrders(JSON.parse(storedOrders));
      if (storedThreads) {
        const parsedThreads = JSON.parse(storedThreads);
        setChatThreads(parsedThreads);
        if (parsedThreads.length > 0) setActiveThreadId(parsedThreads[0].id);
      }
      if (storedLoggedOut) setIsLoggedOut(JSON.parse(storedLoggedOut) === true);
    } catch (e) {
      console.error("Local storage recovery failed", e);
    }
  }, []);

  // Save to local storage
  const saveAllToLocalStorage = (
    profile: UserProfile,
    servs: Service[],
    ords: Order[],
    threads: ChatThread[]
  ) => {
    try {
      localStorage.setItem('campusskill_profile', JSON.stringify(profile));
      localStorage.setItem('campusskill_services', JSON.stringify(servs));
      localStorage.setItem('campusskill_orders', JSON.stringify(ords));
      localStorage.setItem('campusskill_threads', JSON.stringify(threads));
    } catch (e) {
      console.error("Local storage save failed", e);
    }
  };

  const triggerToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // State handles
  const handleHireService = (service: Service) => {
    // Check if user has sufficient escrow balance
    if (userProfile.balance < service.price) {
      triggerToast('Saldo dompet kampus tidak mencukupi! Silakan isi ulang di tab profil.', 'info');
      setSelectedService(null);
      return;
    }

    // Deduct balance
    const updatedProfile = {
      ...userProfile,
      balance: userProfile.balance - service.price
    };
    setUserProfile(updatedProfile);

    // Format new Order object
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      serviceId: service.id,
      serviceTitle: service.title,
      serviceImage: service.image,
      sellerName: service.seller.name,
      sellerAvatar: service.seller.avatar,
      ratingText: `${service.rating.toFixed(1)} Penyedia Ahli`,
      status: 'Menunggu Konfirmasi',
      price: service.price,
      dateLabel: 'Estimasi Selesai',
      dateValue: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' }),
      category: service.category,
      chatThreadId: `th-custom-${Date.now()}`
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);

    // Also look up/create a chat thread with the seller
    let updatedThreads = [...chatThreads];
    const existingThread = chatThreads.find(t => t.participantName === service.seller.name);
    
    if (existingThread) {
      existingThread.messages.push({
        id: `msg-h-${Date.now()}`,
        sender: 'user',
        text: `Hai! Saya baru saja memesan layanan "${service.title}" seharga $${service.price}! Mari diskusikan detailnya.`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: 'numeric', minute: '2-digit' })
      });
      existingThread.unread = true;
    } else {
      updatedThreads.push({
        id: newOrder.chatThreadId,
        participantName: service.seller.name,
        participantAvatar: service.seller.avatar || 'https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg',
        participantStatus: 'Online',
        lastMessage: 'I just booked your service!',
        lastMessageTime: '1m',
        unread: true,
        messages: [
          {
            id: `msg-h1-${Date.now()}`,
            sender: 'user',
            text: `Hai! Saya lihat layanan "${service.title}" di halaman eksplorasi Campus Skill. Saya baru memesannya seharga $${service.price}!`,
            timestamp: new Date().toLocaleTimeString('id-ID', { hour: 'numeric', minute: '2-digit' })
          }
        ]
      });
    }
    setChatThreads(updatedThreads);

    saveAllToLocalStorage(updatedProfile, services, updatedOrders, updatedThreads);
    setSelectedService(null);
    setActiveTab('orders');
    triggerToast(`Berhasil memesan ${service.title}! Teman sekelas telah diberitahu.`);
  };

  const handleMessageSeller = (service: Service) => {
    // Navigate to chat thread, locate or create thread with service seller
    let targetThreadId = '';
    let updatedThreads = [...chatThreads];
    const existingThread = chatThreads.find(t => t.participantName === service.seller.name);

    if (existingThread) {
      targetThreadId = existingThread.id;
    } else {
      const templateThreadId = `th-q-${Date.now()}`;
      targetThreadId = templateThreadId;
      updatedThreads.push({
        id: templateThreadId,
        participantName: service.seller.name,
        participantAvatar: service.seller.avatar || 'https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg',
        participantStatus: 'Online',
        lastMessage: `Hai, ingin tahu tentang ${service.title}`,
        lastMessageTime: '1m',
        unread: false,
        messages: [
          {
            id: `msg-q-${Date.now()}`,
            sender: 'user',
            text: `Hai! Saya lihat layanan "${service.title}" di halaman eksplorasi Campus Skill. Bisa ceritakan lebih detail?`,
            timestamp: new Date().toLocaleTimeString('id-ID', { hour: 'numeric', minute: '2-digit' })
          }
        ]
      });
      setChatThreads(updatedThreads);
    }

    setActiveThreadId(targetThreadId);
    saveAllToLocalStorage(userProfile, services, orders, updatedThreads);
    setSelectedService(null);
    setActiveTab('inbox');
  };

  const handlePublishService = (newServicePartial: Partial<Service>) => {
    // Create new service item under Jordan user profile
    const newService: Service = {
      id: `custom-srv-${Date.now()}`,
      title: newServicePartial.title || 'Layanan tanpa judul',
      category: (newServicePartial.category as ServiceCategory) || 'Pemrograman',
      rating: 5.0,
      price: newServicePartial.price || 20,
      image: newServicePartial.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCl8lAblvCfFMdiGf7V8aR5eydkK3HDTSrAEvXZ4wbI9KV-_Y4iR6tw7Xx1El9XzLzGoIvzwawuT0pALf0m0sPGhMQ0eeHoylbiIKugDR3yis9jCO-RJteXb-6UwZVTcR4tI6ozWYgN4u6iaHlNiJmq9T4zqhPutSiLA2SnUT0qo_v4E1l0jzP0pDyASohl-jbS7leFTkGe0Z2tbfOhjyJAvvL9XaS14kL9pswFmdtmbzHfSIpBPfj3DxaBFlu6XVoOdlnGyPiaYw',
      description: newServicePartial.description || 'Layanan kustom yang didaftarkan oleh teman sekelas.',
      seller: {
        name: 'Jordan Smith',
        avatar: userProfile.avatar,
        level: 'Teman Universitas Teknologi'
      }
    };

    const updatedServices = [newService, ...services];
    setServices(updatedServices);

    const updatedProfile = {
      ...userProfile,
      servicesSold: userProfile.servicesSold + 0 // listed, not yet sold
    };
    setUserProfile(updatedProfile);

    saveAllToLocalStorage(updatedProfile, updatedServices, orders, chatThreads);
    triggerToast(`Berhasil menerbitkan ${newService.title}! Listing sudah aktif.`);
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    let updatedProfile = { ...userProfile };
    const updatedOrders = orders.map((o) => {
      if (o.id === orderId) {
        if (status === 'Selesai') {
          // Add to earnings if Jordy was the seller (e.g. they sold a custom listing)
          if (o.sellerName === 'Jordan Smith') {
            updatedProfile.earnings += o.price;
            updatedProfile.servicesSold += 1;
          }
          triggerToast('Pesanan selesai! Dana telah dirilis ke tutor.', 'success');
        }
        return { 
          ...o, 
          status,
          dateLabel: status === 'Selesai' ? 'Selesai Pada' : o.dateLabel,
          dateValue: status === 'Selesai' ? new Date().toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' }) : o.dateValue
        };
      }
      return o;
    });

    setOrders(updatedOrders);
    setUserProfile(updatedProfile);
    saveAllToLocalStorage(updatedProfile, services, updatedOrders, chatThreads);
  };

  const handleCancelOrder = (orderId: string) => {
    const isConfirmed = window.confirm('Yakin ingin membatalkan permintaan ini? Dana yang terpotong akan dikembalikan ke escrow.');
    if (!isConfirmed) return;

    const targeted = orders.find(o => o.id === orderId);
    let updatedProfile = { ...userProfile };
    
    if (targeted) {
      // Reimburse funds 
      updatedProfile.balance += targeted.price;
    }

    const updatedOrders = orders.filter(o => o.id !== orderId);
    setOrders(updatedOrders);
    setUserProfile(updatedProfile);

    saveAllToLocalStorage(updatedProfile, services, updatedOrders, chatThreads);
    triggerToast('Pesanan dibatalkan. Saldo dikembalikan sepenuhnya.', 'info');
  };

  const handleDeleteService = (serviceId: string) => {
    const isConfirmed = window.confirm('Yakin ingin menghapus listing layanan ini?');
    if (!isConfirmed) return;

    const updatedServices = services.filter(s => s.id !== serviceId);
    setServices(updatedServices);

    saveAllToLocalStorage(userProfile, updatedServices, orders, chatThreads);
    triggerToast('Listing berhasil dihapus.', 'info');
  };

  const handleSendMessage = (threadId: string, text: string) => {
    const updatedThreads = chatThreads.map((t) => {
      if (t.id === threadId) {
        return {
          ...t,
          lastMessage: text,
          lastMessageTime: 'Now',
          messages: [
            ...t.messages,
            {
              id: `msg-${Date.now()}-${Math.random()}`,
              sender: 'user' as const,
              text,
              timestamp: new Date().toLocaleTimeString('id-ID', { hour: 'numeric', minute: '2-digit' })
            }
          ]
        };
      }
      return t;
    });

    setChatThreads(updatedThreads);
    saveAllToLocalStorage(userProfile, services, orders, updatedThreads);
  };

  // Helper simulated incoming text append for classmates responses
  const handleSimulatePeerMessage = (threadId: string, text: string) => {
    setChatThreads((prevThreads) => {
      const parsed = prevThreads.map((t) => {
        if (t.id === threadId) {
          return {
            ...t,
            lastMessage: text,
            lastMessageTime: 'Now',
            unread: activeTab !== 'inbox' || activeThreadId !== threadId,
            messages: [
              ...t.messages,
              {
                id: `msg-peer-${Date.now()}`,
                sender: 'other' as const,
                text,
                timestamp: new Date().toLocaleTimeString('id-ID', { hour: 'numeric', minute: '2-digit' })
              }
            ]
          };
        }
        return t;
      });
      localStorage.setItem('campusskill_threads', JSON.stringify(parsed));
      return parsed;
    });
  };

  const handleMarkThreadAsRead = (threadId: string) => {
    const updatedThreads = chatThreads.map((t) => {
      if (t.id === threadId) return { ...t, unread: false };
      return t;
    });
    setChatThreads(updatedThreads);
    localStorage.setItem('campusskill_threads', JSON.stringify(updatedThreads));
  };

  const handleOpenChatWithSeller = (sellerName: string) => {
    // Find or create a thread
    let updatedThreads = [...chatThreads];
    let threadId = '';
    const existing = chatThreads.find(t => t.participantName.includes(sellerName) || sellerName.includes(t.participantName));

    if (existing) {
      threadId = existing.id;
    } else {
      const customId = `th-mock-${Date.now()}`;
      threadId = customId;
      updatedThreads.push({
        id: customId,
        participantName: sellerName,
        participantAvatar: 'https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg',
        participantStatus: 'Online',
        lastMessage: 'Starting conversation...',
        lastMessageTime: '1m',
        unread: false,
        messages: [
          {
            id: `msg-st-${Date.now()}`,
            sender: 'user',
            text: `Hai ${sellerName.split(',')[0]}! Saya baru saja mengirim kontrak jadwal untuk pesanan bimbingan Kalkulus.`,
            timestamp: new Date().toLocaleTimeString('id-ID', { hour: 'numeric', minute: '2-digit' })
          }
        ]
      });
      setChatThreads(updatedThreads);
    }

    setActiveThreadId(threadId);
    saveAllToLocalStorage(userProfile, services, orders, updatedThreads);
    setActiveTab('inbox');
  };

  const handleReorderService = (orderId: string) => {
    const prevOrder = orders.find(o => o.id === orderId);
    if (!prevOrder) return;

    // Look up original service
    const origService = services.find(s => s.id === prevOrder.serviceId);
    if (origService) {
      handleHireService(origService);
    } else {
      // Re-create temporary mock service to hire
      const mockService: Service = {
        id: prevOrder.serviceId,
        title: prevOrder.serviceTitle,
        category: prevOrder.category as any,
        rating: 5.0,
        price: prevOrder.price,
        image: prevOrder.serviceImage,
        description: 'Previously ordered service recreated.',
        seller: {
          name: prevOrder.sellerName,
          avatar: prevOrder.sellerAvatar,
          level: 'Penyedia Bersertifikat Campus Skill'
        }
      };
      handleHireService(mockService);
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm('Yakin ingin keluar dan menghapus sesi sandbox?');
    if (!confirmLogout) return;

    setIsLoggedOut(true);
    localStorage.setItem('campusskill_loggedout', 'true');
  };

  const handleResetSandbox = () => {
    // Wipe local storage clean to refresh default demo configurations
    localStorage.removeItem('campusskill_profile');
    localStorage.removeItem('campusskill_services');
    localStorage.removeItem('campusskill_orders');
    localStorage.removeItem('campusskill_threads');
    localStorage.setItem('campusskill_loggedout', 'false');

    setUserProfile(initialUserProfile);
    setServices(initialServices);
    setOrders(initialOrders);
    setChatThreads(initialChatThreads);
    setActiveThreadId(initialChatThreads[0].id);
    setIsLoggedOut(false);
    setActiveTab('home');
    triggerToast('Sesi sandbox dikembalikan ke pengaturan awal.', 'info');
  };

  const handleLogin = (name: string) => {
    setIsLoggedOut(false);
    localStorage.setItem('campusskill_loggedout', 'false');
    const users = JSON.parse(localStorage.getItem('campusskill_users') || '[]');
    const user = users.find((u: any) => u.name === name);
    setUserProfile(prev => ({
      ...prev,
      name,
      role: user ? (user.role || 'pelanggan') : prev.role,
      ktmPhoto: user?.ktmPhoto || prev.ktmPhoto || '',
      avatar: user?.avatar || prev.avatar,
    }));
    setActiveTab('home');
    triggerToast(`Selamat datang, ${name}!`);
  };

  const unreadMessagesCount = chatThreads.filter(t => t.unread).length;
  const activeOrdersCount = orders.filter(o => o.status !== 'Selesai').length;

  return (
    <div
      className="bg-gray-50/50 text-gray-800 min-h-screen font-sans relative"
      onMouseMove={!isLoggedOut ? handleParallaxMove : undefined}
    >
      {isLoggedOut ? (
        <AuthPage
          userProfile={initialUserProfile}
          onLogin={handleLogin}
          onReset={handleResetSandbox}
        />
      ) : (
        <>
          {/* Parallax ambient background */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <motion.div
              className="absolute w-[600px] h-[600px] rounded-full"
              animate={{ x: parallaxLayer(40).x, y: parallaxLayer(40).y }}
              transition={{ type: 'spring', stiffness: 30, damping: 30 }}
              style={{ background: 'radial-gradient(circle, rgba(255,62,0,0.04) 0%, transparent 70%)', top: '-10%', left: '-5%' }}
            />
            <motion.div
              className="absolute w-[400px] h-[400px] rounded-full"
              animate={{ x: parallaxLayer(-30).x, y: parallaxLayer(-30).y }}
              transition={{ type: 'spring', stiffness: 35, damping: 30 }}
              style={{ background: 'radial-gradient(circle, rgba(26,26,26,0.03) 0%, transparent 70%)', bottom: '10%', right: '5%' }}
            />
            <motion.div
              className="absolute w-[250px] h-[250px] rounded-full"
              animate={{ x: parallaxLayer(25).x, y: parallaxLayer(25).y }}
              transition={{ type: 'spring', stiffness: 45, damping: 25 }}
              style={{ background: 'radial-gradient(circle, rgba(255,62,0,0.06) 0%, transparent 70%)', top: '40%', right: '15%' }}
            />
            <motion.div
              className="absolute w-[180px] h-[180px] rounded-full"
              animate={{ x: parallaxLayer(-20).x, y: parallaxLayer(-20).y }}
              transition={{ type: 'spring', stiffness: 50, damping: 25 }}
              style={{ background: 'radial-gradient(circle, rgba(244,241,234,0.03) 0%, transparent 70%)', bottom: '30%', left: '10%' }}
            />
            {/* Grid overlay */}
            <div
              className="absolute inset-0 opacity-[0.015]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(26,26,26,1) 1px, transparent 1px), linear-gradient(90deg, rgba(26,26,26,1) 1px, transparent 1px)',
                backgroundSize: '80px 80px',
              }}
            />
          </div>

          {/* Top fixed bar */}
          <div className="relative z-20">
            <Header 
            onTabChange={setActiveTab} 
            activeTab={activeTab} 
            unreadMessagesCount={unreadMessagesCount}
            activeOrdersCount={activeOrdersCount}
          />
          </div>

          {/* Main workspace with top offset */}
          <main className="pt-24 pb-24 md:pb-12 px-4 max-w-7xl mx-auto relative z-10">
            {activeTab === 'home' && (
              <HomeTab 
                services={services} 
                onServiceSelect={setSelectedService}
                onOpenCreateServiceModal={() => setShowCreateService(true)}
              />
            )}

            {activeTab === 'orders' && (
              <OrdersTab 
                orders={orders}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                onCancelOrder={handleCancelOrder}
                onNavigateHome={() => setActiveTab('home')}
                onOpenChatWithSeller={handleOpenChatWithSeller}
                onReorderService={handleReorderService}
              />
            )}

            {activeTab === 'inbox' && (
              <InboxTab 
                threads={chatThreads}
                onSendMessage={(threadId, text) => {
                  handleSendMessage(threadId, text);
                }}
                onMarkThreadAsRead={handleMarkThreadAsRead}
                activeThreadId={activeThreadId}
                setActiveThreadId={setActiveThreadId}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileTab 
                userProfile={userProfile}
                services={services}
                onOpenCreateServiceModal={() => setShowCreateService(true)}
                onLogout={handleLogout}
                onDeleteService={handleDeleteService}
              />
            )}
          </main>

          {/* Mobile bottom persistent bar */}
          <div className="relative z-20">
            <Navbar 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            unreadMessagesCount={unreadMessagesCount}
          />
          </div>

          {/* Service Details Popup modal */}
          {selectedService && (
            <ServiceDetailModal 
              service={selectedService}
              onClose={() => setSelectedService(null)}
              onHire={handleHireService}
              onMessageSeller={handleMessageSeller}
            />
          )}

          {/* Create custom list modal */}
          {showCreateService && (
            <CreateServiceModal 
              onClose={() => setShowCreateService(false)}
              onSubmit={handlePublishService}
            />
          )}

          {/* Toast Notification Deck */}
          {toastMessage && (
            <div className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-55 max-w-xs md:max-w-sm bg-gray-900 border border-gray-800 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-fadeIn">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-xs font-semibold leading-tight pr-2">{toastMessage}</p>
              </div>
              <button 
                type="button" 
                onClick={() => setToastMessage(null)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Inline fallback icon for convenience
function X({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
