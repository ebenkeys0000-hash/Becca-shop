import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  Heart,
  Search,
  Phone,
  MessageCircle,
  Menu,
  X,
  User as UserIcon,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';
import { STORE_INFO } from '../data/products';
import { formatFCFA } from '../utils/formatters';
import { useStore } from '../context/StoreContext';
import { SafeImage } from './SafeImage';

interface NavbarProps {
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onSelectCategory?: (category: 'all' | 'pagnes' | 'chaussures') => void;
  activeCategory?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  cartTotal,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
}) => {
  const [location, setLocation] = useLocation();
  const { currentUser, isAdmin } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCallDropdown, setShowCallDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Luxury Announcement Bar with gentle entrance */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[#0e0e13] border-b border-[#22222d] text-[11px] md:text-xs text-[#a1a1aa] py-2 px-4 relative z-50"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="text-[#e5c158] font-semibold tracking-wider">BECCA SHOP</span>
            <span className="text-[#3f3f46]">·</span>
            <span className="text-[#d4d4d8]">Boutique de Prestige à Comé, Bénin</span>
            <span className="text-[#3f3f46] hidden md:inline">·</span>
            <span className="text-[#a1a1aa] hidden md:inline font-luxury italic">
              « {STORE_INFO.tagline} »
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[#71717a]">Appels & WhatsApp :</span>
              <a
                href={`tel:${STORE_INFO.phone1}`}
                className="text-[#e5c158] hover:text-white transition-colors font-medium tabular-nums"
              >
                {STORE_INFO.phone1Display}
              </a>
              <span className="text-[#3f3f46]">/</span>
              <a
                href={`tel:${STORE_INFO.phone2}`}
                className="text-[#e5c158] hover:text-white transition-colors font-medium tabular-nums"
              >
                {STORE_INFO.phone2Display}
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Sticky Header with dynamic blur and glass appearance */}
      <header
        className={`sticky top-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'bg-[#0a0a0e]/90 backdrop-blur-xl border-b border-[#252533] shadow-2xl shadow-black/50 py-3.5'
            : 'bg-[#0a0a0e]/60 backdrop-blur-md border-b border-[#1f1f2a]/50 py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">
          {/* Mobile Menu Hamburger */}
          <div className="flex items-center md:hidden">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#d4d4d8] hover:text-[#e5c158] transition-colors"
              aria-label="Ouvrir le menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>

          {/* Brand Wordmark with Official Emblem */}
          <Link
            href="/"
            className="flex items-center gap-3.5 group shrink-0"
          >
            {/* Official BECCA SHOP Emblem Logo */}
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-[#d4af37]/60 shadow-lg shadow-[#d4af37]/20 group-hover:border-[#e5c158] transition-all bg-black shrink-0">
              <SafeImage
                src={STORE_INFO.logoUrl}
                alt="Logo Officiel BECCA SHOP"
                priority
                compactFallback
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-luxury font-bold text-xl sm:text-2xl tracking-widest text-white group-hover:text-[#e5c158] transition-colors">
                BECCA<span className="text-[#e5c158] font-normal"> SHOP</span>
              </span>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#a1a1aa]">
                Comé · Bénin
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium tracking-wide">
            <Link
              href="/"
              className={`relative transition-colors whitespace-nowrap py-1 ${
                location === '/' ? 'text-[#e5c158] font-semibold' : 'text-[#d4d4d8] hover:text-white'
              }`}
            >
              Accueil
              {location === '/' && (
                <motion.div
                  layoutId="navIndicator"
                  className="absolute bottom-0 inset-x-0 h-0.5 bg-[#e5c158] rounded-full"
                />
              )}
            </Link>

            <Link
              href="/shop"
              className={`relative transition-colors whitespace-nowrap py-1 ${
                location.startsWith('/shop') ? 'text-[#e5c158] font-semibold' : 'text-[#d4d4d8] hover:text-white'
              }`}
            >
              Boutique
              {location.startsWith('/shop') && (
                <motion.div
                  layoutId="navIndicator"
                  className="absolute bottom-0 inset-x-0 h-0.5 bg-[#e5c158] rounded-full"
                />
              )}
            </Link>

            <Link
              href="/collections"
              className={`relative transition-colors whitespace-nowrap py-1 ${
                location === '/collections' ? 'text-[#e5c158] font-semibold' : 'text-[#d4d4d8] hover:text-white'
              }`}
            >
              Collections
              {location === '/collections' && (
                <motion.div
                  layoutId="navIndicator"
                  className="absolute bottom-0 inset-x-0 h-0.5 bg-[#e5c158] rounded-full"
                />
              )}
            </Link>

            <Link
              href="/about"
              className={`relative transition-colors whitespace-nowrap py-1 ${
                location === '/about' ? 'text-[#e5c158] font-semibold' : 'text-[#d4d4d8] hover:text-white'
              }`}
            >
              La Maison
              {location === '/about' && (
                <motion.div
                  layoutId="navIndicator"
                  className="absolute bottom-0 inset-x-0 h-0.5 bg-[#e5c158] rounded-full"
                />
              )}
            </Link>

            <Link
              href="/contact"
              className={`relative transition-colors whitespace-nowrap py-1 ${
                location === '/contact' ? 'text-[#e5c158] font-semibold' : 'text-[#d4d4d8] hover:text-white'
              }`}
            >
              Contact & Boutique
              {location === '/contact' && (
                <motion.div
                  layoutId="navIndicator"
                  className="absolute bottom-0 inset-x-0 h-0.5 bg-[#e5c158] rounded-full"
                />
              )}
            </Link>
          </nav>

          {/* Right Action Icons & Interactive Cart */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
            {/* Direct Shop button */}
            <Link
              href="/shop"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#181824] hover:bg-[#222232] border border-[#2e2e42] text-xs font-semibold text-[#e5c158] transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Catalogue</span>
            </Link>

            {/* Quick Call Dropdown Trigger */}
            <div className="relative hidden lg:block">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowCallDropdown(!showCallDropdown)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#d4d4d8] bg-[#16161f] hover:bg-[#1f1f2a] border border-[#2c2c3a] rounded-full transition-colors shadow-sm"
                title="Appeler la boutique"
              >
                <Phone className="w-3.5 h-3.5 text-[#e5c158]" />
                <span>Nous contacter</span>
              </motion.button>

              <AnimatePresence>
                {showCallDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 mt-2.5 w-60 bg-[#14141c]/95 backdrop-blur-xl border border-[#d4af37]/40 rounded-2xl shadow-2xl p-3.5 z-50"
                  >
                    <p className="text-[11px] uppercase tracking-wider text-[#a1a1aa] mb-2.5 font-semibold">
                      Service Clientèle Comé
                    </p>
                    <div className="space-y-2">
                      <a
                        href={`tel:${STORE_INFO.phone1}`}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#1d1d28] hover:bg-[#252534] text-xs text-white transition-colors"
                      >
                        <span className="font-mono text-[#e5c158]">{STORE_INFO.phone1Display}</span>
                        <span className="text-[10px] text-[#a1a1aa]">Appel direct</span>
                      </a>
                      <a
                        href={`tel:${STORE_INFO.phone2}`}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#1d1d28] hover:bg-[#252534] text-xs text-white transition-colors"
                      >
                        <span className="font-mono text-[#e5c158]">{STORE_INFO.phone2Display}</span>
                        <span className="text-[10px] text-[#a1a1aa]">Appel direct</span>
                      </a>
                      <div className="pt-2 border-t border-[#262633] flex gap-2">
                        <a
                          href={STORE_INFO.whatsappUrl1}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 py-1.5 text-center bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] text-[11px] font-medium rounded-lg transition-colors"
                        >
                          WhatsApp 1
                        </a>
                        <a
                          href={STORE_INFO.whatsappUrl2}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 py-1.5 text-center bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] text-[11px] font-medium rounded-lg transition-colors"
                        >
                          WhatsApp 2
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wishlist Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              onClick={onOpenWishlist}
              className="relative p-2.5 rounded-full text-[#d4d4d8] hover:text-[#e5c158] hover:bg-[#181820] transition-colors"
              title="Mes favoris"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <motion.span
                  key={wishlistCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                  className="absolute top-1 right-1 w-4 h-4 bg-[#c59b27] text-black font-bold text-[10px] rounded-full flex items-center justify-center"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </motion.button>

            {/* User Account / Admin Badge Button */}
            <Link
              href={currentUser ? (isAdmin ? '/admin' : '/account') : '/login'}
              className="p-2.5 rounded-full text-[#d4d4d8] hover:text-[#e5c158] hover:bg-[#181820] transition-colors relative"
              title={currentUser ? `${currentUser.firstName} (${currentUser.role})` : 'Connexion / Inscription'}
            >
              {isAdmin ? (
                <Shield className="w-5 h-5 text-[#e5c158]" />
              ) : (
                <UserIcon className="w-5 h-5" />
              )}
            </Link>

            {/* Cart Button */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onOpenCart}
              className="flex items-center gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#b38515] text-[#0c0c0f] font-semibold text-xs shadow-xl shadow-[#d4af37]/25 hover:brightness-110 active:scale-95 transition-all"
              aria-label="Voir le panier"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-black" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                      className="absolute -top-1.5 -right-2 bg-black text-[#e5c158] text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-[#d4af37]"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <span className="hidden sm:inline font-bold">Panier</span>
              {cartTotal > 0 && (
                <span className="hidden sm:inline tabular-nums text-[11px] opacity-90 pl-1 border-l border-black/30 font-medium">
                  {formatFCFA(cartTotal)}
                </span>
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Slide-down Menu with Framer Motion AnimatePresence */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden overflow-hidden bg-[#0e0e14]/98 backdrop-blur-2xl border-b border-[#252535] px-4 py-5 space-y-3"
            >
              <div className="flex flex-col space-y-1.5">
                {[
                  { label: 'Accueil', href: '/' },
                  { label: 'Boutique & Catalogues', href: '/shop' },
                  { label: 'Pagnes Africains de Luxe', href: '/shop/pagnes' },
                  { label: 'Chaussures & Escarpins', href: '/shop/chaussures' },
                  { label: 'Collections Thématiques', href: '/collections' },
                  { label: 'La Maison BECCA SHOP', href: '/about' },
                  { label: 'Contact & Boutique Comé', href: '/contact' },
                  { label: currentUser ? 'Mon Espace Client' : 'Connexion / Inscription', href: currentUser ? '/account' : '/login' },
                  ...(isAdmin ? [{ label: 'Console Administrateur', href: '/admin' }] : []),
                ].map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-left px-3.5 py-2.5 rounded-xl text-sm font-medium text-white hover:bg-[#181822] hover:text-[#e5c158] transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="pt-3 border-t border-[#22222d] flex flex-col gap-2">
                <p className="text-xs text-[#a1a1aa]">Commander directement par WhatsApp :</p>
                <div className="flex gap-2">
                  <a
                    href={STORE_INFO.whatsappUrl1}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#25D366] text-black font-semibold text-xs rounded-xl shadow-md"
                  >
                    <MessageCircle className="w-4 h-4" />
                    +229 95 44 16 02
                  </a>
                  <a
                    href={STORE_INFO.whatsappUrl2}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#25D366] text-black font-semibold text-xs rounded-xl shadow-md"
                  >
                    <MessageCircle className="w-4 h-4" />
                    +229 41 46 55 06
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};
