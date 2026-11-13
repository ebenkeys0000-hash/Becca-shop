import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { formatFCFA } from '../utils/formatters';
import { Heart, ShoppingBag, Eye, MessageCircle, Check, ImageOff } from 'lucide-react';
import { resolveImageUrl } from '../assets/images';

interface ProductCardProps {
  product: Product;
  onOpenQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color?: string) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenQuickView,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [addedDirectly, setAddedDirectly] = useState(false);

  const primarySrc = resolveImageUrl(product.images?.[0]);
  const rawSecondary = product.images && product.images.length > 1 ? resolveImageUrl(product.images[1]) : '';
  const hasSecondaryImage = Boolean(rawSecondary);

  const [primaryLoaded, setPrimaryLoaded] = useState(false);
  const [primaryError, setPrimaryError] = useState(!primarySrc);
  const [secondaryError, setSecondaryError] = useState(!rawSecondary);

  useEffect(() => {
    setPrimaryLoaded(false);
    setPrimaryError(!primarySrc);
    setSecondaryError(!rawSecondary);
  }, [primarySrc, rawSecondary]);

  const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : '';
  const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0].name : undefined;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, defaultSize, defaultColor);
    setAddedDirectly(true);
    setTimeout(() => setAddedDirectly(false), 1600);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-[#111116] border border-[#21212b] hover:border-[#d4af37]/50 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-black/80"
    >
      {/* Visual Asset Container with Secondary Image on Hover */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#16161e]">
        {/* Primary Image */}
        {primaryError || !primarySrc ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#16161f] via-[#101016] to-[#0a0a0d] text-center p-4 gap-2 absolute inset-0">
            <div className="w-10 h-10 rounded-full bg-[#1e1b12] border border-[#d4af37]/30 flex items-center justify-center text-[#e5c158]">
              <ImageOff className="w-4 h-4" />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-[#e5c158] font-semibold">
              BECCA SHOP
            </span>
            <span className="text-[11px] text-[#71717a] line-clamp-2">{product.name}</span>
          </div>
        ) : (
          <motion.img
            src={primarySrc}
            alt={product.name}
            animate={{
              opacity: hasSecondaryImage && !secondaryError && isHovered ? 0 : 1,
              scale: isHovered ? 1.08 : 1,
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            onLoad={() => setPrimaryLoaded(true)}
            onError={() => {
              setPrimaryError(true);
              setPrimaryLoaded(true);
            }}
            className={`w-full h-full object-cover object-center absolute inset-0 ${
              !primaryLoaded ? 'bg-[#16161f] animate-pulse' : ''
            }`}
            referrerPolicy="no-referrer"
            loading="lazy"
            decoding="async"
          />
        )}

        {/* Secondary Image on Hover (fades in smoothly) */}
        {hasSecondaryImage && !secondaryError && rawSecondary && (
          <motion.img
            src={rawSecondary}
            alt={`${product.name} vue alternative`}
            initial={{ opacity: 0 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            onError={() => setSecondaryError(true)}
            className="w-full h-full object-cover object-center absolute inset-0"
            referrerPolicy="no-referrer"
            loading="lazy"
            decoding="async"
          />
        )}

        {/* Dark subtle gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Top Floating Actions: Wishlist with Spring scale bounce */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all shadow-md ${
              isWishlisted
                ? 'bg-[#c59b27] text-black'
                : 'bg-black/60 text-white/80 hover:text-white hover:bg-black/90 border border-white/10'
            }`}
            title={isWishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <motion.div
              animate={{ scale: isWishlisted ? [1, 1.35, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
            </motion.div>
          </motion.button>
        </div>

        {/* Action Bar on Hover */}
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 8 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-x-3 bottom-3 flex gap-2 z-10"
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onOpenQuickView(product)}
            className="flex-1 py-2 rounded-xl bg-[#0c0c10]/95 hover:bg-[#0c0c10] text-white text-xs font-medium border border-[#383846] hover:border-[#e5c158] backdrop-blur-md transition-colors flex items-center justify-center gap-1.5 shadow-lg"
          >
            <Eye className="w-3.5 h-3.5 text-[#e5c158]" />
            <span>Aperçu</span>
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleQuickAdd}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center shadow-lg ${
              addedDirectly
                ? 'bg-[#10b981] text-white'
                : 'bg-[#d4af37] hover:bg-[#e5c158] text-black'
            }`}
            title="Ajout direct au panier"
          >
            {addedDirectly ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <ShoppingBag className="w-3.5 h-3.5" />
            )}
          </motion.button>
        </motion.div>
      </div>

      {/* Product Information Container */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Zero-Pill Clean Metadata: Category · Reference */}
          <div className="flex items-center gap-2 text-[11px] text-[#a1a1aa] uppercase tracking-wider mb-1.5 font-medium">
            <span>{product.subCategory}</span>
            <span aria-hidden="true" className="text-[#3f3f4a]">·</span>
            <span className="font-mono text-[#71717a] text-[10px]">{product.reference}</span>
          </div>

          {/* Product Name with luxury font */}
          <h3
            onClick={() => onOpenQuickView(product)}
            className="font-luxury font-bold text-sm sm:text-base text-white hover:text-[#e5c158] transition-colors cursor-pointer line-clamp-1 leading-snug"
          >
            {product.name}
          </h3>

          {/* Availability Status as subtle text */}
          <div className="mt-1 text-xs">
            {product.status === 'low_stock' ? (
              <span className="text-[#f59e0b] font-medium text-[11px]">Dernières pièces en boutique</span>
            ) : product.status === 'out_of_stock' ? (
              <span className="text-[#ef4444] text-[11px]">Rupture de stock temporaire</span>
            ) : (
              <span className="text-[#10b981] text-[11px]">En stock à Comé</span>
            )}
          </div>
        </div>

        {/* Price & Direct WhatsApp Action Row */}
        <div className="pt-3.5 mt-3.5 border-t border-[#1c1c24] flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-bold text-[#e5c158] tabular-nums tracking-tight">
                {formatFCFA(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-[#71717a] line-through tabular-nums">
                  {formatFCFA(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Direct WhatsApp Quick Order */}
          <motion.a
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            href={`https://wa.me/22995441602?text=${encodeURIComponent(
              `Bonjour BECCA SHOP, je souhaite des infos ou commander cet article : *${product.name}* (Réf: ${product.reference}) au prix de ${formatFCFA(product.price)}.`
            )}`}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-xl text-[#25D366] bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 transition-colors"
            title="Commander directement via WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </motion.a>
        </div>

      </div>
    </motion.div>
  );
};
