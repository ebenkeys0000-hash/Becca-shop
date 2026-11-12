import React from 'react';
import { Link } from 'wouter';
import { STORE_INFO } from '../data/products';
import { Phone, MessageCircle, MapPin, Mail, ArrowUp, Lock } from 'lucide-react';

interface FooterProps {
  onSelectCategory: (category: 'all' | 'pagnes' | 'chaussures') => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#08080a] border-t border-[#1e1e26] text-[#a1a1aa] text-xs">
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand & Slogan Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-[#d4af37]/60 shadow-lg bg-black shrink-0">
                <img
                  src={STORE_INFO.logoUrl}
                  alt="Logo Officiel BECCA SHOP"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="font-luxury font-bold text-xl text-white tracking-widest block">
                  BECCA<span className="text-[#e5c158] font-normal"> SHOP</span>
                </span>
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#71717a]">
                  Comé · Bénin
                </span>
              </div>
            </div>

            <p className="text-xs text-[#d4d4d8] font-luxury italic text-[#e5c158]">
              « {STORE_INFO.tagline} »
            </p>

            <p className="text-xs text-[#71717a] leading-relaxed">
              La référence à Comé pour vos pagnes de cérémonie africains et vos chaussures féminines raffinées. Authenticité garantie et service sur-mesure.
            </p>
          </div>

          {/* Catalog Links Column */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-white font-bold">
              Collections
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onSelectCategory('all')}
                  className="hover:text-[#e5c158] transition-colors"
                >
                  Tous les modèles
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('pagnes')}
                  className="hover:text-[#e5c158] transition-colors"
                >
                  Pagnes Africains Wax
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('chaussures')}
                  className="hover:text-[#e5c158] transition-colors"
                >
                  Chaussures Femmes
                </button>
              </li>
              <li>
                <a href="#a-propos" className="hover:text-[#e5c158] transition-colors">
                  À Propos de la boutique
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Direct Column */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-white font-bold">
              Contacts & Commandes
            </h4>
            <div className="space-y-2 text-xs">
              <a
                href={`tel:${STORE_INFO.phone1}`}
                className="flex items-center gap-2 hover:text-[#e5c158] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#e5c158]" />
                <span className="font-mono">{STORE_INFO.phone1Display}</span>
              </a>
              <a
                href={`tel:${STORE_INFO.phone2}`}
                className="flex items-center gap-2 hover:text-[#e5c158] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#e5c158]" />
                <span className="font-mono">{STORE_INFO.phone2Display}</span>
              </a>
              <div className="flex items-start gap-2 pt-1 text-[#71717a]">
                <MapPin className="w-3.5 h-3.5 text-[#e5c158] shrink-0 mt-0.5" />
                <span>{STORE_INFO.fullAddress}</span>
              </div>
            </div>
          </div>

          {/* Payment & Reassurance Column */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-white font-bold">
              Modes de Règlement
            </h4>
            <p className="text-[11px] text-[#71717a] leading-relaxed">
              Paiement à la livraison ou au retrait à Comé, Mobile Money Bénin (MTN & Moov), et virements sécurisés.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-[10px] text-[#d4d4d8]">
              <span className="px-2 py-1 rounded bg-[#161620] border border-[#262635]">
                Espèces à la livraison
              </span>
              <span className="px-2 py-1 rounded bg-[#161620] border border-[#262635]">
                MTN MoMo (*880#)
              </span>
              <span className="px-2 py-1 rounded bg-[#161620] border border-[#262635]">
                Moov Money (*855#)
              </span>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[#181820] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-[#71717a] text-center sm:text-left">
            © {new Date().getFullYear()} BECCA SHOP. Tous droits réservés. Boutique de référence à Comé, Bénin.
          </p>

          <div className="flex items-center gap-4 text-xs">
            <Link
              href="/admin/login"
              className="text-[#71717a] hover:text-[#d4af37] transition-colors inline-flex items-center gap-1.5 text-[11px]"
            >
              <Lock className="w-3 h-3 text-[#d4af37]" />
              <span>Espace Direction</span>
            </Link>
            <span className="text-[#333344]">·</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-xs text-[#a1a1aa] hover:text-[#e5c158] transition-colors"
            >
              <span>Haut de page</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
