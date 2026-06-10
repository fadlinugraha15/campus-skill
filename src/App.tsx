/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Sparkles, GraduationCap, ArrowRight, RefreshCw, KeyRound, AlertCircle } from 'lucide-react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import HomeTab from './components/HomeTab';
import OrdersTab from './components/OrdersTab';
import InboxTab from './components/InboxTab';
import ProfileTab from './components/ProfileTab';
import ServiceDetailModal from './components/ServiceDetailModal';
import CreateServiceModal from './components/CreateServiceModal';

import { Service, Order, ChatThread, UserProfile, OrderStatus } from './types';
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

  // Load from local storage
  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem('skillswap_profile');
      const storedServices = localStorage.getItem('skillswap_services');
      const storedOrders = localStorage.getItem('skillswap_orders');
      const storedThreads = localStorage.getItem('skillswap_threads');
      const storedLoggedOut = localStorage.getItem('skillswap_loggedout');

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
      localStorage.setItem('skillswap_profile', JSON.stringify(profile));
      localStorage.setItem('skillswap_services', JSON.stringify(servs));
      localStorage.setItem('skillswap_orders', JSON.stringify(ords));
      localStorage.setItem('skillswap_threads', JSON.stringify(threads));
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
      triggerToast(`Insufficient campus wallet funds! Please load balance in profile tab.`, 'info');
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
      ratingText: `${service.rating.toFixed(1)} Expert Provider`,
      status: 'Pending Confirmation',
      price: service.price,
      dateLabel: 'Estimated Completion',
      dateValue: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
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
        text: `Hey! I just booked your service "${service.title}" for $${service.price}! Let's lock in the requirements.`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
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
            text: `Hey! I saw your service "${service.title}" on the SkillSwap explore page. I just booked it for $${service.price}!`,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
          }
        ]
      });
    }
    setChatThreads(updatedThreads);

    saveAllToLocalStorage(updatedProfile, services, updatedOrders, updatedThreads);
    setSelectedService(null);
    setActiveTab('orders');
    triggerToast(`Successfully booked ${service.title}! Classmate notified.`);
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
        lastMessage: `Hey, inquiring about ${service.title}`,
        lastMessageTime: '1m',
        unread: false,
        messages: [
          {
            id: `msg-q-${Date.now()}`,
            sender: 'user',
            text: `Hey! I saw your service "${service.title}" on the SkillSwap explore page. Can you tell me more about it?`,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
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
      title: newServicePartial.title || 'Untitled service',
      category: newServicePartial.category || 'Coding',
      rating: 5.0,
      price: newServicePartial.price || 20,
      image: newServicePartial.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCl8lAblvCfFMdiGf7V8aR5eydkK3HDTSrAEvXZ4wbI9KV-_Y4iR6tw7Xx1El9XzLzGoIvzwawuT0pALf0m0sPGhMQ0eeHoylbiIKugDR3yis9jCO-RJteXb-6UwZVTcR4tI6ozWYgN4u6iaHlNiJmq9T4zqhPutSiLA2SnUT0qo_v4E1l0jzP0pDyASohl-jbS7leFTkGe0Z2tbfOhjyJAvvL9XaS14kL9pswFmdtmbzHfSIpBPfj3DxaBFlu6XVoOdlnGyPiaYw',
      description: newServicePartial.description || 'Custom service listed by peer.',
      seller: {
        name: 'Jordan Smith',
        avatar: userProfile.avatar,
        level: 'University of Tech Peer'
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
    triggerToast(`Successfully published ${newService.title}! Listing is live.`);
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    let updatedProfile = { ...userProfile };
    const updatedOrders = orders.map((o) => {
      if (o.id === orderId) {
        if (status === 'Completed') {
          // Add to earnings if Jordy was the seller (e.g. they sold a custom listing)
          if (o.sellerName === 'Jordan Smith') {
            updatedProfile.earnings += o.price;
            updatedProfile.servicesSold += 1;
          }
          triggerToast(`Order finalized! Funds released to tutor.`, 'success');
        }
        return { 
          ...o, 
          status,
          dateLabel: status === 'Completed' ? 'Completed On' : o.dateLabel,
          dateValue: status === 'Completed' ? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : o.dateValue
        };
      }
      return o;
    });

    setOrders(updatedOrders);
    setUserProfile(updatedProfile);
    saveAllToLocalStorage(updatedProfile, services, updatedOrders, chatThreads);
  };

  const handleCancelOrder = (orderId: string) => {
    const isConfirmed = window.confirm('Are you sure you want to cancel this request? Deducted funds will instantly escrow back.');
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
    triggerToast('Order request canceled. Balance fully refunded.', 'info');
  };

  const handleDeleteService = (serviceId: string) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this offered skill listing?');
    if (!isConfirmed) return;

    const updatedServices = services.filter(s => s.id !== serviceId);
    setServices(updatedServices);

    saveAllToLocalStorage(userProfile, updatedServices, orders, chatThreads);
    triggerToast('Listing deleted successfully.', 'info');
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
              timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
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
                timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
              }
            ]
          };
        }
        return t;
      });
      localStorage.setItem('skillswap_threads', JSON.stringify(parsed));
      return parsed;
    });
  };

  const handleMarkThreadAsRead = (threadId: string) => {
    const updatedThreads = chatThreads.map((t) => {
      if (t.id === threadId) return { ...t, unread: false };
      return t;
    });
    setChatThreads(updatedThreads);
    localStorage.setItem('skillswap_threads', JSON.stringify(updatedThreads));
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
            text: `Hi ${sellerName.split(',')[0]}! I just sent a schedule contract on our Calculus tutoring order.`,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
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
          level: 'SkillSwap Certified Provider'
        }
      };
      handleHireService(mockService);
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to sign out and clear sandbox session?');
    if (!confirmLogout) return;

    setIsLoggedOut(true);
    localStorage.setItem('skillswap_loggedout', 'true');
  };

  const handleResetSandbox = () => {
    // Wipe local storage clean to refresh default demo configurations
    localStorage.removeItem('skillswap_profile');
    localStorage.removeItem('skillswap_services');
    localStorage.removeItem('skillswap_orders');
    localStorage.removeItem('skillswap_threads');
    localStorage.setItem('skillswap_loggedout', 'false');

    setUserProfile(initialUserProfile);
    setServices(initialServices);
    setOrders(initialOrders);
    setChatThreads(initialChatThreads);
    setActiveThreadId(initialChatThreads[0].id);
    setIsLoggedOut(false);
    setActiveTab('home');
    triggerToast('Sandbox session restored to default assets.', 'info');
  };

  const handleLoginAsJordan = () => {
    setIsLoggedOut(false);
    localStorage.setItem('skillswap_loggedout', 'false');
    setActiveTab('home');
    triggerToast('Access granted as Jordan Smith - University of Tech CS Junior.');
  };

  const unreadMessagesCount = chatThreads.filter(t => t.unread).length;
  const activeOrdersCount = orders.filter(o => o.status !== 'Completed').length;

  return (
    <div className="bg-gray-50/50 text-gray-800 min-h-screen font-sans">
      {isLoggedOut ? (
        /* Customized elegant signin gateway for the SkillSwap sandbox mock */
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-blue-50/30 to-white/70">
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-100/90 text-center space-y-6">
            <div className="flex flex-col items-center space-y-2.5">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
                <GraduationCap className="w-10 h-10" />
              </div>
              <div>
                <h1 className="font-bold text-2xl text-blue-800 tracking-tight leading-none">SkillSwap</h1>
                <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase font-bold mt-1.5">Campus Sandbox Protocol</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50/45 p-4 rounded-2xl text-left border border-blue-50 space-y-2">
                <p className="text-xs font-semibold text-blue-900 flex items-center gap-1.5 leading-none">
                  <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
                  <span>Sandbox Auth Profile Ready</span>
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <img src={initialUserProfile.avatar} alt="Jordan" className="w-10 h-10 rounded-full border border-gray-200 object-cover" />
                  <div>
                    <h3 className="font-bold text-xs text-gray-800 leading-none">{initialUserProfile.name}</h3>
                    <p className="text-[10px] text-gray-400 font-medium mt-1">{initialUserProfile.university}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <button 
                  type="button"
                  onClick={handleLoginAsJordan}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-blue-200 cursor-pointer flex items-center justify-center gap-2 transition-transform duration-150 active:scale-95"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Login with Institutional ID</span>
                </button>

                <button 
                  type="button"
                  onClick={handleResetSandbox}
                  className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-bold text-sm cursor-pointer flex items-center justify-center gap-1.5"
                  title="Clear storage cache records"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Reset Sandbox state</span>
                </button>
              </div>
            </div>

            <div className="text-[10px] text-gray-400">
              Payments are escrow protected. Peer to peer institutional credentials verified.
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Top fixed bar */}
          <Header 
            onTabChange={setActiveTab} 
            activeTab={activeTab} 
            unreadMessagesCount={unreadMessagesCount}
            activeOrdersCount={activeOrdersCount}
          />

          {/* Main workspace with top offset */}
          <main className="pt-24 pb-24 md:pb-12 px-4 max-w-7xl mx-auto">
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
          <Navbar 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            unreadMessagesCount={unreadMessagesCount}
          />

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
