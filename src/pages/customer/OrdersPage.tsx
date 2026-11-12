import React, { useState } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../context/StoreContext';
import { formatFCFA, formatDate } from '../../utils/formatters';
import { STORE_INFO } from '../../data/products';
import { OrderDetails } from '../../types';
import {
  Package,
  Calendar,
  MapPin,
  FileText,
  Printer,
  Download,
  X,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
  Eye,
} from 'lucide-react';
import {
  downloadInvoicePDF,
  printInvoicePDF,
  getInvoiceNumber,
} from '../../services/invoiceService';

export const OrdersPage: React.FC = () => {
  const { orders, currentUser } = useStore();
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<OrderDetails | null>(null);

  const userOrders = orders.filter(
    (o) => !currentUser || o.customerEmail?.toLowerCase() === currentUser.email.toLowerCase() || o.userId === currentUser?.id
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3" />
            <span>Livrée</span>
          </span>
        );
      case 'shipped':
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#3b82f6]/15 text-[#3b82f6] border border-[#3b82f6]/30 flex items-center gap-1.5">
            <Truck className="w-3 h-3" />
            <span>En cours d'expédition</span>
          </span>
        );
      case 'processing':
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30 flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            <span>En préparation</span>
          </span>
        );
      case 'confirmed':
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#d4af37]/15 text-[#e5c158] border border-[#d4af37]/30 flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3" />
            <span>Confirmée</span>
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#71717a]/15 text-[#a1a1aa] border border-[#71717a]/30 flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            <span>En attente</span>
          </span>
        );
    }
  };

  return (
    <div className="py-12 bg-[#0a0a0d] min-h-screen text-[#f3f3f6]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#a1a1aa] mb-6">
          <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
          <span>/</span>
          <Link href="/account" className="hover:text-white transition-colors">Mon Compte</Link>
          <span>/</span>
          <span className="text-[#e5c158]">Mes Commandes</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-[#222230]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#e5c158]">
              Suivi & Historique
            </span>
            <h1 className="font-luxury text-3xl font-bold text-white tracking-tight mt-1">
              Mes Commandes BECCA SHOP
            </h1>
          </div>
          <Link href="/shop" className="text-xs text-[#e5c158] hover:underline">
            Commander d'autres modèles →
          </Link>
        </div>

        {userOrders.length === 0 ? (
          <div className="p-12 rounded-3xl bg-[#111117] border border-[#222230] text-center space-y-4">
            <Package className="w-12 h-12 text-[#71717a] mx-auto" />
            <h3 className="font-luxury text-lg font-bold text-white">Aucune commande pour le moment</h3>
            <p className="text-xs text-[#a1a1aa] max-w-sm mx-auto">
              Toutes les acquisitions que vous passerez sur le site s'afficheront ici avec le suivi en direct.
            </p>
            <Link
              href="/shop"
              className="inline-block px-6 py-3 rounded-full bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wider"
            >
              Découvrir la boutique
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {userOrders.map((order) => (
              <div
                key={order.orderId}
                className="bg-[#111117] border border-[#222230] rounded-3xl p-6 sm:p-7 shadow-xl space-y-6"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#20202d]">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-base font-bold text-white">
                      #{order.orderId}
                    </span>
                    <span className="text-xs text-[#71717a] flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(order.createdAt)}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => downloadInvoicePDF(order)}
                      className="px-3 py-1.5 rounded-xl bg-[#d4af37]/15 hover:bg-[#d4af37]/25 text-[#e5c158] border border-[#d4af37]/30 text-xs font-semibold transition-colors flex items-center gap-1.5"
                      title="Télécharger la facture au format PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Facture PDF</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedInvoiceOrder(order)}
                      className="px-3 py-1.5 rounded-xl bg-[#1c1c28] hover:bg-[#252536] border border-[#303042] text-xs font-semibold text-white transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#e5c158]" />
                      <span>Détail</span>
                    </button>
                  </div>
                </div>

                {/* Items preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <span className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider block">
                      Articles ({order.items.length})
                    </span>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-xs">
                          <div className="w-12 h-14 rounded-lg bg-black overflow-hidden shrink-0 border border-[#2b2b3a]">
                            <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="font-medium text-white line-clamp-1">{item.product.name}</div>
                            <div className="text-[11px] text-[#a1a1aa]">
                              Format : {item.selectedSize} · Qté : {item.quantity}
                            </div>
                            <div className="font-mono text-[#e5c158] text-[11px] font-bold">
                              {formatFCFA(item.appliedUnitPrice * item.quantity)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery & summary info */}
                  <div className="bg-[#161622] border border-[#262638] rounded-2xl p-4 flex flex-col justify-between text-xs space-y-3">
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider block">
                        Informations de Réception
                      </span>
                      <div className="flex items-center gap-1.5 text-white font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#e5c158]" />
                        <span>{order.city} · {order.address}</span>
                      </div>
                      <div className="text-[#a1a1aa] text-[11px]">
                        Destinataire : {order.customerName} ({order.customerPhone})
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#252538] flex items-baseline justify-between">
                      <span className="text-[#a1a1aa]">Total Réglé :</span>
                      <span className="font-luxury text-lg font-bold text-[#e5c158] font-mono">
                        {formatFCFA(order.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Invoice Modal */}
        <AnimatePresence>
          {selectedInvoiceOrder && (
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
                      <img src={STORE_INFO.logoUrl} alt="BECCA SHOP" className="w-full h-full object-cover rounded-full" />
                    </div>
                    <div>
                      <h3 className="font-luxury text-lg font-bold text-white">Facture Officielle BECCA SHOP</h3>
                      <p className="text-[11px] text-[#a1a1aa]">Comé, Mono · Bénin · +229 95 44 16 02</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedInvoiceOrder(null)}
                    className="p-2 rounded-xl text-[#a1a1aa] hover:text-white hover:bg-[#1f1f2e]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs bg-[#171724] p-4 rounded-2xl border border-[#28283a]">
                  <div>
                    <span className="text-[10px] text-[#71717a] uppercase">Facturé à :</span>
                    <div className="font-bold text-white mt-0.5">{selectedInvoiceOrder.customerName}</div>
                    <div className="text-[#a1a1aa]">{selectedInvoiceOrder.customerPhone}</div>
                    <div className="text-[#a1a1aa]">{selectedInvoiceOrder.city}, {selectedInvoiceOrder.address}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#71717a] uppercase">Détails de Facture :</span>
                    <div className="font-mono font-bold text-[#e5c158] mt-0.5">#{selectedInvoiceOrder.orderId}</div>
                    <div className="text-[#a1a1aa]">{formatDate(selectedInvoiceOrder.createdAt)}</div>
                    <div className="text-[#10b981] font-semibold mt-1 capitalize">Statut : {selectedInvoiceOrder.status}</div>
                  </div>
                </div>

                {/* Table */}
                <div className="space-y-2">
                  <div className="divide-y divide-[#242436] text-xs">
                    {selectedInvoiceOrder.items.map((i, idx) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between">
                        <div>
                          <span className="font-medium text-white">{i.product.name}</span>
                          <span className="text-[11px] text-[#71717a] block">Format : {i.selectedSize} · Qté : {i.quantity}</span>
                        </div>
                        <span className="font-mono text-white font-bold">{formatFCFA(i.appliedUnitPrice * i.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-[#26263a] space-y-1.5 text-xs">
                    <div className="flex justify-between text-[#a1a1aa]">
                      <span>Sous-total :</span>
                      <span className="font-mono text-white">{formatFCFA(selectedInvoiceOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-[#a1a1aa]">
                      <span>Frais de livraison :</span>
                      <span className="font-mono text-white">{formatFCFA(selectedInvoiceOrder.shippingFee)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-[#2a2a3e]">
                      <span>Total :</span>
                      <span className="font-mono text-[#e5c158] text-base">{formatFCFA(selectedInvoiceOrder.total)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => downloadInvoicePDF(selectedInvoiceOrder)}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#aa7c11] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:brightness-110 transition-all"
                  >
                    <Download className="w-4 h-4 text-black" />
                    <span>Télécharger la Facture PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => printInvoicePDF(selectedInvoiceOrder)}
                    className="flex-1 py-3 rounded-xl bg-[#1e1e2c] hover:bg-[#28283a] text-white font-semibold text-xs flex items-center justify-center gap-2 border border-[#343448] transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Imprimer la Facture</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedInvoiceOrder(null)}
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
    </div>
  );
};
