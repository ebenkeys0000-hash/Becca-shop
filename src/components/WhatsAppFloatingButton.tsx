import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { STORE_INFO } from '../data/products';
import { MessageCircle, Phone, X } from 'lucide-react';

export const WhatsAppFloatingButton: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Popover popup with Framer Motion AnimatePresence */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 12 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="mb-3 w-76 sm:w-80 rounded-3xl bg-[#13131c]/95 backdrop-blur-xl border border-[#d4af37]/45 shadow-2xl p-4 text-xs space-y-3"
          >
            <div className="flex items-center justify-between pb-2.5 border-b border-[#232332]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse" />
                <span className="font-bold text-white tracking-wide">BECCA SHOP WhatsApp</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.15, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setOpen(false)}
                className="text-[#a1a1aa] hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            <p className="text-[11px] text-[#a1a1aa] leading-relaxed">
              Besoin d'un renseignement, d'une commande urgente ou d'un conseil personnalisé ?
            </p>

            <div className="space-y-2">
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={`https://wa.me/22995441602?text=${encodeURIComponent(
                  "Bonjour BECCA SHOP, j'aimerais avoir des informations sur vos pagnes et chaussures."
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 rounded-2xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-white font-medium border border-[#25D366]/35 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>N° 1 : {STORE_INFO.phone1Display}</span>
                </div>
                <span className="text-[10px] text-[#25D366] font-bold">Écrire</span>
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={`https://wa.me/22941465506?text=${encodeURIComponent(
                  "Bonjour BECCA SHOP, j'aimerais avoir des informations sur vos pagnes et chaussures."
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 rounded-2xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-white font-medium border border-[#25D366]/35 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>N° 2 : {STORE_INFO.phone2Display}</span>
                </div>
                <span className="text-[10px] text-[#25D366] font-bold">Écrire</span>
              </motion.a>
            </div>

            <div className="pt-1.5 flex justify-center text-[11px]">
              <a
                href={`tel:${STORE_INFO.phone1}`}
                className="text-[#e5c158] hover:underline flex items-center gap-1 font-medium"
              >
                <Phone className="w-3 h-3" />
                <span>Ou appelez-nous directement</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main floating trigger button with subtle pulse */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen(!open)}
        className="group relative flex items-center gap-2 px-4 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-black font-extrabold text-xs shadow-2xl shadow-[#25D366]/35 transition-all"
        aria-label="Contacter sur WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline font-bold">WhatsApp Direct</span>
      </motion.button>
    </div>
  );
};
