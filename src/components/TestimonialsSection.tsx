import React from 'react';
import { motion } from 'motion/react';
import { TESTIMONIALS } from '../data/products';
import { Star, MessageSquareQuote, CheckCircle } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 bg-[#0d0d12] border-b border-[#1f1f28] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#e5c158] mb-2">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>Témoignages & Avis Clients</span>
          </div>
          <h2 className="font-luxury text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
            La Confiance de nos Clientes à Comé et Partout au Bénin
          </h2>
          <p className="text-xs sm:text-sm text-[#a1a1aa] mt-2 font-light">
            Des retours authentiques de femmes qui ont choisi l'élégance et l'authenticité BECCA SHOP.
          </p>
        </motion.div>

        {/* 3 Review Cards with Staggered Entrance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, borderColor: 'rgba(212, 175, 55, 0.45)' }}
              className="p-7 rounded-3xl bg-[#13131a] border border-[#232330] flex flex-col justify-between transition-colors shadow-xl"
            >
              <div>
                {/* 5 Golden Stars with subtle glow */}
                <div className="flex items-center gap-1 text-[#e5c158] mb-5">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current drop-shadow-sm" />
                  ))}
                </div>

                {/* Comment quote */}
                <p className="text-xs sm:text-sm text-[#d4d4d8] leading-relaxed italic mb-8 font-light">
                  « {t.comment} »
                </p>
              </div>

              {/* Author attribution */}
              <div className="pt-4 border-t border-[#20202c]">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{t.name}</span>
                      <CheckCircle className="w-3.5 h-3.5 text-[#10b981]" />
                    </h4>
                    <span className="text-[11px] text-[#e5c158] font-medium">{t.city}</span>
                  </div>
                  <span className="text-[10px] text-[#71717a] font-normal text-right max-w-[130px] truncate">
                    {t.productPurchased}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
