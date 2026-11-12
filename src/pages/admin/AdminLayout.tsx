import React from 'react';
import { Link, useLocation } from 'wouter';
import { useStore } from '../../context/StoreContext';
import { STORE_INFO } from '../../data/products';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Warehouse,
  Tag,
  PackageCheck,
  Megaphone,
  Settings,
  FileText,
  LogOut,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Menu,
  X,
} from 'lucide-react';

import { AdminLoginPage } from './AdminLoginPage';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [location, setLocation] = useLocation();
  const { currentUser, isAdmin, logout } = useStore();
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);

  // If user is not logged in as administrator, show the Admin Login Portal
  if (!isAdmin) {
    return <AdminLoginPage onSuccess={() => setLocation(location === '/admin/login' ? '/admin' : location)} />;
  }

  const navItems = [
    { href: '/admin', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Produits & Catalogue', icon: Package },
    { href: '/admin/categories', label: 'Rayons & Catégories', icon: Layers },
    { href: '/admin/orders', label: 'Commandes Clients', icon: ShoppingBag },
    { href: '/admin/invoices', label: 'Factures (PDF)', icon: FileText },
    { href: '/admin/customers', label: 'Répertoire Clients', icon: Users },
    { href: '/admin/inventory', label: 'Stocks & Traçabilité', icon: Warehouse },
    { href: '/admin/promotions', label: 'Promotions & Codes', icon: Tag },
    { href: '/admin/wholesale', label: 'Vente en Gros', icon: PackageCheck },
    { href: '/admin/marketing', label: 'Marketing & Newsletter', icon: Megaphone },
    { href: '/admin/settings', label: 'Paramètres & Emails', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#07070a] text-[#f1f1f4] flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-[#0e0e14] border-b border-[#222230] p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-[#d4af37]">
            <img src={STORE_INFO.logoUrl} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-luxury font-bold text-sm text-white">BECCA Admin</span>
        </div>
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-2 text-white hover:text-[#e5c158]"
        >
          {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Luxury Sidebar */}
      <aside
        className={`${
          mobileNavOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-[#0e0e14] border-r border-[#1f1f2c] flex-shrink-0 flex flex-col justify-between p-5 sticky top-0 md:h-screen z-40 overflow-y-auto`}
      >
        <div className="space-y-6">
          {/* Logo & Store Info */}
          <div className="flex items-center gap-3 pb-5 border-b border-[#20202d]">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-[#d4af37]/60 p-0.5 bg-black shrink-0">
              <img src={STORE_INFO.logoUrl} alt="Logo" className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <div className="font-luxury font-bold text-sm text-white tracking-wide">
                BECCA<span className="text-[#e5c158]"> SHOP</span>
              </div>
              <div className="text-[10px] text-[#71717a] uppercase tracking-wider">
                Console de Gestion
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#222016] text-[#e5c158] border border-[#d4af37]/40 shadow-sm'
                      : 'text-[#a1a1aa] hover:text-white hover:bg-[#161622]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#e5c158]' : 'text-[#71717a]'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-[#20202d] space-y-3">
          <div className="p-3 rounded-xl bg-[#14141e] border border-[#242436] flex items-center justify-between">
            <div className="text-xs">
              <div className="font-bold text-white">{currentUser?.firstName} {currentUser?.lastName}</div>
              <div className="text-[10px] text-[#e5c158] uppercase">Administrateur</div>
            </div>
            <button
              onClick={() => {
                logout();
                setLocation('/admin/login');
              }}
              title="Se déconnecter de l'administration"
              className="p-1.5 rounded-lg text-[#ef4444] hover:bg-[#ef4444]/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <Link
            href="/"
            className="w-full py-2.5 rounded-xl bg-[#181824] hover:bg-[#202030] text-[#a1a1aa] hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-[#28283a]"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Voir le site public</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Content Container */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
