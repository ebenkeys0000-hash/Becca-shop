import React from 'react';
import { motion } from 'motion/react';
import { STORE_INFO } from '../../data/products';
import { Award, HeartHandshake, MapPin, Sparkles, CheckCircle, Phone, MessageCircle } from 'lucide-react';
import { Link } from 'wouter';
import { ASSET_IMAGES } from '../../assets/images';
import { SafeImage } from '../../components/SafeImage';

export const AboutPage: React.FC = () => {
  return (
    <div className="py-16 bg-[#0a0a0d] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181612] border border-[#d4af37]/30 text-xs font-semibold text-[#e5c158] uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Maison de Haute Tradition</span>
          </div>
          <h1 className="font-luxury text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            L'Histoire & la Vision de <span className="gold-gradient-text">BECCA SHOP</span>
          </h1>
          <p className="text-sm sm:text-base text-[#a1a1aa] leading-relaxed">
            Fondée à Comé, notre maison célèbre la grâce et l'élégance de la femme africaine à travers une sélection exclusive de pagnes d'apparat et de souliers de cérémonie.
          </p>
        </div>

        {/* Narrative Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6 text-sm text-[#d4d4d8] leading-relaxed">
            <h2 className="font-luxury text-2xl sm:text-3xl font-bold text-white">
              L'Ancrage Authentique au Cœur du Mono
            </h2>
            <p>
              Depuis notre boutique physique située sur la Route Principale de <strong className="text-white">Comé au Bénin</strong>, BECCA SHOP s'est fixé une mission claire : redonner au pagne africain et à la chaussure féminine toute leur noblesse.
            </p>
            <p>
              Chaque pièce qui intègre nos rayons est rigoureusement examinée : éclat et résistance des dorures sous la lumière du soleil béninois, douceur du coton peigné, souplesse et tombé majestueux des soies wax.
            </p>
            <p>
              Pour nos chaussures, nous collaborons avec des ateliers spécialisés pour garantir des cambrures qui subliment la posture tout en offrant le confort nécessaire pour danser, célébrer et marcher des heures sans fatigue.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <Link
                href="/shop"
                className="px-6 py-3 rounded-full bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wider text-center"
              >
                Explorer la boutique
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 rounded-full bg-[#1c1c28] text-white font-medium text-xs border border-[#333346] text-center"
              >
                Nous rendre visite à Comé
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden border border-[#d4af37]/40 bg-[#16161f] shadow-2xl">
              <SafeImage
                src={ASSET_IMAGES.heroBeninFashion}
                alt="Haute couture béninoise en Super Wax authentique chez BECCA SHOP"
                className="w-full h-[450px] object-cover"
              />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#0c0c10]/90 backdrop-blur-md border border-[#d4af37]/30">
                <p className="font-luxury text-white font-bold text-base">« {STORE_INFO.tagline} »</p>
                <p className="text-xs text-[#e5c158] mt-0.5">Boutique officielle à Comé, Mono, Bénin</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <div className="p-6 rounded-2xl bg-[#13131b] border border-[#232332] space-y-3">
            <Award className="w-6 h-6 text-[#e5c158]" />
            <h3 className="font-luxury text-lg font-bold text-white">Authenticité Sans Compromis</h3>
            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              Nous refusons les imitations fragiles. Nos pagnes Super Wax et Bazin Getzner conservent leur brillance au fil des années.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#13131b] border border-[#232332] space-y-3">
            <HeartHandshake className="w-6 h-6 text-[#e5c158]" />
            <h3 className="font-luxury text-lg font-bold text-white">Vente en Gros & Détail</h3>
            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              Nous soutenons les commerçantes et créatrices avec des grilles tarifaires transparentes et dégressives dès 4 ou 5 pièces.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#13131b] border border-[#232332] space-y-3">
            <MapPin className="w-6 h-6 text-[#e5c158]" />
            <h3 className="font-luxury text-lg font-bold text-white">Service Client Dédié</h3>
            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              Deux lignes téléphoniques directes et un service WhatsApp 7j/7 pour vous guider dans vos choix et expéditions.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
