import { useState, useCallback, type MouseEvent } from 'react';
import { motion } from 'motion/react';
import { Sparkles, GraduationCap, RefreshCw, KeyRound, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';

interface ParallaxLandingProps {
  userProfile: UserProfile;
  onLogin: () => void;
  onReset: () => void;
}

export default function ParallaxLanding({ userProfile, onLogin, onReset }: ParallaxLandingProps) {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePos({ x: 0.5, y: 0.5 });
  }, []);

  const layer = (depth: number) => ({
    x: (mousePos.x - 0.5) * depth,
    y: (mousePos.y - 0.5) * depth,
  });

  const cardTilt = {
    x: (mousePos.x - 0.5) * 20,
    y: (mousePos.y - 0.5) * -20,
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#1A1A1A]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Grid backdrop */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,62,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,62,0,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Layer 3 - Deepest gradient orbs */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
        animate={{
          x: layer(100).x,
          y: layer(100).y,
        }}
        transition={{ type: 'spring', stiffness: 50, damping: 30 }}
        style={{
          background:
            'radial-gradient(circle, rgba(255,62,0,0.08) 0%, transparent 70%)',
          top: '5%',
          left: '15%',
        }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
        animate={{
          x: -layer(80).x,
          y: -layer(80).y,
        }}
        transition={{ type: 'spring', stiffness: 50, damping: 30 }}
        style={{
          background:
            'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)',
          bottom: '10%',
          right: '15%',
        }}
      />

      {/* Layer 2 - Mid orbs */}
      <motion.div
        className="absolute w-[280px] h-[280px] rounded-full pointer-events-none"
        animate={{
          x: layer(60).x,
          y: layer(60).y,
        }}
        transition={{ type: 'spring', stiffness: 80, damping: 25 }}
        style={{
          background:
            'radial-gradient(circle, rgba(255,62,0,0.12) 0%, transparent 70%)',
          top: '30%',
          right: '25%',
        }}
      />
      <motion.div
        className="absolute w-[200px] h-[200px] rounded-full pointer-events-none"
        animate={{
          x: -layer(50).x,
          y: -layer(50).y,
        }}
        transition={{ type: 'spring', stiffness: 80, damping: 25 }}
        style={{
          background:
            'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)',
          bottom: '20%',
          left: '10%',
        }}
      />

      {/* Layer 1 - Nearest orbs */}
      <motion.div
        className="absolute w-[150px] h-[150px] rounded-full pointer-events-none"
        animate={{
          x: layer(30).x,
          y: layer(30).y,
        }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        style={{
          background:
            'radial-gradient(circle, rgba(255,62,0,0.15) 0%, transparent 70%)',
          top: '15%',
          left: '8%',
        }}
      />

      {/* Floating decorative icons */}
      <motion.div
        className="absolute top-[12%] right-[12%] pointer-events-none text-white/[0.04]"
        animate={{
          x: -layer(40).x,
          y: -layer(40).y,
          rotate: 360,
        }}
        transition={{ rotate: { duration: 30, repeat: Infinity, ease: 'linear' }, default: { type: 'spring', stiffness: 100, damping: 20 } }}
      >
        <GraduationCap className="w-28 h-28" />
      </motion.div>
      <motion.div
        className="absolute bottom-[18%] right-[8%] pointer-events-none text-white/[0.04]"
        animate={{
          x: layer(35).x,
          y: layer(35).y,
          rotate: -360,
        }}
        transition={{ rotate: { duration: 25, repeat: Infinity, ease: 'linear' }, default: { type: 'spring', stiffness: 100, damping: 20 } }}
      >
        <Sparkles className="w-20 h-20" />
      </motion.div>
      <motion.div
        className="absolute top-[40%] left-[5%] pointer-events-none text-white/[0.03]"
        animate={{
          x: layer(45).x,
          y: layer(45).y,
        }}
        transition={{ type: 'spring', stiffness: 90, damping: 22 }}
      >
        <ShieldCheck className="w-16 h-16" />
      </motion.div>

      {/* Login card with 3D tilt */}
      <motion.div
        className="relative w-full max-w-sm"
        style={{ perspective: 1000 }}
        animate={{
          rotateX: cardTilt.y,
          rotateY: cardTilt.x,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      >
        <motion.div
          className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20 text-center space-y-6"
          style={{ transformStyle: 'preserve-3d' }}
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div style={{ transform: 'translateZ(32px)' }}>
            <div className="flex flex-col items-center space-y-2.5">
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200/50"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <GraduationCap className="w-10 h-10" />
              </motion.div>
              <div>
                <h1 className="font-bold text-2xl text-blue-800 tracking-tight leading-none">Campus Skill</h1>
                <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase font-bold mt-1.5">
                  Protokol Sandbox Kampus
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div style={{ transform: 'translateZ(40px)' }} className="space-y-4">
            <motion.div
              className="bg-blue-50/70 backdrop-blur-sm p-4 rounded-2xl text-left border border-blue-100 space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
            >
              <p className="text-xs font-semibold text-blue-900 flex items-center gap-1.5 leading-none">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Profil Auth Sandbox Siap</span>
              </p>
              <div className="flex items-center gap-3 pt-1">
                <img
                  src={userProfile.avatar}
                  alt="Jordan"
                  className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                />
                <div>
                  <h3 className="font-bold text-xs text-gray-800 leading-none">{userProfile.name}</h3>
                  <p className="text-[10px] text-gray-400 font-medium mt-1">{userProfile.university}</p>
                </div>
              </div>
            </motion.div>

            <div className="space-y-2">
              <motion.button
                type="button"
                onClick={onLogin}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-blue-200 cursor-pointer flex items-center justify-center gap-2 transition-transform duration-150 active:scale-95"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <KeyRound className="w-4 h-4" />
                <span>Masuk dengan ID Institusi</span>
              </motion.button>

              <motion.button
                type="button"
                onClick={onReset}
                className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-bold text-sm cursor-pointer flex items-center justify-center gap-1.5"
                title="Hapus cache penyimpanan"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset Status Sandbox</span>
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            style={{ transform: 'translateZ(20px)' }}
            className="text-[10px] text-gray-400 flex items-center justify-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.7 }}
          >
            <ShieldCheck className="w-3 h-3" />
            Pembayaran dilindungi escrow. Kredensial institusi peer-to-peer terverifikasi.
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF3E00]/30 to-transparent" />
    </div>
  );
}
