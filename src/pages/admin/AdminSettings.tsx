import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../context/StoreContext';
import { EmailLog, SiteSettings } from '../../types';
import { formatDate } from '../../utils/formatters';
import {
  Settings,
  Mail,
  Eye,
  CheckCircle2,
  Save,
  Phone,
  MapPin,
  Clock,
  Truck,
  X,
  FileCode,
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings, emailLogs } = useStore();

  const [formData, setFormData] = useState<SiteSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<EmailLog | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#20202d]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#e5c158] font-bold">
            Configuration & Automatisation
          </span>
          <h1 className="font-luxury text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Paramètres Généraux & Journal des Emails
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Coordonnées officielles de la boutique de Comé et inspecteur des courriels automatiques.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Store Settings Form */}
        <div className="lg:col-span-6 bg-[#121219] border border-[#222230] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#242436]">
            <Settings className="w-5 h-5 text-[#e5c158]" />
            <h2 className="font-luxury text-lg font-bold text-white">Coordonnées de BECCA SHOP</h2>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#a1a1aa] uppercase font-semibold mb-1">Téléphone Principal (WhatsApp 1)</label>
                <input
                  type="text"
                  required
                  value={formData.phone1}
                  onChange={(e) => setFormData({ ...formData, phone1: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#181824] border border-[#2e2e40] rounded-xl text-white font-mono outline-none focus:border-[#e5c158]"
                />
              </div>

              <div>
                <label className="block text-[#a1a1aa] uppercase font-semibold mb-1">Téléphone Secondaire (WhatsApp 2)</label>
                <input
                  type="text"
                  required
                  value={formData.phone2}
                  onChange={(e) => setFormData({ ...formData, phone2: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#181824] border border-[#2e2e40] rounded-xl text-white font-mono outline-none focus:border-[#e5c158]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#a1a1aa] uppercase font-semibold mb-1">Adresse Complète de la Boutique</label>
              <input
                type="text"
                required
                value={formData.fullAddress}
                onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#181824] border border-[#2e2e40] rounded-xl text-white outline-none focus:border-[#e5c158]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#a1a1aa] uppercase font-semibold mb-1">Frais Livraison Comé (FCFA)</label>
                <input
                  type="number"
                  required
                  value={formData.deliveryFeeComeHome}
                  onChange={(e) => setFormData({ ...formData, deliveryFeeComeHome: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-[#181824] border border-[#2e2e40] rounded-xl text-white font-mono outline-none focus:border-[#e5c158]"
                />
              </div>

              <div>
                <label className="block text-[#a1a1aa] uppercase font-semibold mb-1">Frais Expédition Bénin (FCFA)</label>
                <input
                  type="number"
                  required
                  value={formData.deliveryFeeBenin}
                  onChange={(e) => setFormData({ ...formData, deliveryFeeBenin: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-[#181824] border border-[#2e2e40] rounded-xl text-white font-mono outline-none focus:border-[#e5c158]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#242436] flex items-center justify-between">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#aa7c11] text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer la configuration</span>
              </button>

              {savedSuccess && (
                <div className="text-xs text-[#10b981] flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Modifications sauvegardées !</span>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Right Column: Email Automation Logs Inspector */}
        <div className="lg:col-span-6 bg-[#121219] border border-[#222230] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#242436]">
            <div className="flex items-center gap-2.5">
              <Mail className="w-5 h-5 text-[#e5c158]" />
              <div>
                <h2 className="font-luxury text-lg font-bold text-white">Journal des Emails Transactionnels</h2>
                <span className="text-[10px] text-[#71717a]">Bienvenue, confirmations et alertes clients</span>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#10b981]/20 text-[#10b981]">
              {emailLogs.length} envoyés
            </span>
          </div>

          <div className="max-h-96 overflow-y-auto divide-y divide-[#20202e] text-xs">
            {emailLogs.length === 0 ? (
              <p className="text-xs text-[#71717a] py-6 text-center">Aucun email transactionnel consigné pour le moment.</p>
            ) : (
              emailLogs.map((log) => (
                <div key={log.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="font-bold text-white line-clamp-1">{log.subject}</div>
                    <div className="text-[11px] text-[#a1a1aa]">
                      À : <strong className="text-[#e5c158]">{log.recipientName}</strong> ({log.to})
                    </div>
                    <div className="text-[10px] text-[#71717a]">{formatDate(log.sentAt)} · Modèle : {log.template}</div>
                  </div>

                  <button
                    onClick={() => setSelectedEmail(log)}
                    className="px-3 py-1.5 rounded-xl bg-[#1c1c28] hover:bg-[#252536] border border-[#2e2e40] text-xs font-semibold text-[#e5c158] transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Aperçu</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* HTML Email Visual Inspector Modal */}
      <AnimatePresence>
        {selectedEmail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#121219] border border-[#d4af37]/40 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#242436]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#e5c158] tracking-widest">
                    Aperçu Haute Définition
                  </span>
                  <h3 className="font-luxury text-lg font-bold text-white">{selectedEmail.subject}</h3>
                  <div className="text-xs text-[#a1a1aa]">
                    Destinataire : {selectedEmail.recipientName} &lt;{selectedEmail.to}&gt;
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEmail(null)}
                  className="p-1.5 rounded-lg text-[#a1a1aa] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sandboxed rendering of the luxury HTML email */}
              <div className="rounded-2xl overflow-hidden border border-[#2e2e42] bg-[#000000] p-2">
                <iframe
                  title="Aperçu Email"
                  srcDoc={selectedEmail.htmlContent}
                  className="w-full h-[500px] rounded-xl bg-black border-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedEmail(null)}
                  className="px-6 py-2.5 rounded-xl bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wider"
                >
                  Fermer l'inspecteur
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
