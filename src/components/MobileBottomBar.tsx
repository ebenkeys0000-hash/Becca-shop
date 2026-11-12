import React from 'react';
import { motion } from 'motion/react';
import { Home, Layers, Sparkles, ShoppingBag, MessageCircle } from 'lucide-react';
import { STORE_INFO } from '../data/products';

interface MobileBottomBarProps {
  activeCategory: string;
  onSelectCategory: (category: 'all' | 'pagnes' | 'chaussures') => void;
  cartCount: number;
  onOpenCart: () => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  activeCategory,
  onSelectCategory,
  cartCount,
  onOpenCart,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-[#0a0a0e]/95 backdrop-blur-xl border-t border-[#22222d] px-3 py-2 flex items-center justify-around text-[10px]">
      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={() => {
          onSelectCategory('all');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 transition-colors ${
          activeCategory === 'all' ? 'text-[#e5c158] font-bold' : 'text-[#a1a1aa] hover:text-white'
        }`}
      >
        <Home className="w-4 h-4" />
        <span>Accueil</span>
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={() => {
          onSelectCategory('pagnes');
          const el = document.getElementById('catalogue');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 transition-colors ${
          activeCategory === 'pagnes' ? 'text-[#e5c158] font-bold' : 'text-[#a1a1aa] hover:text-white'
        }`}
      >
        <Layers className="w-4 h-4" />
        <span>Pagnes</span>
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={() => {
          onSelectCategory('chaussures');
          const el = document.getElementById('catalogue');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 transition-colors ${
          activeCategory === 'chaussures' ? 'text-[#e5c158] font-bold' : 'text-[#a1a1aa] hover:text-white'
        }`}
      >
        <Sparkles className="w-4 h-4" />
        <span>Chaussures</span>
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={onOpenCart}
        className="flex flex-col items-center gap-1 py-1 px-2.5 text-[#a1a1aa] hover:text-white relative"
      >
        <div className="relative">
          <ShoppingBag className="w-4 h-4" />
          {cartCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 450, damping: 20 }}
              className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-[#e5c158] text-black font-extrabold text-[8px] rounded-full flex items-center justify-center"
            >
              {cartCount}
            </motion.span>
          )}
        </div>
        <span>Panier</span>
      </motion.button>

      <motion.a
        whileTap={{ scale: 0.88 }}
        href={STORE_INFO.whatsappUrl1}
        target="_blank"
        rel="noreferrer"
        className="flex flex-col items-center gap-1 py-1 px-2.5 text-[#25D366] font-medium"
      >
        <MessageCircle className="w-4 h-4" />
        <span>WhatsApp</span>
      </motion.a>
    </div>
  );
};
