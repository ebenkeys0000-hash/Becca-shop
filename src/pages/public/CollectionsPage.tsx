import React from 'react';
import { Link } from 'wouter';
import { CATEGORIES } from '../../data/products';
import { Sparkles, ArrowRight } from 'lucide-react';
import { SafeImage } from '../../components/SafeImage';

export const CollectionsPage: React.FC = () => {
  return (
    <div className="py-16 bg-[#0a0a0d] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181612] border border-[#d4af37]/30 text-xs font-semibold text-[#e5c158] uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Catalogue Thématique</span>
          </div>
          <h1 className="font-luxury text-3xl sm:text-4xl font-extrabold text-white">
            Nos Univers de Collections
          </h1>
          <p className="text-xs sm:text-sm text-[#a1a1aa]">
            Choisissez votre univers pour explorer les modèles disponibles en boutique physique et livraison partout au Bénin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="group relative overflow-hidden rounded-3xl bg-[#13131b] border border-[#272736] hover:border-[#d4af37]/60 transition-all shadow-xl"
            >
              <div className="h-80 sm:h-96 w-full overflow-hidden relative">
                <SafeImage
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090d] via-[#09090d]/40 to-transparent" />
              </div>

              <div className="absolute bottom-0 inset-x-0 p-8 flex flex-col justify-end">
                <span className="text-xs font-bold text-[#e5c158] uppercase tracking-widest mb-1">
                  {cat.count}
                </span>
                <h3 className="font-luxury text-2xl sm:text-3xl font-bold text-white mb-2">
                  {cat.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#d4d4d8] mb-4">
                  {cat.subtitle}
                </p>

                <div>
                  <Link
                    href={`/shop/${cat.id}`}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all"
                  >
                    <span>Explorer le rayon</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Subcategories pill showcase */}
        <div className="p-8 rounded-3xl bg-[#12121a] border border-[#232332] space-y-6">
          <h3 className="font-luxury text-xl font-bold text-white text-center">
            Les Spécialités Phares chez BECCA SHOP
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <Link
              href="/shop/pagnes"
              className="p-4 rounded-xl bg-[#191924] hover:bg-[#202030] border border-[#28283a] text-xs text-white font-medium transition-colors"
            >
              <span className="text-[#e5c158] block mb-1 font-bold">Super Wax</span>
              <span className="text-[11px] text-[#a1a1aa]">Coton peigné & Dorures</span>
            </Link>
            <Link
              href="/shop/pagnes"
              className="p-4 rounded-xl bg-[#191924] hover:bg-[#202030] border border-[#28283a] text-xs text-white font-medium transition-colors"
            >
              <span className="text-[#e5c158] block mb-1 font-bold">Soie Wax Royale</span>
              <span className="text-[11px] text-[#a1a1aa]">Drapé fluide de prestige</span>
            </Link>
            <Link
              href="/shop/chaussures"
              className="p-4 rounded-xl bg-[#191924] hover:bg-[#202030] border border-[#28283a] text-xs text-white font-medium transition-colors"
            >
              <span className="text-[#e5c158] block mb-1 font-bold">Escarpins Stiletto</span>
              <span className="text-[11px] text-[#a1a1aa]">Talons 8 à 10 cm soirée</span>
            </Link>
            <Link
              href="/shop/chaussures"
              className="p-4 rounded-xl bg-[#191924] hover:bg-[#202030] border border-[#28283a] text-xs text-white font-medium transition-colors"
            >
              <span className="text-[#e5c158] block mb-1 font-bold">Mules & Sandales</span>
              <span className="text-[11px] text-[#a1a1aa]">Cuir & Talons carrés confort</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
