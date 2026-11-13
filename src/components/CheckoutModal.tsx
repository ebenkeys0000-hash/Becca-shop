import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, OrderDetails } from '../types';
import { formatFCFA } from '../utils/formatters';
import { X, ShieldCheck, MapPin, User, CheckCircle2 } from 'lucide-react';
import { STORE_INFO } from '../data/products';
import { overlayVariants, modalVariants } from '../utils/motion';
import { SafeImage } from './SafeImage';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderComplete: (order: OrderDetails) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderComplete,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [city, setCity] = useState('Comé');
  const [address, setAddress] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'come_pickup' | 'come_home' | 'benin_shipping'>('come_pickup');
  const [paymentMethod, setPaymentMethod] = useState<'delivery' | 'mtn_momo' | 'moov_money' | 'card'>('delivery');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);

  const shippingFee =
    deliveryMethod === 'come_pickup'
      ? 0
      : deliveryMethod === 'come_home'
      ? 1000
      : 2500;

  const total = subtotal + shippingFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim()) {
      setErrorMsg('Veuillez renseigner votre nom complet.');
      return;
    }

    if (!customerPhone.trim() || customerPhone.replace(/\D/g, '').length < 8) {
      setErrorMsg('Veuillez renseigner un numéro de téléphone valide pour la livraison.');
      return;
    }

    if (!address.trim() && deliveryMethod !== 'come_pickup') {
      setErrorMsg('Veuillez préciser votre quartier ou repère de livraison.');
      return;
    }

    setIsSubmitting(true);

    const generatedOrderId = `BS-${Math.floor(10000 + Math.random() * 90000)}`;

    const order: OrderDetails = {
      orderId: generatedOrderId,
      customerName,
      customerPhone,
      customerEmail: customerEmail.trim() || undefined,
      city,
      address: address.trim() || (deliveryMethod === 'come_pickup' ? 'Boutique BECCA SHOP, Comé' : ''),
      notes: notes.trim() || undefined,
      deliveryMethod,
      paymentMethod,
      items,
      subtotal,
      shippingFee,
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onOrderComplete(order);
    }, 400);
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="relative w-full max-w-2xl bg-[#121217] border border-[#d4af37]/40 rounded-3xl shadow-2xl overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 border-b border-[#242432] flex items-center justify-between bg-[#15151c]">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full overflow-hidden border border-[#d4af37]/60 shrink-0 bg-black shadow-md">
                  <SafeImage
                    src={STORE_INFO.logoUrl}
                    alt="Logo BECCA SHOP"
                    compactFallback
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="font-luxury text-xl font-bold text-white">Finaliser votre commande</h2>
                  <p className="text-xs text-[#a1a1aa] mt-0.5">
                    Renseignez vos coordonnées pour la préparation et l'expédition
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-xl text-[#a1a1aa] hover:text-white hover:bg-[#20202c] transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 rounded-xl bg-red-950/50 border border-red-500/50 text-red-200 text-xs"
                >
                  {errorMsg}
                </motion.div>
              )}

              {/* Section 1: Coordonnées du Client */}
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-wider text-[#e5c158] font-bold flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>1. Vos Coordonnées</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#d4d4d8] mb-1.5">
                      Nom et Prénom(s) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ex : Clarisse Kpadonou"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#181822] border border-[#2b2b38] text-white text-xs focus:border-[#e5c158] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#d4d4d8] mb-1.5">
                      Numéro de Téléphone (Bénin) <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-[#71717a] font-mono">
                        +229
                      </span>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="95 44 16 02"
                        className="w-full pl-14 pr-3.5 py-2.5 rounded-xl bg-[#181822] border border-[#2b2b38] text-white text-xs font-mono focus:border-[#e5c158] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Mode et Adresse de Livraison */}
              <div className="space-y-4 pt-2 border-t border-[#20202a]">
                <h3 className="text-xs uppercase tracking-wider text-[#e5c158] font-bold flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>2. Mode de réception</span>
                </h3>

                {/* Mode selection radio cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => {
                      setDeliveryMethod('come_pickup');
                      setCity('Comé');
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      deliveryMethod === 'come_pickup'
                        ? 'border-[#e5c158] bg-[#1e1c15] shadow-md'
                        : 'border-[#262633] bg-[#16161f] hover:border-[#38384a]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">Retrait Boutique</span>
                      <span className="text-[11px] font-bold text-[#10b981]">Gratuit</span>
                    </div>
                    <p className="text-[11px] text-[#a1a1aa] leading-relaxed">
                      Retirez directement votre commande à la boutique BECCA SHOP à Comé.
                    </p>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => {
                      setDeliveryMethod('come_home');
                      setCity('Comé');
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      deliveryMethod === 'come_home'
                        ? 'border-[#e5c158] bg-[#1e1c15] shadow-md'
                        : 'border-[#262633] bg-[#16161f] hover:border-[#38384a]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">Livraison Comé</span>
                      <span className="text-[11px] font-bold text-[#e5c158]">1 000 FCFA</span>
                    </div>
                    <p className="text-[11px] text-[#a1a1aa] leading-relaxed">
                      Livraison à domicile ou au lieu de travail dans la ville de Comé.
                    </p>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setDeliveryMethod('benin_shipping')}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      deliveryMethod === 'benin_shipping'
                        ? 'border-[#e5c158] bg-[#1e1c15] shadow-md'
                        : 'border-[#262633] bg-[#16161f] hover:border-[#38384a]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">Expédition Bénin</span>
                      <span className="text-[11px] font-bold text-[#e5c158]">2 500 FCFA</span>
                    </div>
                    <p className="text-[11px] text-[#a1a1aa] leading-relaxed">
                      Envoi vers Cotonou, Porto-Novo, Parakou, Calavi, Lokossa, etc.
                    </p>
                  </motion.button>
                </div>

                {/* City & Address Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#d4d4d8] mb-1.5">
                      Ville / Commune
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#181822] border border-[#2b2b38] text-white text-xs focus:border-[#e5c158] focus:outline-none transition-colors"
                    >
                      <option value="Comé">Comé (Mono)</option>
                      <option value="Cotonou">Cotonou (Littoral)</option>
                      <option value="Abomey-Calavi">Abomey-Calavi (Atlantique)</option>
                      <option value="Porto-Novo">Porto-Novo (Ouémé)</option>
                      <option value="Lokossa">Lokossa (Mono)</option>
                      <option value="Grand-Popo">Grand-Popo (Mono)</option>
                      <option value="Ouidah">Ouidah (Atlantique)</option>
                      <option value="Parakou">Parakou (Borgou)</option>
                      <option value="Autre">Autre localité</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#d4d4d8] mb-1.5">
                      {deliveryMethod === 'come_pickup'
                        ? 'Précisions pour le retrait (Optionnel)'
                        : 'Quartier & Indication de repère *'}
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={
                        deliveryMethod === 'come_pickup'
                          ? 'Ex : Retrait prévu ce samedi à 15h'
                          : 'Ex : Quartier Agatogbo, à côté de la pharmacie'
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#181822] border border-[#2b2b38] text-white text-xs focus:border-[#e5c158] focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Mode de Règlement Prévu */}
              <div className="space-y-3 pt-2 border-t border-[#20202a]">
                <h3 className="text-xs uppercase tracking-wider text-[#e5c158] font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>3. Modalité de règlement</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label
                    onClick={() => setPaymentMethod('delivery')}
                    className={`p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                      paymentMethod === 'delivery'
                        ? 'border-[#e5c158] bg-[#1e1c15]'
                        : 'border-[#262633] bg-[#16161f]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'delivery'}
                      onChange={() => setPaymentMethod('delivery')}
                      className="accent-[#e5c158]"
                    />
                    <div>
                      <span className="font-semibold text-white block">Paiement à la livraison / Retrait</span>
                      <span className="text-[11px] text-[#a1a1aa]">Réglez en espèces à réception du colis</span>
                    </div>
                  </label>

                  <label
                    onClick={() => setPaymentMethod('mtn_momo')}
                    className={`p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                      paymentMethod === 'mtn_momo'
                        ? 'border-[#e5c158] bg-[#1e1c15]'
                        : 'border-[#262633] bg-[#16161f]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'mtn_momo'}
                      onChange={() => setPaymentMethod('mtn_momo')}
                      className="accent-[#e5c158]"
                    />
                    <div>
                      <span className="font-semibold text-white block">MTN Mobile Money Bénin</span>
                      <span className="text-[11px] text-[#a1a1aa]">Transfert MoMo sécurisé</span>
                    </div>
                  </label>

                  <label
                    onClick={() => setPaymentMethod('moov_money')}
                    className={`p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                      paymentMethod === 'moov_money'
                        ? 'border-[#e5c158] bg-[#1e1c15]'
                        : 'border-[#262633] bg-[#16161f]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'moov_money'}
                      onChange={() => setPaymentMethod('moov_money')}
                      className="accent-[#e5c158]"
                    />
                    <div>
                      <span className="font-semibold text-white block">Moov Money Bénin</span>
                      <span className="text-[11px] text-[#a1a1aa]">Paiement Flooz / Moov</span>
                    </div>
                  </label>

                  <label
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'border-[#e5c158] bg-[#1e1c15]'
                        : 'border-[#262633] bg-[#16161f]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="accent-[#e5c158]"
                    />
                    <div>
                      <span className="font-semibold text-white block">Carte bancaire / Virement</span>
                      <span className="text-[11px] text-[#a1a1aa]">Visa / Mastercard / Diaspora</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Section 4: Recapitulatif Financier */}
              <div className="p-4 rounded-2xl bg-[#171722] border border-[#262634] space-y-2 text-xs">
                <div className="flex justify-between text-[#a1a1aa]">
                  <span>Sous-total ({items.length} articles) :</span>
                  <span className="text-white font-medium tabular-nums">{formatFCFA(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#a1a1aa]">
                  <span>Frais de livraison ({city}) :</span>
                  <span className="text-white font-medium tabular-nums">{formatFCFA(shippingFee)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-[#2a2a3a]">
                  <span>Montant Total à Régler :</span>
                  <span className="text-base text-[#e5c158] font-extrabold tabular-nums">{formatFCFA(total)}</span>
                </div>
              </div>

              {/* Submit CTA with Motion effects */}
              <div className="space-y-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02, filter: 'brightness(1.05)' }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#aa7c11] text-black font-extrabold text-sm tracking-wide shadow-xl shadow-[#d4af37]/25 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{isSubmitting ? 'Enregistrement de la commande...' : 'Confirmer ma Commande'}</span>
                </motion.button>

                <p className="text-[11px] text-center text-[#71717a] leading-relaxed">
                  Dès confirmation, vous pourrez transmettre le récapitulatif directement par WhatsApp aux numéros <strong className="text-[#a1a1aa]">{STORE_INFO.phone1Display}</strong> et <strong className="text-[#a1a1aa]">{STORE_INFO.phone2Display}</strong>.
                </p>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
