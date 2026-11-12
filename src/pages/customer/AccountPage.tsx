import React from 'react';
import { Link } from 'wouter';
import { motion } from 'motion/react';
import { useStore } from '../../context/StoreContext';
import { formatFCFA } from '../../utils/formatters';
import {
  User as UserIcon,
  ShoppingBag,
  Heart,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Package,
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const { currentUser, logout, orders, wishlist } = useStore();

  if (!currentUser) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 px-4 text-center bg-[#0a0a0d]">
        <div className="w-16 h-16 rounded-full bg-[#181824] border border-[#2e2e42] flex items-center justify-center text-[#e5c158] mb-4">
          <UserIcon className="w-8 h-8" />
        </div>
        <h1 className="font-luxury text-2xl font-bold text-white mb-2">Espace Client Privilège</h1>
        <p className="text-xs text-[#a1a1aa] max-w-sm mb-6">
          Veuillez vous connecter pour accéder à vos commandes, adresses et avantages réservés.
        </p>
        <div className="flex gap-3">
          <Link
            href="/login"
            className="px-6 py-3 rounded-full bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wider"
          >
            Se connecter
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 rounded-full bg-[#1c1c28] hover:bg-[#252536] text-white font-medium text-xs tracking-wider"
          >
            Créer un compte
          </Link>
        </div>
      </div>
    );
  }

  const userOrders = orders.filter((o) => o.customerEmail?.toLowerCase() === currentUser.email.toLowerCase() || o.userId === currentUser.id);
  const totalSpent = userOrders.reduce((acc, o) => acc + o.total, 0);

  return (
    <div className="py-12 bg-[#0a0a0d] min-h-screen text-[#f3f3f6]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-[#121219] border border-[#222230] rounded-3xl p-6 sm:p-10 mb-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#d4af37] via-[#b38515] to-[#735209] p-0.5 shadow-xl shadow-[#d4af37]/20 shrink-0">
              <div className="w-full h-full bg-[#0e0e13] rounded-2xl flex items-center justify-center text-[#e5c158] font-luxury font-bold text-2xl sm:text-3xl">
                {currentUser.firstName[0]}
                {currentUser.lastName[0]}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="font-luxury text-xl sm:text-2xl font-bold text-white">
                  {currentUser.firstName} {currentUser.lastName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#d4af37]/20 text-[#e5c158] border border-[#d4af37]/40">
                  Membre Privilège
                </span>
              </div>
              <p className="text-xs text-[#a1a1aa] flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[#e5c158]" />
                  {currentUser.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#e5c158]" />
                  {currentUser.phone}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/account/profile"
              className="px-4 py-2.5 rounded-xl bg-[#1b1b26] hover:bg-[#252536] border border-[#303042] text-xs font-semibold text-white transition-colors"
            >
              Modifier mon profil
            </Link>
            <button
              onClick={logout}
              className="px-4 py-2.5 rounded-xl bg-[#ef4444]/15 hover:bg-[#ef4444]/25 border border-[#ef4444]/30 text-xs font-semibold text-[#ef4444] transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-[#121219] border border-[#222230]">
            <span className="text-[11px] text-[#a1a1aa] uppercase tracking-wider font-semibold">Commandes Réalisées</span>
            <div className="text-2xl font-bold text-white mt-1 tabular-nums">{userOrders.length}</div>
            <Link href="/account/orders" className="text-xs text-[#e5c158] hover:underline mt-2 inline-block">
              Consulter l'historique →
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-[#121219] border border-[#222230]">
            <span className="text-[11px] text-[#a1a1aa] uppercase tracking-wider font-semibold">Total Investi en Beauté</span>
            <div className="text-2xl font-bold text-[#e5c158] mt-1 tabular-nums font-mono">{formatFCFA(totalSpent)}</div>
            <span className="text-[11px] text-[#71717a] mt-2 block">Achats cumulés BECCA SHOP</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#121219] border border-[#222230]">
            <span className="text-[11px] text-[#a1a1aa] uppercase tracking-wider font-semibold">Articles Favoris</span>
            <div className="text-2xl font-bold text-white mt-1 tabular-nums">{wishlist.length}</div>
            <Link href="/account/wishlist" className="text-xs text-[#e5c158] hover:underline mt-2 inline-block">
              Voir ma wishlist →
            </Link>
          </div>
        </div>

        {/* Quick Nav Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/account/orders"
            className="p-6 rounded-3xl bg-[#111117] border border-[#242436] hover:border-[#d4af37]/50 transition-all group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#1b1a26] text-[#e5c158] flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
              <h3 className="font-luxury text-base font-bold text-white group-hover:text-[#e5c158] transition-colors">
                Historique des Commandes
              </h3>
              <p className="text-xs text-[#a1a1aa]">
                Suivez en direct l'état de préparation et d'expédition de vos colis.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs text-[#e5c158] font-semibold pt-4">
              <span>Voir mes commandes</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>

          <Link
            href="/account/profile"
            className="p-6 rounded-3xl bg-[#111117] border border-[#242436] hover:border-[#d4af37]/50 transition-all group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#1b1a26] text-[#e5c158] flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-luxury text-base font-bold text-white group-hover:text-[#e5c158] transition-colors">
                Carnet d'Adresses & Contact
              </h3>
              <p className="text-xs text-[#a1a1aa]">
                Gérez votre adresse de livraison habituelle à Comé ou dans les autres départements.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs text-[#e5c158] font-semibold pt-4">
              <span>Mettre à jour</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>

          <Link
            href="/account/wishlist"
            className="p-6 rounded-3xl bg-[#111117] border border-[#242436] hover:border-[#d4af37]/50 transition-all group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#1b1a26] text-[#e5c158] flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-luxury text-base font-bold text-white group-hover:text-[#e5c158] transition-colors">
                Liste d'Envies
              </h3>
              <p className="text-xs text-[#a1a1aa]">
                Conservez vos modèles coup de cœur pour vos futures célébrations et cérémonies.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs text-[#e5c158] font-semibold pt-4">
              <span>Accéder aux favoris</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
