/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile, Service, Order, ChatThread } from './types';

export const initialUserProfile: UserProfile = {
  name: 'Jordan Smith',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0f-CwmEe-drZtPOdLjuC8Ea1yj4XZS6XpO6AICIBGDWqFQcgmTrCMnwj302RparN7l9Xq-JmeyEq-8Dn2dUtZ2H2WO5jr9MI6_213pVFZZDhuvqzMLgKHLXaRJGQFrztmUFRDasBUyU07Bivlhv40SNaFLG7b0HNCkYTVeCJlrlpFJXt92_Z4fYR9Keknsifczz_jQnmTqIuIaWXJb-J180E33E9NFIO7ZR8O_BrD5tFDMqDdTRaVPjd5fhk7fmF7zE2-S8nw5Q',
  university: 'Universitas Teknologi',
  isVerified: true,
  servicesSold: 24,
  rating: 4.9,
  earnings: 1200,
  balance: 145.50,
  bio: 'Mahasiswa Ilmu Komputer tingkat akhir yang menguasai frontend engineering dan UI/UX design. Siap membantu teman sekelas dengan pengembangan React dan purwarupa desain!',
  role: 'penyedia_jasa',
  ktmPhoto: ''
};

export const initialServices: Service[] = [
  {
    id: 'srv-1',
    title: 'Pengembangan React Native',
    category: 'Pemrograman',
    rating: 4.9,
    price: 20,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCl8lAblvCfFMdiGf7V8aR5eydkK3HDTSrAEvXZ4wbI9KV-_Y4iR6tw7Xx1El9XzLzGoIvzwawuT0pALf0m0sPGhMQ0eeHoylbiIKugDR3yis9jCO-RJteXb-6UwZVTcR4tI6ozWYgN4u6iaHlNiJmq9T4zqhPutSiLA2SnUT0qo_v4E1l0jzP0pDyASohl-jbS7leFTkGe0Z2tbfOhjyJAvvL9XaS14kL9pswFmdtmbzHfSIpBPfj3DxaBFlu6XVoOdlnGyPiaYw',
    description: 'Saya akan membangun aplikasi mobile responsif dan berperforma tinggi menggunakan React Native untuk iOS dan Android. Berpengalaman dalam state management, integrasi peta, dan animasi kustom.',
    seller: {
      name: 'Alex, Senior Ilmu Komputer',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150',
      level: 'Senior, Ilmu Komputer'
    }
  },
  {
    id: 'srv-2',
    title: 'Edit Esai Akademik',
    category: 'Menulis',
    rating: 5.0,
    price: 15,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJGUuvg6wz0YnVYrkyyjIYsaAdHbPoEcDsW86pB-Nre8AsI_lL2g0NQ8jktRy8ii0U7vd2ShZVEJoIVFMCYnM2FPeUq6d06CMAnYdmyodsJLUsTerZNdBr6o1ik36vYWU_JNCaJdEGF5STNLGTHVK7BgFwLL6sTXUwJaj0aN2aEctU9ca633CCHhsom9PcTzPpyAkc4nSrkCORin0dd6BxWBI8amhpEqrWHQliA4GvB3lHyQnuTYDfGfEpTNojwduqXPxK9T_gKg',
    description: 'Proofreading dan editing presisi tinggi untuk makalah akademik, esai sastra, dan deklarasi tesis. Fokus pada struktur, format, tata bahasa, dan artikulasi ilmiah.',
    seller: {
      name: 'Maya, Master Sastra',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      level: 'Kandidat Master, Sastra'
    }
  },
  {
    id: 'srv-3',
    title: 'Identitas Merek UI/UX',
    category: 'Desain',
    rating: 4.8,
    price: 35,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAs3xLHLph7rXm2KEZYLnlMQnJNfpZhAsZsNmmauK3uAprHpPq-rOJ8ChSygQ7axoErzO63EDLqiTz4QrphwOGszQGT8KY9wFrNDOmX5zEQ69NpfNB-lSQo3HikHdHD8QDkxFwBAvzNCaf5RpOc8Q9M9BQ813xVD3tZPAAMKiLbHdhAOJ64HLeyNfJSY8yIUWeHkZkrN64b6M1yQUUdL4IGSuUXOEP5glPzvZ3uZCQEvQYDtm7I95jz7Ub8Gv6Li4RotTkSZeD32w',
    description: 'Buat representasi Figma berkualitas tinggi untuk aplikasi web atau mobile Anda. Termasuk pemetaan alur pengguna lengkap, pustaka komponen, dan sistem tipografi/warna.',
    seller: {
      name: 'Jordan, Desain Junior',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0f-CwmEe-drZtPOdLjuC8Ea1yj4XZS6XpO6AICIBGDWqFQcgmTrCMnwj302RparN7l9Xq-JmeyEq-8Dn2dUtZ2H2WO5jr9MI6_213pVFZZDhuvqzMLgKHLXaRJGQFrztmUFRDasBUyU07Bivlhv40SNaFLG7b0HNCkYTVeCJlrlpFJXt92_Z4fYR9Keknsifczz_jQnmTqIuIaWXJb-J180E33E9NFIO7ZR8O_BrD5tFDMqDdTRaVPjd5fhk7fmF7zE2-S8nw5Q',
      level: 'Junior, Sistem Desain'
    }
  },
  {
    id: 'srv-4',
    title: 'Bimbingan Kalkulus & Statistik',
    category: 'Bimbingan',
    rating: 4.7,
    price: 25,
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600',
    description: 'Kesulitan dengan integral, turunan, model probabilitas, atau uji hipotesis? Saya memberikan panduan langkah demi langkah, contoh soal UTS, dan pemecahan masalah langsung.',
    seller: {
      name: 'David, Jago Matematika',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      level: 'Senior, Matematika Terapan'
    }
  }
];

