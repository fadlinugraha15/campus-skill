import { useState, useCallback, type MouseEvent, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { Sparkles, GraduationCap, KeyRound, ShieldCheck, Mail, Lock, User, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface AuthPageProps {
  userProfile: UserProfile;
  onLogin: (name: string) => void;
  onReset: () => void;
}

interface StoredUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  ktmPhoto?: string;
}

export default function AuthPage({ userProfile, onLogin, onReset }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [regRole, setRegRole] = useState<UserRole>('pelanggan');
  const [regKtmPhoto, setRegKtmPhoto] = useState<string>('');
  const [regError, setRegError] = useState('');

  // OTP verification
  const [regStep, setRegStep] = useState<'form' | 'otp'>('form');
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [pendingRegData, setPendingRegData] = useState<StoredUser | null>(null);

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
    x: (mousePos.x - 0.5) * 24,
    y: (mousePos.y - 0.5) * -24,
  };

  const getStoredUsers = (): StoredUser[] => {
    try {
      return JSON.parse(localStorage.getItem('campusskill_users') || '[]');
    } catch {
      return [];
    }
  };

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail || !loginPassword) {
      setLoginError('Harap isi semua field');
      return;
    }

    const users = getStoredUsers();
    const user = users.find(u => u.email === loginEmail && u.password === loginPassword);

    if (user) {
      onLogin(user.name);
    } else {
      setLoginError('Email atau password salah');
    }
  };

  const handleRegisterSubmit = (e: FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regName || !regEmail || !regPassword || !regConfirmPassword) {
      setRegError('Harap isi semua field');
      return;
    }

    if (regRole === 'penyedia_jasa' && !regKtmPhoto) {
      setRegError('Harap upload foto KTM');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Password tidak cocok');
      return;
    }

    if (regPassword.length < 6) {
      setRegError('Password minimal 6 karakter');
      return;
    }

    const users = getStoredUsers();
    if (users.some(u => u.email === regEmail)) {
      setRegError('Email sudah terdaftar');
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setPendingRegData({ name: regName, email: regEmail, password: regPassword, role: regRole, ktmPhoto: regKtmPhoto });
    setOtpCode('');
    setOtpError('');
    setRegStep('otp');
  };

  const handleOtpVerify = () => {
    setOtpError('');
    if (otpCode.length !== 6) {
      setOtpError('Masukkan kode verifikasi 6 digit');
      return;
    }
    if (otpCode !== generatedOtp) {
      setOtpError('Kode verifikasi salah');
      return;
    }
    if (!pendingRegData) return;

    const users = getStoredUsers();
    localStorage.setItem('campusskill_users', JSON.stringify([...users, pendingRegData]));
    onLogin(pendingRegData.name);
  };

  const handleOtpResend = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpCode('');
    setOtpError('');
  };

  const handleBackToForm = () => {
    setRegStep('form');
    setOtpError('');
    setOtpCode('');
  };

  const handleQuickLogin = () => {
    onLogin('Jordan Smith');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#1A1A1A]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Grain noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />

      {/* Grid backdrop */}
      <motion.div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        animate={{ x: layer(8).x, y: layer(8).y }}
        transition={{ type: 'spring', stiffness: 40, damping: 30 }}
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,62,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,62,0,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Layer 6 - Deepest orbs */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
        animate={{ x: layer(120).x, y: layer(120).y }}
        transition={{ type: 'spring', stiffness: 30, damping: 30 }}
        style={{ background: 'radial-gradient(circle, rgba(255,62,0,0.06) 0%, transparent 70%)', top: '-10%', left: '5%' }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
        animate={{ x: -layer(100).x, y: -layer(100).y }}
        transition={{ type: 'spring', stiffness: 35, damping: 30 }}
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)', bottom: '-5%', right: '0%' }}
      />

      {/* Layer 5 - Mid-deep orbs */}
      <motion.div
        className="absolute w-[350px] h-[350px] rounded-full pointer-events-none"
        animate={{ x: layer(80).x, y: layer(80).y }}
        transition={{ type: 'spring', stiffness: 40, damping: 28 }}
        style={{ background: 'radial-gradient(circle, rgba(255,62,0,0.08) 0%, transparent 70%)', top: '20%', right: '10%' }}
      />
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full pointer-events-none"
        animate={{ x: -layer(70).x, y: -layer(70).y }}
        transition={{ type: 'spring', stiffness: 45, damping: 28 }}
        style={{ background: 'radial-gradient(circle, rgba(244,241,234,0.03) 0%, transparent 70%)', bottom: '15%', left: '8%' }}
      />

      {/* Layer 4 - Mid orbs */}
      <motion.div
        className="absolute w-[200px] h-[200px] rounded-full pointer-events-none"
        animate={{ x: layer(60).x, y: layer(60).y }}
        transition={{ type: 'spring', stiffness: 55, damping: 25 }}
        style={{ background: 'radial-gradient(circle, rgba(255,62,0,0.1) 0%, transparent 70%)', top: '8%', left: '30%' }}
      />
      <motion.div
        className="absolute w-[180px] h-[180px] rounded-full pointer-events-none"
        animate={{ x: -layer(50).x, y: -layer(50).y }}
        transition={{ type: 'spring', stiffness: 60, damping: 25 }}
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)', bottom: '30%', right: '20%' }}
      />

      {/* Layer 3 - Near orbs */}
      <motion.div
        className="absolute w-[120px] h-[120px] rounded-full pointer-events-none"
        animate={{ x: layer(40).x, y: layer(40).y }}
        transition={{ type: 'spring', stiffness: 70, damping: 22 }}
        style={{ background: 'radial-gradient(circle, rgba(255,62,0,0.15) 0%, transparent 70%)', top: '45%', left: '12%' }}
      />
      <motion.div
        className="absolute w-[100px] h-[100px] rounded-full pointer-events-none"
        animate={{ x: -layer(35).x, y: -layer(35).y }}
        transition={{ type: 'spring', stiffness: 75, damping: 22 }}
        style={{ background: 'radial-gradient(circle, rgba(244,241,234,0.04) 0%, transparent 70%)', bottom: '40%', right: '8%' }}
      />

      {/* Geometric floating shapes */}
      {/* Rotating diamond */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ top: '15%', left: '8%' }}
        animate={{
          x: layer(55).x,
          y: layer(55).y,
          rotate: 360,
        }}
        transition={{
          rotate: { duration: 40, repeat: Infinity, ease: 'linear' },
          default: { type: 'spring', stiffness: 50, damping: 25 },
        }}
      >
        <div className="w-16 h-16 border border-[#FF3E00]/20 rotate-45" />
      </motion.div>

      {/* Pulsing ring */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ bottom: '25%', right: '12%' }}
        animate={{
          x: layer(45).x,
          y: layer(45).y,
          scale: [1, 1.1, 1],
        }}
        transition={{
          scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          default: { type: 'spring', stiffness: 55, damping: 25 },
        }}
      >
        <div className="w-20 h-20 rounded-full border border-[#F4F1EA]/10" />
      </motion.div>

      {/* Small floating square */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ top: '60%', left: '5%' }}
        animate={{
          x: layer(35).x,
          y: layer(35).y,
          rotate: -360,
        }}
        transition={{
          rotate: { duration: 25, repeat: Infinity, ease: 'linear' },
          default: { type: 'spring', stiffness: 65, damping: 22 },
        }}
      >
        <div className="w-8 h-8 bg-[#FF3E00]/5 border border-[#FF3E00]/15" />
      </motion.div>

      {/* Large ring */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ top: '25%', right: '5%' }}
        animate={{
          x: layer(30).x,
          y: layer(30).y,
          scale: [1, 1.05, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          rotate: { duration: 60, repeat: Infinity, ease: 'linear' },
          scale: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
          default: { type: 'spring', stiffness: 50, damping: 25 },
        }}
      >
        <div className="w-32 h-32 rounded-full border border-[#FF3E00]/5" style={{ borderWidth: '1px' }} />
      </motion.div>

      {/* Floating icons */}
      <motion.div
        className="absolute top-[12%] right-[15%] pointer-events-none text-[#F4F1EA]/[0.03]"
        animate={{ x: -layer(50).x, y: -layer(50).y, rotate: 360 }}
        transition={{ rotate: { duration: 30, repeat: Infinity, ease: 'linear' }, default: { type: 'spring', stiffness: 80, damping: 20 } }}
      >
        <GraduationCap className="w-32 h-32" />
      </motion.div>
      <motion.div
        className="absolute bottom-[22%] right-[5%] pointer-events-none text-[#F4F1EA]/[0.03]"
        animate={{ x: layer(40).x, y: layer(40).y, rotate: -360 }}
        transition={{ rotate: { duration: 25, repeat: Infinity, ease: 'linear' }, default: { type: 'spring', stiffness: 85, damping: 20 } }}
      >
        <Sparkles className="w-24 h-24" />
      </motion.div>
      <motion.div
        className="absolute top-[35%] left-[4%] pointer-events-none text-[#F4F1EA]/[0.02]"
        animate={{ x: layer(45).x, y: layer(45).y }}
        transition={{ type: 'spring', stiffness: 75, damping: 22 }}
      >
        <ShieldCheck className="w-20 h-20" />
      </motion.div>

      {/* Auth card */}
      <motion.div
        className="relative w-full max-w-md"
        style={{ perspective: 1200 }}
        animate={{ rotateX: cardTilt.y, rotateY: cardTilt.x }}
        transition={{ type: 'spring', stiffness: 180, damping: 22 }}
      >
        <motion.div
          className="bg-[#F4F1EA] rounded-none p-6 md:p-8 shadow-[8px_8px_0px_#000000] border-2 border-[#1A1A1A]"
          style={{ transformStyle: 'preserve-3d' }}
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Logo */}
          <motion.div style={{ transform: 'translateZ(40px)' }} className="text-center mb-6">
            <motion.div
              className="w-16 h-16 bg-[#1A1A1A] flex items-center justify-center text-[#F4F1EA] mx-auto border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#FF3E00]"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <GraduationCap className="w-8 h-8" />
            </motion.div>
            <h1 className="font-extrabold text-2xl text-[#1A1A1A] tracking-tight mt-4 uppercase">Campus Skill</h1>
            <p className="text-[9px] text-[#1A1A1A]/50 font-mono tracking-[0.2em] uppercase font-bold mt-1">
              Protokol Sandbox Kampus
            </p>
            <div className="w-12 h-1 bg-[#FF3E00] mx-auto mt-3" />
          </motion.div>

          {/* Tab toggle */}
          <div className="flex mb-6 bg-white border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]" style={{ transform: 'translateZ(24px)' }}>
            <button
              type="button"
              onClick={() => { setMode('login'); setLoginError(''); setRegError(''); setRegStep('form'); setOtpCode(''); setOtpError(''); }}
              className={`flex-1 py-3 text-[10px] font-bold font-mono tracking-[0.15em] uppercase transition-all ${
                mode === 'login'
                  ? 'bg-[#1A1A1A] text-[#F4F1EA]'
                  : 'bg-white text-[#1A1A1A] hover:bg-gray-100'
              }`}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setLoginError(''); setRegError(''); setRegStep('form'); setOtpCode(''); setOtpError(''); }}
              className={`flex-1 py-3 text-[10px] font-bold font-mono tracking-[0.15em] uppercase transition-all ${
                mode === 'register'
                  ? 'bg-[#1A1A1A] text-[#F4F1EA]'
                  : 'bg-white text-[#1A1A1A] hover:bg-gray-100'
              }`}
            >
              Daftar
            </button>
          </div>

          <motion.div style={{ transform: 'translateZ(32px)' }} className="space-y-4">
            {mode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[9px] font-mono font-bold uppercase tracking-[0.15em] text-[#1A1A1A]/60 mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/40" />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      placeholder="contoh@email.com"
                      className="w-full pl-10 pr-3 py-3 bg-white border-2 border-[#1A1A1A] text-sm font-medium text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 focus:border-[#FF3E00] focus:shadow-[2px_2px_0px_#1A1A1A] focus:outline-none transition-all font-mono uppercase tracking-wide"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-mono font-bold uppercase tracking-[0.15em] text-[#1A1A1A]/60 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/40" />
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-3 bg-white border-2 border-[#1A1A1A] text-sm font-medium text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 focus:border-[#FF3E00] focus:shadow-[2px_2px_0px_#1A1A1A] focus:outline-none transition-all font-mono uppercase tracking-wide"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A1A1A]/40 hover:text-[#1A1A1A]"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {loginError && (
                  <p className="text-red-500 text-xs font-semibold text-center font-mono uppercase tracking-wide">{loginError}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#1A1A1A] hover:bg-[#FF3E00] text-[#F4F1EA] font-bold text-xs font-mono uppercase tracking-[0.15em] border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#000000] hover:shadow-[4px_4px_0px_#000000] cursor-pointer flex items-center justify-center gap-2 transition-all duration-150 active:scale-95"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Masuk</span>
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#1A1A1A]/20" />
                  </div>
                  <div className="relative flex justify-center text-[9px]">
                    <span className="bg-[#F4F1EA] px-3 text-[#1A1A1A]/40 font-mono font-bold uppercase tracking-[0.2em]">Atau</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleQuickLogin}
                  className="w-full py-3.5 bg-white hover:bg-gray-100 text-[#1A1A1A] font-bold text-xs font-mono uppercase tracking-[0.15em] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#000000] cursor-pointer flex items-center justify-center gap-2 transition-all duration-150 active:scale-95"
                >
                  <User className="w-4 h-4" />
                  <span>Demo sebagai Jordan Smith</span>
                </button>
              </form>
            ) : regStep === 'otp' ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-14 h-14 bg-[#1A1A1A] flex items-center justify-center mx-auto border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#FF3E00]">
                    <Mail className="w-7 h-7 text-[#F4F1EA]" />
                  </div>
                  <h3 className="font-extrabold text-lg text-[#1A1A1A] mt-3 uppercase tracking-tight">Verifikasi Email</h3>
                  <p className="text-[10px] text-[#1A1A1A]/60 mt-1 font-mono uppercase tracking-wide">
                    Kode verifikasi telah dikirim ke<br />
                    <span className="font-bold text-[#1A1A1A]">{regEmail}</span>
                  </p>
                </div>

                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={otpCode}
                  onChange={e => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full text-center text-2xl font-bold tracking-[0.3em] p-3 bg-white border-2 border-[#1A1A1A] text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 focus:border-[#FF3E00] focus:shadow-[2px_2px_0px_#1A1A1A] focus:outline-none transition-all font-mono"
                  placeholder="000000"
                  autoFocus
                />

                <div className="bg-[#1A1A1A] border-2 border-[#1A1A1A] p-3 text-center">
                  <p className="text-[9px] text-[#F4F1EA]/80 font-mono font-bold tracking-[0.15em] uppercase">
                    KODE VERIFIKASI: <span className="text-base tracking-[0.3em] text-[#FF3E00]">{generatedOtp}</span>
                  </p>
                  <p className="text-[8px] text-[#F4F1EA]/40 mt-1 font-mono">(Demo - kode akan dikirim ke email di production)</p>
                </div>

                {otpError && (
                  <p className="text-red-500 text-xs font-semibold text-center font-mono uppercase tracking-wide">{otpError}</p>
                )}

                <button
                  type="button"
                  onClick={handleOtpVerify}
                  className="w-full py-3.5 bg-[#1A1A1A] hover:bg-[#FF3E00] text-[#F4F1EA] font-bold text-xs font-mono uppercase tracking-[0.15em] border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#000000] cursor-pointer flex items-center justify-center gap-2 transition-all duration-150 active:scale-95"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verifikasi & Daftar</span>
                </button>

                <button
                  type="button"
                  onClick={handleOtpResend}
                  className="w-full py-2 text-[10px] text-[#FF3E00] hover:text-[#1A1A1A] font-bold font-mono uppercase tracking-wider cursor-pointer"
                >
                  Kirim ulang kode
                </button>

                <button
                  type="button"
                  onClick={handleBackToForm}
                  className="w-full py-2 text-[10px] text-[#1A1A1A]/50 hover:text-[#1A1A1A] font-bold font-mono uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Kembali ke form pendaftaran
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                {/* Role Selection */}
                <div>
                  <label className="block text-[9px] font-mono font-bold uppercase tracking-[0.15em] text-[#1A1A1A]/60 mb-2">
                    Saya ingin mendaftar sebagai
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRegRole('pelanggan')}
                      className={`p-3 border-2 text-center transition-all font-mono uppercase text-[10px] font-bold tracking-wider ${
                        regRole === 'pelanggan'
                          ? 'border-[#1A1A1A] bg-[#1A1A1A] text-[#F4F1EA] shadow-[2px_2px_0px_#000000]'
                          : 'border-[#1A1A1A] bg-white text-[#1A1A1A] hover:bg-gray-100 shadow-[2px_2px_0px_#000000]'
                      }`}
                    >
                      <div className="text-[10px]">Pelanggan</div>
                      <div className="text-[8px] opacity-60 mt-0.5">Mencari jasa</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegRole('penyedia_jasa')}
                      className={`p-3 border-2 text-center transition-all font-mono uppercase text-[10px] font-bold tracking-wider ${
                        regRole === 'penyedia_jasa'
                          ? 'border-[#1A1A1A] bg-[#1A1A1A] text-[#F4F1EA] shadow-[2px_2px_0px_#000000]'
                          : 'border-[#1A1A1A] bg-white text-[#1A1A1A] hover:bg-gray-100 shadow-[2px_2px_0px_#000000]'
                      }`}
                    >
                      <div className="text-[10px]">Penyedia Jasa</div>
                      <div className="text-[8px] opacity-60 mt-0.5">Menawarkan jasa</div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-mono font-bold uppercase tracking-[0.15em] text-[#1A1A1A]/60 mb-1.5">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/40" />
                    <input
                      type="text"
                      value={regName}
                      onChange={e => setRegName(e.target.value)}
                      placeholder="Nama Lengkap"
                      className="w-full pl-10 pr-3 py-3 bg-white border-2 border-[#1A1A1A] text-sm font-medium text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 focus:border-[#FF3E00] focus:shadow-[2px_2px_0px_#1A1A1A] focus:outline-none transition-all font-mono uppercase tracking-wide"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-mono font-bold uppercase tracking-[0.15em] text-[#1A1A1A]/60 mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/40" />
                    <input
                      type="email"
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      placeholder="contoh@email.com"
                      className="w-full pl-10 pr-3 py-3 bg-white border-2 border-[#1A1A1A] text-sm font-medium text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 focus:border-[#FF3E00] focus:shadow-[2px_2px_0px_#1A1A1A] focus:outline-none transition-all font-mono uppercase tracking-wide"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-mono font-bold uppercase tracking-[0.15em] text-[#1A1A1A]/60 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/40" />
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      placeholder="Min. 6 karakter"
                      className="w-full pl-10 pr-10 py-3 bg-white border-2 border-[#1A1A1A] text-sm font-medium text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 focus:border-[#FF3E00] focus:shadow-[2px_2px_0px_#1A1A1A] focus:outline-none transition-all font-mono uppercase tracking-wide"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A1A1A]/40 hover:text-[#1A1A1A]"
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-mono font-bold uppercase tracking-[0.15em] text-[#1A1A1A]/60 mb-1.5">
                    Konfirmasi Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/40" />
                    <input
                      type={showRegConfirmPassword ? 'text' : 'password'}
                      value={regConfirmPassword}
                      onChange={e => setRegConfirmPassword(e.target.value)}
                      placeholder="Ulangi password"
                      className="w-full pl-10 pr-10 py-3 bg-white border-2 border-[#1A1A1A] text-sm font-medium text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 focus:border-[#FF3E00] focus:shadow-[2px_2px_0px_#1A1A1A] focus:outline-none transition-all font-mono uppercase tracking-wide"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A1A1A]/40 hover:text-[#1A1A1A]"
                    >
                      {showRegConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* KTM Photo Upload - only for Penyedia Jasa */}
                {regRole === 'penyedia_jasa' && (
                  <div>
                    <label className="block text-[9px] font-mono font-bold uppercase tracking-[0.15em] text-[#1A1A1A]/60 mb-1.5">
                      Foto KTM
                    </label>
                    <div className="relative">
                      {regKtmPhoto ? (
                        <div className="relative">
                          <img
                            src={regKtmPhoto}
                            alt="Foto KTM"
                            className="w-full h-36 object-cover border-2 border-[#1A1A1A]"
                          />
                          <button
                            type="button"
                            onClick={() => setRegKtmPhoto('')}
                            className="absolute top-2 right-2 bg-[#FF3E00] text-white w-6 h-6 flex items-center justify-center text-xs cursor-pointer hover:bg-[#1A1A1A] border border-[#1A1A1A]"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-[#1A1A1A] cursor-pointer hover:border-[#FF3E00] transition-colors bg-white">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 text-[#1A1A1A]/40 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                            <p className="text-[9px] text-[#1A1A1A]/50 font-mono font-bold uppercase tracking-wider">Upload Foto KTM</p>
                            <p className="text-[7px] text-[#1A1A1A]/30 mt-0.5 font-mono">JPG, PNG (max. 2MB)</p>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.size > 2 * 1024 * 1024) {
                                  setRegError('Ukuran file maksimal 2MB');
                                  return;
                                }
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  setRegKtmPhoto(ev.target?.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                )}

                {regError && (
                  <p className="text-red-500 text-xs font-semibold text-center font-mono uppercase tracking-wide">{regError}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#1A1A1A] hover:bg-[#FF3E00] text-[#F4F1EA] font-bold text-xs font-mono uppercase tracking-[0.15em] border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#000000] cursor-pointer flex items-center justify-center gap-2 transition-all duration-150 active:scale-95"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Daftar</span>
                </button>
              </form>
            )}
          </motion.div>

          <motion.div
            style={{ transform: 'translateZ(20px)' }}
            className="mt-6 pt-4 border-t border-[#1A1A1A]/20 flex items-center justify-between"
          >
            <button
              type="button"
              onClick={onReset}
              className="text-[9px] text-[#1A1A1A]/50 hover:text-[#1A1A1A] font-mono uppercase tracking-wider font-bold flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" />
              Reset Sandbox
            </button>
            <p className="text-[8px] text-[#1A1A1A]/40 font-mono uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Escrow terlindungi
            </p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF3E00]/50 to-transparent" />

      {/* Corner decorative elements */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#FF3E00]/20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[#FF3E00]/20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-[#FF3E00]/20 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#FF3E00]/20 pointer-events-none" />
    </div>
  );
}
