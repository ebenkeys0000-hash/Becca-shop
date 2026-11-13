import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../context/StoreContext';
import { OrderDetails, OrderStatus } from '../../types';
import { formatFCFA, formatDate } from '../../utils/formatters';
import { STORE_INFO } from '../../data/products';
import { SafeImage } from '../../components/SafeImage';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  Eye,
  Printer,
  Download,
  X,
  Phone,
  MapPin,
  Mail,
  AlertCircle,
} from 'lucide-react';
import {
  downloadInvoicePDF,
  printInvoicePDF,
  getInvoiceNumber,
} from '../../services/invoiceService';

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        o.orderId.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q) ||
        o.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return 'bg-[#10b981]/20 text-[#10b981] border-[#10b981]/40';
      case 'shipped':
        return 'bg-[#3b82f6]/20 text-[#3b82f6] border-[#3b82f6]/40';
      case 'processing':
        return 'bg-[#f59e0b]/20 text-[#f59e0b] border-[#f59e0b]/40';
      case 'confirmed':
        return 'bg-[#d4af37]/20 text-[#e5c158] border-[#d4af37]/40';
      case 'cancelled':
        return 'bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/40';
      default:
        return 'bg-[#71717a]/20 text-[#a1a1aa] border-[#71717a]/40';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#20202d]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#e5c158] font-bold">
            Gestion Commerciale
          </span>
          <h1 className="font-luxury text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Commandes Clients ({orders.length})
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Traitez les commandes, modifiez les statuts et éditez les reçus officiels.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#121219] border border-[#222230] rounded-2xl p-4 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0">
          {[
            { id: 'all', label: 'Toutes' },
            { id: 'pending', label: 'En attente' },
            { id: 'confirmed', label: 'Confirmées' },
            { id: 'processing', label: 'Préparation' },
            { id: 'shipped', label: 'Expédiées' },
            { id: 'delivered', label: 'Livrées' },
            { id: 'cancelled', label: 'Annulées' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === f.id
                  ? 'bg-[#d4af37] text-black shadow-md'
                  : 'text-[#a1a1aa] hover:text-white bg-[#1a1924]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-64">
          <Search className="w-4 h-4 text-[#71717a] absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="N° commande, client, tél..."
            className="w-full pl-9 pr-4 py-2 bg-[#181824] border border-[#2c2c3d] rounded-xl text-xs text-white placeholder-[#71717a] outline-none focus:border-[#e5c158]"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#121219] border border-[#222230] rounded-3xl p-6 shadow-xl overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#222230] text-[#71717a] uppercase tracking-wider text-[10px]">
              <th className="pb-3 font-semibold">N° Commande</th>
              <th className="pb-3 font-semibold">Client & Contact</th>
              <th className="pb-3 font-semibold">Destination</th>
              <th className="pb-3 font-semibold">Articles</th>
              <th className="pb-3 font-semibold">Date</th>
              <th className="pb-3 font-semibold">Total Net</th>
              <th className="pb-3 font-semibold">Changer Statut</th>
              <th className="pb-3 font-semibold text-right">Détail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e2c]">
            {filteredOrders.map((ord) => (
              <tr key={ord.orderId} className="hover:bg-[#161622] transition-colors">
                <td className="py-3.5 font-mono font-bold text-white">#{ord.orderId}</td>
                <td className="py-3.5">
                  <div className="font-bold text-white">{ord.customerName}</div>
                  <div className="text-[10px] text-[#e5c158] font-mono">{ord.customerPhone}</div>
                  {ord.customerEmail && <div className="text-[10px] text-[#71717a]">{ord.customerEmail}</div>}
                </td>
                <td className="py-3.5">
                  <div className="text-white font-medium">{ord.city}</div>
                  <div className="text-[10px] text-[#71717a] max-w-[140px] truncate">{ord.address}</div>
                </td>
                <td className="py-3.5 font-medium text-[#d4d4d8]">
                  {ord.items.reduce((s, i) => s + i.quantity, 0)} pc(s)
                </td>
                <td className="py-3.5 text-[#71717a]">{formatDate(ord.createdAt)}</td>
                <td className="py-3.5 font-mono font-bold text-[#e5c158]">{formatFCFA(ord.total)}</td>
                <td className="py-3.5">
                  <select
                    value={ord.status}
                    onChange={(e) => updateOrderStatus(ord.orderId, e.target.value as OrderStatus)}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase border outline-none cursor-pointer bg-[#14141e] ${getStatusBadge(
                      ord.status
                    )}`}
                  >
                    <option value="pending" className="bg-[#14141e] text-white">En attente</option>
                    <option value="confirmed" className="bg-[#14141e] text-white">Confirmée</option>
                    <option value="processing" className="bg-[#14141e] text-white">En préparation</option>
                    <option value="shipped" className="bg-[#14141e] text-white">Expédiée</option>
                    <option value="delivered" className="bg-[#14141e] text-white">Livrée</option>
                    <option value="cancelled" className="bg-[#14141e] text-white">Annulée</option>
                  </select>
                </td>
                <td className="py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => downloadInvoicePDF(ord)}
                      className="p-2 rounded-lg bg-[#d4af37]/15 hover:bg-[#d4af37]/25 text-[#e5c158] transition-colors"
                      title="Télécharger la Facture PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="p-2 rounded-lg bg-[#1c1c28] hover:bg-[#252536] text-[#e5c158] transition-colors"
                      title="Voir le reçu complet"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Detail & Invoice Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#121219] border border-[#d4af37]/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-[#242436] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black border border-[#d4af37]/40 p-1">
                    <SafeImage
                      src={STORE_INFO.logoUrl}
                      alt="Logo BECCA SHOP"
                      compactFallback
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <h3 className="font-luxury text-lg font-bold text-white">Détail de Commande #{selectedOrder.orderId}</h3>
                    <p className="text-[11px] text-[#a1a1aa]">Date d'enregistrement : {formatDate(selectedOrder.createdAt)}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 rounded-xl text-[#a1a1aa] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Client & Destination Card */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-[#171724] p-4 rounded-2xl border border-[#28283a]">
                <div>
                  <span className="text-[10px] text-[#71717a] uppercase font-semibold">Client :</span>
                  <div className="font-bold text-white mt-0.5">{selectedOrder.customerName}</div>
                  <div className="text-[#e5c158] font-mono">{selectedOrder.customerPhone}</div>
                  {selectedOrder.customerEmail && <div className="text-[#a1a1aa]">{selectedOrder.customerEmail}</div>}
                </div>
                <div>
                  <span className="text-[10px] text-[#71717a] uppercase font-semibold">Livraison :</span>
                  <div className="text-white font-medium mt-0.5">{selectedOrder.city}</div>
                  <div className="text-[#a1a1aa]">{selectedOrder.address}</div>
                  {selectedOrder.notes && (
                    <div className="text-[11px] text-[#f59e0b] italic mt-1">« {selectedOrder.notes} »</div>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-[#a1a1aa] uppercase">Articles commandés :</span>
                <div className="divide-y divide-[#222232] border border-[#222232] rounded-2xl bg-[#161622] p-4 text-xs">
                  {selectedOrder.items.map((i, idx) => (
                    <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-black overflow-hidden shrink-0 border border-[#2d2d3e]">
                          <SafeImage
                            src={i.product.images[0]}
                            alt={i.product.name}
                            compactFallback
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-white">{i.product.name}</div>
                          <div className="text-[10px] text-[#71717a]">
                            Format: {i.selectedSize} · Qté: {i.quantity}
                          </div>
                        </div>
                      </div>
                      <span className="font-mono text-white font-bold">{formatFCFA(i.appliedUnitPrice * i.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Totals */}
              <div className="p-4 rounded-2xl bg-[#161622] border border-[#252538] space-y-2 text-xs">
                <div className="flex justify-between text-[#a1a1aa]">
                  <span>Sous-total articles :</span>
                  <span className="font-mono text-white">{formatFCFA(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#a1a1aa]">
                  <span>Frais de livraison ({selectedOrder.city}) :</span>
                  <span className="font-mono text-white">{formatFCFA(selectedOrder.shippingFee)}</span>
                </div>
                <div className="pt-2 border-t border-[#252538] flex justify-between text-sm font-bold text-white">
                  <span>Total Net :</span>
                  <span className="font-mono text-[#e5c158] text-base">{formatFCFA(selectedOrder.total)}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => downloadInvoicePDF(selectedOrder)}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#aa7c11] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                >
                  <Download className="w-4 h-4 text-black" />
                  <span>Télécharger la Facture PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => printInvoicePDF(selectedOrder)}
                  className="flex-1 py-3 rounded-xl bg-[#1e1e2c] hover:bg-[#28283a] text-white font-semibold text-xs flex items-center justify-center gap-2 border border-[#343448] transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimer la Facture</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-5 py-3 rounded-xl bg-[#181822] text-[#a1a1aa] hover:text-white text-xs"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
