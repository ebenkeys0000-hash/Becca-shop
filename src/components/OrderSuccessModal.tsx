import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { OrderDetails } from '../types';
import { formatFCFA, generateWhatsAppOrderUrl } from '../utils/formatters';
import { STORE_INFO } from '../data/products';
import { MessageCircle, Printer, ArrowRight, X, Download } from 'lucide-react';
import { overlayVariants, modalVariants } from '../utils/motion';
import { downloadInvoicePDF } from '../services/invoiceService';
import { SafeImage } from './SafeImage';

interface OrderSuccessModalProps {
  order: OrderDetails | null;
  onClose: () => void;
  onContinueShopping: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onContinueShopping,
}) => {
  if (!order) return null;

  const whatsappLink1 = generateWhatsAppOrderUrl(STORE_INFO.phone1, order);
  const whatsappLink2 = generateWhatsAppOrderUrl(STORE_INFO.phone2, order);

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
          className="relative w-full max-w-xl bg-[#121217] border border-[#d4af37]/60 rounded-3xl shadow-2xl overflow-hidden my-8"
        >
          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-[#a1a1aa] hover:text-white hover:bg-[#20202c] transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </motion.button>

          {/* Top Gold Banner */}
          <div className="p-6 text-center bg-gradient-to-b from-[#221f15] via-[#16161d] to-[#121217] border-b border-[#2d2a20]">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 380, damping: 20, delay: 0.15 }}
              className="w-18 h-18 rounded-full overflow-hidden border-2 border-[#d4af37] mx-auto shadow-xl shadow-[#d4af37]/25 mb-3 bg-black"
            >
              <SafeImage
                src={STORE_INFO.logoUrl}
                alt="Logo BECCA SHOP"
                compactFallback
                className="w-full h-full object-cover"
              />
            </motion.div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#e5c158]">
              Commande Enregistrée avec Succès !
            </span>
            <h2 className="font-luxury text-2xl font-bold text-white mt-1">
              Merci pour votre confiance, {order.customerName}
            </h2>
            <p className="text-xs text-[#a1a1aa] mt-1">
              Référence de votre commande : <span className="font-mono text-white font-bold">#{order.orderId}</span>
            </p>
          </div>

          {/* Order Summary Receipt Box */}
          <div className="p-6 space-y-5">
            <div className="p-4 rounded-2xl bg-[#161620] border border-[#262635] space-y-3 text-xs">
              <div className="flex justify-between pb-2 border-b border-[#252533]">
                <span className="text-[#a1a1aa]">Destinataire :</span>
                <span className="text-white font-medium">{order.customerName} ({order.customerPhone})</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#252533]">
                <span className="text-[#a1a1aa]">Lieu de livraison :</span>
                <span className="text-white font-medium text-right">{order.city} · {order.address}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#252533]">
                <span className="text-[#a1a1aa]">Mode de livraison :</span>
                <span className="text-[#e5c158] font-medium">
                  {order.deliveryMethod === 'come_pickup'
                    ? 'Retrait à la boutique BECCA SHOP (Comé)'
                    : order.deliveryMethod === 'come_home'
                    ? 'Livraison à domicile (Comé)'
                    : 'Expédition interurbaine (Bénin)'}
                </span>
              </div>

              <div className="pt-1">
                <span className="text-[#a1a1aa] block mb-2 font-semibold">Articles ({order.items.length}) :</span>
                <ul className="space-y-1.5 pl-2">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex justify-between text-white">
                      <span>
                        {item.quantity}x {item.product.name} ({item.selectedSize})
                      </span>
                      <span className="tabular-nums font-mono text-[#e5c158]">
                        {formatFCFA(item.product.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-[#29293a] flex justify-between items-center text-sm font-bold">
                <span className="text-white">Total TTC :</span>
                <span className="text-lg text-[#e5c158] tabular-nums font-extrabold">{formatFCFA(order.total)}</span>
              </div>
            </div>

            {/* WhatsApp Direct Actions */}
            <div className="space-y-2.5">
              <p className="text-xs text-center text-[#d4d4d8] font-medium">
                Transmettez ce récapitulatif directement par WhatsApp pour un traitement instantané :
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <motion.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  href={whatsappLink1}
                  target="_blank"
                  rel="noreferrer"
                  className="py-3 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-[#25D366]/20"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Envoyer au +229 95 44 16 02</span>
                </motion.a>

                <motion.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  href={whatsappLink2}
                  target="_blank"
                  rel="noreferrer"
                  className="py-3 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-[#25D366]/20"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Envoyer au +229 41 46 55 06</span>
                </motion.a>
              </div>
            </div>

            {/* Action Row */}
            <div className="space-y-2.5 pt-2">
              <motion.button
                whileHover={{ scale: 1.02, filter: 'brightness(1.05)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => downloadInvoicePDF(order)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#aa7c11] text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#d4af37]/25 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-black" />
                <span>Télécharger ma Facture Officielle (PDF)</span>
              </motion.button>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#181822] hover:bg-[#222230] text-[#d4d4d8] text-xs font-medium border border-[#2c2c3c] transition-colors flex items-center justify-center gap-2"
                >
                  <Printer className="w-3.5 h-3.5 text-[#e5c158]" />
                  <span>Imprimer le reçu</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onClose();
                    onContinueShopping();
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#252536] hover:bg-[#303044] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <span>Continuer vos achats</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#e5c158]" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
