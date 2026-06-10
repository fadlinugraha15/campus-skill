/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
}

export type ServiceCategory = 'All' | 'Coding' | 'Writing' | 'Design' | 'Tutoring' | 'Business' | 'Language';

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

export type OrderStatus = 'In Progress' | 'Awaiting Review' | 'Pending Confirmation' | 'Completed';

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
