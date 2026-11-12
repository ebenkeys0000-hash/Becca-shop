import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '../types';
import { formatFCFA } from '../utils/formatters';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { overlayVariants, drawerVariants } from '../utils/motion';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onRemoveItem: (itemId: string) => void;
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onContinueShopping,
}) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-md"
        >
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="w-screen max-w-md bg-[#0f0f14] border-l border-[#242432] shadow-2xl flex flex-col justify-between"
            >
              
              {/* Header */}
              <div className="p-5 border-b border-[#21212d] flex items-center justify-between bg-[#121218]">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-5 h-5 text-[#e5c158]" />
                  <h2 className="font-luxury text-lg font-bold text-white">Mon Panier</h2>
                  <span className="text-xs text-[#a1a1aa] tabular-nums font-mono">
                    ({items.reduce((s, i) => s + i.quantity, 0)} articles)
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-xl text-[#a1a1aa] hover:text-white hover:bg-[#1a1a24] transition-colors"
                  aria-label="Fermer le panier"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Cart Item List with AnimatePresence */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      className="w-16 h-16 rounded-2xl bg-[#181822] border border-[#2b2b38] flex items-center justify-center text-[#71717a]"
                    >
                      <ShoppingBag className="w-8 h-8" />
                    </motion.div>
                    <div>
                      <h3 className="font-luxury text-lg font-bold text-white mb-1">
                        Votre panier est vide
                      </h3>
                      <p className="text-xs text-[#a1a1aa] max-w-xs leading-relaxed">
                        Découvrez nos créations exclusives d'authentiques pagnes africains et de souliers féminins de grand standing.
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        onClose();
                        onContinueShopping();
                      }}
                      className="px-6 py-2.5 rounded-full bg-[#e5c158] hover:bg-[#d4af37] text-black font-bold text-xs transition-colors shadow-lg shadow-[#d4af37]/20"
                    >
                      Découvrir la boutique
                    </motion.button>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.div
                        layout
                        key={item.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.3 }}
                        className="p-3.5 rounded-2xl bg-[#15151e] border border-[#232330] flex gap-3.5 items-start shadow-sm"
                      >
                        {/* Thumbnail */}
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#1f1f2a] shrink-0 border border-[#2c2c3a]">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover object-center"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-semibold text-white truncate">
                              {item.product.name}
                            </h4>
                            <motion.button
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.85 }}
                              onClick={() => onRemoveItem(item.id)}
                              className="text-[#71717a] hover:text-[#ef4444] transition-colors p-1"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </motion.button>
                          </div>

                          <div className="text-[11px] text-[#a1a1aa] mt-1 space-x-2">
                            <span>Option : {item.selectedSize}</span>
                            {item.selectedColor && (
                              <span>· {item.selectedColor}</span>
                            )}
                          </div>

                          <div className="mt-2.5 flex items-center justify-between">
                            {/* Quantity stepper */}
                            <div className="flex items-center bg-[#1d1d28] border border-[#2b2b3a] rounded-lg">
                              <button
                                onClick={() => onUpdateQuantity(item.id, -1)}
                                className="px-2.5 py-0.5 text-xs text-[#a1a1aa] hover:text-white"
                              >
                                -
                              </button>
                              <span className="px-2 text-xs font-mono font-bold text-white tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(item.id, 1)}
                                className="px-2.5 py-0.5 text-xs text-[#a1a1aa] hover:text-white"
                              >
                                +
                              </button>
                            </div>

                            {/* Line Price */}
                            <span className="text-xs font-bold text-[#e5c158] tabular-nums">
                              {formatFCFA(item.product.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* Footer & Checkout Trigger */}
              {items.length > 0 && (
                <div className="p-5 border-t border-[#21212d] bg-[#121218] space-y-4">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-[#a1a1aa]">
                      <span>Sous-total articles</span>
                      <span className="text-white font-medium tabular-nums">
                        {formatFCFA(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#a1a1aa]">
                      <span>Livraison à Comé</span>
                      <span className="text-[#10b981] font-medium">Gratuite en boutique</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-[#252534]">
                      <span>Total estimé</span>
                      <motion.span
                        key={subtotal}
                        initial={{ scale: 1.1, color: '#ffffff' }}
                        animate={{ scale: 1, color: '#e5c158' }}
                        className="text-base font-extrabold tabular-nums"
                      >
                        {formatFCFA(subtotal)}
                      </motion.span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <motion.button
                      whileHover={{ scale: 1.02, filter: 'brightness(1.05)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onClose();
                        onProceedToCheckout();
                      }}
                      className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#aa7c11] text-black font-extrabold text-sm tracking-wide shadow-xl shadow-[#d4af37]/25 flex items-center justify-center gap-2"
                    >
                      <span>Passer la commande</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>

                    <p className="text-[11px] text-center text-[#71717a] flex items-center justify-center gap-1.5 pt-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#e5c158]" />
                      <span>Confirmation directe par appel ou WhatsApp</span>
                    </p>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
