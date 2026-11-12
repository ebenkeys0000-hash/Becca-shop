import React from 'react';
import { Link } from 'wouter';
import { useStore } from '../../context/StoreContext';
import { formatFCFA } from '../../utils/formatters';
import { Layers, Sparkles, Package, ArrowRight } from 'lucide-react';

export const AdminCategories: React.FC = () => {
  const { products } = useStore();

  const pagnes = products.filter((p) => p.category === 'pagnes');
  const chaussures = products.filter((p) => p.category === 'chaussures');

  const getSubcategories = (cat: 'pagnes' | 'chaussures') => {
    const list = products.filter((p) => p.category === cat);
    const subMap: Record<string, { count: number; stock: number; totalValue: number }> = {};
    list.forEach((p) => {
      if (!subMap[p.subCategory]) {
        subMap[p.subCategory] = { count: 0, stock: 0, totalValue: 0 };
      }
      subMap[p.subCategory].count += 1;
      subMap[p.subCategory].stock += p.stock;
      subMap[p.subCategory].totalValue += p.price * p.stock;
    });
    return Object.entries(subMap).map(([name, data]) => ({ name, ...data }));
  };

  const pagnesSubs = getSubcategories('pagnes');
  const chaussuresSubs = getSubcategories('chaussures');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#20202d]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#e5c158] font-bold">
            Organisation du Catalogue
          </span>
          <h1 className="font-luxury text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Rayons & Catégories de Prestige
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Structure des collections de pagnes africains et de souliers à Comé.
          </p>
        </div>

        <Link
          href="/admin/products"
          className="px-4 py-2.5 rounded-xl bg-[#1c1c28] hover:bg-[#252536] border border-[#2e2e40] text-xs font-semibold text-white transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <span>Gérer les articles</span>
          <ArrowRight className="w-4 h-4 text-[#e5c158]" />
        </Link>
      </div>

      {/* Main Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category 1: Pagnes */}
        <div className="bg-[#121219] border border-[#222230] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#222230]">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#e5c158] font-bold">
                Rayon Principal 1
              </span>
              <h2 className="font-luxury text-xl font-bold text-white mt-0.5">Pagnes Africains</h2>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#d4af37]/15 text-[#e5c158] border border-[#d4af37]/30">
              {pagnes.length} modèles
            </span>
          </div>

          <div className="space-y-3">
            <span className="text-xs text-[#a1a1aa] uppercase font-semibold">Sous-collections actives :</span>
            <div className="space-y-2.5">
              {pagnesSubs.map((sub, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#181824] border border-[#262638] flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-white block">{sub.name}</span>
                    <span className="text-[11px] text-[#71717a]">{sub.count} modèle(s) · {sub.stock} pièces en stock</span>
                  </div>
                  <span className="font-mono font-bold text-[#e5c158] text-[11px]">
                    Val: {formatFCFA(sub.totalValue)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category 2: Chaussures */}
        <div className="bg-[#121219] border border-[#222230] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#222230]">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#e5c158] font-bold">
                Rayon Principal 2
              </span>
              <h2 className="font-luxury text-xl font-bold text-white mt-0.5">Chaussures & Escarpins</h2>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#d4af37]/15 text-[#e5c158] border border-[#d4af37]/30">
              {chaussures.length} modèles
            </span>
          </div>

          <div className="space-y-3">
            <span className="text-xs text-[#a1a1aa] uppercase font-semibold">Sous-collections actives :</span>
            <div className="space-y-2.5">
              {chaussuresSubs.map((sub, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#181824] border border-[#262638] flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-white block">{sub.name}</span>
                    <span className="text-[11px] text-[#71717a]">{sub.count} modèle(s) · {sub.stock} paires en stock</span>
                  </div>
                  <span className="font-mono font-bold text-[#e5c158] text-[11px]">
                    Val: {formatFCFA(sub.totalValue)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
