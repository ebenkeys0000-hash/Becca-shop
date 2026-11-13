import React from 'react';
import { motion } from 'motion/react';
import { CATEGORIES } from '../data/products';
import { ArrowRight, Sparkles } from 'lucide-react';
import { SafeImage } from './SafeImage';

interface CategoryShowcaseProps {
  onSelectCategory: (category: 'pagnes' | 'chaussures') => void;
}

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({ onSelectCategory }) => {
  return (
    <section className="py-20 bg-[#0d0d12] border-b border-[#1f1f28] relative overflow-hidden">
      {/* Decorative backdrop mesh */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-[#d4af37]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Staggered Entrance */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#e5c158] uppercase tracking-widest mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Nos Univers de Prédilection</span>
            </div>
            <h2 className="font-luxury text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Deux Collections Dédiées à Votre Sublime Féminité
            </h2>
          </div>
          <p className="text-sm text-[#a1a1aa] max-w-md font-light leading-relaxed">
            Des étoffes de grand apparat aux souliers sculptés avec finesse, chaque création BECCA SHOP est pensée pour révéler votre distinction naturelle.
          </p>
        </motion.div>

        {/* 2 Big Visual Category Cards with Motion Reveal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.75, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -5 }}
              onClick={() => onSelectCategory(cat.id as 'pagnes' | 'chaussures')}
              className="group relative cursor-pointer overflow-hidden rounded-3xl bg-[#13131a] border border-[#262635] hover:border-[#d4af37]/60 transition-colors duration-500 shadow-2xl"
            >
              <div className="h-80 sm:h-96 w-full overflow-hidden relative">
                <SafeImage
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                />
                {/* Dark gradient scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090d] via-[#09090d]/50 to-transparent" />
              </div>

              {/* Card Content Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-8 flex flex-col justify-end">
                <span className="text-xs uppercase tracking-widest text-[#e5c158] font-bold mb-1.5 inline-block">
                  {cat.count}
                </span>
                <h3 className="font-luxury text-2xl sm:text-3xl font-bold text-white group-hover:text-[#e5c158] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#d4d4d8] mt-2 line-clamp-2 leading-relaxed">
                  {cat.subtitle}
                </p>

                <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-white group-hover:text-[#e5c158] transition-colors">
                  <span>Explorer les créations</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
