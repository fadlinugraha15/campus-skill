/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'penyedia_jasa' | 'pelanggan';

export interface UserProfile {
  name: string;
  avatar: string;
  university: string;
  isVerified: boolean;
  servicesSold: number;
  rating: number;
  earnings: number;
  balance: number;
  bio?: string;
  role?: UserRole;
  ktmPhoto?: string;
}

export type ServiceCategory = 'Semua' | 'Pemrograman' | 'Menulis' | 'Desain' | 'Bimbingan' | 'Bisnis' | 'Bahasa';

export interface Service {
  id: string;
  title: string;
  category: ServiceCategory;
  rating: number;
  image: string;
  price: number;
  description: string;
  seller: {
    name: string;
    avatar: string;
    level: string;
  };
}

export type OrderStatus = 'Sedang Berjalan' | 'Menunggu Review' | 'Menunggu Konfirmasi' | 'Selesai';

export interface Order {
  id: string;
  serviceId: string;
  serviceTitle: string;
  serviceImage: string;
  sellerName: string;
  sellerAvatar: string;
  ratingText: string;
  status: OrderStatus;
  price: number;
  dateLabel: string; // e.g., "Oct 24, 2023"
  dateValue: string; // e.g., "Oct 24, 2023"
  category: string;
  chatThreadId: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'other';
  text: string;
  timestamp: string; // e.g., "12:45 PM"
}

export interface ChatThread {
  id: string;
  participantName: string;
  participantAvatar: string;
  participantStatus: 'Online' | 'Offline';
  lastMessage: string;
  lastMessageTime: string; // e.g., "12m"
  unread: boolean;
  messages: ChatMessage[];
}
