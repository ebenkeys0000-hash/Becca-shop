import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'motion/react';
import { useStore } from '../../context/StoreContext';
import { formatFCFA } from '../../utils/formatters';
import { STORE_INFO } from '../../data/products';
import { OrderDetails } from '../../types';
import { SafeImage } from '../../components/SafeImage';
import {
  ShieldCheck,
  CheckCircle2,
  Truck,
  MessageCircle,
  Phone,
  ArrowRight,
  ShoppingBag,
  CreditCard,
  Banknote,
  Smartphone,
  Printer,
  Download,
} from 'lucide-react';
import { downloadInvoicePDF } from '../../services/invoiceService';

export const CheckoutPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const { cartItems, currentUser, placeOrder, settings } = useStore();

  const [firstName, setFirstName] = useState(currentUser?.firstName || '');
  const [lastName, setLastName] = useState(currentUser?.lastName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [city, setCity] = useState(currentUser?.city || 'Comé');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [notes, setNotes] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'come_pickup' | 'come_home' | 'benin_shipping'>('come_home');
  const [paymentMethod, setPaymentMethod] = useState<'delivery' | 'mtn_momo' | 'moov_money' | 'card'>('delivery');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderDetails | null>(null);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.appliedUnitPrice * item.quantity,
    0
  );

  const deliveryFee =
    deliveryMethod === 'come_pickup'
      ? 0
      : deliveryMethod === 'come_home'
      ? settings.deliveryFeeComeHome || 1000
      : settings.deliveryFeeBenin || 3000;

  const total = subtotal + deliveryFee;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setIsSubmitting(true);
    try {
      const order = await placeOrder({
        userId: currentUser?.id,
        customerName: `${firstName.trim()} ${lastName.trim()}`,
        customerPhone: phone.trim(),
        customerEmail: email.trim(),
        city: city.trim(),
        address: address.trim(),
        notes: notes.trim(),
        deliveryMethod,
        paymentMethod,
        items: [...cartItems],
        subtotal,
        shippingFee: deliveryFee,
        total,
      });

      setConfirmedOrder(order);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If order was placed, display celebratory confirmation screen
  if (confirmedOrder) {
    const deliveryMethodLabel =
      confirmedOrder.deliveryMethod === 'come_pickup'
        ? 'Retrait à la boutique de Comé'
        : confirmedOrder.deliveryMethod === 'come_home'
        ? 'Livraison à domicile à Comé'
        : 'Expédition nationale Bénin';

    const paymentMethodLabel =
      confirmedOrder.paymentMethod === 'delivery'
        ? 'Paiement à la livraison'
        : confirmedOrder.paymentMethod === 'mtn_momo'
        ? 'MTN Mobile Money'
        : confirmedOrder.paymentMethod === 'moov_money'
        ? 'Moov Money'
        : 'Carte bancaire';

    const whatsappOrderMsg = encodeURIComponent(
      `Bonjour BECCA SHOP ! J'ai validé ma commande sur le site web.\n\n` +
      `• N° Commande : #${confirmedOrder.orderId}\n` +
      `• Nom : ${confirmedOrder.customerName}\n` +
      `• Téléphone : ${confirmedOrder.customerPhone}\n` +
      `• Ville : ${confirmedOrder.city} (${confirmedOrder.address})\n` +
      `• Mode livraison : ${deliveryMethodLabel}\n` +
      `• Mode règlement : ${paymentMethodLabel}\n` +
      `• Total : ${formatFCFA(confirmedOrder.total)}\n\n` +
      `Articles :\n` +
      confirmedOrder.items
        .map((i) => ` - ${i.quantity}x ${i.product.name} (${i.selectedSize}) = ${formatFCFA(i.appliedUnitPrice * i.quantity)}`)
        .join('\n') +
      `\n\nPouvez-vous confirmer la réception de ma commande ? Merci !`
    );

    return (
      <div className="py-16 bg-[#0a0a0d] min-h-screen text-[#f3f3f6]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#121219] border border-[#d4af37]/40 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8"
          >
            {/* Header Badge */}
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#10b981]/20 text-[#10b981] flex items-center justify-center mx-auto border border-[#10b981]/40">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#e5c158]">
                Commande Confirmée
              </span>
              <h1 className="font-luxury text-3xl sm:text-4xl font-bold text-white">
                Merci pour votre Confiance !
              </h1>
              <p className="text-xs text-[#a1a1aa] max-w-md mx-auto">
                Votre commande a été enregistrée avec succès sous la référence{' '}
                <strong className="text-white font-mono text-sm">#{confirmedOrder.orderId}</strong>.
                {confirmedOrder.customerEmail && ' Un email récapitulatif détaillé vous a été envoyé.'}
              </p>
            </div>

            {/* Order Details Summary Card */}
            <div className="bg-[#181824] border border-[#2b2b3d] rounded-2xl p-6 space-y-4 text-xs">
              <div className="flex justify-between items-center pb-3 border-b border-[#29293d]">
                <span className="text-[#a1a1aa]">Référence Commande</span>
                <span className="font-mono font-bold text-white">#{confirmedOrder.orderId}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#29293d]">
                <span className="text-[#a1a1aa]">Client</span>
                <span className="font-medium text-white">{confirmedOrder.customerName}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#29293d]">
                <span className="text-[#a1a1aa]">Téléphone</span>
                <span className="font-mono text-[#e5c158]">{confirmedOrder.customerPhone}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#29293d]">
                <span className="text-[#a1a1aa]">Destination & Adresse</span>
                <span className="text-right text-white font-medium">{confirmedOrder.city}, {confirmedOrder.address}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#29293d]">
                <span className="text-[#a1a1aa]">Mode de Livraison</span>
                <span className="text-white">{deliveryMethodLabel}</span>
              </div>
              <div className="flex justify-between items-center pt-2 text-sm font-bold text-white">
                <span>Total Net à Régler</span>
                <span className="text-[#e5c158] font-mono">{formatFCFA(confirmedOrder.total)}</span>
              </div>
            </div>

            {/* Items summary */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#d4d4d8]">
                Articles commandés ({confirmedOrder.items.length})
              </h3>
              <div className="divide-y divide-[#242436] border border-[#242436] rounded-2xl bg-[#161622] p-4">
                {confirmedOrder.items.map((i, idx) => (
                  <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-black overflow-hidden shrink-0">
                        <SafeImage
                          src={i.product.images[0]}
                          alt={i.product.name}
                          compactFallback
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-white">{i.product.name}</div>
                        <div className="text-[11px] text-[#a1a1aa]">Format : {i.selectedSize} · Qté : {i.quantity}</div>
                      </div>
                    </div>
                    <span className="font-mono text-white font-bold">{formatFCFA(i.appliedUnitPrice * i.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp transmission button */}
            <div className="space-y-3 pt-4 border-t border-[#222230]">
              <a
                href={`https://wa.me/22995441602?text=${whatsappOrderMsg}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Transmettre ma commande sur WhatsApp (Validation Rapide)</span>
              </a>

              <button
                type="button"
                onClick={() => downloadInvoicePDF(confirmedOrder)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#aa7c11] text-black font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#d4af37]/25 hover:brightness-110"
              >
                <Download className="w-4 h-4 text-black" />
                <span>Télécharger la Facture Officielle (PDF)</span>
              </button>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-3.5 rounded-xl bg-[#1e1e2c] hover:bg-[#2a2a3e] border border-[#343448] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimer le reçu de commande</span>
                </button>
                <Link
                  href="/shop"
                  className="flex-1 py-3.5 rounded-xl bg-[#181822] hover:bg-[#222230] text-[#d4af37] border border-[#d4af37]/40 text-xs font-bold uppercase tracking-wider flex items-center justify-center transition-colors text-center"
                >
                  Retourner à la boutique
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // If cart is empty, show prompt
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 px-4 text-center bg-[#0a0a0d]">
        <h2 className="font-luxury text-2xl font-bold text-white mb-2">Aucun article à régler</h2>
        <p className="text-xs text-[#a1a1aa] mb-6">Ajoutez d'abord des créations à votre panier avant de passer à la caisse.</p>
        <Link
          href="/shop"
          className="px-6 py-3 rounded-full bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wider shadow-lg"
        >
          Voir la boutique
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
              Finalisation de votre acquisition
            </span>
            <h1 className="font-luxury text-3xl sm:text-4xl font-bold text-white tracking-tight mt-1">
              Caisse & Coordonnées de Livraison
            </h1>
          </div>
          <Link href="/cart" className="text-xs text-[#e5c158] hover:underline font-medium">
            ← Modifier le panier
          </Link>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Form Fields */}
            <div className="lg:col-span-8 space-y-8">
              {/* 1. Customer Personal Information */}
              <div className="p-6 sm:p-8 bg-[#111117] border border-[#222230] rounded-3xl shadow-xl space-y-5">
                <h2 className="font-luxury text-lg font-bold text-white border-b border-[#242434] pb-3">
                  1. Vos Coordonnées Personnelles
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#d4d4d8] mb-1.5 uppercase tracking-wider">
                      Prénom <span className="text-[#e5c158]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Clarisse"
                      className="w-full px-4 py-3 bg-[#181822] border border-[#2b2b3c] rounded-xl text-white text-xs outline-none focus:border-[#e5c158] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#d4d4d8] mb-1.5 uppercase tracking-wider">
                      Nom de famille <span className="text-[#e5c158]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Dossou"
                      className="w-full px-4 py-3 bg-[#181822] border border-[#2b2b3c] rounded-xl text-white text-xs outline-none focus:border-[#e5c158] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#d4d4d8] mb-1.5 uppercase tracking-wider">
                      Numéro Téléphone / WhatsApp <span className="text-[#e5c158]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+229 97 00 00 00"
                      className="w-full px-4 py-3 bg-[#181822] border border-[#2b2b3c] rounded-xl text-white text-xs font-mono outline-none focus:border-[#e5c158] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#d4d4d8] mb-1.5 uppercase tracking-wider">
                      Adresse Email (Pour confirmation)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nom@exemple.com"
                      className="w-full px-4 py-3 bg-[#181822] border border-[#2b2b3c] rounded-xl text-white text-xs outline-none focus:border-[#e5c158] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Destination & Address */}
              <div className="p-6 sm:p-8 bg-[#111117] border border-[#222230] rounded-3xl shadow-xl space-y-5">
                <h2 className="font-luxury text-lg font-bold text-white border-b border-[#242434] pb-3">
                  2. Destination & Adresse de Réception
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#d4d4d8] mb-1.5 uppercase tracking-wider">
                      Ville au Bénin <span className="text-[#e5c158]">*</span>
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-3 bg-[#181822] border border-[#2b2b3c] rounded-xl text-white text-xs outline-none focus:border-[#e5c158] transition-colors"
                    >
                      <option value="Comé">Comé (Mono)</option>
                      <option value="Cotonou">Cotonou (Littoral)</option>
                      <option value="Abomey-Calavi">Abomey-Calavi (Atlantique)</option>
                      <option value="Porto-Novo">Porto-Novo (Ouémé)</option>
                      <option value="Parakou">Parakou (Borgou)</option>
                      <option value="Grand-Popo">Grand-Popo (Mono)</option>
                      <option value="Lokossa">Lokossa (Mono)</option>
                      <option value="Ouidah">Ouidah (Atlantique)</option>
                      <option value="Autre ville">Autre localité du Bénin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#d4d4d8] mb-1.5 uppercase tracking-wider">
                      Quartier & Précision d'adresse <span className="text-[#e5c158]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="ex: Quartier Zongo, près de la pharmacie"
                      className="w-full px-4 py-3 bg-[#181822] border border-[#2b2b3c] rounded-xl text-white text-xs outline-none focus:border-[#e5c158] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#d4d4d8] mb-1.5 uppercase tracking-wider">
                    Remarques ou instructions particulières
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="ex: Appeler avant la livraison, créneau d'après-midi souhaité..."
                    className="w-full px-4 py-3 bg-[#181822] border border-[#2b2b3c] rounded-xl text-white text-xs outline-none focus:border-[#e5c158] transition-colors resize-none"
                  />
                </div>
              </div>

              {/* 3. Delivery Method */}
              <div className="p-6 sm:p-8 bg-[#111117] border border-[#222230] rounded-3xl shadow-xl space-y-4">
                <h2 className="font-luxury text-lg font-bold text-white border-b border-[#242434] pb-3">
                  3. Mode de Livraison
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label
                    onClick={() => setDeliveryMethod('come_pickup')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      deliveryMethod === 'come_pickup'
                        ? 'bg-[#242116] border-[#e5c158] text-white'
                        : 'bg-[#181824] border-[#29293d] text-[#a1a1aa]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">Retrait Boutique</span>
                      <span className="text-xs font-bold text-[#10b981]">Gratuit</span>
                    </div>
                    <p className="text-[11px] text-[#71717a]">Boutique BECCA SHOP, Comé</p>
                  </label>

                  <label
                    onClick={() => setDeliveryMethod('come_home')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      deliveryMethod === 'come_home'
                        ? 'bg-[#242116] border-[#e5c158] text-white'
                        : 'bg-[#181824] border-[#29293d] text-[#a1a1aa]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">Comé Domicile</span>
                      <span className="text-xs font-bold text-[#e5c158]">1 000 FCFA</span>
                    </div>
                    <p className="text-[11px] text-[#71717a]">Livraison coursier express</p>
                  </label>

                  <label
                    onClick={() => setDeliveryMethod('benin_shipping')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      deliveryMethod === 'benin_shipping'
                        ? 'bg-[#242116] border-[#e5c158] text-white'
                        : 'bg-[#181824] border-[#29293d] text-[#a1a1aa]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">Tout Bénin</span>
                      <span className="text-xs font-bold text-[#e5c158]">3 000 FCFA</span>
                    </div>
                    <p className="text-[11px] text-[#71717a]">Cotonou, Parakou, etc.</p>
                  </label>
                </div>
              </div>

              {/* 4. Payment Method */}
              <div className="p-6 sm:p-8 bg-[#111117] border border-[#222230] rounded-3xl shadow-xl space-y-4">
                <h2 className="font-luxury text-lg font-bold text-white border-b border-[#242434] pb-3">
                  4. Mode de Paiement
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    onClick={() => setPaymentMethod('delivery')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      paymentMethod === 'delivery'
                        ? 'bg-[#242116] border-[#e5c158]'
                        : 'bg-[#181824] border-[#29293d]'
                    }`}
                  >
                    <Banknote className="w-5 h-5 text-[#e5c158] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-white">Paiement à la livraison / retrait</div>
                      <div className="text-[11px] text-[#a1a1aa] mt-0.5">Réglez en espèces à la remise en main propre</div>
                    </div>
                  </label>

                  <label
                    onClick={() => setPaymentMethod('mtn_momo')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      paymentMethod === 'mtn_momo'
                        ? 'bg-[#242116] border-[#e5c158]'
                        : 'bg-[#181824] border-[#29293d]'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-[#ffcc00] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-white">MTN Mobile Money</div>
                      <div className="text-[11px] text-[#a1a1aa] mt-0.5">Transfert vers +229 95 44 16 02</div>
                    </div>
                  </label>

                  <label
                    onClick={() => setPaymentMethod('moov_money')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      paymentMethod === 'moov_money'
                        ? 'bg-[#242116] border-[#e5c158]'
                        : 'bg-[#181824] border-[#29293d]'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-[#0066cc] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-white">Moov Money</div>
                      <div className="text-[11px] text-[#a1a1aa] mt-0.5">Transfert vers +229 41 46 55 06</div>
                    </div>
                  </label>

                  <label
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      paymentMethod === 'card'
                        ? 'bg-[#242116] border-[#e5c158]'
                        : 'bg-[#181824] border-[#29293d]'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-[#e5c158] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-white">Carte Bancaire Visa / Mastercard</div>
                      <div className="text-[11px] text-[#a1a1aa] mt-0.5">Terminal sécurisé à la livraison ou en ligne</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Place Order Button */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#111117] border border-[#222230] rounded-3xl p-6 sm:p-7 shadow-xl space-y-6 sticky top-28">
                <h3 className="font-luxury text-xl font-bold text-white pb-4 border-b border-[#242434]">
                  Synthèse de Commande
                </h3>

                {/* Mini cart items */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-black shrink-0">
                          <SafeImage
                            src={item.product.images[0]}
                            alt={item.product.name}
                            compactFallback
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-white line-clamp-1">{item.product.name}</div>
                          <div className="text-[10px] text-[#71717a]">{item.quantity}x {item.selectedSize}</div>
                        </div>
                      </div>
                      <span className="font-mono text-white tabular-nums">
                        {formatFCFA(item.appliedUnitPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Subtotals & Final Amount */}
                <div className="space-y-2.5 pt-4 border-t border-[#222230] text-xs">
                  <div className="flex justify-between text-[#a1a1aa]">
                    <span>Sous-total</span>
                    <span className="font-mono text-white">{formatFCFA(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[#a1a1aa]">
                    <span>Livraison ({city})</span>
                    <span className="font-mono text-white">
                      {deliveryFee === 0 ? 'Gratuit' : formatFCFA(deliveryFee)}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-[#252538] flex items-baseline justify-between text-white">
                    <span className="font-luxury text-base font-bold">Total à Payer</span>
                    <span className="font-luxury text-2xl font-black text-[#e5c158] font-mono">
                      {formatFCFA(total)}
                    </span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#aa7c11] text-black font-extrabold text-xs uppercase tracking-wider shadow-xl shadow-[#d4af37]/25 hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4 text-black" />
                  <span>{isSubmitting ? 'Validation en cours...' : 'Confirmer Ma Commande'}</span>
                </button>

                <div className="text-center space-y-1 pt-1">
                  <p className="text-[11px] text-[#71717a]">
                    En confirmant, vous recevrez un récapitulatif par email et pourrez suivre votre commande sur WhatsApp.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
