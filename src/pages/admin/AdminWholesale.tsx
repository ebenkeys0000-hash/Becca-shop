import React from 'react';
import { useStore } from '../../context/StoreContext';
import { formatFCFA } from '../../utils/formatters';
import { PackageCheck, Layers, Sparkles, CheckCircle2, ShieldCheck, Truck } from 'lucide-react';

export const AdminWholesale: React.FC = () => {
  const { products, updateProduct } = useStore();

  const wholesaleProducts = products.filter((p) => p.wholesaleEligible);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#20202d]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#e5c158] font-bold">
            Tarification Grossistes & Revendeurs
          </span>
          <h1 className="font-luxury text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Vente en Gros & Demi-Gros ({wholesaleProducts.length} articles)
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Barèmes de remises par volume appliqués automatiquement dès que le client atteint le palier requis.
          </p>
        </div>
      </div>

      {/* Policy Explainer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-[#121219] border border-[#222230] shadow-xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 text-[#e5c158] flex items-center justify-center">
            <PackageCheck className="w-5 h-5" />
          </div>
          <h3 className="font-luxury text-base font-bold text-white">Palier Demi-Gros (5-9 pcs)</h3>
          <p className="text-xs text-[#a1a1aa] leading-relaxed">
            Permet aux clientes d'obtenir jusqu'à 15% de réduction immédiate pour les dots, cérémonies familiales et cortèges.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#121219] border border-[#222230] shadow-xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#3b82f6]/15 text-[#3b82f6] flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-luxury text-base font-bold text-white">Palier Grand Gros (10+ pcs)</h3>
          <p className="text-xs text-[#a1a1aa] leading-relaxed">
            Tarifs réservés aux boutiques revendeuses du Bénin (Cotonou, Parakou, Porto-Novo, Lokossa) avec calcul dynamique au panier.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#121219] border border-[#222230] shadow-xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#10b981]/15 text-[#10b981] flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <h3 className="font-luxury text-base font-bold text-white">Logistique Colis Sécurisé</h3>
          <p className="text-xs text-[#a1a1aa] leading-relaxed">
            Emballage haute résistance et acheminement via transporteurs partenaires dans toutes les villes du Bénin.
          </p>
        </div>
      </div>

      {/* Eligible Products Table */}
      <div className="bg-[#121219] border border-[#222230] rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#222230]">
          <h2 className="font-luxury text-lg font-bold text-white">Catalogue Éligible au Tarif de Gros</h2>
          <span className="text-xs text-[#a1a1aa]">Activez ou désactivez l'éligibilité en un clic</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#222230] text-[#71717a] uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Article</th>
                <th className="pb-3 font-semibold">Rayon</th>
                <th className="pb-3 font-semibold">Prix Détail (1-4 pcs)</th>
                <th className="pb-3 font-semibold">Prix Gros (5+ pcs)</th>
                <th className="pb-3 font-semibold">Économie Client</th>
                <th className="pb-3 font-semibold">Stock</th>
                <th className="pb-3 font-semibold text-right">Éligibilité Gros</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e2c]">
              {products.map((p) => {
                const discount = p.wholesalePrice ? p.price - p.wholesalePrice : 0;
                return (
                  <tr key={p.id} className="hover:bg-[#161622] transition-colors">
                    <td className="py-3.5 font-bold text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-11 rounded-lg bg-black overflow-hidden shrink-0">
                          <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div>{p.name}</div>
                          <div className="text-[10px] text-[#71717a] font-mono">Réf: {p.reference}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 capitalize text-[#a1a1aa]">{p.category}</td>
                    <td className="py-3.5 font-mono font-bold text-white">{formatFCFA(p.price)}</td>
                    <td className="py-3.5 font-mono font-bold text-[#e5c158]">
                      {p.wholesalePrice ? formatFCFA(p.wholesalePrice) : 'Non défini'}
                    </td>
                    <td className="py-3.5 text-[#10b981] font-semibold font-mono">
                      {discount > 0 ? `-${formatFCFA(discount)} / pc` : '-'}
                    </td>
                    <td className="py-3.5 font-mono text-[#d4d4d8]">{p.stock} pcs</td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => updateProduct(p.id, { wholesaleEligible: !p.wholesaleEligible })}
                        className={`px-3 py-1 rounded-xl text-[10px] font-bold uppercase transition-all ${
                          p.wholesaleEligible
                            ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40'
                            : 'bg-[#222230] text-[#71717a] hover:text-white'
                        }`}
                      >
                        {p.wholesaleEligible ? 'Activé' : 'Désactivé'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
