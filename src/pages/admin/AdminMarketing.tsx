import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatDate } from '../../utils/formatters';
import { Megaphone, Mail, Download, CheckCircle2, Save } from 'lucide-react';

export const AdminMarketing: React.FC = () => {
  const { subscribers, settings, updateSettings } = useStore();
  const [bannerText, setBannerText] = useState(settings.bannerAnnouncement);
  const [bannerActive, setBannerActive] = useState(settings.bannerActive);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      bannerAnnouncement: bannerText,
      bannerActive: bannerActive,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Email,Date_Inscription\n' +
      subscribers.map((s) => `"${s.email}","${s.subscribedAt}"`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `subscribers_becca_shop_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#20202d]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#e5c158] font-bold">
            Acquisition & Fidélisation
          </span>
          <h1 className="font-luxury text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Marketing, Annonces & Newsletter
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Gérez le ruban d'annonces du site et exportez vos abonnés pour vos campagnes de promotions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Banner Configuration */}
        <div className="lg:col-span-6 bg-[#121219] border border-[#222230] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#242436]">
            <Megaphone className="w-5 h-5 text-[#e5c158]" />
            <h2 className="font-luxury text-lg font-bold text-white">Bandeau d'Annonce Supérieur</h2>
          </div>

          <form onSubmit={handleSaveBanner} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#a1a1aa] uppercase font-semibold mb-1">
                Message d'annonce diffusé aux visiteurs
              </label>
              <textarea
                rows={3}
                value={bannerText}
                onChange={(e) => setBannerText(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#181824] border border-[#2e2e40] rounded-xl text-white outline-none focus:border-[#e5c158] resize-none"
              />
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer text-white">
              <input
                type="checkbox"
                checked={bannerActive}
                onChange={(e) => setBannerActive(e.target.checked)}
                className="rounded text-[#d4af37]"
              />
              <span className="font-semibold">Activer le ruban d'annonce sur la boutique</span>
            </label>

            <div className="pt-3 border-t border-[#242436] flex items-center justify-between">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#aa7c11] text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer le message</span>
              </button>

              {savedSuccess && (
                <div className="text-xs text-[#10b981] flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Enregistré !</span>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Newsletter Subscribers */}
        <div className="lg:col-span-6 bg-[#121219] border border-[#222230] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#242436]">
            <div className="flex items-center gap-2.5">
              <Mail className="w-5 h-5 text-[#e5c158]" />
              <h2 className="font-luxury text-lg font-bold text-white">
                Abonnés Newsletter ({subscribers.length})
              </h2>
            </div>

            <button
              onClick={handleExportCSV}
              disabled={subscribers.length === 0}
              className="px-3.5 py-1.5 rounded-xl bg-[#1c1c28] hover:bg-[#252536] border border-[#2e2e40] text-xs font-semibold text-white transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5 text-[#e5c158]" />
              <span>Exporter CSV</span>
            </button>
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-[#20202e] text-xs">
            {subscribers.length === 0 ? (
              <p className="text-xs text-[#71717a] py-6 text-center">Aucun abonné enregistré pour le moment.</p>
            ) : (
              subscribers.map((sub) => (
                <div key={sub.id} className="py-2.5 flex items-center justify-between">
                  <span className="font-medium text-white">{sub.email}</span>
                  <span className="text-[11px] text-[#71717a]">{formatDate(sub.subscribedAt)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
