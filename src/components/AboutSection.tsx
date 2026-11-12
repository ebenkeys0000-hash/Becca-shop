import React from 'react';
import { motion } from 'motion/react';
import { STORE_INFO } from '../data/products';
import { Award, HeartHandshake, Sparkles, MapPin, Phone, ArrowUpRight } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="a-propos" className="py-24 bg-[#09090c] border-b border-[#20202a] relative overflow-hidden">
      {/* Subtle background ambient glow */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-[#d4af37]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
          
          {/* Left Column: Brand Story with Staggered Entrance */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-7"
          >
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#e5c158]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>La Maison BECCA SHOP</span>
            </div>

            <h2 className="font-luxury text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Une passion pour la grâce, l'élégance et le style de la femme africaine
            </h2>

            <p className="text-base text-[#a1a1aa] leading-relaxed font-light">
              Établie à <strong className="text-white font-medium">Comé, au cœur du département du Mono au Bénin</strong>, <span className="text-[#e5c158] font-semibold">BECCA SHOP</span> s’est imposée comme une référence de prestige pour toutes celles qui conçoivent la mode africaine comme une signature d'affirmation, de noblesse et de distinction.
            </p>

            <p className="text-sm text-[#a1a1aa] leading-relaxed">
              Nous sélectionnons avec la plus stricte rigueur nos <strong className="text-white font-medium">pagnes de collection</strong> (Super Wax aux dorures impériales, soies souples, bazins damassés) et concevons des <strong className="text-white font-medium">chaussures féminines</strong> combinant équilibre, solidité et confort absolu pour vos cérémonies et journées d’exception.
            </p>

            {/* Three Brand Pillars with Staggered Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3">
              {[
                {
                  icon: Award,
                  title: "Qualité Supérieure",
                  desc: "Dorures durables, coton peigné et cuirs choisis sans compromis."
                },
                {
                  icon: HeartHandshake,
                  title: "Proximité & Conseil",
                  desc: "Accompagnement personnalisé sur WhatsApp pour chaque tenue."
                },
                {
                  icon: MapPin,
                  title: "Ancrage à Comé",
                  desc: "Boutique d'accueil chaleureuse et expéditions rapides dans tout le Bénin."
                }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4, borderColor: 'rgba(212, 175, 55, 0.4)' }}
                  className="p-4 rounded-2xl bg-[#121218] border border-[#22222d] transition-all shadow-sm"
                >
                  <item.icon className="w-5 h-5 text-[#e5c158] mb-2.5" />
                  <h4 className="text-xs font-bold text-white">{item.title}</h4>
                  <p className="text-[11px] text-[#a1a1aa] mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Slogan Banner */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="p-5 rounded-2xl bg-gradient-to-r from-[#1d1a12] via-[#14141a] to-[#101015] border border-[#d4af37]/35 flex items-center justify-between shadow-lg"
            >
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[#a1a1aa]">Devise de la Maison</p>
                <p className="font-luxury text-base sm:text-lg text-[#e5c158] font-bold mt-1">
                  « {STORE_INFO.tagline} »
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Visual Brand Card with Floating Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-3xl overflow-hidden border border-[#d4af37]/45 bg-[#14141d] p-7 sm:p-9 space-y-6 shadow-2xl">
              
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ rotate: 5, scale: 1.05 }}
                  className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#d4af37] shadow-xl shrink-0 bg-black"
                >
                  <img
                    src={STORE_INFO.logoUrl}
                    alt="Logo Officiel BECCA SHOP"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <div>
                  <h3 className="font-luxury text-xl font-bold text-white tracking-wide">
                    BECCA SHOP
                  </h3>
                  <p className="text-xs text-[#e5c158]">Boutique Officielle · Comé, Bénin</p>
                </div>
              </div>

              {/* Statistics Strip */}
              <div className="grid grid-cols-3 gap-2.5 py-4 border-y border-[#242432] text-center">
                <div>
                  <span className="block font-mono text-lg font-bold text-white">100%</span>
                  <span className="text-[10px] uppercase text-[#a1a1aa]">Authentique</span>
                </div>
                <div>
                  <span className="block font-mono text-lg font-bold text-[#e5c158]">7j/7</span>
                  <span className="text-[10px] uppercase text-[#a1a1aa]">WhatsApp</span>
                </div>
                <div>
                  <span className="block font-mono text-lg font-bold text-white">Bénin</span>
                  <span className="text-[10px] uppercase text-[#a1a1aa]">Expéditions</span>
                </div>
              </div>

              <div className="space-y-3.5 text-xs text-[#d4d4d8] pt-1">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#e5c158] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Adresse physique</span>
                    <span className="text-[#a1a1aa]">{STORE_INFO.fullAddress}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#e5c158] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Lignes directes WhatsApp & Appels</span>
                    <span className="text-[#a1a1aa] font-mono">{STORE_INFO.phone1Display} / {STORE_INFO.phone2Display}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2.5">
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={`tel:${STORE_INFO.phone1}`}
                  className="w-full py-3 text-center bg-[#222230] hover:bg-[#2b2b3c] text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Appeler la gérante ({STORE_INFO.phone1Display})</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#e5c158]" />
                </motion.a>
                
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={STORE_INFO.whatsappUrl1}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 text-center bg-[#25D366] hover:bg-[#20ba59] text-black text-xs font-bold rounded-xl transition-colors shadow-md shadow-[#25D366]/20"
                >
                  Discuter sur WhatsApp maintenant
                </motion.a>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