export const initialOrders: Order[] = [
  {
    id: 'ord-1',
    serviceId: 'srv-x1',
    serviceTitle: 'Bimbingan Kalkulus Tingkat Lanjut',
    serviceImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrK84NYYTscN5AWet1wIO1qAcyIlssua8VOtKpR-QwrUv8MgmV_fLk0W492CZ6UIhk4DJXmmquQFtD0FxIGQz9vWgEfrgQ_1eQDwLm9HqgqMbZuSVffZIUHaWx4KnGz7QaRfeNIjOQ2RHAO_42mY28ZVef4rvRhPcCO7ibd6VwHVFTjZrPVOeKc2x2QJtFNZ214JCHyuC96G5oIdWWSgd0cMqsD7Mlq1tz_0BWAJj7mjaV0cJIq3Iudtn32mYJbAI32QWSnkZgJg',
    sellerName: 'David, Jago Matematika',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    ratingText: '4.9 Rating Instruktur',
    status: 'Sedang Berjalan',
    price: 45.00,
    dateValue: '24 Okt 2023',
    dateLabel: 'Tanggal Pengiriman',
    category: 'Bimbingan',
    chatThreadId: 'th-1' // We will link to a thread
  },
  {
    id: 'ord-2',
    serviceId: 'srv-1',
    serviceTitle: 'Skrip Python untuk Analisis Data',
    serviceImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=300',
    sellerName: 'Sarah Jenkins',
    sellerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANGzPoOPiO3cjrw2lWQ_9N9r_eNZwkHv8sH5Kc9gGof0SYpL7z-W_uDeM0NfVBYePX397tsszzAYzMuhsOZ3II2OaVbJlArp8dU02WKOrjyycxEJgc47dF0klRkWTh_Yaunn_wj-7ERsZcx4OnwVplh-Jpu1FYUlQVoPOApf3QE9iW7T1VpCYKbYVhmDoEJe_fnAu2aDePH4y0a-lbb-l3KIuPWCs_ECAV0CiVRsxEHc9S_3rSjZIYlv1xkW72GIxEBc3jadPp1A',
    ratingText: '5.0 Level Ahli',
    status: 'Menunggu Review',
    price: 120.00,
    dateValue: 'Hari Ini, 10:30',
    dateLabel: 'Dikirim Pada',
    category: 'Pemrograman',
    chatThreadId: 'th-1'
  },
  {
    id: 'ord-3',
    serviceId: 'srv-x3',
    serviceTitle: 'Terjemahan Esai Bahasa Spanyol',
    serviceImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxOxNyMRKU_YiVtjNzIV7PgZSAtYpzNX_RVaJPsfk5EJlPR7gIJ1jFBiyMN15pE9SQAfjR71PNtzY5uXGU30nwkyuMMKRtWuajNruyvaHpu3qtotPSLD1lNZQZ6x8v5FgClF1o0LGLuMlsdKoCtppDMjjBvXJTRAGTIvDcM4u2cit9YrsfXEZ1cRwlWnMPQZ3wfgfdcREJ8ioN0BvtFa7uaEzXGuoAP3cFTwUHWf0Bqit7HX_lehvTPIDRF7oauqZrF4O8y3epRg',
    sellerName: 'Miguel, Tutor Bahasa',
    sellerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    ratingText: '4.7 Penutur Asli',
    status: 'Menunggu Konfirmasi',
    price: 25.00,
    dateValue: '26 Okt 2023',
    dateLabel: 'Estimasi Selesai',
    category: 'Bahasa',
    chatThreadId: 'th-3'
  },
  {
    id: 'ord-4',
    serviceId: 'srv-x4',
    serviceTitle: 'Bantuan PR Statistik',
    serviceImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCs8iN44c5YhPP8jjGRgetixxyGTtl124790goF8Q9gDAjEaoMuUOX_GT5o8iIFe90awljYjXW2FzjOb47JSI_7dM3_zj2oAv8U4559NF1hYK6hWfApbsruEP8_8rB7rU1zu4yBU8LhNTnqavxq6ptw9OnDqbVln0cfGjzt15Y-F-CaQ5dU-wgCWJ2FHeWN8Mdt0NEp1fv8dUxTfZiXjDQFDbsKPCauUXeRDm5ZDNXNCFkKq5XnzCeNZbi8ko0x7UuZIynRa-wRxw',
    sellerName: 'Elena Rodriguez',
    sellerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsgoHCDC5jxBFeVuZbXCgSbk5CIRmB3HAM62J0db41bscMXQW5E4rXz28Lyq7wBclk2Qv8VJptei_uUANe8HFBq8Sa7TeoAo1c7UBK3uYxMGU8yY0rKBUUeEuIALnZRbu-luwgl3twX7Zp6Q26DAbYztr1EhgqKWKcLln7TbXaudUkpDIN9StF68w4idxrY62YxI1SngpvOdaP51VuYgjXklrSR84jsu8IkP-JMBvC2sPgEqT3VpKlSP8rVvdnC6YslBkQLfTenw',
    ratingText: 'Selesai 15 Okt',
    status: 'Selesai',
    price: 30.00,
    dateValue: '15 Okt 2023',
    dateLabel: 'Selesai Pada',
    category: 'Bimbingan',
    chatThreadId: 'th-3'
  }
];

