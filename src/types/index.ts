export type Role = 'customer' | 'admin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  address?: string;
  role: Role;
  emailVerified: boolean;
  createdAt: string;
}

export interface WholesaleTier {
  minQty: number;
  maxQty?: number; // undefined means "and above"
  unitPrice: number; // in FCFA
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // In FCFA (Retail price)
  originalPrice?: number; // In FCFA if on promo
  wholesalePrice?: number; // Base wholesale unit price
  wholesaleEligible?: boolean;
  wholesaleMinQty?: number; // Default e.g. 5
  wholesaleTiers?: WholesaleTier[];
  images: string[];
  category: 'pagnes' | 'chaussures';
  subCategory: string;
  reference: string;
  stock: number;
  status: 'available' | 'low_stock' | 'out_of_stock';
  isNew?: boolean;
  isBestSeller?: boolean;
  isPromo?: boolean;
  isPublished?: boolean;
  sizes: string[];
  colors?: { name: string; hex: string }[];
  material?: string;
  origin?: string;
  details?: string[];
  createdAt?: string;
}

export interface CartItem {
  id: string; // Unique cart item key (productId + size + color)
  product: Product;
  selectedSize: string;
  selectedColor?: string;
  quantity: number;
  appliedUnitPrice: number; // dynamically computed (retail or wholesale tier)
  isWholesalePriceApplied?: boolean;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderDetails {
  orderId: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  city: string;
  address: string;
  notes?: string;
  deliveryMethod: 'come_pickup' | 'come_home' | 'benin_shipping';
  paymentMethod: 'delivery' | 'mtn_momo' | 'moov_money' | 'card';
  items: CartItem[];
  subtotal: number;
  discountAmount?: number;
  promoCode?: string;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  invoiceNumber?: string;
  invoiceDate?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Promotion {
  id: string;
  code: string;
  name: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // 15 for 15%, or 5000 for 5000 FCFA
  appliesTo: 'all' | 'pagnes' | 'chaussures' | 'product';
  targetProductId?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  bannerText?: string;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'order' | 'restock' | 'adjustment' | 'return';
  quantityDelta: number; // e.g. -2 or +10
  previousStock: number;
  newStock: number;
  reason: string;
  timestamp: string;
  actor: string;
  referenceOrderId?: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

export interface EmailLog {
  id: string;
  to: string;
  recipientName: string;
  subject: string;
  template: 'welcome' | 'order_confirmation' | 'order_status' | 'password_reset' | 'promo';
  htmlContent: string;
  status: 'sent' | 'delivered' | 'failed';
  sentAt: string;
}

export interface SiteSettings {
  storeName: string;
  tagline: string;
  logoUrl: string;
  city: string;
  fullAddress: string;
  phone1: string;
  phone1Display: string;
  phone2: string;
  phone2Display: string;
  email: string;
  hours: string;
  deliveryFeeComeHome: number;
  deliveryFeeBenin: number;
  freeShippingThreshold: number;
  bannerAnnouncement: string;
  bannerActive: boolean;
}

export type ActiveFilter = 'all' | 'pagnes' | 'chaussures' | 'bestsellers' | 'new' | 'promo' | 'wholesale';
