import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { User } from '../../types';
import { formatFCFA, formatDate } from '../../utils/formatters';
import { Users, Search, Mail, Phone, MapPin, MessageCircle, ShoppingBag } from 'lucide-react';

export const AdminCustomers: React.FC = () => {
  const { orders } = useStore();
  const [search, setSearch] = useState('');

  // Read registered users from storage
  const [users] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('becca_users');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const filteredCustomers = users.filter((u) => {
    if (u.role === 'admin') return false; // Show customer accounts
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        u.firstName.toLowerCase().includes(q) ||
        u.lastName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q) ||
        u.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#20202d]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#e5c158] font-bold">
            Fichier Clientèle
          </span>
          <h1 className="font-luxury text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Répertoire des Clientes & Partenaires ({filteredCustomers.length})
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Consultez les coordonnées, l'historique d'achats et contactez vos clientes privilégiées.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#71717a] absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nom, téléphone, email..."
            className="w-full pl-9 pr-4 py-2 bg-[#181824] border border-[#2c2c3d] rounded-xl text-xs text-white placeholder-[#71717a] outline-none focus:border-[#e5c158]"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-[#121219] border border-[#222230] rounded-3xl p-6 shadow-xl overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#222230] text-[#71717a] uppercase tracking-wider text-[10px]">
              <th className="pb-3 font-semibold">Cliente</th>
              <th className="pb-3 font-semibold">Téléphone / WhatsApp</th>
              <th className="pb-3 font-semibold">Localisation</th>
              <th className="pb-3 font-semibold">Commandes</th>
              <th className="pb-3 font-semibold">Total Cumulé</th>
              <th className="pb-3 font-semibold">Date d'inscription</th>
              <th className="pb-3 font-semibold text-right">Contacter</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e2c]">
            {filteredCustomers.map((cust) => {
              const custOrders = orders.filter(
                (o) => o.customerEmail?.toLowerCase() === cust.email.toLowerCase() || o.userId === cust.id
              );
              const custTotal = custOrders.reduce((sum, o) => sum + o.total, 0);

              const cleanPhone = cust.phone.replace(/[^0-9]/g, '');

              return (
                <tr key={cust.id} className="hover:bg-[#161622] transition-colors">
                  <td className="py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#1b1a26] border border-[#2e2d40] text-[#e5c158] font-bold flex items-center justify-center shrink-0">
                        {cust.firstName[0]}
                      </div>
                      <div>
                        <div className="font-bold text-white">{cust.firstName} {cust.lastName}</div>
                        <div className="text-[10px] text-[#71717a]">{cust.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 font-mono text-[#e5c158]">{cust.phone}</td>
                  <td className="py-3.5 text-[#a1a1aa]">
                    <div>{cust.city}</div>
                    {cust.address && <div className="text-[10px] text-[#71717a] truncate max-w-[120px]">{cust.address}</div>}
                  </td>
                  <td className="py-3.5">
                    <span className="font-bold text-white font-mono">{custOrders.length}</span> cde(s)
                  </td>
                  <td className="py-3.5 font-mono font-bold text-[#e5c158]">{formatFCFA(custTotal)}</td>
                  <td className="py-3.5 text-[#71717a]">{formatDate(cust.createdAt)}</td>
                  <td className="py-3.5 text-right">
                    <a
                      href={`https://wa.me/${cleanPhone}?text=Bonjour%20${encodeURIComponent(cust.firstName)}%20!%20L'%C3%A9quipe%20BECCA%20SHOP%20vous%20salue.`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] text-[11px] font-semibold transition-colors"
                      title="Ouvrir WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
