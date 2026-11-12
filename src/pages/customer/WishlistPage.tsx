import React from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../../components/ProductCard';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, toggleWishlist, addToCart, isInWishlist } = useStore();

  return (
    <div className="py-12 bg-[#0a0a0d] min-h-screen text-[#f3f3f6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#a1a1aa] mb-6">
          <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
          <span>/</span>
          <Link href="/account" className="hover:text-white transition-colors">Mon Compte</Link>
          <span>/</span>
          <span className="text-[#e5c158]">Mes Favoris</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-[#222230]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#e5c158]">
              Sélection Coups de Cœur
            </span>
            <h1 className="font-luxury text-3xl font-bold text-white tracking-tight mt-1">
              Ma Wishlist ({wishlist.length})
            </h1>
          </div>
          <Link href="/shop" className="text-xs text-[#e5c158] hover:underline font-medium">
            Explorer le catalogue →
          </Link>
        </div>

        {wishlist.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-[#111117] rounded-3xl border border-[#222230] p-8 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#1b1a26] text-[#e5c158] flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="font-luxury text-xl font-bold text-white">Votre liste d'envies est vide</h2>
            <p className="text-xs text-[#a1a1aa]">
              Enregistrez vos pagnes préférés et vos escarpins de rêve pour vos prochaines sorties et cérémonies.
            </p>
            <Link
              href="/shop"
              className="inline-block px-6 py-3 rounded-full bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wider shadow-lg"
            >
              Découvrir la collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {wishlist.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenQuickView={() => {}}
                  onAddToCart={(p, size, color) => addToCart(p, size, color, 1)}
                  onToggleWishlist={toggleWishlist}
                  isWishlisted={isInWishlist(product.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
