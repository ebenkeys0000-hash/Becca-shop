import React, { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../context/StoreContext';
import { STORE_INFO } from '../../data/products';
import { SafeImage } from '../../components/SafeImage';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  KeyRound,
  CheckCircle2,
  RefreshCw,
  Store,
} from 'lucide-react';

interface AdminLoginPageProps {
  onSuccess?: () => void;
  params?: any;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onSuccess }) => {
  const [, setLocation] = useLocation();
  const { login, currentUser, isAdmin } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successNotice, setSuccessNotice] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await login(email.trim(), password);

      if (res.success) {
        setSuccessNotice(true);
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          } else {
            setLocation('/admin');
          }
        }, 500);
      } else {
        setErrorMessage(
          res.message || "Identifiants invalides. Veuillez vérifier l'adresse email et le mot de passe."
        );
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Une erreur est survenue lors de la connexion.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07070a] text-[#f4f4f7] flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-[#d4af37] selection:text-black">
      {/* Background Decorative Gold Halos */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#065f46]/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-[#111118] border border-[#d4af37]/40 rounded-3xl p-7 sm:p-9 shadow-2xl shadow-black relative z-10 space-y-6"
      >
        {/* Brand Emblem & Header */}
        <div className="text-center space-y-3">
          <div className="relative inline-block">
            <div className="w-20 h-20 rounded-full bg-black border-2 border-[#d4af37] p-1.5 mx-auto shadow-xl shadow-[#d4af37]/20">
              <SafeImage
                src={STORE_INFO.logoUrl}
                alt="Logo BECCA SHOP"
                priority
                compactFallback
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#d4af37] text-black flex items-center justify-center shadow-md">
              <Lock className="w-3.5 h-3.5" />
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#e5c158] inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Espace Administrateur Sécurisé</span>
            </span>
            <h1 className="font-luxury text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Connexion Direction
            </h1>
            <p className="text-xs text-[#a1a1aa] mt-1">
              Gestion des pagnes, souliers, commandes et facturation · Boutique de Comé
            </p>
          </div>
        </div>

        {/* Error / Success Feedback Alerts */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3.5 rounded-2xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-2.5"
            >
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span className="leading-snug">{errorMessage}</span>
            </motion.div>
          )}

          {successNotice && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Authentification réussie. Redirection vers le tableau de bord...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Identifiant Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#d4af37]">
              Identifiant / Email Administrateur
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#71717a] absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@beccashop.bj"
                className="w-full pl-10 pr-4 py-3 bg-[#181824] border border-[#2d2d40] rounded-2xl text-xs sm:text-sm text-white placeholder-[#71717a] outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/50 transition-all font-mono"
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#d4af37]">
                Mot de Passe Secret
              </label>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-[#71717a] absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-11 py-3 bg-[#181824] border border-[#2d2d40] rounded-2xl text-xs sm:text-sm text-white placeholder-[#71717a] outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/50 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-[#71717a] hover:text-[#d4af37] transition-colors p-0.5"
                title={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-[#a1a1aa] cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-[#343448] bg-[#181824] text-[#d4af37] focus:ring-0"
              />
              <span>Mémoriser ma session</span>
            </label>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading || successNotice}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#aa7c11] text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#d4af37]/25 flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-60 mt-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-black" />
                <span>Vérification des accès...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-black" />
                <span>Accéder au Tableau de Bord</span>
                <ArrowRight className="w-4 h-4 text-black ml-1" />
              </>
            )}
          </motion.button>
        </form>

        {/* Return to Public Website */}
        <div className="pt-2 text-center border-t border-[#1e1e2d]">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#a1a1aa] hover:text-[#d4af37] transition-colors"
          >
            <Store className="w-3.5 h-3.5" />
            <span>← Retourner à la boutique publique BECCA SHOP</span>
          </Link>
        </div>
      </motion.div>

      {/* Footer Notice */}
      <div className="mt-6 text-center text-[10px] text-[#71717a] max-w-sm space-y-1">
        <p>Connexion sécurisée SSL 256-bit · Direction BECCA SHOP, Comé, Bénin</p>
        <p>Support technique d'urgence : +229 95 44 16 02 / +229 41 46 55 06</p>
      </div>
    </div>
  );
};
