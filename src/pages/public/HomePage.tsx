import React from 'react';
import { Link } from 'wouter';
import { motion } from 'motion/react';
import { useStore } from '../../context/StoreContext';
import { Hero } from '../../components/Hero';
import { CategoryShowcase } from '../../components/CategoryShowcase';
import { StyleCuratorSection } from '../../components/StyleCuratorSection';
import { ProductCard } from '../../components/ProductCard';
import { TestimonialsSection } from '../../components/TestimonialsSection';
import { AboutSection } from '../../components/AboutSection';
import { ContactSection } from '../../components/ContactSection';
import { Sparkles, ArrowRight, PackageCheck, Truck, ShieldCheck, Mail } from 'lucide-react';
import { STORE_INFO } from '../../data/products';

export const HomePage: React.FC = () => {
  const { products, addToCart, toggleWishlist, isInWishlist, subscribeNewsletter } = useStore();
  const [newsletterEmail, setNewsletterEmail] = React.useState('');
  const [newsletterMsg, setNewsletterMsg] = React.useState('');

  const bestSellers = products.filter((p) => p.isBestSeller && p.isPublished !== false).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNew && p.isPublished !== false).slice(0, 4);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    const res = subscribeNewsletter(newsletterEmail);
    setNewsletterMsg(res.message);
    if (res.success) setNewsletterEmail('');
  };

  return (
    <div className="space-y-0">
      {/* 1. Hero Section */}
      <Hero
        onExploreCatalog={() => {
          const el = document.getElementById('bestsellers');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onFilterCategory={() => {}}
      />

      {/* 2. Categories Showcase */}
      <CategoryShowcase onSelectCategory={() => {}} />

      {/* 3. Curateur de Style IA & Mises en Situation Bénin / Togo */}
      <StyleCuratorSection />

      {/* 4. Wholesale & Demi-Gros Spotlight Banner */}
      <section className="py-16 bg-[#0f0e15] border-b border-[#222230] relative overflow-hidden">
        <div className="absolute -right-20 top-0 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#171520] via-[#12121a] to-[#18161f] border border-[#d4af37]/40 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl text-center lg:text-left">
              <span className="text-xs uppercase tracking-widest text-[#e5c158] font-bold inline-flex items-center gap-2">
                <PackageCheck className="w-4 h-4" />
                <span>Service Vente en Gros & Demi-Gros</span>
              </span>
              <h2 className="font-luxury text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                Tarifs Dégressifs Privilèges pour Revendeuses & Événements
              </h2>
              <p className="text-sm text-[#a1a1aa] leading-relaxed">
                Vous préparez une dot, un mariage ou vous distribuez des étoffes et chaussures au Bénin ? Bénéficiez de remises immédiates dès 4 ou 5 articles directement appliquées sur notre boutique en ligne.
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-[#d4d4d8] pt-2">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#e5c158]" />
                  <span>Authenticité 100% garantie</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#e5c158]" />
                  <span>Expédition vers Cotonou, Porto-Novo, Parakou</span>
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3.5 shrink-0">
              <Link
                href="/shop"
                className="px-8 py-4 rounded-full bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#aa7c11] text-black font-extrabold text-xs tracking-wider uppercase shadow-xl hover:brightness-110 transition-all text-center"
              >
                Accéder au catalogue gros
              </Link>
              <a
                href={STORE_INFO.whatsappUrl1}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-4 rounded-full bg-[#1e1e28] hover:bg-[#282836] border border-[#38384a] text-white font-medium text-xs tracking-wider transition-colors text-center"
              >
                Discuter avec la direction
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Best-Selling Products Section */}
      <section id="bestsellers" className="py-20 bg-[#0c0c0f] border-b border-[#202028]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#e5c158] mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sélection Recommandée</span>
              </div>
              <h2 className="font-luxury text-2xl sm:text-3xl font-bold text-white">
                Nos Meilleures Ventes à Comé
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-semibold text-[#e5c158] hover:underline inline-flex items-center gap-1.5"
            >
              <span>Voir tout le catalogue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenQuickView={() => {}}
                onAddToCart={(p, size, color) => addToCart(p, size, color, 1)}
                onToggleWishlist={toggleWishlist}
                isWishlisted={isInWishlist(product.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. New Arrivals Section */}
      <section className="py-20 bg-[#09090d] border-b border-[#202028]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#e5c158] mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Derniers Arrivages</span>
              </div>
              <h2 className="font-luxury text-2xl sm:text-3xl font-bold text-white">
                Nouveautés Haute Couture
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-semibold text-[#e5c158] hover:underline inline-flex items-center gap-1.5"
            >
              <span>Découvrir toutes les nouveautés</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenQuickView={() => {}}
                onAddToCart={(p, size, color) => addToCart(p, size, color, 1)}
                onToggleWishlist={toggleWishlist}
                isWishlisted={isInWishlist(product.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Brand Presentation */}
      <AboutSection />

      {/* 7. Testimonials */}
      <TestimonialsSection />

      {/* 8. Newsletter Subscription Module */}
      <section className="py-20 bg-[#121118] border-b border-[#252535] relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#e5c158] font-bold">
            <Mail className="w-4 h-4" />
            <span>Club Privilège BECCA SHOP</span>
          </div>
          <h2 className="font-luxury text-3xl sm:text-4xl font-bold text-white">
            Recevez nos Avant-Premières et Offres Privées
          </h2>
          <p className="text-sm text-[#a1a1aa] max-w-xl mx-auto">
            Inscrivez-vous pour être informée en priorité des nouveaux arrivages de pagnes wax, soies impériales et séries limitées de souliers.
          </p>

          <form onSubmit={handleNewsletter} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2 pt-2">
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Votre adresse email personnelle"
              className="flex-1 px-4 py-3.5 rounded-full bg-[#1a1924] border border-[#333346] text-white text-xs outline-none focus:border-[#e5c158]"
            />
            <button
              type="submit"
              className="px-6 py-3.5 rounded-full bg-[#e5c158] hover:bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-[#d4af37]/20"
            >
              S'inscrire
            </button>
          </form>

          {newsletterMsg && (
            <p className="text-xs text-[#10b981] font-medium animate-in fade-in">
              {newsletterMsg}
            </p>
          )}
        </div>
      </section>

      {/* 9. Contact & Store Section */}
      <ContactSection />
    </div>
  );
};
