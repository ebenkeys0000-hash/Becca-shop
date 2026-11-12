import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { STORE_INFO } from '../data/products';
import {
  Sparkles,
  Compass,
  MapPin,
  Scissors,
  Crown,
  ChevronRight,
  MessageCircle,
  Printer,
  ShoppingBag,
  RefreshCw,
  Sliders,
  CheckCircle2,
  Share2,
} from 'lucide-react';

interface StagingLocation {
  id: string;
  name: string;
  country: string;
  flag: string;
  landmark: string;
  image: string;
  description: string;
}

const CULTURAL_LOCATIONS: StagingLocation[] = [
  {
    id: 'cotonou_marina',
    name: 'Boulevard de la Marina & Palais des Congrès',
    country: 'Bénin',
    flag: '🇧🇯',
    landmark: 'Cotonou, Esplanade Maritime',
    image: '/src/assets/images/staging_cotonou_marina_1794478709951.jpg',
    description: 'Avenue prestigieuse et modernité architecturale au bord de l\'Atlantique.',
  },
  {
    id: 'lome_palais',
    name: 'Palais des Gouverneurs & Cité Nana Benz',
    country: 'Togo',
    flag: '🇹🇬',
    landmark: 'Lomé, Cœur Historique',
    image: '/src/assets/images/staging_lome_palais_1794478710819.jpg',
    description: 'Élégance néo-classique et héritage légendaire des reines du pagne togolais.',
  },
  {
    id: 'ouidah_ocean',
    name: 'Porte du Non-Retour & Littoral Royal',
    country: 'Bénin',
    flag: '🇧🇯',
    landmark: 'Ouidah, Plage Historique',
    image: '/src/assets/images/staging_ouidah_ocean_1794478711873.jpg',
    description: 'Majesté de l\'océan et mémoire culturelle sacrée des ancêtres béninois.',
  },
  {
    id: 'come_mono',
    name: 'Rives Lagunaires & Salines de Comé',
    country: 'Bénin',
    flag: '🇧🇯',
    landmark: 'Comé, Mono (Berceau BECCA)',
    image: '/src/assets/images/staging_come_mono_1794478712868.jpg',
    description: 'Le terroir de notre boutique physique, entre douceur des lagunes et palmiers.',
  },
];

const FABRIC_OPTIONS = [
  {
    id: 'bs-pag-001',
    name: 'Super Wax Royal Or & Indigo',
    category: 'Super Wax Hollandais',
    details: 'Véritable wax aux dorures fines et motifs géométriques royaux.',
  },
  {
    id: 'bs-pag-004',
    name: 'Wax Hollandais Fleur de Mariage',
    category: 'Wax Classique Nana Benz',
    details: 'Le motif légendaire de prospérité et d\'amour conjugal à Lomé et Cotonou.',
  },
  {
    id: 'bs-pag-002',
    name: 'Pagne Soie Wax Saphir & Or Impérial',
    category: 'Soie Wax Fluide',
    details: 'Satin soyeux ultra-lumineux pour traînes majestueuses et boubous fluides.',
  },
  {
    id: 'bs-pag-003',
    name: 'Bazin Riche Getzner Brodé Doré',
    category: 'Bazin Riche Glacé',
    details: 'Damassé 100% pur coton teinté violet et or pour apparats de fête.',
  },
];

const SILHOUETTES = [
  {
    id: 'sirene',
    title: 'Robe Sirène Royale avec Traîne',
    subtitle: 'Bustier cœur sculpté, basque dorée et traîne majestueuse',
  },
  {
    id: 'peplum',
    title: 'Ensemble Peplum & Manches Architecturales',
    subtitle: 'Taille cintrée, col montant fendu et épaules bouffantes',
  },
  {
    id: 'boubou',
    title: 'Grand Boubou d\'Apparat Coutumier',
    subtitle: 'Ampleur fluide, broderies dorées au col et tombé souverain',
  },
  {
    id: 'kaba_chic',
    title: 'Kaba Moderne avec Découpes Asymétriques',
    subtitle: 'Inspiration ouest-africaine revisitée avec liseré métallique',
  },
];

const OCCASIONS = [
  'Mariage Coutumier & Cérémonie de Dot',
  'Gala Diplomatique & Soirée d\'Excellence',
  'Célébration Religieuse (Tabaski, Pâques)',
  'Réception Familiale & Sortie Chic',
];

