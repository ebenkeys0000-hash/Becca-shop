import { Product, Promotion, User, OrderDetails, SiteSettings } from '../types';
import { PRODUCTS } from './products';

export const DEFAULT_SETTINGS: SiteSettings = {
  storeName: "BECCA SHOP",
  tagline: "Qualité • Élégance • Votre style, notre priorité.",
  logoUrl: "/assets/aistudio/Becca_Shop_Luxury_Fashion_Emblem_4d9ef32f.png",
  city: "Comé",
  fullAddress: "Quartier Central, Route Principale, Comé, Bénin",
  phone1: "+22995441602",
  phone1Display: "+229 95 44 16 02",
  phone2: "+22941465506",
  phone2Display: "+229 41 46 55 06",
  email: "contact@beccashop.bj",
  hours: "Lun - Sam : 08h30 - 20h00 | Dimanche sur RDV",
  deliveryFeeComeHome: 1000,
  deliveryFeeBenin: 2500,
  freeShippingThreshold: 100000,
  bannerAnnouncement: "👑 Vente au détail & en gros (demi-gros) disponible à Comé et partout au Bénin !",
  bannerActive: true,
};

export const SEED_USERS: (User & { passwordHash: string })[] = [
  {
    id: "usr_admin_001",
    email: "admin@beccashop.bj",
    passwordHash: "Admin@Becca2026!",
    firstName: "Béatrice",
    lastName: "Directrice",
    phone: "+22995441602",
    city: "Comé",
    address: "Boutique Officielle, Comé",
    role: "admin",
    emailVerified: true,
    createdAt: "2026-01-01T08:00:00Z",
  },
  {
    id: "usr_cust_001",
    email: "clarisse@gmail.com",
    passwordHash: "Clari@2026",
    firstName: "Clarisse",
    lastName: "Agbodjan",
    phone: "+22997123456",
    city: "Comé",
    address: "Quartier Agatogbo, Rue 12",
    role: "customer",
    emailVerified: true,
    createdAt: "2026-01-15T10:30:00Z",
  },
];

export const SEED_PROMOTIONS: Promotion[] = [
  {
    id: "promo_welcome10",
    code: "BECCA10",
    name: "Offre Privilège Nouvelle Saison",
    description: "10% de réduction immédiate sur tous les pagnes et chaussures",
    discountType: "percentage",
    discountValue: 10,
    appliesTo: "all",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    isActive: true,
    bannerText: "Code BECCA10 : -10% sur toute votre commande !",
  },
  {
    id: "promo_wax20",
    code: "ROYAL20",
    name: "Spécial Soie & Super Wax",
    description: "Remise spéciale de 5 000 FCFA sur les soies de collection",
    discountType: "fixed",
    discountValue: 5000,
    appliesTo: "pagnes",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    isActive: true,
  },
];

// Enrich seed products with wholesale tier pricing
export const SEED_PRODUCTS: Product[] = PRODUCTS.map((p) => {
  const isPagne = p.category === 'pagnes';
  const basePrice = p.price;

  return {
    ...p,
    wholesaleEligible: true,
    wholesaleMinQty: isPagne ? 4 : 5,
    wholesalePrice: Math.round(basePrice * 0.8),
    wholesaleTiers: [
      { minQty: 1, maxQty: isPagne ? 3 : 4, unitPrice: basePrice },
      { minQty: isPagne ? 4 : 5, maxQty: 9, unitPrice: Math.round(basePrice * 0.85) },
      { minQty: 10, maxQty: 19, unitPrice: Math.round(basePrice * 0.78) },
      { minQty: 20, unitPrice: Math.round(basePrice * 0.72) },
    ],
    isPublished: true,
    createdAt: "2026-01-10T12:00:00Z",
  };
});

export const SEED_ORDERS: OrderDetails[] = [
  {
    orderId: "BS-82914",
    userId: "usr_cust_001",
    customerName: "Clarisse Agbodjan",
    customerPhone: "+229 97 12 34 56",
    customerEmail: "clarisse@gmail.com",
    city: "Comé",
    address: "Quartier Agatogbo, Rue 12",
    notes: "Appeler avant la livraison",
    deliveryMethod: "come_home",
    paymentMethod: "delivery",
    items: [
      {
        id: "bs-pag-001-6yards",
        product: SEED_PRODUCTS[0],
        selectedSize: "6 Yards (Morceau complet)",
        selectedColor: "Vert Émeraude & Doré",
        quantity: 1,
        appliedUnitPrice: 38500,
      },
    ],
    subtotal: 38500,
    shippingFee: 1000,
    total: 39500,
    status: "delivered",
    createdAt: "2026-02-14T14:20:00Z",
    updatedAt: "2026-02-15T11:00:00Z",
  },
  {
    orderId: "BS-94812",
    userId: "usr_cust_001",
    customerName: "Clarisse Agbodjan",
    customerPhone: "+229 97 12 34 56",
    customerEmail: "clarisse@gmail.com",
    city: "Comé",
    address: "Boutique BECCA SHOP, Comé",
    deliveryMethod: "come_pickup",
    paymentMethod: "mtn_momo",
    items: [
      {
        id: "bs-cha-001-38",
        product: SEED_PRODUCTS[1],
        selectedSize: "38",
        selectedColor: "Or Métallique Brillant",
        quantity: 1,
        appliedUnitPrice: 29500,
      },
    ],
    subtotal: 29500,
    shippingFee: 0,
    total: 29500,
    status: "processing",
    createdAt: "2026-03-01T09:15:00Z",
  },
];
