import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { formatFCFA, generateWhatsAppProductUrl } from '../utils/formatters';
import { STORE_INFO } from '../data/products';
import { X, Heart, ShoppingBag, MessageCircle, Check, Truck, ShieldCheck, MapPin } from 'lucide-react';
import { FabricZoomMagnifier } from './FabricZoomMagnifier';
import { overlayVariants, modalVariants } from '../utils/motion';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color?: string, quantity?: number) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}) => {
  if (!product) return null;

  const [selectedImageIdx, setSelectedImageIdx] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || '');
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors && product.colors.length > 0 ? product.colors[0].name : ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [addedNotice, setAddedNotice] = useState<boolean>(false);
  const [activeWhatsAppPhone, setActiveWhatsAppPhone] = useState<string>(STORE_INFO.phone1);

  const handleAdd = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const whatsAppUrl = generateWhatsAppProductUrl(
    activeWhatsAppPhone,
    product,
    selectedSize,
    selectedColor
  );

  return (
    <AnimatePresence>
      <motion.div
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
        className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl bg-[#121217] border border-[#d4af37]/40 rounded-3xl shadow-2xl overflow-hidden my-8"
        >
          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-[#1c1c24] text-[#d4d4d8] hover:text-white hover:bg-[#282834] transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </motion.button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
            
            {/* Left Column: Product Image Gallery & Fabric Zoom */}
            <div className="space-y-4">
              <FabricZoomMagnifier
                imageSrc={product.images[selectedImageIdx] || product.images[0]}
                altText={product.name}
                fabricName={product.name}
                isWaxOrBazin={product.category === 'pagnes'}
              />

              {/* Multi-angle Thumbnail Strip when available */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-3">
                  {product.images.map((img, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedImageIdx(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImageIdx === idx
                          ? 'border-[#e5c158] shadow-md shadow-[#e5c158]/20 scale-105'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Vue miniature ${idx + 1}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Guarantees Box */}
              <div className="p-4 rounded-2xl bg-[#16161f] border border-[#252532] space-y-2 text-xs text-[#a1a1aa]">
                <div className="flex items-center gap-2.5 text-white font-medium">
                  <MapPin className="w-4 h-4 text-[#e5c158] shrink-0" />
                  <span>Disponible immédiatement à Comé, Bénin</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Truck className="w-4 h-4 text-[#71717a] shrink-0" />
                  <span>Livraison Comé (1 000 FCFA) • Expédition Bénin (2 500 FCFA)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#71717a] shrink-0" />
                  <span>Paiement à la livraison / Retrait ou MTN/Moov Money sécurisé</span>
                </div>
              </div>
            </div>

            {/* Right Column: Contiguous Purchase Module */}
            <div className="flex flex-col justify-between space-y-5">
              <div>
                {/* Reference & Subcategory */}
                <div className="flex items-center justify-between text-xs text-[#a1a1aa] mb-1 font-medium">
                  <span className="uppercase tracking-widest">{product.subCategory}</span>
                  <span className="font-mono text-[#71717a]">RÉF : {product.reference}</span>
                </div>

                {/* Title */}
                <h2 className="font-luxury text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
                  {product.name}
                </h2>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#e5c158] tabular-nums">
                    {formatFCFA(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-[#71717a] line-through tabular-nums">
                      {formatFCFA(product.originalPrice)}
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="text-xs text-[#10b981] font-semibold">
                      Économisez {formatFCFA(product.originalPrice - product.price)}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#d4d4d8] leading-relaxed mb-5">
                  {product.description}
                </p>

                {/* Size / Metrage Variant Selector */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center text-xs font-semibold text-white mb-2">
                      <span>{product.category === 'pagnes' ? 'Métrage / Morceau' : 'Pointure disponible'}</span>
                      <span className="text-[#a1a1aa] font-normal text-[11px]">Faites votre choix</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <motion.button
                          key={size}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                            selectedSize === size
                              ? 'bg-[#e5c158] text-black font-bold shadow-md shadow-[#e5c158]/20'
                              : 'bg-[#191922] text-[#d4d4d8] hover:bg-[#232330] border border-[#2b2b38]'
                          }`}
                        >
                          {size}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Variant Selector */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs font-semibold text-white mb-2">
                      Couleur sélectionnée : <span className="text-[#e5c158] font-normal">{selectedColor}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      {product.colors.map((c) => (
                        <motion.button
                          key={c.name}
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          type="button"
                          onClick={() => setSelectedColor(c.name)}
                          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                            selectedColor === c.name
                              ? 'border-[#e5c158] scale-110 shadow-lg'
                              : 'border-transparent hover:border-[#71717a]'
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        >
                          {selectedColor === c.name && (
                            <Check className="w-3.5 h-3.5 text-white drop-shadow" />
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="mb-5 flex items-center gap-4">
                  <span className="text-xs font-semibold text-white">Quantité :</span>
                  <div className="flex items-center bg-[#181822] border border-[#2c2c38] rounded-xl overflow-hidden">
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 py-1.5 text-white hover:text-[#e5c158] text-sm font-bold"
                    >
                      -
                    </motion.button>
                    <motion.span
                      key={quantity}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="px-3 py-1.5 text-xs font-mono font-bold text-white tabular-nums"
                    >
                      {quantity}
                    </motion.span>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3.5 py-1.5 text-white hover:text-[#e5c158] text-sm font-bold"
                    >
                      +
                    </motion.button>
                  </div>
                  <span className="text-xs text-[#71717a]">
                    ({product.stock} pièces disponibles)
                  </span>
                </div>
              </div>

              {/* Action Buttons Section */}
              <div className="space-y-3 pt-3 border-t border-[#22222a]">
                {/* Primary: Add to Cart */}
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02, filter: 'brightness(1.08)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAdd}
                    className="flex-1 py-3.5 px-6 rounded-full bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#aa7c11] text-black font-extrabold text-sm tracking-wide shadow-xl shadow-[#d4af37]/25 flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{addedNotice ? '✓ Ajouté au panier !' : 'Ajouter au Panier'}</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onToggleWishlist(product)}
                    className={`p-3.5 rounded-full border transition-all ${
                      isWishlisted
                        ? 'bg-[#c59b27] text-black border-[#c59b27]'
                        : 'bg-[#181820] text-white border-[#2e2e3a] hover:border-[#e5c158]'
                    }`}
                    title={isWishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </motion.button>
                </div>

                {/* Direct WhatsApp Ordering with Number Switcher */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-[#a1a1aa]">
                    <span>Commander sur WhatsApp :</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveWhatsAppPhone(STORE_INFO.phone1)}
                        className={`text-[10px] px-2.5 py-0.5 rounded-md transition-colors ${
                          activeWhatsAppPhone === STORE_INFO.phone1
                            ? 'bg-[#e5c158] text-black font-bold'
                            : 'text-[#a1a1aa] hover:text-white'
                        }`}
                      >
                        N° 1 (95 44 16 02)
                      </button>
                      <button
                        onClick={() => setActiveWhatsAppPhone(STORE_INFO.phone2)}
                        className={`text-[10px] px-2.5 py-0.5 rounded-md transition-colors ${
                          activeWhatsAppPhone === STORE_INFO.phone2
                            ? 'bg-[#e5c158] text-black font-bold'
                            : 'text-[#a1a1aa] hover:text-white'
                        }`}
                      >
                        N° 2 (41 46 55 06)
                      </button>
                    </div>
                  </div>

                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/50 text-[#25D366] font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-md"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Commander cet article sur WhatsApp ({activeWhatsAppPhone === STORE_INFO.phone1 ? STORE_INFO.phone1Display : STORE_INFO.phone2Display})</span>
                  </motion.a>
                </div>

                {/* Details & Specifications Preview */}
                {product.details && product.details.length > 0 && (
                  <div className="pt-2">
                    <h4 className="text-[11px] uppercase tracking-wider text-[#a1a1aa] font-semibold mb-1">
                      Caractéristiques :
                    </h4>
                    <ul className="text-xs text-[#a1a1aa] space-y-1 list-disc list-inside">
                      {product.details.map((detail, idx) => (
                        <li key={idx}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

            </div>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