export const StyleCuratorSection: React.FC = () => {
  const { products, addToCart } = useStore();

  const [selectedFabric, setSelectedFabric] = useState(FABRIC_OPTIONS[0]);
  const [selectedSilhouette, setSelectedSilhouette] = useState(SILHOUETTES[0]);
  const [selectedLocation, setSelectedLocation] = useState(CULTURAL_LOCATIONS[0]);
  const [selectedOccasion, setSelectedOccasion] = useState(OCCASIONS[0]);

  const [isLoading, setIsLoading] = useState(false);
  const [curationResult, setCurationResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle generation via server-side Gemini route
  const handleGenerateCurator = async () => {
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/curateur-style', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fabricName: selectedFabric.name,
          silhouette: selectedSilhouette.title,
          location: `${selectedLocation.name} (${selectedLocation.country})`,
          occasion: selectedOccasion,
          clientPreferences: 'Mise en valeur des dorures et coupe sur-mesure d\'excellence',
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setCurationResult(json.data);
      } else {
        throw new Error(json.error || 'Erreur lors de la génération');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Création générée avec nos recommandations expertes maison.');
      // Fallback display
      setCurationResult({
        title: `${selectedSilhouette.title} — Édition ${selectedLocation.country}`,
        concept: `Une création haute couture saisissante qui fait rayonner le ${selectedFabric.name} dans la lumière dorée de ${selectedLocation.name}.`,
        cutDetails: [
          'Bustier baleiné sur-mesure sculptant la taille avec finitions invisibles',
          'Alignement parfait des motifs traditionnels sur l\'axe central',
          'Basque asymétrique doublée pour un tombé rigide et sans faux plis',
          'Finitions lisière certifiée apparente sur la traîne royale',
        ],
        fabricYardage: '6 Yards complets (1 pièce entière BECCA SHOP)',
        accessories: {
          shoes: 'Escarpins Stiletto Dorés Prestige "Aurelia" (Talon 9 cm)',
          jewelry: 'Parure royale en or ciselé et manchettes en laiton doré poli',
          bag: 'Minaudière rigide en cuir noir verni et fermoir doré',
        },
        headwrapAdvice: 'Grand foulard Gélé noué en éventail impérial à plis géométriques.',
        culturalResonance: `Cette tenue rend hommage à l'élégance intemporelle des femmes d'Afrique de l'Ouest, mêlant la tradition du terroir de ${selectedLocation.name} à l'audace contemporaine.`,
        whatsappSummary: `Bonjour BECCA SHOP, j'ai composé ma silhouette "${selectedSilhouette.title}" avec le "${selectedFabric.name}" sur votre Curateur de Style. Je souhaite commander le tissu pour ma confection.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // WhatsApp order link
  const openWhatsApp = () => {
    const text = encodeURIComponent(
      curationResult?.whatsappSummary ||
        `Bonjour BECCA SHOP, je souhaite commander le pagne "${selectedFabric.name}" pour confectionner ma tenue "${selectedSilhouette.title}".`
    );
    window.open(`${STORE_INFO.whatsappUrl1}?text=${text}`, '_blank');
  };

  // Add to cart directly
  const handleAddProductToCart = () => {
    const matchingProduct = products.find((p) => p.id === selectedFabric.id) || products[0];
    addToCart(matchingProduct, '6 Yards (Morceau complet)', 'Or & Indigo', 1);
  };

  return (
    <section id="curateur-style" className="py-20 bg-[#0d0d12] relative overflow-hidden border-y border-[#20202d]">
      {/* Background Decorative Glows */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#d4af37]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 right-10 w-[500px] h-[250px] bg-[#065f46]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1c1a14] border border-[#d4af37]/40 text-xs font-bold text-[#e5c158] uppercase tracking-widest shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Innovation Haute Couture BECCA</span>
          </div>
          <h2 className="font-luxury text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Curateur de Style & Mises en Situation IA
          </h2>
          <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed">
            Composez votre silhouette sur-mesure et visualisez nos pagnes royaux portés dans les
            décors emblématiques de l’architecture et des paysages culturels du{' '}
            <strong className="text-white">Bénin</strong> et du <strong className="text-white">Togo</strong>.
          </p>
        </div>

        {/* Studio Interactive Workbench: 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Customization Controls (5 cols) */}
          <div className="lg:col-span-5 bg-[#121219] border border-[#242436] rounded-3xl p-6 sm:p-7 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#202030]">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#e5c158]" />
                <h3 className="font-luxury text-base font-bold text-white">
                  1. Paramétrez Votre Allure
                </h3>
              </div>
              <span className="text-[11px] text-[#71717a] font-mono">Sur-mesure</span>
            </div>

            {/* Step 1: Choose the Fabric */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#e5c158] block">
                Choix du Pagne d’Exception :
              </label>
              <div className="grid grid-cols-1 gap-2">
                {FABRIC_OPTIONS.map((f) => {
                  const isSel = selectedFabric.id === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setSelectedFabric(f)}
                      className={`p-3 rounded-2xl text-left border transition-all flex items-center justify-between ${
                        isSel
                          ? 'bg-[#1e1b12] border-[#d4af37] text-white shadow-md'
                          : 'bg-[#181822] border-[#252536] text-[#a1a1aa] hover:border-[#38384d]'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-white">{f.name}</div>
                        <div className="text-[10px] text-[#e5c158]">{f.category}</div>
                      </div>
                      {isSel && <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Choose the Silhouette */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#e5c158] block">
                Coupe & Silhouette Haute Couture :
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SILHOUETTES.map((s) => {
                  const isSel = selectedSilhouette.id === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedSilhouette(s)}
                      className={`p-3 rounded-2xl text-left border transition-all ${
                        isSel
                          ? 'bg-[#1e1b12] border-[#d4af37] text-white shadow-md'
                          : 'bg-[#181822] border-[#252536] text-[#a1a1aa] hover:border-[#38384d]'
                      }`}
                    >
                      <div className="text-xs font-bold text-white mb-0.5">{s.title}</div>
                      <div className="text-[9px] text-[#71717a] line-clamp-1">{s.subtitle}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Choose Cultural Location / Staging Backdrop */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#e5c158] block">
                Cadre & Décor Culturel (Bénin & Togo) :
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CULTURAL_LOCATIONS.map((loc) => {
                  const isSel = selectedLocation.id === loc.id;
                  return (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => setSelectedLocation(loc)}
                      className={`p-2.5 rounded-2xl text-left border transition-all ${
                        isSel
                          ? 'bg-[#1e1b12] border-[#d4af37] text-white shadow-md'
                          : 'bg-[#181822] border-[#252536] text-[#a1a1aa] hover:border-[#38384d]'
                      }`}
                    >
                      <div className="flex items-center gap-1 text-[11px] font-bold text-white mb-0.5">
                        <span>{loc.flag}</span>
                        <span className="truncate">{loc.country}</span>
                      </div>
                      <div className="text-[10px] text-[#d4af37] truncate">{loc.landmark}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Occasion */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#e5c158] block">
                Occasion de Prestige :
              </label>
              <select
                value={selectedOccasion}
                onChange={(e) => setSelectedOccasion(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#181822] border border-[#2c2c3e] rounded-xl text-xs text-white outline-none focus:border-[#d4af37]"
              >
                {OCCASIONS.map((occ) => (
                  <option key={occ} value={occ}>
                    {occ}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Trigger Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleGenerateCurator}
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#aa7c11] text-black font-extrabold text-xs uppercase tracking-wider shadow-xl shadow-[#d4af37]/25 flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  <span>Curation Haute Couture en cours...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Générer ma Curation Stylistique IA</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Right Column: Visual Staging & Haute Couture Lookbook (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Visual Staging Presentation Card */}
            <div className="relative rounded-3xl overflow-hidden border border-[#d4af37]/40 bg-[#12121a] shadow-2xl group">
              <div className="h-80 sm:h-[420px] w-full overflow-hidden relative">
                <img
                  src={selectedLocation.image}
                  alt={`Mise en situation haute couture à ${selectedLocation.name}`}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0f] via-[#0b0b0f]/30 to-transparent" />

                {/* Cultural Landmark Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-[#d4af37]/40 text-xs text-white shadow-lg">
                  <span className="text-sm">{selectedLocation.flag}</span>
                  <span className="font-bold text-[#e5c158]">{selectedLocation.landmark}</span>
                </div>

                {/* Live Selection Indicator */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-[#0e0e14]/90 backdrop-blur-md border border-[#d4af37]/35 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-[#e5c158] font-bold block">
                        Allure en Situation
                      </span>
                      <h4 className="font-luxury text-base sm:text-lg font-bold text-white">
                        {curationResult?.title || `${selectedSilhouette.title} en ${selectedFabric.name}`}
                      </h4>
                      <p className="text-[11px] text-[#a1a1aa] mt-0.5">
                        Décor : {selectedLocation.name} · {selectedOccasion}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={openWhatsApp}
                      className="px-4 py-2 rounded-xl bg-[#25d366]/20 border border-[#25d366]/40 text-[#25d366] text-xs font-bold hover:bg-[#25d366] hover:text-black transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Atelier</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Generated Lookbook Specification (Fiche Technique Couturier) */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#121219] border border-[#242436] space-y-6 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#202030]">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-[#e5c158]" />
                  <h3 className="font-luxury text-base font-bold text-white">
                    Fiche Technique & Recommandations du Maître-Tailleur
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-[#e5c158]">BECCA Atelier</span>
              </div>

              {/* Concept Presentation */}
              <div className="p-4 rounded-2xl bg-[#171724] border border-[#28283a] space-y-1.5">
                <span className="text-[10px] text-[#e5c158] font-bold uppercase tracking-wider block">
                  Vision du Créateur
                </span>
                <p className="text-xs sm:text-sm text-[#e4e4e7] leading-relaxed italic">
                  « {curationResult?.concept || `Une silhouette d'apparat sublimant les dorures du ${selectedFabric.name}, conçue spécialement pour briller lors de ${selectedOccasion} dans la splendeur de ${selectedLocation.name}.`} »
                </p>
              </div>

              {/* Technical Cut Details */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#e5c158] uppercase tracking-wider flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5" />
                  <span>Détails Techniques de Coupe :</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {(curationResult?.cutDetails || [
                    'Bustier baleiné sur-mesure sculptant la taille avec finitions invisibles',
                    'Alignement parfait des motifs traditionnels sur l\'axe central',
                    'Basque asymétrique doublée pour un tombé rigide et sans faux plis',
                    'Finitions lisière certifiée apparente sur la traîne royale',
                  ]).map((detail: string, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#181822] border border-[#232332] text-[#d4d4d8] flex items-start gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] mt-1.5 shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Accessories (Shoes & Jewelry) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-[#181822] border border-[#232332] space-y-1">
                  <span className="text-[10px] text-[#71717a] uppercase font-semibold block">
                    Souliers BECCA SHOP
                  </span>
                  <div className="text-xs font-bold text-white">
                    {curationResult?.accessories?.shoes || 'Escarpins Stiletto Dorés "Aurelia" (9 cm)'}
                  </div>
                  <span className="text-[10px] text-[#e5c158]">Harmonie or & rouge</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#181822] border border-[#232332] space-y-1">
                  <span className="text-[10px] text-[#71717a] uppercase font-semibold block">
                    Parure de Bijoux
                  </span>
                  <div className="text-xs font-bold text-white">
                    {curationResult?.accessories?.jewelry || 'Collier filigrane or & manchettes royales'}
                  </div>
                  <span className="text-[10px] text-[#e5c158]">Or pur & perles béninoises</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#181822] border border-[#232332] space-y-1">
                  <span className="text-[10px] text-[#71717a] uppercase font-semibold block">
                    Coiffure & Foulard Gélé
                  </span>
                  <div className="text-xs font-bold text-white">
                    {curationResult?.headwrapAdvice || 'Foulard Gélé en couronne royale étagée'}
                  </div>
                  <span className="text-[10px] text-[#e5c158]">Nouage coutumier chic</span>
                </div>
              </div>

              {/* Cultural Resonance Note */}
              {curationResult?.culturalResonance && (
                <div className="text-[11px] text-[#a1a1aa] border-t border-[#222230] pt-3">
                  <strong className="text-[#e5c158]">Ancrage culturel :</strong>{' '}
                  {curationResult.culturalResonance}
                </div>
              )}

              {/* Bottom Conversion Action Strip */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAddProductToCart}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#d4af37] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-md"
                >
                  <ShoppingBag className="w-4 h-4 text-black" />
                  <span>Ajouter le Pagne au Panier</span>
                </button>

                <button
                  type="button"
                  onClick={openWhatsApp}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#1c1c28] hover:bg-[#252536] text-white font-semibold text-xs border border-[#343448] flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#25d366]" />
                  <span>Commander la Tenue sur WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-full sm:w-auto p-3 rounded-xl bg-[#181822] hover:bg-[#222230] text-[#a1a1aa] hover:text-white border border-[#2c2c3e] transition-colors"
                  title="Imprimer la fiche couturier"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
