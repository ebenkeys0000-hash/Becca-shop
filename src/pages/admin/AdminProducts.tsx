import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { formatFCFA } from '../../utils/formatters';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Check,
  X,
  PackageCheck,
  Tag,
  Sparkles,
} from 'lucide-react';
import { ProductImageUploader } from '../../components/admin/ProductImageUploader';

export const AdminProducts: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'pagnes' | 'chaussures'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'pagnes' as 'pagnes' | 'chaussures',
    subCategory: 'Super Wax Hollandais',
    price: 45000,
    originalPrice: 0,
    wholesalePrice: 38000,
    wholesaleEligible: true,
    wholesaleMinQty: 5,
    stock: 12,
    reference: '',
    imageUrl: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?q=80&w=1200&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1590736969955-71cc94801759?q=80&w=1200&auto=format&fit=crop'] as string[],
    description: '',
    sizes: 'Pièce 6 Yards, Demi-pièce 3 Yards',
    isNew: true,
    isBestSeller: false,
    isPromo: false,
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'pagnes',
      subCategory: 'Super Wax Hollandais',
      price: 45000,
      originalPrice: 0,
      wholesalePrice: 38000,
      wholesaleEligible: true,
      wholesaleMinQty: 5,
      stock: 12,
      reference: `BS-MOD-${Math.floor(100 + Math.random() * 900)}`,
      imageUrl: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?q=80&w=1200&auto=format&fit=crop',
      images: ['https://images.unsplash.com/photo-1590736969955-71cc94801759?q=80&w=1200&auto=format&fit=crop'],
      description: 'Étoffe prestigieuse aux reflets dorés confectionnée pour les grandes cérémonies et tenues traditionnelles de distinction.',
      sizes: 'Pièce 6 Yards, Demi-pièce 3 Yards',
      isNew: true,
      isBestSeller: false,
      isPromo: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      subCategory: product.subCategory,
      price: product.price,
      originalPrice: product.originalPrice || 0,
      wholesalePrice: product.wholesalePrice || Math.round(product.price * 0.85),
      wholesaleEligible: product.wholesaleEligible ?? true,
      wholesaleMinQty: product.wholesaleMinQty || 5,
      stock: product.stock,
      reference: product.reference,
      imageUrl: product.images[0] || '',
      images: product.images && product.images.length > 0 ? product.images : [product.images[0] || 'https://images.unsplash.com/photo-1590736969955-71cc94801759?q=80&w=1200&auto=format&fit=crop'],
      description: product.description,
      sizes: product.sizes.join(', '),
      isNew: !!product.isNew,
      isBestSeller: !!product.isBestSeller,
      isPromo: !!product.isPromo,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sizesArray = formData.sizes.split(',').map((s) => s.trim()).filter(Boolean);
    const finalImages = formData.images.length > 0 ? formData.images : [formData.imageUrl];

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formData.name,
        category: formData.category,
        subCategory: formData.subCategory,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        wholesalePrice: Number(formData.wholesalePrice),
        wholesaleEligible: formData.wholesaleEligible,
        wholesaleMinQty: Number(formData.wholesaleMinQty),
        stock: Number(formData.stock),
        status: Number(formData.stock) === 0 ? 'out_of_stock' : Number(formData.stock) <= 5 ? 'low_stock' : 'available',
        reference: formData.reference,
        images: finalImages,
        description: formData.description,
        sizes: sizesArray,
        isNew: formData.isNew,
        isBestSeller: formData.isBestSeller,
        isPromo: formData.isPromo,
      });
    } else {
      addProduct({
        name: formData.name,
        category: formData.category,
        subCategory: formData.subCategory,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        wholesalePrice: Number(formData.wholesalePrice),
        wholesaleEligible: formData.wholesaleEligible,
        wholesaleMinQty: Number(formData.wholesaleMinQty),
        wholesaleTiers: [
          { minQty: 5, maxQty: 9, unitPrice: Number(formData.wholesalePrice) },
          { minQty: 10, unitPrice: Math.round(Number(formData.wholesalePrice) * 0.92) },
        ],
        stock: Number(formData.stock),
        status: Number(formData.stock) === 0 ? 'out_of_stock' : Number(formData.stock) <= 5 ? 'low_stock' : 'available',
        reference: formData.reference || `BS-${Math.floor(100 + Math.random() * 900)}`,
        images: finalImages,
        description: formData.description,
        sizes: sizesArray,
        isNew: formData.isNew,
        isBestSeller: formData.isBestSeller,
        isPromo: formData.isPromo,
      });
    }
    setIsModalOpen(false);
  };

  const filtered = products.filter((p) => {
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.reference.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#20202d]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#e5c158] font-bold">
            Gestion du Catalogue
          </span>
          <h1 className="font-luxury text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Produits & Modèles en Ligne ({products.length})
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Créez, modifiez et gérez la visibilité de vos pagnes africains et souliers.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#aa7c11] text-black font-extrabold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-black" />
          <span>Ajouter un Article</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#121219] border border-[#222230] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              categoryFilter === 'all' ? 'bg-[#d4af37] text-black' : 'text-[#a1a1aa] hover:text-white bg-[#1a1924]'
            }`}
          >
            Tous ({products.length})
          </button>
          <button
            onClick={() => setCategoryFilter('pagnes')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              categoryFilter === 'pagnes' ? 'bg-[#d4af37] text-black' : 'text-[#a1a1aa] hover:text-white bg-[#1a1924]'
            }`}
          >
            Pagnes ({products.filter((p) => p.category === 'pagnes').length})
          </button>
          <button
            onClick={() => setCategoryFilter('chaussures')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              categoryFilter === 'chaussures' ? 'bg-[#d4af37] text-black' : 'text-[#a1a1aa] hover:text-white bg-[#1a1924]'
            }`}
          >
            Chaussures ({products.filter((p) => p.category === 'chaussures').length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#71717a] absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, réf..."
            className="w-full pl-9 pr-4 py-2 bg-[#181824] border border-[#2c2c3d] rounded-xl text-xs text-white placeholder-[#71717a] outline-none focus:border-[#e5c158]"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#121219] border border-[#222230] rounded-3xl p-6 shadow-xl overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#222230] text-[#71717a] uppercase tracking-wider text-[10px]">
              <th className="pb-3 font-semibold">Article & Réf.</th>
              <th className="pb-3 font-semibold">Rayon</th>
              <th className="pb-3 font-semibold">Prix Détail</th>
              <th className="pb-3 font-semibold">Prix Gros</th>
              <th className="pb-3 font-semibold">Stock</th>
              <th className="pb-3 font-semibold">Statut</th>
              <th className="pb-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e2c]">
            {filtered.map((product) => (
              <tr key={product.id} className="hover:bg-[#161622] transition-colors">
                <td className="py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-14 rounded-xl overflow-hidden bg-black border border-[#29293a] shrink-0">
                      <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-bold text-white max-w-xs truncate">{product.name}</div>
                      <div className="text-[10px] text-[#71717a] font-mono">Réf: {product.reference}</div>
                      <div className="flex gap-1.5 mt-1">
                        {product.isNew && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#d4af37]/20 text-[#e5c158] font-bold">
                            Nouv.
                          </span>
                        )}
                        {product.isBestSeller && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#3b82f6]/20 text-[#3b82f6] font-bold">
                            Top
                          </span>
                        )}
                        {product.isPromo && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#ef4444]/20 text-[#ef4444] font-bold">
                            Promo
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 capitalize text-[#a1a1aa]">{product.category}</td>
                <td className="py-3.5 font-mono font-bold text-white">{formatFCFA(product.price)}</td>
                <td className="py-3.5 font-mono font-bold text-[#e5c158]">
                  {product.wholesalePrice ? formatFCFA(product.wholesalePrice) : 'N/A'}
                </td>
                <td className="py-3.5">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    product.stock > 5
                      ? 'bg-[#10b981]/20 text-[#10b981]'
                      : product.stock > 0
                      ? 'bg-[#f59e0b]/20 text-[#f59e0b]'
                      : 'bg-[#ef4444]/20 text-[#ef4444]'
                  }`}>
                    {product.stock} pcs
                  </span>
                </td>
                <td className="py-3.5">
                  <button
                    onClick={() => updateProduct(product.id, { isPublished: !product.isPublished })}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 transition-colors ${
                      product.isPublished !== false
                        ? 'bg-[#10b981]/15 text-[#10b981] hover:bg-[#10b981]/25'
                        : 'bg-[#71717a]/15 text-[#a1a1aa] hover:bg-[#71717a]/25'
                    }`}
                  >
                    {product.isPublished !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{product.isPublished !== false ? 'En ligne' : 'Masqué'}</span>
                  </button>
                </td>
                <td className="py-3.5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenEdit(product)}
                      className="p-2 rounded-lg bg-[#1c1c28] hover:bg-[#262638] text-white transition-colors"
                      title="Modifier"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-[#e5c158]" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Confirmez-vous la suppression définitive du modèle « ${product.name} » ?`)) {
                          deleteProduct(product.id);
                        }
                      }}
                      className="p-2 rounded-lg bg-[#ef4444]/15 hover:bg-[#ef4444]/25 text-[#ef4444] transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#121219] border border-[#d4af37]/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#242436]">
                <h3 className="font-luxury text-xl font-bold text-white">
                  {editingProduct ? 'Modifier le Produit' : 'Créer un Nouveau Modèle'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl text-[#a1a1aa] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#a1a1aa] uppercase font-semibold mb-1">Nom du modèle</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#181824] border border-[#2e2e40] rounded-xl text-white outline-none focus:border-[#e5c158]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#a1a1aa] uppercase font-semibold mb-1">Catégorie</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full px-4 py-2.5 bg-[#181824] border border-[#2e2e40] rounded-xl text-white outline-none focus:border-[#e5c158]"
                    >
                      <option value="pagnes">Pagnes Africains</option>
                      <option value="chaussures">Chaussures Femmes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#a1a1aa] uppercase font-semibold mb-1">Sous-catégorie</label>
                    <input
                      type="text"
                      required
                      value={formData.subCategory}
                      onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                      placeholder="ex: Soie Wax Impériale"
                      className="w-full px-4 py-2.5 bg-[#181824] border border-[#2e2e40] rounded-xl text-white outline-none focus:border-[#e5c158]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[#a1a1aa] uppercase font-semibold mb-1">Prix Détail (FCFA)</label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 bg-[#181824] border border-[#2e2e40] rounded-xl text-white font-mono outline-none focus:border-[#e5c158]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#a1a1aa] uppercase font-semibold mb-1">Prix Gros (FCFA)</label>
                    <input
                      type="number"
                      required
                      value={formData.wholesalePrice}
                      onChange={(e) => setFormData({ ...formData, wholesalePrice: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 bg-[#181824] border border-[#2e2e40] rounded-xl text-white font-mono outline-none focus:border-[#e5c158]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#a1a1aa] uppercase font-semibold mb-1">Stock (pcs)</label>
                    <input
                      type="number"
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 bg-[#181824] border border-[#2e2e40] rounded-xl text-white font-mono outline-none focus:border-[#e5c158]"
                    />
                  </div>
                </div>

                <ProductImageUploader
                  images={formData.images}
                  onChange={(newImgs) =>
                    setFormData({ ...formData, images: newImgs, imageUrl: newImgs[0] || '' })
                  }
                  productId={editingProduct?.id}
                />

                <div>
                  <label className="block text-[#a1a1aa] uppercase font-semibold mb-1">Formats ou Pointures (séparés par virgule)</label>
                  <input
                    type="text"
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                    placeholder="ex: Pièce 6 Yards, Demi-pièce 3 Yards"
                    className="w-full px-4 py-2.5 bg-[#181824] border border-[#2e2e40] rounded-xl text-white outline-none focus:border-[#e5c158]"
                  />
                </div>

                <div>
                  <label className="block text-[#a1a1aa] uppercase font-semibold mb-1">Description éditoriale</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#181824] border border-[#2e2e40] rounded-xl text-white outline-none focus:border-[#e5c158] resize-none"
                  />
                </div>

                <div className="flex gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-[#d4d4d8]">
                    <input
                      type="checkbox"
                      checked={formData.isNew}
                      onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                    />
                    <span>Nouveauté</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-[#d4d4d8]">
                    <input
                      type="checkbox"
                      checked={formData.isBestSeller}
                      onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    />
                    <span>Meilleure vente</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-[#d4d4d8]">
                    <input
                      type="checkbox"
                      checked={formData.isPromo}
                      onChange={(e) => setFormData({ ...formData, isPromo: e.target.checked })}
                    />
                    <span>En promotion</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4 border-t border-[#242436]">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#aa7c11] text-black font-extrabold text-xs uppercase tracking-wider"
                  >
                    {editingProduct ? 'Mettre à jour le modèle' : 'Enregistrer le nouveau modèle'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-3 rounded-xl bg-[#1e1e2c] text-white text-xs font-semibold"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
