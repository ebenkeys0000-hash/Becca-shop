import React from 'react';
import { ContactSection } from '../../components/ContactSection';
import { STORE_INFO } from '../../data/products';
import { MapPin, Phone, MessageCircle, Clock, ShieldCheck } from 'lucide-react';

export const ContactPage: React.FC = () => {
  return (
    <div className="py-12 bg-[#0a0a0d] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#e5c158] font-bold">
            Service Clientèle & Boutique Physique
          </span>
          <h1 className="font-luxury text-3xl sm:text-4xl font-extrabold text-white">
            Prenez Contact avec BECCA SHOP
          </h1>
          <p className="text-xs sm:text-sm text-[#a1a1aa]">
            Nos équipes à Comé sont à votre disposition pour vous conseiller, confirmer vos commandes ou organiser vos livraisons partout au Bénin.
          </p>
        </div>

        {/* Detailed Info Cards Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#13131b] border border-[#242432] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#201d14] border border-[#d4af37]/35 flex items-center justify-center text-[#e5c158]">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-luxury text-base font-bold text-white">Boutique de Comé</h3>
            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              {STORE_INFO.fullAddress}
            </p>
            <p className="text-[11px] text-[#e5c158] font-medium pt-1">
              Mono, République du Bénin
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#13131b] border border-[#242432] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#201d14] border border-[#d4af37]/35 flex items-center justify-center text-[#e5c158]">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-luxury text-base font-bold text-white">Lignes Téléphoniques</h3>
            <div className="space-y-1 text-xs">
              <a href={`tel:${STORE_INFO.phone1}`} className="text-white hover:text-[#e5c158] block font-mono">
                {STORE_INFO.phone1Display} (Principal)
              </a>
              <a href={`tel:${STORE_INFO.phone2}`} className="text-white hover:text-[#e5c158] block font-mono">
                {STORE_INFO.phone2Display} (Secondaire)
              </a>
            </div>
            <p className="text-[11px] text-[#71717a] pt-1">Appels et WhatsApp disponibles</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#13131b] border border-[#242432] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#201d14] border border-[#d4af37]/35 flex items-center justify-center text-[#e5c158]">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-luxury text-base font-bold text-white">Horaires d'Accueil</h3>
            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              {STORE_INFO.hours}
            </p>
            <p className="text-[11px] text-[#10b981] font-medium pt-1">
              Boutique ouverte 6j/7
            </p>
          </div>
        </div>

        {/* Interactive Form Section */}
        <ContactSection />

      </div>
    </div>
  );
};
