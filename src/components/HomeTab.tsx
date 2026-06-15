import { useState, useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Search, ArrowRight, Plus } from 'lucide-react';
import { Service, ServiceCategory } from '../types';
import ServiceCard from './ServiceCard';

interface HomeTabProps {
  services: Service[];
  onServiceSelect: (service: Service) => void;
  onOpenCreateServiceModal: () => void;
}

function ParallaxSection({ children, className = '', offset = 50 }: { children: ReactNode; className?: string; offset?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

function FadeInView({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function HomeTab({ services, onServiceSelect, onOpenCreateServiceModal }: HomeTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('All');

  const categories: ServiceCategory[] = ['Semua', 'Pemrograman', 'Menulis', 'Desain', 'Bimbingan', 'Bisnis', 'Bahasa'];

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          service.seller.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-12 animate-fadeIn pb-12">
      {/* Search Section */}
      <FadeInView>
        <ParallaxSection offset={30}>
          <section className="mt-4 relative">
            <span className="absolute -top-12 right-2 text-[60px] md:text-[80px] font-serif italic text-[#1A1A1A]/5 leading-none select-none pointer-events-none">01 // Cari</span>
            <div className="relative group z-10">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500">
                <Search className="w-5 h-5 text-[#1A1A1A]" />
              </div>
              <motion.input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari pemrograman, desain, atau bimbingan..."
                className="w-full h-14 pl-12 pr-4 bg-white border-2 border-[#1A1A1A] focus:border-[#FF3E00] focus:shadow-[4px_4px_0px_#1A1A1A] outline-none text-xs font-mono text-[#1A1A1A] transition-all duration-300 uppercase tracking-wider placeholder-[#1A1A1A]/40"
                whileFocus={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              />
            </div>
          </section>
        </ParallaxSection>
      </FadeInView>

      {/* Categories */}
      <FadeInView delay={0.1}>
        <ParallaxSection offset={20}>
          <section className="-mx-4 px-4 overflow-x-auto no-scrollbar scroll-smooth">
            <div className="flex gap-2 whitespace-nowrap pb-2">
              {categories.map((cat, i) => (
                <motion.button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-none font-bold text-xs font-mono uppercase tracking-widest border-2 border-[#1A1A1A] transition-all duration-250 cursor-pointer ${selectedCategory === cat ? 'bg-[#FF3E00] text-white shadow-[2px_2px_0px_#1A1A1A]' : 'bg-white hover:bg-gray-100 text-[#1A1A1A]'}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  {cat}
                </motion.button>
              ))}
            </div>
          </section>
        </ParallaxSection>
      </FadeInView>

      {/* Service Grid */}
      <div className="relative pt-6">
        <FadeInView delay={0.15}>
          <span className="absolute -top-8 right-2 text-[60px] md:text-[80px] font-serif italic text-[#1A1A1A]/5 leading-none select-none pointer-events-none font-bold">02 // KOLEKSI</span>
          <div className="flex justify-between items-end mb-6 border-b-2 border-[#1A1A1A] pb-3">
            <div>
              <h2 className="font-extrabold text-[#1A1A1A] text-lg uppercase tracking-wider">Layanan Teratas</h2>
              <p className="text-[10px] font-mono text-[#1A1A1A]/60 mt-0.5 uppercase tracking-widest">Rekomendasi dari koordinator teman sekelas</p>
            </div>
            {filteredServices.length > 0 && (
              <motion.button
                type="button"
                onClick={() => { setSearchQuery(''); setSelectedCategory('Semua'); }}
                className="text-[#FF3E00] hover:text-[#1A1A1A] font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
                whileHover={{ x: 3 }}
              >
                <span>Lihat Semua</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </div>
        </FadeInView>

        {filteredServices.length === 0 ? (
          <motion.div
            className="text-center py-16 bg-white border-2 border-[#1A1A1A] p-8 flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="w-16 h-16 bg-white border-2 border-[#1A1A1A] flex items-center justify-center text-[#1A1A1A] mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-[#1A1A1A] text-xs font-mono uppercase tracking-widest">Layanan tidak ditemukan</h3>
            <p className="text-[#1A1A1A]/70 text-xs max-w-sm mt-1 leading-normal uppercase">
              Tidak dapat mencocokkan &quot;{searchQuery}&quot; di kategori &quot;{selectedCategory}&quot; dalam listing teman sekelas. Coba perluas kata kunci Anda!
            </p>
            <motion.button
              type="button"
              onClick={() => { setSearchQuery(''); setSelectedCategory('Semua'); }}
              className="mt-6 px-6 py-3 bg-[#FF3E00] text-white border-2 border-[#1A1A1A] font-mono font-bold text-xs uppercase tracking-wider shadow-[2px_2px_0px_#1A1A1A]"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Hapus Filter
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4 }}
              >
                <ServiceCard
                  service={service}
                  onClick={() => onServiceSelect(service)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Monetize Banner */}
      <FadeInView delay={0.2}>
        <ParallaxSection offset={40}>
          <section className="bg-white border-2 border-[#1A1A1A] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 overflow-hidden relative shadow-[4px_4px_0px_#1A1A1A] transition-all duration-300">
            <span className="absolute -bottom-8 -left-5 text-[150px] font-serif italic text-[#1A1A1A]/5 leading-none select-none pointer-events-none">03</span>
            <div className="flex-1 z-10 text-left">
              <motion.span
                className="text-[10px] uppercase font-bold text-[#FF3E00] mb-2 block tracking-widest font-mono"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Program Layanan
              </motion.span>
              <h2 className="font-extrabold text-2xl text-[#1A1A1A] mb-2 tracking-tight uppercase">Monetisasi Skill-mu</h2>
              <p className="text-xs text-[#1A1A1A]/80 mb-6 max-w-md leading-relaxed uppercase tracking-tight">
                Bergabunglah dengan ratusan rekan studio tech yang menghasilkan penghasilan tambahan dengan membantu teman sekelas dalam pemrograman, penulisan, dan spesifikasi desain.
              </p>
              <motion.button
                type="button"
                onClick={onOpenCreateServiceModal}
                className="px-8 py-4 bg-[#FF3E00] text-white cursor-pointer hover:bg-[#1A1A1A] font-mono font-bold text-xs uppercase tracking-[0.2em] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]"
                whileHover={{ scale: 1.03, x: 2 }}
                whileTap={{ scale: 0.97 }}
              >
                Mulai Jual // Studio Terdaftar
              </motion.button>
            </div>

            <div className="relative w-full md:w-1/2 h-52 bg-[#1A1A1A] border-2 border-[#1A1A1A] overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF3E00] to-black opacity-30 z-10 pointer-events-none" />
              <motion.img
                alt="Pertukaran skill mahasiswa"
                className="w-full h-full object-cover filter grayscale"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3E00EszV4DO4H_201bKP3d9vVVg1z7hxcN9FVoMeYZvM0SfKs5hN2QhfOP38VDoGCf7PLSpoZocG9bJmwySiEw9iuc4vi-eKq98i83kJ-BF_X0ZhFOy_b_YYACxFw-BpOLPeNRtTwg11JP_2vxQpMxMa8wA8OlObizcbJt1nhDoHxpzuy89RkHsxWCJFjzZ-UjBAnY8uwSqO_1sYTR9WbILWPz8iDcoHS2_sK7yPLgg9Htn_2kQVpKVCCU0h4dqZeQ9uK50c1Ww"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </section>
        </ParallaxSection>
      </FadeInView>

      {/* Mobile FAB */}
      <motion.button
        type="button"
        onClick={onOpenCreateServiceModal}
        className="fixed bottom-24 right-5 w-14 h-14 bg-[#FF3E00] text-white border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] flex items-center justify-center md:hidden z-40 cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ y: [0, -4, 0] }}
        transition={{ y: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }}
        title="Buat Layanan"
      >
        <Plus className="w-8 h-8 text-white" />
      </motion.button>
    </div>
  );
}
