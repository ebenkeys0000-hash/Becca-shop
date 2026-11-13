import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'motion/react';
import { useStore } from '../../context/StoreContext';
import { formatFCFA } from '../../utils/formatters';
import { SafeImage } from '../../components/SafeImage';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  PackageCheck,
  Tag,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Truck,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const { cartItems, updateCartQuantity, removeFromCart, promotions, settings } = useStore();
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<any | null>(null);
  const [promoError, setPromoError] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'come_pickup' | 'come_home' | 'benin_shipping'>('come_home');

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.appliedUnitPrice * item.quantity,
    0
  );

  // Compute wholesale total savings
  const wholesaleSavings = cartItems.reduce((acc, item) => {
    if (item.isWholesalePriceApplied) {
      const regularPrice = item.product.price;
      const saved = Math.max(0, regularPrice - item.appliedUnitPrice) * item.quantity;
      return acc + saved;
    }
    return acc;
  }, 0);

  // Apply promo
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const found = promotions.find(
      (p) => p.code.toUpperCase() === promoInput.trim().toUpperCase() && p.isActive
    );
    if (!found) {
      setPromoError('Code promo invalide ou expiré.');
      return;
    }
    setAppliedPromo(found);
  };

  const discountAmount = appliedPromo
    ? appliedPromo.discountType === 'percentage'
      ? Math.round((subtotal * appliedPromo.discountValue) / 100)
      : appliedPromo.discountValue
    : 0;

  const deliveryFee =
    deliveryMethod === 'come_pickup'
      ? 0
      : deliveryMethod === 'come_home'
      ? settings.deliveryFeeComeHome || 1000
      : settings.deliveryFeeBenin || 3000;

  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center py-20 px-4 text-center bg-[#0a0a0d]">
        <div className="w-20 h-20 rounded-full bg-[#161622] border border-[#2b2b3d] flex items-center justify-center mb-6 text-[#a1a1aa]">
          <ShoppingBag className="w-10 h-10 text-[#d4af37]" />
        </div>
        <h1 className="font-luxury text-3xl font-bold text-white mb-2">Votre Panier est Vide</h1>
        <p className="text-xs text-[#a1a1aa] max-w-sm mb-8">
          Vous n'avez pas encore sélectionné de pagnes ou souliers. Parcourez notre collection exclusive et composez votre tenue d'apparat.
        </p>
        <Link
          href="/shop"
          className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#aa7c11] text-black font-extrabold text-xs uppercase tracking-wider shadow-xl shadow-[#d4af37]/20 hover:brightness-110 transition-all"
        >
          Découvrir la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 bg-[#0a0a0d] min-h-screen text-[#f3f3f6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 pb-6 border-b border-[#20202e] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#e5c158]">
              Récapitulatif de votre commande
            </span>
            <h1 className="font-luxury text-3xl sm:text-4xl font-bold text-white tracking-tight mt-1">
              Mon Panier d'Achats ({cartItems.reduce((s, i) => s + i.quantity, 0)})
            </h1>
          </div>
          <Link href="/shop" className="text-xs text-[#e5c158] hover:underline font-medium">
            ← Continuer mes achats
          </Link>
        </div>

        {/* Wholesale Banner if applicable */}
        {wholesaleSavings > 0 && (
          <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-[#1b1911] via-[#16151a] to-[#1a1710] border border-[#d4af37]/40 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <PackageCheck className="w-6 h-6 text-[#e5c158] shrink-0" />
              <div>
                <span className="text-xs font-bold text-[#e5c158] uppercase tracking-wider block">
                  Avantage Tarif de Gros Activé !
                </span>
                <p className="text-xs text-[#a1a1aa]">
                  Vous bénéficiez de réductions spéciales volume sur vos articles.
                </p>
              </div>
            </div>
            <span className="text-sm font-bold text-[#10b981] whitespace-nowrap">
              - {formatFCFA(wholesaleSavings)} d'économie
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Cart Table (Left Column) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-[#111117] border border-[#222230] rounded-3xl overflow-hidden shadow-xl">
              <div className="p-4 sm:p-6 divide-y divide-[#20202d]">
                {cartItems.map((item) => {
                  const lineTotal = item.appliedUnitPrice * item.quantity;
                  return (
                    <div key={item.id} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      {/* Product Thumbnail & Details */}
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-24 rounded-xl overflow-hidden bg-black border border-[#2a2a3a] shrink-0">
                          <SafeImage
                            src={item.product.images[0]}
                            alt={item.product.name}
                            compactFallback
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="space-y-1">
                          <Link href={`/product/${item.product.id}`} className="font-luxury text-base font-bold text-white hover:text-[#e5c158] transition-colors">
                            {item.product.name}
                          </Link>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-[#a1a1aa]">
                            <span>Réf: {item.product.reference}</span>
                            <span>•</span>
                            <span>Format/Taille: <strong className="text-white">{item.selectedSize}</strong></span>
                            {item.selectedColor && (
                              <>
                                <span>•</span>
                                <span>Couleur: <strong className="text-white">{item.selectedColor}</strong></span>
                              </>
                            )}
                          </div>

                          <div className="flex items-center gap-2 pt-1">
                            <span className="text-sm font-bold text-[#e5c158]">
                              {formatFCFA(item.appliedUnitPrice)}
                            </span>
                            {item.isWholesalePriceApplied && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#181824] text-[#10b981] border border-[#10b981]/40">
                                Prix de gros
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quantity Stepper & Subtotal */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
                        <div className="flex items-center gap-2 bg-[#171722] border border-[#2e2e42] rounded-xl p-1">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-lg bg-[#222230] hover:bg-[#2c2c3e] text-white flex items-center justify-center font-bold text-xs"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-white tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-lg bg-[#222230] hover:bg-[#2c2c3e] text-white flex items-center justify-center font-bold text-xs"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-bold text-white tabular-nums">
                            {formatFCFA(lineTotal)}
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-xs text-[#ef4444] hover:underline inline-flex items-center gap-1 mt-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Supprimer</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery Method Selection in Cart */}
            <div className="p-6 bg-[#111117] border border-[#222230] rounded-3xl shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#e5c158]">
                <Truck className="w-4 h-4" />
                <span>Option d'expédition souhaitée</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('come_pickup')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    deliveryMethod === 'come_pickup'
                      ? 'bg-[#222017] border-[#e5c158] text-white shadow-md'
                      : 'bg-[#161620] border-[#252535] text-[#a1a1aa] hover:border-white'
                  }`}
                >
                  <div className="text-xs font-bold text-white">Retrait à la boutique</div>
                  <div className="text-[11px] text-[#71717a] mt-0.5">Comé, Mono</div>
                  <div className="text-xs font-bold text-[#10b981] mt-2">Gratuit</div>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod('come_home')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    deliveryMethod === 'come_home'
                      ? 'bg-[#222017] border-[#e5c158] text-white shadow-md'
                      : 'bg-[#161620] border-[#252535] text-[#a1a1aa] hover:border-white'
                  }`}
                >
                  <div className="text-xs font-bold text-white">Livraison Comé Ville</div>
                  <div className="text-[11px] text-[#71717a] mt-0.5">À votre domicile</div>
                  <div className="text-xs font-bold text-[#e5c158] mt-2">{formatFCFA(1000)}</div>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod('benin_shipping')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    deliveryMethod === 'benin_shipping'
                      ? 'bg-[#222017] border-[#e5c158] text-white shadow-md'
                      : 'bg-[#161620] border-[#252535] text-[#a1a1aa] hover:border-white'
                  }`}
                >
                  <div className="text-xs font-bold text-white">Expédition Tout Bénin</div>
                  <div className="text-[11px] text-[#71717a] mt-0.5">Cotonou, Parakou, etc.</div>
                  <div className="text-xs font-bold text-[#e5c158] mt-2">{formatFCFA(3000)}</div>
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary (Right Column) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#111117] border border-[#222230] rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
              <h2 className="font-luxury text-xl font-bold text-white pb-4 border-b border-[#222230]">
                Total de la Commande
              </h2>

              {/* Promo code form */}
              <div>
                <label className="block text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider mb-2">
                  Code Privilège / Promotion
                </label>
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="ex: BECCA10"
                    className="flex-1 px-3.5 py-2.5 bg-[#181822] border border-[#2e2e40] rounded-xl text-white text-xs placeholder-[#71717a] uppercase outline-none focus:border-[#e5c158]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-[#222230] hover:bg-[#2c2c3e] text-white font-bold text-xs uppercase transition-colors"
                  >
                    Appliquer
                  </button>
                </form>
                {promoError && <p className="text-[11px] text-[#ef4444] mt-1">{promoError}</p>}
                {appliedPromo && (
                  <p className="text-[11px] text-[#10b981] mt-1 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Code {appliedPromo.code} appliqué (-{appliedPromo.discountValue}{appliedPromo.discountType === 'percentage' ? '%' : ' FCFA'})</span>
                  </p>
                )}
              </div>

              {/* Price Lines */}
              <div className="space-y-3 pt-4 border-t border-[#20202d] text-xs">
                <div className="flex items-center justify-between text-[#a1a1aa]">
                  <span>Sous-total articles</span>
                  <span className="font-mono text-white">{formatFCFA(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-[#10b981] font-semibold">
                    <span>Remise code promo</span>
                    <span className="font-mono">- {formatFCFA(discountAmount)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-[#a1a1aa]">
                  <span>Frais de livraison</span>
                  <span className="font-mono text-white">
                    {deliveryFee === 0 ? 'Gratuit' : formatFCFA(deliveryFee)}
                  </span>
                </div>

                <div className="pt-4 border-t border-[#252538] flex items-baseline justify-between text-white">
                  <div>
                    <span className="font-luxury text-base font-bold">Total Net à Régler</span>
                    <span className="block text-[10px] text-[#71717a]">Taxes incluses</span>
                  </div>
                  <span className="font-luxury text-2xl font-black text-[#e5c158] font-mono">
                    {formatFCFA(grandTotal)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => setLocation('/checkout')}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#aa7c11] text-black font-extrabold text-xs uppercase tracking-wider shadow-xl shadow-[#d4af37]/25 hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                <span>Procéder à la Caisse</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#71717a] pt-2">
                <ShieldCheck className="w-4 h-4 text-[#e5c158]" />
                <span>Paiement sécurisé · Validation humaine</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
