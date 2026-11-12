import React, { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'motion/react';
import { useStore } from '../../context/StoreContext';
import { User, Mail, Phone, MapPin, Save, CheckCircle2, ArrowLeft } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { currentUser, updateProfile } = useStore();

  const [firstName, setFirstName] = useState(currentUser?.firstName || '');
  const [lastName, setLastName] = useState(currentUser?.lastName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [city, setCity] = useState(currentUser?.city || 'Comé');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!currentUser) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 px-4 text-center bg-[#0a0a0d]">
        <h2 className="font-luxury text-2xl font-bold text-white mb-2">Accès restreint</h2>
        <p className="text-xs text-[#a1a1aa] mb-6">Veuillez vous connecter pour gérer votre profil.</p>
        <Link href="/login" className="px-6 py-3 rounded-full bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wider">
          Se connecter
        </Link>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      firstName,
      lastName,
      phone,
      city,
      address,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="py-12 bg-[#0a0a0d] min-h-screen text-[#f3f3f6]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#a1a1aa] mb-6">
          <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
          <span>/</span>
          <Link href="/account" className="hover:text-white transition-colors">Mon Compte</Link>
          <span>/</span>
          <span className="text-[#e5c158]">Profil & Coordonnées</span>
        </div>

        <div className="bg-[#121219] border border-[#222230] rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
          <div className="pb-4 border-b border-[#242436] flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#e5c158]">
                Informations Privilège
              </span>
              <h1 className="font-luxury text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                Mon Profil Personnel
              </h1>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#1c1c28] border border-[#2d2d3e] flex items-center justify-center text-[#e5c158] font-luxury font-bold text-xl">
              {currentUser.firstName[0]}
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#d4d4d8] mb-1.5 uppercase tracking-wider">
                  Prénom
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#181822] border border-[#2b2b3c] rounded-xl text-white text-xs outline-none focus:border-[#e5c158] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#d4d4d8] mb-1.5 uppercase tracking-wider">
                  Nom de famille
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#181822] border border-[#2b2b3c] rounded-xl text-white text-xs outline-none focus:border-[#e5c158] transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#d4d4d8] mb-1.5 uppercase tracking-wider">
                  Numéro de téléphone / WhatsApp
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-[#181822] border border-[#2b2b3c] rounded-xl text-white text-xs font-mono outline-none focus:border-[#e5c158] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#d4d4d8] mb-1.5 uppercase tracking-wider">
                  Adresse Email (Identifiant)
                </label>
                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="w-full px-4 py-3 bg-[#13131c] border border-[#222230] rounded-xl text-[#71717a] text-xs cursor-not-allowed outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#d4d4d8] mb-1.5 uppercase tracking-wider">
                  Ville Principale
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Comé"
                  className="w-full px-4 py-3 bg-[#181822] border border-[#2b2b3c] rounded-xl text-white text-xs outline-none focus:border-[#e5c158] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#d4d4d8] mb-1.5 uppercase tracking-wider">
                  Adresse de livraison / Repères
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Quartier, rue ou indication"
                  className="w-full px-4 py-3 bg-[#181822] border border-[#2b2b3c] rounded-xl text-white text-xs outline-none focus:border-[#e5c158] transition-colors"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#242436] flex items-center justify-between gap-4">
              <button
                type="submit"
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#aa7c11] text-black font-extrabold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer les modifications</span>
              </button>

              {savedSuccess && (
                <div className="flex items-center gap-2 text-xs text-[#10b981] font-semibold animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Profil mis à jour !</span>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
