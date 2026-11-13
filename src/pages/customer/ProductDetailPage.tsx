import React, { useState, useMemo } from 'react';
import { useRoute, Link } from 'wouter';
import { motion } from 'motion/react';
import { useStore } from '../../context/StoreContext';
import { formatFCFA } from '../../utils/formatters';
import { STORE_INFO } from '../../data/products';
import { ProductCard } from '../../components/ProductCard';
import { FabricZoomMagnifier } from '../../components/FabricZoomMagnifier';
import { SafeImage } from '../../components/SafeImage';
import {
  ShoppingBag,
  Heart,
  CheckCircle2,
  PackageCheck,
  ShieldCheck,
  Truck,
  MessageCircle,
  ArrowLeft,
  Sparkles,
  Info,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const [, params] = useRoute('/product/:id');
  const productId = params?.id;
  const { products, addToCart, toggleWishlist, isInWishlist, calculateUnitPrice } = useStore();

  const product = products.find((p) => p.id === productId);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  // Initialize size & color
  React.useEffect(() => {
    if (product) {
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0].name);
      }
      setActiveImageIndex(0);
      setQuantity(1);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 px-4 text-center bg-[#0a0a0d]">
        <h2 className="font-luxury text-2xl font-bold text-white mb-2">Article non trouvé</h2>
        <p className="text-xs text-[#a1a1aa] mb-6">Ce modèle est temporairement indisponible ou a été retiré du catalogue.</p>
        <Link
          href="/shop"
          className="px-6 py-3 rounded-full bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wider shadow-lg"
        >
          Retourner au catalogue
        </Link>
      </div>
    );
  }

  // Live Unit Price & Wholesale calculation based on current quantity
  const { unitPrice, isWholesale, savingsPerUnit } = calculateUnitPrice(product, quantity);
  const lineTotal = unitPrice * quantity;

  const handleAdd = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const whatsappMessage = encodeURIComponent(
    `Bonjour BECCA SHOP ! Je souhaite commander ce modèle :\n\n` +
    `• Article : ${product.name}\n` +
    `• Référence : ${product.reference}\n` +
    `• Taille / Format : ${selectedSize}\n` +
    (selectedColor ? `• Teinte : ${selectedColor}\n` : '') +
    `• Quantité : ${quantity}\n` +
    `• Prix unitaire : ${formatFCFA(unitPrice)}\n` +
    `• Montant estimé : ${formatFCFA(lineTotal)}\n\n` +
    `Pouvez-vous confirmer la disponibilité à la boutique de Comé ? Merci !`
  );

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="py-10 bg-[#0a0a0d] min-h-screen text-[#f3f3f6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#a1a1aa] mb-8">
          <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-white transition-colors">Boutique</Link>
          <span>/</span>
          <Link
            href={product.category === 'pagnes' ? '/shop/pagnes' : '/shop/chaussures'}
            className="hover:text-white transition-colors capitalize"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-[#e5c158] truncate max-w-[200px] sm:max-w-none">{product.name}</span>
        </div>

        {/* Product Hero Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 bg-[#111117] border border-[#222230] rounded-3xl p-6 sm:p-10 shadow-2xl">
          {/* Left Column: Gallery & Fabric Magnifier */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative">
              <FabricZoomMagnifier
                imageSrc={product.images[activeImageIndex] || product.images[0]}
                altText={product.name}
                fabricName={product.name}
                isWaxOrBazin={product.category === 'pagnes'}
              />

              {/* Wishlist Button floating */}
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`absolute top-16 right-4 p-3 rounded-full backdrop-blur-md transition-all z-20 ${
                  isInWishlist(product.id)
                    ? 'bg-[#c59b27] text-black shadow-lg shadow-[#c59b27]/30'
                    : 'bg-black/60 text-white hover:text-[#e5c158] border border-white/10'
                }`}
                title="Ajouter aux favoris"
              >
                <Heart className="w-5 h-5 fill-current" />
              </button>

              {/* Status Badges */}
              <div className="absolute top-16 left-4 flex flex-col gap-1.5 z-20 pointer-events-none">
                {product.isNew && (
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#d4af37] text-black shadow-md">
                    Nouveauté
                  </span>
                )}
                {product.isPromo && (
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#ef4444] text-white shadow-md">
                    Promotion
                  </span>
                )}
                {product.wholesaleEligible && (
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#181824]/90 text-[#e5c158] border border-[#e5c158]/40 shadow-md">
                    Tarif de Gros
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail selector */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-[#e5c158] scale-105 shadow-md'
                        : 'border-[#262635] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <SafeImage
                      src={img}
                      alt={`${product.name} - vue ${idx + 1}`}
                      compactFallback
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information & Purchase options */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#a1a1aa]">
                  Réf. {product.reference} · {product.subCategory}
                </span>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                  product.stock > 5
                    ? 'bg-[#10b981]/15 text-[#10b981] border-[#10b981]/30'
                    : product.stock > 0
                    ? 'bg-[#f59e0b]/15 text-[#f59e0b] border-[#f59e0b]/30'
                    : 'bg-[#ef4444]/15 text-[#ef4444] border-[#ef4444]/30'
                }`}>
                  {product.stock > 5
                    ? 'En stock à Comé'
                    : product.stock > 0
                    ? `Plus que ${product.stock} disponibles`
                    : 'Épuisé'}
                </span>
              </div>

              <h1 className="font-luxury text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                {product.name}
              </h1>

              {/* Price display with wholesale dynamic calculation */}
              <div className="mt-4 p-4 rounded-2xl bg-[#171622] border border-[#2b2a3a] flex flex-wrap items-baseline gap-3">
                <div className="text-3xl font-extrabold text-[#e5c158] tracking-tight">
                  {formatFCFA(unitPrice)}
                </div>
                {product.originalPrice && !isWholesale && (
                  <div className="text-sm text-[#71717a] line-through">
                    {formatFCFA(product.originalPrice)}
                  </div>
                )}
                <div className="text-xs text-[#a1a1aa] font-medium">/ l'unité</div>

                {isWholesale && (
                  <div className="w-full mt-2 pt-2 border-t border-[#2d2c3e] flex items-center justify-between text-xs text-[#10b981] font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Tarif de gros appliqué automatiquement</span>
                    </span>
                    <span>Économie : {formatFCFA(savingsPerUnit * quantity)}</span>
                  </div>
                )}
              </div>

              {/* Wholesale Tier Pricing Table */}
              {product.wholesaleEligible && product.wholesaleTiers && product.wholesaleTiers.length > 0 && (
                <div className="mt-5 p-4 rounded-2xl bg-[#14141e] border border-[#d4af37]/30">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#e5c158] mb-2 uppercase tracking-wider">
                    <PackageCheck className="w-4 h-4" />
                    <span>Barème des prix dégressifs (Gros & Demi-gros)</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-xl bg-[#1b1a26] border border-[#2b2a3b]">
                      <div className="text-[10px] text-[#a1a1aa]">Détail (1-4 pcs)</div>
                      <div className="font-bold text-white mt-0.5">{formatFCFA(product.price)}</div>
                    </div>
                    {product.wholesaleTiers.map((tier, idx) => {
                      const isActiveTier =
                        quantity >= tier.minQty && (!tier.maxQty || quantity <= tier.maxQty);
                      return (
                        <div
                          key={idx}
                          className={`p-2 rounded-xl border transition-all ${
                            isActiveTier
                              ? 'bg-[#292415] border-[#e5c158] text-[#e5c158] font-bold shadow-sm'
                              : 'bg-[#1b1a26] border-[#2b2a3b] text-[#d4d4d8]'
                          }`}
                        >
                          <div className="text-[10px] text-[#a1a1aa]">
                            {tier.maxQty ? `${tier.minQty} - ${tier.maxQty} pcs` : `${tier.minQty}+ pcs`}
                          </div>
                          <div className="font-bold mt-0.5">{formatFCFA(tier.unitPrice)}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="mt-5 text-xs text-[#a1a1aa] leading-relaxed">
                {product.description}
              </div>

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mt-6">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#d4d4d8] mb-2">
                    {product.category === 'pagnes' ? 'Format / Conditionnement' : 'Pointure disponible'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                          selectedSize === sz
                            ? 'bg-[#d4af37] text-black border-[#d4af37] shadow-md'
                            : 'bg-[#181822] text-[#d4d4d8] border-[#2e2e40] hover:border-white'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#d4d4d8] mb-2">
                    Teinte sélectionnée : <span className="text-[#e5c158]">{selectedColor}</span>
                  </label>
                  <div className="flex gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`w-8 h-8 rounded-full border-2 transition-transform ${
                          selectedColor === c.name ? 'border-[#e5c158] scale-110 shadow-lg' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector & Live Total */}
              <div className="mt-6 flex items-center justify-between gap-4 p-4 rounded-2xl bg-[#171622] border border-[#282738]">
                <div>
                  <span className="text-xs text-[#a1a1aa] block">Quantité commandée</span>
                  <span className="text-xs font-bold text-white">
                    Sous-total : <span className="text-[#e5c158] font-mono">{formatFCFA(lineTotal)}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-[#101016] border border-[#303044] rounded-xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg bg-[#1c1c28] hover:bg-[#282838] text-white flex items-center justify-center font-bold text-sm"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-12 text-center bg-transparent text-white font-bold text-xs outline-none"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-[#1c1c28] hover:bg-[#282838] text-white flex items-center justify-center font-bold text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-[#222230]">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAdd}
                disabled={product.stock === 0}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#aa7c11] text-black font-extrabold text-xs uppercase tracking-wider shadow-xl shadow-[#d4af37]/25 hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4 text-black" />
                <span>Ajouter au Panier · {formatFCFA(lineTotal)}</span>
              </motion.button>

              <a
                href={`https://wa.me/22995441602?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Commander directement par WhatsApp</span>
              </a>

              {addedToast && (
                <div className="p-3 rounded-xl bg-[#10b981]/15 border border-[#10b981]/30 text-[#10b981] text-xs font-semibold flex items-center justify-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Article ajouté au panier !</span>
                  <Link href="/cart" className="underline ml-2">Voir le panier</Link>
                </div>
              )}
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#222230] text-[11px] text-[#a1a1aa]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#e5c158]" />
                <span>100% Qualité d'Origine</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#e5c158]" />
                <span>Livraison rapide Bénin</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#e5c158] font-bold">Suggestions</span>
                <h2 className="font-luxury text-2xl font-bold text-white">Vous Aimerez Aussi</h2>
              </div>
              <Link href="/shop" className="text-xs text-[#e5c158] hover:underline">
                Voir toute la collection →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onOpenQuickView={() => {}}
                  onAddToCart={(prod, sz, col) => addToCart(prod, sz, col, 1)}
                  onToggleWishlist={toggleWishlist}
                  isWishlisted={isInWishlist(p.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
