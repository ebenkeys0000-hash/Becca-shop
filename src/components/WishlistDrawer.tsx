import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { formatFCFA } from '../utils/formatters';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { overlayVariants, drawerVariants } from '../utils/motion';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onAddToCart: (product: Product, size: string, color?: string) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onAddToCart,
}) => {
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
                  <Heart className="w-5 h-5 text-[#e5c158] fill-current" />
                  <h2 className="font-luxury text-lg font-bold text-white">Mes Coups de Cœur</h2>
                  <span className="text-xs text-[#a1a1aa] tabular-nums font-mono">({wishlist.length})</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-xl text-[#a1a1aa] hover:text-white hover:bg-[#1a1a24] transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* List with layout animations */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
                {wishlist.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-16 h-16 rounded-2xl bg-[#181822] border border-[#2b2b38] flex items-center justify-center text-[#71717a]"
                    >
                      <Heart className="w-7 h-7" />
                    </motion.div>
                    <h3 className="font-luxury text-base font-bold text-white">Aucun favori enregistré</h3>
                    <p className="text-xs text-[#a1a1aa] max-w-xs leading-relaxed">
                      Cliquez sur le cœur d'un pagne ou d'une paire d'escarpins pour les garder en mémoire.
                    </p>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {wishlist.map((item) => (
                      <motion.div
                        layout
                        key={item.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.3 }}
                        className="p-3.5 rounded-2xl bg-[#15151e] border border-[#242432] flex gap-3.5 items-center shadow-sm"
                      >
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#1f1f2a] shrink-0 border border-[#2b2b38]">
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-white truncate">{item.name}</h4>
                          <span className="text-xs font-bold text-[#e5c158] tabular-nums block mt-1">
                            {formatFCFA(item.price)}
                          </span>
                          <div className="mt-2.5 flex items-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.04 }}
                              whileTap={{ scale: 0.96 }}
                              onClick={() => {
                                const size = item.sizes[0] || '';
                                const color = item.colors && item.colors[0] ? item.colors[0].name : undefined;
                                onAddToCart(item, size, color);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-[#e5c158] hover:bg-[#d4af37] text-black text-[11px] font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                            >
                              <ShoppingBag className="w-3 h-3" />
                              <span>Ajouter au panier</span>
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.8 }}
                              onClick={() => onRemoveFromWishlist(item.id)}
                              className="p-1 text-[#71717a] hover:text-red-400"
                              title="Retirer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              <div className="p-4 border-t border-[#21212d] bg-[#121218]">
                <button
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl bg-[#1d1d28] hover:bg-[#252534] text-white text-xs font-medium transition-colors"
                >
                  Fermer
                </button>
              </div>

            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
