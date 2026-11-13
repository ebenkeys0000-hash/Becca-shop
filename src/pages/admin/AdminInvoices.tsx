import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../context/StoreContext';
import { OrderDetails } from '../../types';
import { formatFCFA, formatDate } from '../../utils/formatters';
import {
  downloadInvoicePDF,
  printInvoicePDF,
  getInvoiceNumber,
} from '../../services/invoiceService';
import { STORE_INFO } from '../../data/products';
import { SafeImage } from '../../components/SafeImage';
import {
  FileText,
  Download,
  Printer,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  X,
  Calendar,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

export const AdminInvoices: React.FC = () => {
  const { orders } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const invNum = getInvoiceNumber(order).toLowerCase();
    const query = search.toLowerCase().trim();

    if (statusFilter !== 'all' && order.status !== statusFilter) return false;

    if (query) {
      const matchNum = invNum.includes(query);
      const matchOrder = order.orderId.toLowerCase().includes(query);
      const matchName = order.customerName.toLowerCase().includes(query);
      const matchPhone = order.customerPhone.includes(query);
      return matchNum || matchOrder || matchName || matchPhone;
    }
    return true;
  });

  const totalInvoiced = orders.reduce((sum, o) => sum + o.total, 0);
  const deliveredInvoiced = orders
    .filter((o) => o.status === 'delivered')
    .reduce((sum, o) => sum + o.total, 0);

  const handleDownload = async (order: OrderDetails) => {
    try {
      setDownloadingId(order.orderId);
      await downloadInvoicePDF(order);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingId(null);
    }
  };

  const handlePrint = async (order: OrderDetails) => {
    try {
      await printInvoicePDF(order);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#20202d]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#e5c158] font-bold">
            Comptabilité & Facturation Officielle
          </span>
          <h1 className="font-luxury text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Factures & Reçus Commerciaux ({orders.length})
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Génération instantanée de factures PDF haute définition au format officiel BECCA SHOP.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-[#121219] border border-[#222230] shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider">
              Total Facturé
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#d4af37]/15 text-[#e5c158] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#e5c158] font-mono mt-2">
            {formatFCFA(totalInvoiced)}
          </div>
          <span className="text-[11px] text-[#71717a] mt-1 block">
            {orders.length} factures générées
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-[#121219] border border-[#222230] shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider">
              Factures Encaissées
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#10b981]/15 text-[#10b981] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#10b981] font-mono mt-2">
            {formatFCFA(deliveredInvoiced)}
          </div>
          <span className="text-[11px] text-[#71717a] mt-1 block">
            Commandes livrées et acquittées
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-[#121219] border border-[#222230] shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider">
              Norme de Facturation
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#3b82f6]/15 text-[#3b82f6] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-base font-bold text-white mt-2">Format PDF Professionnel</div>
          <span className="text-[11px] text-[#71717a] mt-1 block">
            Émission conforme avec mention FCFA & Comé (Bénin)
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#121219] border border-[#222230] rounded-2xl p-4 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0">
          {[
            { id: 'all', label: 'Toutes' },
            { id: 'delivered', label: 'Acquittées (Livrées)' },
            { id: 'confirmed', label: 'Confirmées' },
            { id: 'processing', label: 'En cours' },
            { id: 'pending', label: 'En attente' },
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

        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-[#71717a] absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par N° facture, nom, tél..."
            className="w-full pl-9 pr-4 py-2 bg-[#181824] border border-[#2c2c3d] rounded-xl text-xs text-white placeholder-[#71717a] outline-none focus:border-[#e5c158]"
          />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-[#121219] border border-[#222230] rounded-3xl p-6 shadow-xl overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#222230] text-[#71717a] uppercase tracking-wider text-[10px]">
              <th className="pb-3 font-semibold">N° Facture</th>
              <th className="pb-3 font-semibold">Date d'Émission</th>
              <th className="pb-3 font-semibold">Cliente & Contact</th>
              <th className="pb-3 font-semibold">Destination</th>
              <th className="pb-3 font-semibold">Montant Net</th>
              <th className="pb-3 font-semibold">Statut</th>
              <th className="pb-3 font-semibold text-right">Actions PDF</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e2c]">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[#71717a]">
                  Aucune facture ne correspond à votre recherche.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const invNumber = getInvoiceNumber(order);
                const isDownloading = downloadingId === order.orderId;

                return (
                  <tr key={order.orderId} className="hover:bg-[#161622] transition-colors">
                    <td className="py-3.5">
                      <div className="font-mono font-extrabold text-[#e5c158] text-xs">
                        {invNumber}
                      </div>
                      <div className="text-[10px] text-[#71717a] font-mono">
                        Cde #{order.orderId}
                      </div>
                    </td>
                    <td className="py-3.5 text-[#a1a1aa]">{formatDate(order.createdAt)}</td>
                    <td className="py-3.5">
                      <div className="font-bold text-white">{order.customerName}</div>
                      <div className="text-[10px] text-[#e5c158] font-mono">
                        {order.customerPhone}
                      </div>
                    </td>
                    <td className="py-3.5 text-[#d4d4d8]">
                      <div>{order.city}</div>
                      <div className="text-[10px] text-[#71717a] truncate max-w-[130px]">
                        {order.address}
                      </div>
                    </td>
                    <td className="py-3.5 font-mono font-bold text-white text-sm">
                      {formatFCFA(order.total)}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          order.status === 'delivered'
                            ? 'bg-[#10b981]/20 text-[#10b981]'
                            : order.status === 'confirmed'
                            ? 'bg-[#d4af37]/20 text-[#e5c158]'
                            : order.status === 'processing'
                            ? 'bg-[#3b82f6]/20 text-[#3b82f6]'
                            : 'bg-[#71717a]/20 text-[#a1a1aa]'
                        }`}
                      >
                        {order.status === 'delivered'
                          ? 'Acquittée'
                          : order.status === 'confirmed'
                          ? 'Confirmée'
                          : order.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Download PDF Button */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDownload(order)}
                          disabled={isDownloading}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#aa7c11] text-black font-extrabold text-[11px] flex items-center gap-1.5 shadow-md shadow-[#d4af37]/20 hover:brightness-110 transition-all disabled:opacity-60"
                          title="Télécharger la facture au format PDF"
                        >
                          <Download className="w-3.5 h-3.5 text-black" />
                          <span>{isDownloading ? 'Génération...' : 'PDF'}</span>
                        </motion.button>

                        {/* Print Button */}
                        <button
                          onClick={() => handlePrint(order)}
                          className="p-2 rounded-xl bg-[#1c1c28] hover:bg-[#252536] text-[#d4d4d8] hover:text-white transition-colors"
                          title="Imprimer directement"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        {/* View Modal */}
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 rounded-xl bg-[#1c1c28] hover:bg-[#252536] text-[#e5c158] transition-colors"
                          title="Aperçu rapide"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Invoice Detail Modal */}
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
                  <div className="w-11 h-11 rounded-full bg-black border border-[#d4af37]/50 p-1">
                    <SafeImage
                      src={STORE_INFO.logoUrl}
                      alt="Logo BECCA SHOP"
                      compactFallback
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <h3 className="font-luxury text-lg font-bold text-white">
                      Facture N° {getInvoiceNumber(selectedOrder)}
                    </h3>
                    <p className="text-[11px] text-[#e5c158]">
                      Commande #{selectedOrder.orderId} · BECCA SHOP Comé
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 rounded-xl text-[#a1a1aa] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Client & Destination Info */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-[#171724] p-4 rounded-2xl border border-[#28283a]">
                <div>
                  <span className="text-[10px] text-[#71717a] uppercase font-semibold">
                    Destinataire / Facturé à :
                  </span>
                  <div className="font-bold text-white mt-0.5">{selectedOrder.customerName}</div>
                  <div className="text-[#e5c158] font-mono">{selectedOrder.customerPhone}</div>
                  <div className="text-[#a1a1aa]">{selectedOrder.city}, {selectedOrder.address}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#71717a] uppercase font-semibold">
                    Modalités :
                  </span>
                  <div className="text-white mt-0.5 capitalize">{selectedOrder.deliveryMethod.replace('_', ' ')}</div>
                  <div className="text-[#a1a1aa]">Règlement : {selectedOrder.paymentMethod}</div>
                  <div className="text-[#10b981] font-semibold mt-1">
                    Date : {formatDate(selectedOrder.createdAt)}
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#a1a1aa] uppercase">
                  Articles facturés :
                </span>
                <div className="divide-y divide-[#242436] border border-[#242436] rounded-2xl bg-[#161622] p-4 text-xs">
                  {selectedOrder.items.map((i, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white">{i.product.name}</div>
                        <div className="text-[11px] text-[#71717a]">
                          Réf: {i.product.reference} · Format: {i.selectedSize} · Qté: {i.quantity}
                          {i.isWholesalePriceApplied && (
                            <span className="text-[#10b981] font-bold ml-1.5">
                              [Tarif de gros appliqué]
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="font-mono text-white font-bold">
                        {formatFCFA(i.appliedUnitPrice * i.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="p-4 rounded-2xl bg-[#171724] border border-[#28283a] space-y-1.5 text-xs">
                <div className="flex justify-between text-[#a1a1aa]">
                  <span>Sous-total articles :</span>
                  <span className="font-mono text-white">{formatFCFA(selectedOrder.subtotal)}</span>
                </div>
                {selectedOrder.discountAmount && selectedOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-[#10b981] font-semibold">
                    <span>Remise ({selectedOrder.promoCode}) :</span>
                    <span className="font-mono">-{formatFCFA(selectedOrder.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#a1a1aa]">
                  <span>Frais d'expédition :</span>
                  <span className="font-mono text-white">{formatFCFA(selectedOrder.shippingFee)}</span>
                </div>
                <div className="pt-2 border-t border-[#2d2d42] flex justify-between text-sm font-bold text-white">
                  <span>Total Net Réglé :</span>
                  <span className="font-mono text-[#e5c158] text-base">
                    {formatFCFA(selectedOrder.total)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleDownload(selectedOrder)}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#aa7c11] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:brightness-110 transition-all"
                >
                  <Download className="w-4 h-4 text-black" />
                  <span>Télécharger la Facture PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => handlePrint(selectedOrder)}
                  className="flex-1 py-3 rounded-xl bg-[#1e1e2c] hover:bg-[#28283a] text-white font-semibold text-xs flex items-center justify-center gap-2 border border-[#343448] transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimer</span>
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
