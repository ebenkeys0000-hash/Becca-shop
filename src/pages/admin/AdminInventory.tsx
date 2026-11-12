import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { formatDate } from '../../utils/formatters';
import {
  Warehouse,
  AlertTriangle,
  Plus,
  Minus,
  RotateCcw,
  History,
  Search,
  CheckCircle2,
  X,
  FileSpreadsheet,
} from 'lucide-react';

export const AdminInventory: React.FC = () => {
  const { products, inventoryMovements, adjustStock } = useStore();
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustDelta, setAdjustDelta] = useState<number>(5);
  const [adjustReason, setAdjustReason] = useState<string>('Nouvel arrivage fournisseur');

  const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockCount = products.filter((p) => p.stock <= 5 && p.stock > 0).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    adjustStock(selectedProduct.id, adjustDelta, adjustReason);
    setSelectedProduct(null);
  };

  const filteredProducts = products.filter((p) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.reference.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#20202d]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#e5c158] font-bold">
            Gestion des Stocks & Entrepôt
          </span>
          <h1 className="font-luxury text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Inventaire & Traçabilité des Mouvements
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Suivi des entrées, sorties de stock lors des commandes et journal d'audit chronologique.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-[#121219] border border-[#222230]">
          <span className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider">Stock Global</span>
          <div className="text-3xl font-extrabold text-white font-mono mt-1">{totalUnits} pcs</div>
          <span className="text-[11px] text-[#71717a] mt-1 block">Toutes collections confondues</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#121219] border border-[#222230]">
          <span className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider">Alertes Stock Faible</span>
          <div className="text-3xl font-extrabold text-[#f59e0b] font-mono mt-1">{lowStockCount}</div>
          <span className="text-[11px] text-[#71717a] mt-1 block">Moins de 5 pièces en réserve</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#121219] border border-[#222230]">
          <span className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider">Ruptures Définitives</span>
          <div className="text-3xl font-extrabold text-[#ef4444] font-mono mt-1">{outOfStockCount}</div>
          <span className="text-[11px] text-[#71717a] mt-1 block">Modèles à 0 unité</span>
        </div>
      </div>

      {/* Stock Levels Table */}
      <div className="bg-[#121219] border border-[#222230] rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#222230]">
          <h2 className="font-luxury text-lg font-bold text-white">Niveaux de Stocks par Article</h2>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#71717a] absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filtrer un modèle..."
              className="w-full pl-9 pr-4 py-1.5 bg-[#181824] border border-[#2c2c3d] rounded-xl text-xs text-white placeholder-[#71717a] outline-none focus:border-[#e5c158]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#222230] text-[#71717a] uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Article</th>
                <th className="pb-3 font-semibold">Rayon</th>
                <th className="pb-3 font-semibold">Référence</th>
                <th className="pb-3 font-semibold">Quantité Disponible</th>
                <th className="pb-3 font-semibold">État</th>
                <th className="pb-3 font-semibold text-right">Ajuster Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e2c]">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-[#161622] transition-colors">
                  <td className="py-3 font-bold text-white">{p.name}</td>
                  <td className="py-3 capitalize text-[#a1a1aa]">{p.category}</td>
                  <td className="py-3 font-mono text-[#71717a]">{p.reference}</td>
                  <td className="py-3 font-mono font-bold text-white text-sm">{p.stock} pcs</td>
                  <td className="py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      p.stock > 5
                        ? 'bg-[#10b981]/20 text-[#10b981]'
                        : p.stock > 0
                        ? 'bg-[#f59e0b]/20 text-[#f59e0b]'
                        : 'bg-[#ef4444]/20 text-[#ef4444]'
                    }`}>
                      {p.stock > 5 ? 'Normal' : p.stock > 0 ? 'Faible' : 'Épuisé'}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedProduct(p);
                        setAdjustDelta(5);
                        setAdjustReason('Nouvel arrivage fournisseur');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#1c1c28] hover:bg-[#262638] text-[#e5c158] font-semibold text-xs transition-colors"
                    >
                      Ajuster (+ / -)
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chronological Audit Movements Log */}
      <div className="bg-[#121219] border border-[#222230] rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#222230]">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <History className="w-4 h-4 text-[#e5c158]" />
            <span>Journal d'Audit des Mouvements de Stock ({inventoryMovements.length})</span>
          </div>
          <span className="text-[11px] text-[#71717a]">Traçabilité horodatée</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#222230] text-[#71717a] uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Date & Heure</th>
                <th className="pb-3 font-semibold">Article</th>
                <th className="pb-3 font-semibold">Variation</th>
                <th className="pb-3 font-semibold">Évolution</th>
                <th className="pb-3 font-semibold">Motif / Justificatif</th>
                <th className="pb-3 font-semibold">Opérateur</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e2c]">
              {inventoryMovements.slice(0, 15).map((mov) => (
                <tr key={mov.id} className="hover:bg-[#161622] transition-colors">
                  <td className="py-3 text-[#71717a]">{formatDate(mov.timestamp)}</td>
                  <td className="py-3 font-medium text-white">{mov.productName}</td>
                  <td className="py-3">
                    <span className={`font-mono font-bold ${
                      mov.quantityDelta > 0 ? 'text-[#10b981]' : 'text-[#ef4444]'
                    }`}>
                      {mov.quantityDelta > 0 ? `+${mov.quantityDelta}` : mov.quantityDelta}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-[#a1a1aa]">
                    {mov.previousStock} → <strong className="text-white">{mov.newStock}</strong>
                  </td>
                  <td className="py-3 text-[#d4d4d8]">{mov.reason}</td>
                  <td className="py-3 text-[#e5c158] font-medium">{mov.actor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#121219] border border-[#d4af37]/40 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#242436]">
                <h3 className="font-luxury text-lg font-bold text-white">Ajustement Manuel de Stock</h3>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="p-1.5 rounded-lg text-[#a1a1aa] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-xs bg-[#171724] p-3.5 rounded-2xl border border-[#28283a] space-y-1">
                <span className="text-[#a1a1aa]">Article sélectionné :</span>
                <div className="font-bold text-white text-sm">{selectedProduct.name}</div>
                <div className="text-[#71717a]">Réf: {selectedProduct.reference} · Stock actuel: <strong className="text-[#e5c158] font-mono">{selectedProduct.stock} pcs</strong></div>
              </div>

              <form onSubmit={handleAdjustSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#a1a1aa] uppercase font-semibold mb-1">
                    Quantité à ajouter (+) ou déduire (-)
                  </label>
                  <input
                    type="number"
                    required
                    value={adjustDelta}
                    onChange={(e) => setAdjustDelta(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-[#181824] border border-[#2e2e40] rounded-xl text-white font-mono text-sm outline-none focus:border-[#e5c158]"
                  />
                  <span className="text-[11px] text-[#71717a] mt-1 block">
                    Nouveau stock prévisionnel : <strong className="text-white">{Math.max(0, selectedProduct.stock + adjustDelta)} pcs</strong>
                  </span>
                </div>

                <div>
                  <label className="block text-[#a1a1aa] uppercase font-semibold mb-1">
                    Motif de l'ajustement
                  </label>
                  <select
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#181824] border border-[#2e2e40] rounded-xl text-white outline-none focus:border-[#e5c158]"
                  >
                    <option value="Nouvel arrivage fournisseur">Nouvel arrivage fournisseur</option>
                    <option value="Retour cliente en boutique">Retour cliente en boutique</option>
                    <option value="Régularisation inventaire physique">Régularisation inventaire physique</option>
                    <option value="Vente directe au comptoir de Comé">Vente directe au comptoir de Comé</option>
                    <option value="Perte ou dégradation textile">Perte ou dégradation textile</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4 border-t border-[#242436]">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#aa7c11] text-black font-extrabold text-xs uppercase tracking-wider"
                  >
                    Valider le Mouvement
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(null)}
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
