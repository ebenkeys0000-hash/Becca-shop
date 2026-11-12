import React, { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { useStore } from '../../context/StoreContext';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';
import { STORE_INFO } from '../../data/products';

export const LoginPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const { login, currentUser } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // If already logged in, redirect
  React.useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') {
        setLocation('/admin');
      } else {
        setLocation('/shop');
      }
    }
  }, [currentUser, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.message || "Erreur lors de la connexion.");
    }
  };

  // Demo Login Quick Fillers
  const handleQuickDemoCustomer = async () => {
    setEmail('clarisse@gmail.com');
    setPassword('Clari@2026');
    setLoading(true);
    await login('clarisse@gmail.com', 'Clari@2026');
    setLoading(false);
  };

  const handleQuickDemoAdmin = async () => {
    setEmail('admin@beccashop.bj');
    setPassword('Admin@Becca2026!');
    setLoading(true);
    await login('admin@beccashop.bj', 'Admin@Becca2026!');
    setLoading(false);
  };

  return (
    <div className="py-16 bg-[#0a0a0d] min-h-[85vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#121218] border border-[#d4af37]/40 rounded-3xl shadow-2xl p-8 space-y-6">
        
        {/* Brand Lockup */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#d4af37] mx-auto shadow-xl bg-black">
            <img
              src={STORE_INFO.logoUrl}
              alt="Logo BECCA SHOP"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="font-luxury text-2xl font-bold text-white">Espace Connexion</h1>
          <p className="text-xs text-[#a1a1aa]">
            Accédez à vos commandes, vos favoris et vos privilèges
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs text-center">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#d4d4d8] mb-1.5">
              Adresse Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#71717a] absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@exemple.bj"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#181822] border border-[#2b2b38] text-white text-xs outline-none focus:border-[#e5c158] transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-medium text-[#d4d4d8]">
                Mot de passe
              </label>
              <Link href="/forgot-password" className="text-[11px] text-[#e5c158] hover:underline">
                Mot de passe oublié ?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#71717a] absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#181822] border border-[#2b2b38] text-white text-xs outline-none focus:border-[#e5c158] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#aa7c11] text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#d4af37]/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Connexion en cours...' : 'Se Connecter'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Login Buttons for Instant Review */}
        <div className="pt-2 border-t border-[#22222f] space-y-2">
          <p className="text-[11px] text-center text-[#71717a]">
            Comptes de démonstration pré-configurés :
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleQuickDemoCustomer}
              className="py-2 px-2.5 rounded-lg bg-[#1a1a24] hover:bg-[#232332] border border-[#2d2d3e] text-[11px] text-white flex items-center justify-center gap-1.5 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#e5c158]" />
              <span>Cliente Démo</span>
            </button>
            <button
              type="button"
              onClick={() => setLocation('/admin/login')}
              className="py-2 px-2.5 rounded-lg bg-[#1e1a12] hover:bg-[#282216] border border-[#d4af37]/40 text-[11px] text-[#e5c158] font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#e5c158]" />
              <span>Portail Admin</span>
            </button>
          </div>
        </div>

        {/* Register Link */}
        <div className="text-center pt-2 text-xs text-[#a1a1aa]">
          Pas encore de compte ?{' '}
          <Link href="/register" className="text-[#e5c158] font-bold hover:underline">
            Créer un compte client
          </Link>
        </div>

        {/* Dedicated Admin Portal Link */}
        <div className="pt-2 text-center border-t border-[#1e1e2d]">
          <Link
            href="/admin/login"
            className="text-[11px] text-[#71717a] hover:text-[#e5c158] transition-colors inline-flex items-center gap-1.5"
          >
            <Lock className="w-3 h-3 text-[#d4af37]" />
            <span>Accès sécurisé réservé à la Direction de Comé</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
