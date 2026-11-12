import React, { useState, useMemo } from 'react';
import { useRoute, Link } from 'wouter';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../../components/ProductCard';
import { ProductModal } from '../../components/ProductModal';
import { Product } from '../../types';
import { Search, Sparkles, ArrowUpDown, Filter, PackageCheck, Layers, RefreshCw } from 'lucide-react';

interface ShopPageProps {
  initialCategory?: 'pagnes' | 'chaussures';
}

export const ShopPage: React.FC<ShopPageProps> = ({ initialCategory }) => {
  const { products, addToCart, toggleWishlist, isInWishlist } = useStore();
  const [, paramsPagnes] = useRoute('/shop/pagnes');
  const [, paramsChaussures] = useRoute('/shop/chaussures');

  const defaultCategory = initialCategory || (paramsPagnes ? 'pagnes' : paramsChaussures ? 'chaussures' : 'all');

  const [activeCategory, setActiveCategory] = useState<'all' | 'pagnes' | 'chaussures'>(defaultCategory);
  const [activeFilter, setActiveFilter] = useState<'all' | 'popular' | 'new' | 'promo' | 'wholesale'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Update if route changed
  React.useEffect(() => {
    if (paramsPagnes) setActiveCategory('pagnes');
    else if (paramsChaussures) setActiveCategory('chaussures');
  }, [paramsPagnes, paramsChaussures]);

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => p.isPublished !== false);

    // Category
    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Special Filter Tabs
    if (activeFilter === 'popular') {
      result = result.filter((p) => p.isBestSeller);
    } else if (activeFilter === 'new') {
      result = result.filter((p) => p.isNew);
    } else if (activeFilter === 'promo') {
      result = result.filter((p) => p.isPromo);
    } else if (activeFilter === 'wholesale') {
      result = result.filter((p) => p.wholesaleEligible);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.subCategory.toLowerCase().includes(q) ||
          p.reference.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, activeCategory, activeFilter, searchQuery, sortBy]);

  return (
    <div className="py-12 bg-[#0a0a0d] min-h-screen text-[#f3f3f6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-[#a1a1aa] mb-3">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span>/</span>
            <span className="text-[#e5c158] font-medium">Boutique</span>
            {activeCategory !== 'all' && (
              <>
                <span>/</span>
                <span className="capitalize">{activeCategory}</span>
              </>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#222230]">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#e5c158] mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Collection Complète BECCA SHOP</span>
              </div>
              <h1 className="font-luxury text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                {activeCategory === 'pagnes'
                  ? 'Pagnes Africains de Prestige'
                  : activeCategory === 'chaussures'
                  ? 'Chaussures & Escarpins Féminins'
                  : 'Toutes les Créations'}
              </h1>
              <p className="text-sm text-[#a1a1aa] mt-2 max-w-2xl">
                Tissus nobles de premier choix, soies, broderies Getzner et souliers d'apparat disponibles à la boutique de Comé, en détail ou en gros avec tarifs dégressifs.
              </p>
            </div>

            {/* Total count and sort */}
            <div className="flex items-center gap-4 shrink-0">
              <span className="text-xs text-[#71717a] font-medium tabular-nums">
                {filteredProducts.length} article{filteredProducts.length > 1 ? 's' : ''}
              </span>
              <div className="flex items-center gap-2 bg-[#15151e] border border-[#262635] rounded-xl px-3.5 py-2 text-xs text-[#d4d4d8]">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#e5c158]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-xs text-white outline-none cursor-pointer"
                >
                  <option value="featured" className="bg-[#15151e]">Sélection vedette</option>
                  <option value="price-asc" className="bg-[#15151e]">Prix : Moins cher</option>
                  <option value="price-desc" className="bg-[#15151e]">Prix : Plus cher</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-[#121219] border border-[#222230] rounded-2xl p-4 mb-8 flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                activeCategory === 'all'
                  ? 'bg-[#d4af37] text-black shadow-md'
                  : 'text-[#a1a1aa] hover:text-white bg-[#1a1924]'
              }`}
            >
              Tous les rayons
            </button>
            <button
              onClick={() => setActiveCategory('pagnes')}
              className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                activeCategory === 'pagnes'
                  ? 'bg-[#d4af37] text-black shadow-md'
                  : 'text-[#a1a1aa] hover:text-white bg-[#1a1924]'
              }`}
            >
              Pagnes Africains
            </button>
            <button
              onClick={() => setActiveCategory('chaussures')}
              className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                activeCategory === 'chaussures'
                  ? 'bg-[#d4af37] text-black shadow-md'
                  : 'text-[#a1a1aa] hover:text-white bg-[#1a1924]'
              }`}
            >
              Chaussures Femmes
            </button>
          </div>

          {/* Sub Filters */}
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto">
            {[
              { id: 'all', label: 'Tout' },
              { id: 'popular', label: 'Bestsellers' },
              { id: 'new', label: 'Nouveautés' },
              { id: 'promo', label: 'Promotions' },
              { id: 'wholesale', label: 'Vente en Gros', icon: PackageCheck },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-xl border text-xs transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    activeFilter === f.id
                      ? 'bg-[#242116] text-[#e5c158] border-[#d4af37]/50 font-semibold'
                      : 'text-[#a1a1aa] border-transparent hover:text-white hover:bg-[#1a1924]'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  <span>{f.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-64 shrink-0">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-[#71717a]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom, réf..."
              className="w-full pl-9 pr-4 py-2 bg-[#181822] border border-[#2b2b3a] rounded-xl text-xs text-white placeholder-[#71717a] outline-none focus:border-[#e5c158] transition-colors"
            />
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-[#121218] rounded-3xl border border-[#22222d] p-8 max-w-xl mx-auto">
            <p className="text-sm text-[#a1a1aa]">
              Aucun article ne correspond à vos critères de recherche actuels.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setActiveFilter('all');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-xl bg-[#e5c158] text-black text-xs font-bold inline-flex items-center gap-2 shadow-lg"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Réinitialiser les filtres</span>
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenQuickView={(p) => setSelectedProduct(p)}
                  onAddToCart={(p, size, color) => addToCart(p, size, color, 1)}
                  onToggleWishlist={toggleWishlist}
                  isWishlisted={isInWishlist(product.id)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Quick View Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p, size, color, qty) => addToCart(p, size, color, qty)}
        onToggleWishlist={toggleWishlist}
        isWishlisted={selectedProduct ? isInWishlist(selectedProduct.id) : false}
      />
    </div>
  );
};
