import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { Sparkles, MessageCircle, ArrowRight, ShieldCheck, Truck, Headphones } from 'lucide-react';
import { STORE_INFO } from '../data/products';
import { wordRevealContainer, wordItem, transitionLuxury } from '../utils/motion';
import { ASSET_IMAGES } from '../assets/images';
import { SafeImage } from './SafeImage';

interface HeroProps {
  onExploreCatalog: () => void;
  onFilterCategory: (category: 'pagnes' | 'chaussures') => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreCatalog, onFilterCategory }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Subtle parallax on the hero image container based on scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? ['0%', '0%'] : ['0%', '12%']);
  const imageScale = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [1, 1] : [1, 1.05]);

  const headlineWords = [
    { text: "L'excellence", gold: false },
    { text: "du", gold: false },
    { text: "Pagne", gold: true },
    { text: "Africain", gold: true },
    { text: "&", gold: false },
    { text: "l'élégance", gold: false },
    { text: "des", gold: false },
    { text: "Chaussures", gold: true },
  ];

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-[#0a0a0d] border-b border-[#20202a]"
    >
      {/* Decorative ambient glowing radial light */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.12, 0.22, 0.12],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-10 right-1/4 w-[550px] h-[550px] bg-[#d4af37]/15 rounded-full blur-[150px] pointer-events-none -z-0"
      />
      <div className="absolute bottom-0 left-10 w-[380px] h-[380px] bg-[#c59b27]/8 rounded-full blur-[110px] pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Brand, Staggered Headline & CTAs */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left z-10">
            
            {/* Tagline / Subtitle kicker with entrance badge */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181611] border border-[#d4af37]/35 text-[#e5c158] text-xs font-medium tracking-wide shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#e5c158]" />
              <span>{STORE_INFO.tagline}</span>
            </motion.div>

            {/* Main Hero Headline with Staggered Word Appearance */}
            <motion.h1
              variants={wordRevealContainer}
              initial="hidden"
              animate="visible"
              className="font-luxury text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.12] tracking-tight flex flex-wrap justify-center lg:justify-start gap-x-3 gap-y-1"
            >
              {headlineWords.map((item, index) => (
                <motion.span
                  key={index}
                  variants={wordItem}
                  className={item.gold ? "gold-gradient-text inline-block" : "text-white inline-block"}
                >
                  {item.text}
                </motion.span>
              ))}
            </motion.h1>

            {/* Subtitle with soft fade in */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="text-[#a1a1aa] text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed"
            >
              Bienvenue chez <strong className="text-white font-semibold">BECCA SHOP</strong> à Comé.
              Découvrez nos pagnes Super Wax aux dorures impériales, nos soies chatoyantes et notre collection de souliers de cérémonie conçus pour sublimer chaque femme avec distinction et prestance.
            </motion.p>

            {/* Primary Action Buttons with Magnetic-style Spring Animations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 12px 30px -4px rgba(212, 175, 55, 0.35)' }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                onClick={onExploreCatalog}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#aa7c11] text-black font-extrabold text-sm tracking-wide shadow-xl shadow-[#d4af37]/25 flex items-center justify-center gap-2"
              >
                <span>Découvrir la collection</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={STORE_INFO.whatsappUrl1}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#15151c] hover:bg-[#1f1f28] border border-[#30303e] hover:border-[#25D366]/60 text-white font-medium text-sm tracking-wide transition-all flex items-center justify-center gap-2 group"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366] group-hover:scale-110 transition-transform" />
                <span>Commander sur WhatsApp</span>
              </motion.a>
            </motion.div>

            {/* Category Quick Pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="pt-3 flex items-center justify-center lg:justify-start gap-3 text-xs text-[#a1a1aa]"
            >
              <span className="text-[#71717a]">Rayons phares :</span>
              <button
                onClick={() => onFilterCategory('pagnes')}
                className="hover:text-[#e5c158] underline underline-offset-4 decoration-[#d4af37]/40 hover:decoration-[#e5c158] transition-colors"
              >
                Pagnes & Soies Wax
              </button>
              <span>·</span>
              <button
                onClick={() => onFilterCategory('chaussures')}
                className="hover:text-[#e5c158] underline underline-offset-4 decoration-[#d4af37]/40 hover:decoration-[#e5c158] transition-colors"
              >
                Escarpins & Sandales Chic
              </button>
              <span>·</span>
              <a
                href="#curateur-style"
                className="text-[#e5c158] font-bold hover:underline inline-flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-[#e5c158]" />
                <span>Curateur de Style IA</span>
              </a>
            </motion.div>
          </div>

          {/* Right Column: High Fashion Visual with Smooth Parallax & Floating Badge */}
          <div className="lg:col-span-5 relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto max-w-md lg:max-w-none"
            >
              
              {/* Outer Golden Glow Border Container */}
              <div className="relative rounded-3xl overflow-hidden border border-[#d4af37]/40 bg-[#141418] shadow-2xl shadow-black/90 group">
                <motion.div
                  style={{ y: imageY, scale: imageScale }}
                  className="w-full h-full"
                >
                  <SafeImage
                    src={ASSET_IMAGES.heroBeninFashion}
                    alt="Haute couture béninoise en Super Wax authentique chez BECCA SHOP à Comé"
                    priority
                    className="w-full h-[440px] sm:h-[500px] lg:h-[540px] object-cover object-top transition-transform duration-700"
                  />
                </motion.div>

                {/* Subtle dark gradient scrim at the bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0f] via-transparent to-transparent opacity-80 pointer-events-none" />

                {/* Floating Showcase Badge on the Image */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-[#101015]/90 backdrop-blur-md border border-[#d4af37]/35 shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-widest text-[#e5c158] font-bold">
                        Collection Prestige 2026
                      </p>
                      <h4 className="font-luxury text-white text-base font-semibold">
                        Pagnes Royaux & Souliers Féminins
                      </h4>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#201d14] border border-[#d4af37]/40 text-[#e5c158]">
                      Comé, Bénin
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Official BECCA SHOP Emblem Badge with floating animation */}
              <motion.div
                animate={{
                  y: [0, -6, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute -top-3 -right-3 sm:-top-5 sm:-right-5 w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[#d4af37] shadow-2xl shadow-black/90 bg-black z-20"
              >
                <SafeImage
                  src={STORE_INFO.logoUrl}
                  alt="Emblème Officiel BECCA SHOP"
                  priority
                  compactFallback
                  className="w-full h-full object-cover"
                />
              </motion.div>

            </motion.div>
          </div>
        </div>

        {/* 3-Part Reassurance Strip Below Hero with Staggered Reveal */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                staggerChildren: 0.15,
                duration: 0.65,
                ease: [0.16, 1, 0.3, 1],
              },
            },
          }}
          className="mt-16 pt-10 border-t border-[#1e1e28] grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={{ y: -3 }}
            className="flex items-start gap-4 p-4 rounded-2xl bg-[#121217]/80 border border-[#23232c] transition-all hover:border-[#d4af37]/40 shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-[#211e15] border border-[#d4af37]/35 flex items-center justify-center text-[#e5c158] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Tissus & Cuirs 100% Authentiques</h3>
              <p className="text-xs text-[#a1a1aa] mt-0.5">
                Chaque pièce est méticuleusement sélectionnée pour sa tenue, ses dorures et sa durabilité.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={{ y: -3 }}
            className="flex items-start gap-4 p-4 rounded-2xl bg-[#121217]/80 border border-[#23232c] transition-all hover:border-[#d4af37]/40 shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-[#211e15] border border-[#d4af37]/35 flex items-center justify-center text-[#e5c158] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Retrait à Comé & Expédition Bénin</h3>
              <p className="text-xs text-[#a1a1aa] mt-0.5">
                Retrait gratuit à notre boutique de Comé ou expédition rapide vers Cotonou, Porto-Novo et tout le pays.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={{ y: -3 }}
            className="flex items-start gap-4 p-4 rounded-2xl bg-[#121217]/80 border border-[#23232c] transition-all hover:border-[#d4af37]/40 shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-[#211e15] border border-[#d4af37]/35 flex items-center justify-center text-[#e5c158] shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Conseils & Commandes WhatsApp 7j/7</h3>
              <p className="text-xs text-[#a1a1aa] mt-0.5">
                Assistance directe aux +229 95 44 16 02 et +229 41 46 55 06 pour choisir vos tailles et métrages.
              </p>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};