export const initialChatThreads: ChatThread[] = [
  {
    id: 'th-1',
    participantName: 'Sarah Jenkins',
    participantAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANGzPoOPiO3cjrw2lWQ_9N9r_eNZwkHv8sH5Kc9gGof0SYpL7z-W_uDeM0NfVBYePX397tsszzAYzMuhsOZ3II2OaVbJlArp8dU02WKOrjyycxEJgc47dF0klRkWTh_Yaunn_wj-7ERsZcx4OnwVplh-Jpu1FYUlQVoPOApf3QE9iW7T1VpCYKbYVhmDoEJe_fnAu2aDePH4y0a-lbb-l3KIuPWCs_ECAV0CiVRsxEHc9S_3rSjZIYlv1xkW72GIxEBc3jadPp1A',
    participantStatus: 'Online',
    lastMessage: 'Bisa ketemu di perpustakaan untuk diskusi project Python?',
    lastMessageTime: '12m',
    unread: true,
    messages: [
      {
        id: 'msg-1',
        sender: 'other',
        text: "Hai! Saya lihat portofolio Anda di halaman eksplorasi Campus Skill. Keahlian Python Anda sangat saya butuhkan untuk tugas data sains saya.",
        timestamp: '12:35'
      },
      {
        id: 'msg-2',
        sender: 'user',
        text: 'Hai Sarah! Terima kasih sudah menghubungi. Saya ingin membantu. Topik spesifik apa yang sedang Anda pelajari?',
        timestamp: '12:40'
      },
      {
        id: 'msg-3',
        sender: 'other',
        text: 'Utamanya dataframe Pandas dan visualisasi dengan Seaborn. Bisa ketemu di perpustakaan untuk diskusi project Python? Saya free jam 4 sore.',
        timestamp: '12:45'
      }
    ]
  },
  {
    id: 'th-2',
    participantName: 'David Lee',
    participantAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgK2pHNYgxUoX3dMpYCM6cRPbC2wCbN1UrgxHHvFfdNoZsYnrwXF1DzS417px33DVzjq5an1WTgzziL0JQ-xL4cDyuxS6ZNOps4Wta6xvPjJk-AP2oSoJgqIIczc2YZu3k4kkWsXLiro1s70TTlV764J5vNSevyLp9DMnMi_NamXd02Npdd8JwdZEn3wThKTGOzvVH2hL5w-0cf_oNPeoW1IvFMTn0gZ2eEW_WWJBuOzJfWdFgNwzxOTydSUkWCu8jGhKjjX7QFQ',
    participantStatus: 'Offline',
    lastMessage: 'Terima kasih untuk masukannya pada desain UI saya!',
    lastMessageTime: '2j',
    unread: false,
    messages: [
      {
        id: 'msg-20',
        sender: 'user',
        text: 'Hei David, sudah lihat komponen UI baru dan pilihan tipografinya?',
        timestamp: '9:15'
      },
      {
        id: 'msg-21',
        sender: 'other',
        text: 'Terima kasih untuk masukannya pada desain UI saya! Hasilnya terlihat sangat rapi. Saya sudah mengintegrasikan container-queries Tailwind seperti yang Anda sarankan.',
        timestamp: '10:00'
      }
    ]
  },
  {
    id: 'th-3',
    participantName: 'Elena Rodriguez',
    participantAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsgoHCDC5jxBFeVuZbXCgSbk5CIRmB3HAM62J0db41bscMXQW5E4rXz28Lyq7wBclk2Qv8VJptei_uUANe8HFBq8Sa7TeoAo1c7UBK3uYxMGU8yY0rKBUUeEuIALnZRbu-luwgl3twX7Zp6Q26DAbYztr1EhgqKWKcLln7TbXaudUkpDIN9StF68w4idxrY62YxI1SngpvOdaP51VuYgjXklrSR84jsu8IkP-JMBvC2sPgEqT3VpKlSP8rVvdnC6YslBkQLfTenw',
    participantStatus: 'Online',
    lastMessage: 'Sesi untuk Makroekonomi sangat membantu.',
    lastMessageTime: '1h',
    unread: false,
    messages: [
      {
        id: 'msg-30',
        sender: 'user',
        text: 'Hai Elena, bagaimana perkembangan panduan belajar ekonominya?',
        timestamp: 'Kemarin'
      },
      {
        id: 'msg-31',
        sender: 'other',
        text: 'Hampir selesai. Sesi untuk Makroekonomi sangat membantu. Saya merasa siap untuk ujian tengah semester sekarang.',
        timestamp: 'Kemarin'
      }
    ]
  },
  {
    id: 'th-4',
    participantName: 'Marcus Thorne',
    participantAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBplkCtimsTWrkSe7fAB2jazzsjF2uaLjRrc7HSCkHyw3LiJTUUXecp5DRlUiXl3nyEDPdO_CZYFBN8iPoYvwX5fI6bpUv9gpwxZ6PUYYjDrnc0FdJm6yKh1tPODseLYCL2qCH_A9DfsBrhnqyhasNrbo-ByKmP6puM5dByXHU5K-y_S3Bq7ztpAtgDLvL55X3n1rTnQD50m9xZ0O4xrbPnGXML8D57KM_XPVkNP7U5cz4e8E_2KuN5hSJ76txmJDC5fOMPJ3Z0Lg',
    participantStatus: 'Offline',
    lastMessage: 'Saya sudah mengirim kontrak untuk rangkaian bimbingan.',
    lastMessageTime: '3h',
    unread: false,
    messages: [
      {
        id: 'msg-40',
        sender: 'user',
        text: 'Bisa jelaskan topik mingguan untuk bimbingan kimia?',
        timestamp: '3 hari lalu'
      },
      {
        id: 'msg-41',
        sender: 'other',
        text: 'Tentu! Saya sudah mengirim kontrak untuk rangkaian bimbingan, termasuk detail kurikulum dan undangan kalender. Saya tunggu!',
        timestamp: '3 hari lalu'
      }
    ]
  }
];
