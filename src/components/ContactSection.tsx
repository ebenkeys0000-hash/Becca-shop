import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { STORE_INFO } from '../data/products';
import { Phone, MessageCircle, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState<string>(STORE_INFO.phone1);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;

    const fullMsg = `Bonjour BECCA SHOP,\n\nJe m'appelle *${name}* (${phone || 'Non précisé'}).\n\n*Mon message :*\n${message}`;
    const cleanPhone = selectedRecipient.replace(/\D/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(fullMsg)}`;
    
    window.open(url, '_blank');
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setMessage('');
    }, 3000);
  };

  return (
    <section id="contact" className="py-24 bg-[#0a0a0d] border-b border-[#202028] relative overflow-hidden">
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
            <Phone className="w-3.5 h-3.5" />
            <span>Contact & Visite en Boutique</span>
          </div>
          <h2 className="font-luxury text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
            Nous Sommes à Votre Entière Disposition
          </h2>
          <p className="text-xs sm:text-sm text-[#a1a1aa] mt-2 font-light">
            Rendez-nous visite à la boutique de Comé ou échangez directement avec nous par appel ou WhatsApp.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Direct Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-4"
          >
            {/* Phone & WhatsApp Card 1 */}
            <motion.div
              whileHover={{ y: -3, borderColor: 'rgba(212, 175, 55, 0.4)' }}
              className="p-6 rounded-3xl bg-[#13131a] border border-[#242432] space-y-3.5 transition-all shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#e5c158]">
                  Ligne Principale 1
                </span>
                <span className="text-[10px] bg-[#1e1c14] text-[#e5c158] px-2.5 py-0.5 rounded-full border border-[#d4af37]/30">
                  Appels & WhatsApp
                </span>
              </div>
              <p className="text-xl sm:text-2xl font-mono font-bold text-white tracking-wide">
                {STORE_INFO.phone1Display}
              </p>
              <div className="flex gap-2.5 pt-1">
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={`tel:${STORE_INFO.phone1}`}
                  className="flex-1 py-2.5 text-center rounded-xl bg-[#22222e] hover:bg-[#2b2b3a] text-xs font-semibold text-white transition-colors"
                >
                  Appeler
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={STORE_INFO.whatsappUrl1}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 text-center rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-xs font-bold text-black transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-[#25D366]/20"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </motion.a>
              </div>
            </motion.div>

            {/* Phone & WhatsApp Card 2 */}
            <motion.div
              whileHover={{ y: -3, borderColor: 'rgba(212, 175, 55, 0.4)' }}
              className="p-6 rounded-3xl bg-[#13131a] border border-[#242432] space-y-3.5 transition-all shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#e5c158]">
                  Ligne Secondaire 2
                </span>
                <span className="text-[10px] bg-[#1e1c14] text-[#e5c158] px-2.5 py-0.5 rounded-full border border-[#d4af37]/30">
                  Appels & WhatsApp
                </span>
              </div>
              <p className="text-xl sm:text-2xl font-mono font-bold text-white tracking-wide">
                {STORE_INFO.phone2Display}
              </p>
              <div className="flex gap-2.5 pt-1">
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={`tel:${STORE_INFO.phone2}`}
                  className="flex-1 py-2.5 text-center rounded-xl bg-[#22222e] hover:bg-[#2b2b3a] text-xs font-semibold text-white transition-colors"
                >
                  Appeler
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={STORE_INFO.whatsappUrl2}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 text-center rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-xs font-bold text-black transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-[#25D366]/20"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </motion.a>
              </div>
            </motion.div>

            {/* Address & Hours */}
            <div className="p-6 rounded-3xl bg-[#13131a] border border-[#242432] space-y-3.5 text-xs text-[#a1a1aa]">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#e5c158] shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-semibold block">Localisation :</span>
                  <span>{STORE_INFO.fullAddress}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#e5c158] shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-semibold block">Horaires d'accueil :</span>
                  <span>{STORE_INFO.hours}</span>
                </div>
              </div>
            </div>

          </motion.div>

          {/* Right Column: Direct Message Sender */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <div className="p-7 sm:p-9 rounded-3xl bg-[#13131a] border border-[#242432] shadow-2xl">
              <h3 className="font-luxury text-xl sm:text-2xl font-bold text-white mb-1">
                Écrire un message à la boutique
              </h3>
              <p className="text-xs text-[#a1a1aa] mb-6 font-light">
                Renseignez votre demande (disponibilité d'un modèle, conseil pointure, commande spéciale).
              </p>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-8 rounded-2xl bg-[#142018] border border-[#10b981]/40 text-center space-y-3"
                  >
                    <CheckCircle2 className="w-12 h-12 text-[#10b981] mx-auto" />
                    <h4 className="text-base font-bold text-white">Message transmis avec succès !</h4>
                    <p className="text-xs text-[#a1a1aa] max-w-sm mx-auto">
                      Votre discussion WhatsApp a été préparée et ouverte pour un échange immédiat avec notre équipe.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#d4d4d8] mb-1.5">
                          Votre Nom
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ex : Amina Dossou"
                          className="w-full px-4 py-3 rounded-xl bg-[#181822] border border-[#2a2a38] text-white text-xs focus:border-[#e5c158] focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#d4d4d8] mb-1.5">
                          Votre Téléphone
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+229 XX XX XX XX"
                          className="w-full px-4 py-3 rounded-xl bg-[#181822] border border-[#2a2a38] text-white text-xs focus:border-[#e5c158] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#d4d4d8] mb-1.5">
                        Contacter sur quel numéro ?
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          onClick={() => setSelectedRecipient(STORE_INFO.phone1)}
                          className={`py-2.5 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                            selectedRecipient === STORE_INFO.phone1
                              ? 'bg-[#e5c158] text-black font-bold border-[#e5c158] shadow-md shadow-[#e5c158]/20'
                              : 'bg-[#181822] text-[#a1a1aa] border-[#2a2a38]'
                          }`}
                        >
                          {STORE_INFO.phone1Display}
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          onClick={() => setSelectedRecipient(STORE_INFO.phone2)}
                          className={`py-2.5 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                            selectedRecipient === STORE_INFO.phone2
                              ? 'bg-[#e5c158] text-black font-bold border-[#e5c158] shadow-md shadow-[#e5c158]/20'
                              : 'bg-[#181822] text-[#a1a1aa] border-[#2a2a38]'
                          }`}
                        >
                          {STORE_INFO.phone2Display}
                        </motion.button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#d4d4d8] mb-1.5">
                        Votre Message / Question
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Bonjour, je recherche un ensemble Super Wax pour un mariage à Comé..."
                        className="w-full px-4 py-3 rounded-xl bg-[#181822] border border-[#2a2a38] text-white text-xs focus:border-[#e5c158] focus:outline-none transition-colors"
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02, filter: 'brightness(1.05)' }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#aa7c11] text-black font-bold text-xs tracking-wide shadow-xl shadow-[#d4af37]/20 flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Envoyer mon message sur WhatsApp</span>
                    </motion.button>
                  </form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
