import React, { useState } from 'react';
import { Link } from 'wouter';
import { useStore } from '../../context/StoreContext';
import { formatFCFA, formatDate } from '../../utils/formatters';
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Users,
  AlertTriangle,
  ArrowUpRight,
  Package,
  Calendar,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { orders, products, subscribers } = useStore();
  const [timeline, setTimeline] = useState<'day' | 'week' | 'month'>('month');

  // KPI Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const deliveredOrders = orders.filter((o) => o.status === 'delivered');
  const lowStockProducts = products.filter((p) => p.stock <= 5);

  const recentOrders = [...orders].slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#20202d]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#e5c158] font-bold">
            Tableau de Bord Exécutif
          </span>
          <h1 className="font-luxury text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Performance & Activité Commerciale
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Boutique BECCA SHOP · Comé, Département du Mono, Bénin
          </p>
        </div>

        {/* Timeline switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-[#14141e] border border-[#242436] rounded-xl self-start sm:self-auto text-xs">
          <button
            onClick={() => setTimeline('day')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              timeline === 'day' ? 'bg-[#d4af37] text-black shadow-sm' : 'text-[#a1a1aa] hover:text-white'
            }`}
          >
            Aujourd'hui
          </button>
          <button
            onClick={() => setTimeline('week')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              timeline === 'week' ? 'bg-[#d4af37] text-black shadow-sm' : 'text-[#a1a1aa] hover:text-white'
            }`}
          >
            7 Jours
          </button>
          <button
            onClick={() => setTimeline('month')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              timeline === 'month' ? 'bg-[#d4af37] text-black shadow-sm' : 'text-[#a1a1aa] hover:text-white'
            }`}
          >
            Ce Mois
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Revenue */}
        <div className="p-6 rounded-3xl bg-[#121219] border border-[#222230] shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider">Chiffre d'Affaires</span>
            <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 text-[#e5c158] flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#e5c158] font-mono tracking-tight">
              {formatFCFA(totalRevenue)}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#10b981] mt-2 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18.4% ce mois vs mois précédent</span>
            </div>
          </div>
        </div>

        {/* Card 2: Orders */}
        <div className="p-6 rounded-3xl bg-[#121219] border border-[#222230] shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider">Commandes Totales</span>
            <div className="w-10 h-10 rounded-xl bg-[#3b82f6]/15 text-[#3b82f6] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
              {orders.length}
            </div>
            <div className="text-[11px] text-[#a1a1aa] mt-2">
              Dont <span className="text-[#f59e0b] font-bold">{pendingOrders.length} en attente</span>
            </div>
          </div>
        </div>

        {/* Card 3: Delivered */}
        <div className="p-6 rounded-3xl bg-[#121219] border border-[#222230] shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider">Livrées & Validées</span>
            <div className="w-10 h-10 rounded-xl bg-[#10b981]/15 text-[#10b981] flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#10b981] font-mono tracking-tight">
              {deliveredOrders.length}
            </div>
            <div className="text-[11px] text-[#a1a1aa] mt-2">
              Taux de satisfaction client : 99.2%
            </div>
          </div>
        </div>

        {/* Card 4: Low Stock Alerts */}
        <div className="p-6 rounded-3xl bg-[#121219] border border-[#222230] shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider">Alertes Stock</span>
            <div className="w-10 h-10 rounded-xl bg-[#ef4444]/15 text-[#ef4444] flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#ef4444] font-mono tracking-tight">
              {lowStockProducts.length}
            </div>
            <div className="text-[11px] text-[#a1a1aa] mt-2">
              Modèles nécessitant un réassort
            </div>
          </div>
        </div>
      </div>

      {/* Graphical Breakdown & Recent Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Sales Activity Timeline */}
        <div className="lg:col-span-7 bg-[#121219] border border-[#222230] rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-luxury text-lg font-bold text-white">Évolution des Ventes</h2>
              <p className="text-xs text-[#a1a1aa]">Répartition Pagnes africains vs Chaussures femmes</p>
            </div>
            <span className="text-xs font-mono font-bold text-[#e5c158] bg-[#1d1b13] px-3 py-1.5 rounded-xl border border-[#d4af37]/30">
              Devise : FCFA (XOF)
            </span>
          </div>

          {/* Luxury styled graphical bar chart */}
          <div className="space-y-4 pt-2">
            {[
              { label: 'Super Wax Hollandais & Soies d\'Apparat', percent: 68, amount: totalRevenue * 0.68 },
              { label: 'Chaussures & Escarpins Cérémonie', percent: 32, amount: totalRevenue * 0.32 },
            ].map((cat, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-white">{cat.label}</span>
                  <span className="font-mono text-[#e5c158] font-bold">{formatFCFA(cat.amount)} ({cat.percent}%)</span>
                </div>
                <div className="h-3 w-full bg-[#181824] rounded-full overflow-hidden border border-[#262638]">
                  <div
                    className="h-full bg-gradient-to-r from-[#d4af37] to-[#aa7c11] rounded-full transition-all duration-1000"
                    style={{ width: `${cat.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#222230] grid grid-cols-3 gap-3 text-center text-xs">
            <div className="p-3 rounded-2xl bg-[#161622] border border-[#252538]">
              <span className="text-[#a1a1aa] block text-[10px]">Panier Moyen</span>
              <span className="font-bold text-white font-mono mt-1 block">
                {orders.length > 0 ? formatFCFA(Math.round(totalRevenue / orders.length)) : '0 FCFA'}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-[#161622] border border-[#252538]">
              <span className="text-[#a1a1aa] block text-[10px]">Abonnés Newsletter</span>
              <span className="font-bold text-white font-mono mt-1 block">{subscribers.length}</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#161622] border border-[#252538]">
              <span className="text-[#a1a1aa] block text-[10px]">Articles en Ligne</span>
              <span className="font-bold text-white font-mono mt-1 block">{products.length}</span>
            </div>
          </div>
        </div>

        {/* Low Stock Alerts Quick Card */}
        <div className="lg:col-span-5 bg-[#121219] border border-[#222230] rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#222230]">
            <h2 className="font-luxury text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#ef4444]" />
              <span>Priorité Réapprovisionnement</span>
            </h2>
            <Link href="/admin/inventory" className="text-xs text-[#e5c158] hover:underline">
              Gérer →
            </Link>
          </div>

          <div className="space-y-3">
            {lowStockProducts.length === 0 ? (
              <p className="text-xs text-[#10b981]">Tous les stocks sont à niveau optimal.</p>
            ) : (
              lowStockProducts.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-2xl bg-[#181824] border border-[#2b2b3d] flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-lg bg-black overflow-hidden shrink-0">
                      <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-bold text-white line-clamp-1">{p.name}</div>
                      <div className="text-[10px] text-[#71717a]">Réf: {p.reference}</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/30 shrink-0">
                    {p.stock === 0 ? 'Rupture' : `${p.stock} restant(s)`}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-[#121219] border border-[#222230] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#222230]">
          <div>
            <h2 className="font-luxury text-lg font-bold text-white">Dernières Commandes Enregistrées</h2>
            <p className="text-xs text-[#a1a1aa]">Traitement des commandes clients et expéditions</p>
          </div>
          <Link href="/admin/orders" className="text-xs text-[#e5c158] hover:underline font-semibold">
            Voir toutes les commandes ({orders.length}) →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#222230] text-[#71717a] uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Réf. Commande</th>
                <th className="pb-3 font-semibold">Client</th>
                <th className="pb-3 font-semibold">Destination</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Montant</th>
                <th className="pb-3 font-semibold">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e2c]">
              {recentOrders.map((ord) => (
                <tr key={ord.orderId} className="hover:bg-[#161622] transition-colors">
                  <td className="py-3.5 font-mono font-bold text-white">#{ord.orderId}</td>
                  <td className="py-3.5">
                    <div className="font-medium text-white">{ord.customerName}</div>
                    <div className="text-[10px] text-[#71717a] font-mono">{ord.customerPhone}</div>
                  </td>
                  <td className="py-3.5 text-[#a1a1aa]">{ord.city}</td>
                  <td className="py-3.5 text-[#71717a]">{formatDate(ord.createdAt)}</td>
                  <td className="py-3.5 font-mono font-bold text-[#e5c158]">{formatFCFA(ord.total)}</td>
                  <td className="py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      ord.status === 'delivered'
                        ? 'bg-[#10b981]/20 text-[#10b981]'
                        : ord.status === 'shipped'
                        ? 'bg-[#3b82f6]/20 text-[#3b82f6]'
                        : ord.status === 'processing'
                        ? 'bg-[#f59e0b]/20 text-[#f59e0b]'
                        : 'bg-[#e5c158]/20 text-[#e5c158]'
                    }`}>
                      {ord.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
