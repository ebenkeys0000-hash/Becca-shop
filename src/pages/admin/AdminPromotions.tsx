import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../context/StoreContext';
import { Promotion } from '../../types';
import { formatFCFA } from '../../utils/formatters';
import { Tag, Plus, Trash2, CheckCircle2, XCircle, X } from 'lucide-react';

export const AdminPromotions: React.FC = () => {
  const { promotions, addPromotion, updatePromotion, deletePromotion } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 10,
    appliesTo: 'all' as 'all' | 'pagnes' | 'chaussures',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '2026-12-31',
    isActive: true,
  });

  const handleOpenAdd = () => {
    setFormData({
      code: 'FETE2026',
      name: 'Offre Spéciale Fêtes & Célébrations',
      description: 'Remise exceptionnelle sur tout le catalogue pour les événements.',
      discountType: 'percentage',
      discountValue: 15,
      appliesTo: 'all',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-31',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPromotion({
      code: formData.code.toUpperCase().trim(),
      name: formData.name,
      description: formData.description,
      discountType: formData.discountType,
      discountValue: Number(formData.discountValue),
      appliesTo: formData.appliesTo,
      startDate: formData.startDate,
      endDate: formData.endDate,
      isActive: formData.isActive,
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#20202d]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#e5c158] font-bold">
            Campagnes & Réductions
          </span>
          <h1 className="font-luxury text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Codes Promotionnels & Privilèges ({promotions.length})
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Créez des remises automatiques pour vos clientes régulières et les dots de mariage.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#aa7c11] text-black font-extrabold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-black" />
          <span>Créer un Code Promo</span>
        </button>
      </div>

      {/* Promotions Table */}
      <div className="bg-[#121219] border border-[#222230] rounded-3xl p-6 shadow-xl overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#222230] text-[#71717a] uppercase tracking-wider text-[10px]">
              <th className="pb-3 font-semibold">Code Promo</th>
              <th className="pb-3 font-semibold">Intitulé de la Campagne</th>
              <th className="pb-3 font-semibold">Réduction</th>
              <th className="pb-3 font-semibold">Application</th>
              <th className="pb-3 font-semibold">Validité</th>
              <th className="pb-3 font-semibold">Statut</th>
              <th className="pb-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e2c]">
            {promotions.map((p) => (
              <tr key={p.id} className="hover:bg-[#161622] transition-colors">
                <td className="py-3.5 font-mono font-bold text-[#e5c158] text-sm">
                  <span className="px-3 py-1 bg-[#222016] border border-[#d4af37]/40 rounded-xl">
                    {p.code}
                  </span>
                </td>
                <td className="py-3.5">
                  <div className="font-bold text-white">{p.name}</div>
                  <div className="text-[10px] text-[#71717a]">{p.description}</div>
                </td>
                <td className="py-3.5 font-mono font-bold text-white">
                  {p.discountType === 'percentage'
                    ? `-${p.discountValue}%`
                    : `-${formatFCFA(p.discountValue)}`}
                </td>
                <td className="py-3.5 capitalize text-[#a1a1aa]">{p.appliesTo}</td>
                <td className="py-3.5 text-[#71717a]">Jusqu'au {p.endDate}</td>
                <td className="py-3.5">
                  <button
                    onClick={() => updatePromotion(p.id, { isActive: !p.isActive })}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                      p.isActive
                        ? 'bg-[#10b981]/20 text-[#10b981]'
                        : 'bg-[#ef4444]/20 text-[#ef4444]'
                    }`}
                  >
                    {p.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    <span>{p.isActive ? 'Actif' : 'Désactivé'}</span>
                  </button>
                </td>
                <td className="py-3.5 text-right">
                  <button
                    onClick={() => deletePromotion(p.id)}
                    className="p-2 rounded-lg bg-[#ef4444]/15 hover:bg-[#ef4444]/25 text-[#ef4444] transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#121219] border border-[#d4af37]/40 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#242436]">
                <h3 className="font-luxury text-lg font-bold text-white">Nouveau Code Promotionnel</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg text-[#a1a1aa] hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#a1a1aa] uppercase font-semibold mb-1">Code Promo (en majuscules)</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="ex: ETE2026"
                    className="w-full px-4 py-2.5 bg-[#181824] border border-[#2e2e40] rounded-xl text-white font-mono uppercase outline-none focus:border-[#e5c158]"
                  />
                </div>

                <div>
                  <label className="block text-[#a1a1aa] uppercase font-semibold mb-1">Intitulé de la campagne</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#181824] border border-[#2e2e40] rounded-xl text-white outline-none focus:border-[#e5c158]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#a1a1aa] uppercase font-semibold mb-1">Type de remise</label>
                    <select
                      value={formData.discountType}
                      onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                      className="w-full px-4 py-2.5 bg-[#181824] border border-[#2e2e40] rounded-xl text-white outline-none focus:border-[#e5c158]"
                    >
                      <option value="percentage">Pourcentage (%)</option>
                      <option value="fixed">Montant Fixe (FCFA)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#a1a1aa] uppercase font-semibold mb-1">Valeur</label>
                    <input
                      type="number"
                      required
                      value={formData.discountValue}
                      onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 bg-[#181824] border border-[#2e2e40] rounded-xl text-white font-mono outline-none focus:border-[#e5c158]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#a1a1aa] uppercase font-semibold mb-1">Date d'expiration</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#181824] border border-[#2e2e40] rounded-xl text-white outline-none focus:border-[#e5c158]"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-[#242436]">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#aa7c11] text-black font-extrabold text-xs uppercase tracking-wider"
                  >
                    Enregistrer le Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-3 rounded-xl bg-[#1e1e2c] text-white text-xs font-semibold"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
