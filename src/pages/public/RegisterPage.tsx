import React, { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { useStore } from '../../context/StoreContext';
import { User, Mail, Lock, Phone, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';
import { STORE_INFO } from '../../data/products';

export const RegisterPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const { register } = useStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Comé');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successNotice, setSuccessNotice] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!firstName || !lastName || !email || !password) {
      setErrorMsg("Veuillez renseigner tous les champs obligatoires.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Le mot de passe doit comporter au moins 6 caractères.");
      return;
    }

    setLoading(true);

    const res = await register({
      firstName,
      lastName,
      email,
      phone: phone || '+229 95 44 16 02',
      city,
      address,
      password,
    });

    setLoading(false);

    if (res.success) {
      setSuccessNotice(true);
      // Automatically redirect to /shop after a short delay
      setTimeout(() => {
        setLocation('/shop');
      }, 1200);
    } else {
      setErrorMsg(res.message || "Erreur lors de l'inscription.");
    }
  };

  return (
    <div className="py-16 bg-[#0a0a0d] min-h-[85vh] flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-[#121218] border border-[#d4af37]/40 rounded-3xl shadow-2xl p-8 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#d4af37] mx-auto shadow-xl bg-black">
            <img
              src={STORE_INFO.logoUrl}
              alt="Logo BECCA SHOP"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="font-luxury text-2xl font-bold text-white">Créer un Compte Client</h1>
          <p className="text-xs text-[#a1a1aa]">
            Rejoignez le Cercle Privilège BECCA SHOP et bénéficiez de nos tarifs exclusifs
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs text-center">
            {errorMsg}
          </div>
        )}

        {successNotice ? (
          <div className="p-6 rounded-2xl bg-[#132018] border border-[#10b981]/50 text-center space-y-3 animate-in fade-in zoom-in-95">
            <CheckCircle2 className="w-12 h-12 text-[#10b981] mx-auto" />
            <h3 className="font-luxury text-lg font-bold text-white">Compte Créé avec Succès !</h3>
            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              Un e-mail de bienvenue personnalisé aux couleurs de BECCA SHOP vous a été expédié à <strong className="text-white">{email}</strong>.
            </p>
            <p className="text-xs text-[#e5c158] font-medium">
              Redirection immédiate vers la boutique...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#d4d4d8] mb-1.5">
                  Prénom <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#71717a] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Clarisse"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#181822] border border-[#2b2b38] text-white text-xs outline-none focus:border-[#e5c158] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#d4d4d8] mb-1.5">
                  Nom <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Agbodjan"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#181822] border border-[#2b2b38] text-white text-xs outline-none focus:border-[#e5c158] transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#d4d4d8] mb-1.5">
                  Email <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#71717a] absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="clarisse@gmail.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#181822] border border-[#2b2b38] text-white text-xs outline-none focus:border-[#e5c158] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#d4d4d8] mb-1.5">
                  Téléphone (Bénin) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-[#71717a] font-mono">
                    +229
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="97 12 34 56"
                    className="w-full pl-14 pr-3.5 py-2.5 rounded-xl bg-[#181822] border border-[#2b2b38] text-white text-xs font-mono outline-none focus:border-[#e5c158] transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#d4d4d8] mb-1.5">
                  Ville / Commune
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#181822] border border-[#2b2b38] text-white text-xs outline-none focus:border-[#e5c158] transition-colors"
                >
                  <option value="Comé">Comé (Mono)</option>
                  <option value="Cotonou">Cotonou (Littoral)</option>
                  <option value="Abomey-Calavi">Abomey-Calavi</option>
                  <option value="Porto-Novo">Porto-Novo</option>
                  <option value="Lokossa">Lokossa (Mono)</option>
                  <option value="Grand-Popo">Grand-Popo</option>
                  <option value="Ouidah">Ouidah</option>
                  <option value="Parakou">Parakou</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#d4d4d8] mb-1.5">
                  Quartier / Adresse
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Quartier Agatogbo..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#181822] border border-[#2b2b38] text-white text-xs outline-none focus:border-[#e5c158] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#d4d4d8] mb-1.5">
                Créer un Mot de passe <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#71717a] absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 caractères"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#181822] border border-[#2b2b38] text-white text-xs outline-none focus:border-[#e5c158] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#aa7c11] text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#d4af37]/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Création en cours...' : 'Créer Mon Compte'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="text-center pt-2 text-xs text-[#a1a1aa]">
          Déjà un compte ?{' '}
          <Link href="/login" className="text-[#e5c158] font-bold hover:underline">
            Se connecter
          </Link>
        </div>

      </div>
    </div>
  );
};
