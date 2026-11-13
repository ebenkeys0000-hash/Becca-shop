import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CartItem,
  EmailLog,
  InventoryMovement,
  OrderDetails,
  OrderStatus,
  Product,
  Promotion,
  SiteSettings,
  User,
  NewsletterSubscriber,
} from '../types';
import {
  DEFAULT_SETTINGS,
  SEED_ORDERS,
  SEED_PRODUCTS,
  SEED_PROMOTIONS,
  SEED_USERS,
} from '../data/seedData';
import {
  createEmailLog,
  generateOrderConfirmationEmailHtml,
  generateWelcomeEmailHtml,
} from '../services/emailService';
import { OFFICIAL_LOGO_URL, resolveImageUrl } from '../assets/images';

interface StoreContextType {
  // Auth
  currentUser: User | null;
  isAdmin: boolean;
  isCustomer: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    city: string;
    address?: string;
    password: string;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Inventory
  inventoryMovements: InventoryMovement[];
  adjustStock: (productId: string, delta: number, reason: string) => void;

  // Promotions & Wholesale
  promotions: Promotion[];
  addPromotion: (promo: Omit<Promotion, 'id'>) => void;
  updatePromotion: (id: string, updates: Partial<Promotion>) => void;
  deletePromotion: (id: string) => void;
  calculateUnitPrice: (
    product: Product,
    quantity: number
  ) => { unitPrice: number; isWholesale: boolean; savingsPerUnit: number };

  // Orders
  orders: OrderDetails[];
  placeOrder: (
    orderData: Omit<OrderDetails, 'orderId' | 'createdAt' | 'status'>
  ) => Promise<OrderDetails>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Cart
  cartItems: CartItem[];
  addToCart: (product: Product, size: string, color?: string, quantity?: number) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;

  // Wishlist
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  // Marketing & Settings
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  subscribers: NewsletterSubscriber[];
  subscribeNewsletter: (email: string) => { success: boolean; message: string };
  emailLogs: EmailLog[];
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Users state
  const [users, setUsers] = useState<(User & { passwordHash: string })[]>(() => {
    try {
      const saved = localStorage.getItem('becca_users');
      return saved ? JSON.parse(saved) : SEED_USERS;
    } catch {
      return SEED_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('becca_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // 2. Products state with auto-migration to bundled Benin & Togo imagery
  const normalizeProductImages = (p: Product): Product => {
    const seed = SEED_PRODUCTS.find((sp) => sp.id === p.id);
    if (seed && (!p.images || p.images.length === 0 || p.images.some((img) => img.includes('179334797')))) {
      return { ...p, images: seed.images };
    }
    return {
      ...p,
      images: (p.images || []).map((img) => resolveImageUrl(img)).filter(Boolean),
    };
  };

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('becca_products');
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        return parsed.map(normalizeProductImages);
      }
      return SEED_PRODUCTS;
    } catch {
      return SEED_PRODUCTS;
    }
  });

  // 3. Inventory movements state
  const [inventoryMovements, setInventoryMovements] = useState<InventoryMovement[]>(() => {
    try {
      const saved = localStorage.getItem('becca_inventory_logs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 4. Promotions state
  const [promotions, setPromotions] = useState<Promotion[]>(() => {
    try {
      const saved = localStorage.getItem('becca_promotions');
      return saved ? JSON.parse(saved) : SEED_PROMOTIONS;
    } catch {
      return SEED_PROMOTIONS;
    }
  });

  // 5. Orders state
  const [orders, setOrders] = useState<OrderDetails[]>(() => {
    try {
      const saved = localStorage.getItem('becca_orders');
      if (saved) {
        const parsed: OrderDetails[] = JSON.parse(saved);
        return parsed.map((o) => ({
          ...o,
          items: (o.items || []).map((item) => ({
            ...item,
            product: normalizeProductImages(item.product),
          })),
        }));
      }
      return SEED_ORDERS;
    } catch {
      return SEED_ORDERS;
    }
  });

  // 6. Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('becca_cart');
      if (saved) {
        const parsed: CartItem[] = JSON.parse(saved);
        return parsed.map((item) => ({
          ...item,
          product: normalizeProductImages(item.product),
        }));
      }
      return [];
    } catch {
      return [];
    }
  });

  // 7. Wishlist state
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('becca_wishlist');
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        return parsed.map(normalizeProductImages);
      }
      return [];
    } catch {
      return [];
    }
  });

  // 8. Site Settings
  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem('becca_settings');
      if (saved) {
        const parsed: SiteSettings = JSON.parse(saved);
        return {
          ...parsed,
          logoUrl: resolveImageUrl(parsed.logoUrl, OFFICIAL_LOGO_URL),
        };
      }
      return DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // 9. Newsletter subscribers
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>(() => {
    try {
      const saved = localStorage.getItem('becca_subscribers');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 10. Email logs
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>(() => {
    try {
      const saved = localStorage.getItem('becca_email_logs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('becca_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('becca_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('becca_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('becca_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('becca_inventory_logs', JSON.stringify(inventoryMovements));
  }, [inventoryMovements]);

  useEffect(() => {
    localStorage.setItem('becca_promotions', JSON.stringify(promotions));
  }, [promotions]);

  useEffect(() => {
    localStorage.setItem('becca_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('becca_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('becca_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('becca_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('becca_subscribers', JSON.stringify(subscribers));
  }, [subscribers]);

  const hashPassword = async (plain: string): Promise<string> => {
    if (typeof window !== 'undefined' && window.crypto?.subtle) {
      const encoded = new TextEncoder().encode(plain);
      const buffer = await window.crypto.subtle.digest('SHA-256', encoded);
      return Array.from(new Uint8Array(buffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    }
    return plain;
  };

  // Auth Methods
  const login = async (email: string, pass: string) => {
    const passDigest = await hashPassword(pass);
    const found = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        (u.passwordHash === passDigest || u.passwordHash === pass)
    );
    if (!found) {
      return { success: false, message: "Email ou mot de passe incorrect." };
    }
    const safeUser: User = {
      id: found.id,
      email: found.email,
      firstName: found.firstName,
      lastName: found.lastName,
      phone: found.phone,
      city: found.city,
      address: found.address,
      role: found.role,
      emailVerified: found.emailVerified,
      createdAt: found.createdAt,
    };
    setCurrentUser(safeUser);
    return { success: true };
  };

  const register = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    city: string;
    address?: string;
    password: string;
  }) => {
    const existing = users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      return { success: false, message: "Un compte existe déjà avec cette adresse email." };
    }

    const passDigest = await hashPassword(data.password);
    const newUser: User & { passwordHash: string } = {
      id: `usr_${Date.now()}`,
      email: data.email.toLowerCase(),
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      city: data.city,
      address: data.address || '',
      passwordHash: passDigest,
      role: 'customer',
      emailVerified: true,
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);

    const safeUser: User = {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      phone: newUser.phone,
      city: newUser.city,
      address: newUser.address,
      role: newUser.role,
      emailVerified: newUser.emailVerified,
      createdAt: newUser.createdAt,
    };

    setCurrentUser(safeUser);

    // Send and log personalized Welcome Email
    const welcomeHtml = generateWelcomeEmailHtml(safeUser);
    const log = createEmailLog(
      safeUser.email,
      `${safeUser.firstName} ${safeUser.lastName}`,
      "Bienvenue chez BECCA SHOP — Qualité, Élégance & Distinction",
      "welcome",
      welcomeHtml
    );
    setEmailLogs((prev) => [log, ...prev]);

    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, ...data } : u))
    );
  };

  // Wholesale & Unit Price Calculator
  const calculateUnitPrice = (
    product: Product,
    quantity: number
  ): { unitPrice: number; isWholesale: boolean; savingsPerUnit: number } => {
    const basePrice = product.price;

    // Check wholesale eligibility and tiers
    if (product.wholesaleEligible && product.wholesaleTiers && product.wholesaleTiers.length > 0) {
      // Find matching tier
      const sortedTiers = [...product.wholesaleTiers].sort((a, b) => b.minQty - a.minQty);
      for (const tier of sortedTiers) {
        if (quantity >= tier.minQty) {
          if (!tier.maxQty || quantity <= tier.maxQty) {
            return {
              unitPrice: tier.unitPrice,
              isWholesale: quantity >= (product.wholesaleMinQty || 4),
              savingsPerUnit: Math.max(0, basePrice - tier.unitPrice),
            };
          }
        }
      }
    }

    return {
      unitPrice: basePrice,
      isWholesale: false,
      savingsPerUnit: 0,
    };
  };

  // Product Management
  const addProduct = (pData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...pData,
      id: `bs-${pData.category === 'pagnes' ? 'pag' : 'cha'}-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
      isPublished: true,
    };
    setProducts((prev) => [newProduct, ...prev]);

    // Log stock addition
    const movement: InventoryMovement = {
      id: `mov_${Date.now()}`,
      productId: newProduct.id,
      productName: newProduct.name,
      type: 'restock',
      quantityDelta: newProduct.stock,
      previousStock: 0,
      newStock: newProduct.stock,
      reason: 'Création initiale du produit',
      timestamp: new Date().toISOString(),
      actor: currentUser?.firstName || 'Administrateur',
    };
    setInventoryMovements((prev) => [movement, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          if (updates.stock !== undefined && updates.stock !== p.stock) {
            const delta = updates.stock - p.stock;
            const mov: InventoryMovement = {
              id: `mov_${Date.now()}`,
              productId: p.id,
              productName: p.name,
              type: delta > 0 ? 'restock' : 'adjustment',
              quantityDelta: delta,
              previousStock: p.stock,
              newStock: updates.stock,
              reason: 'Mise à jour fiche produit',
              timestamp: new Date().toISOString(),
              actor: currentUser?.firstName || 'Administrateur',
            };
            setInventoryMovements((m) => [mov, ...m]);
          }
          return { ...p, ...updates };
        }
        return p;
      })
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const adjustStock = (productId: string, delta: number, reason: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newStock = Math.max(0, p.stock + delta);
          const mov: InventoryMovement = {
            id: `mov_${Date.now()}`,
            productId: p.id,
            productName: p.name,
            type: delta > 0 ? 'restock' : 'adjustment',
            quantityDelta: delta,
            previousStock: p.stock,
            newStock,
            reason,
            timestamp: new Date().toISOString(),
            actor: currentUser?.firstName || 'Administrateur',
          };
          setInventoryMovements((m) => [mov, ...m]);

          const status = newStock === 0 ? 'out_of_stock' : newStock <= 5 ? 'low_stock' : 'available';
          return { ...p, stock: newStock, status };
        }
        return p;
      })
    );
  };

  // Promotion Management
  const addPromotion = (promoData: Omit<Promotion, 'id'>) => {
    const newPromo: Promotion = {
      ...promoData,
      id: `prm_${Date.now()}`,
    };
    setPromotions((prev) => [newPromo, ...prev]);
  };

  const updatePromotion = (id: string, updates: Partial<Promotion>) => {
    setPromotions((prev) =>
      prev.map((pr) => (pr.id === id ? { ...pr, ...updates } : pr))
    );
  };

  const deletePromotion = (id: string) => {
    setPromotions((prev) => prev.filter((pr) => pr.id !== id));
  };

  // Cart Management
  const addToCart = (
    product: Product,
    size: string,
    color?: string,
    quantity: number = 1
  ) => {
    const chosenSize = size || (product.sizes && product.sizes[0]) || 'Standard';
    const chosenColor = color || (product.colors && product.colors[0]?.name) || '';
    const cartItemId = `${product.id}-${chosenSize}-${chosenColor}`;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      const newQty = existing ? existing.quantity + quantity : quantity;
      const { unitPrice, isWholesale } = calculateUnitPrice(product, newQty);

      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId
            ? {
                ...item,
                quantity: newQty,
                appliedUnitPrice: unitPrice,
                isWholesalePriceApplied: isWholesale,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          id: cartItemId,
          product,
          selectedSize: chosenSize,
          selectedColor: chosenColor,
          quantity: newQty,
          appliedUnitPrice: unitPrice,
          isWholesalePriceApplied: isWholesale,
        },
      ];
    });
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const { unitPrice, isWholesale } = calculateUnitPrice(item.product, quantity);
          return {
            ...item,
            quantity,
            appliedUnitPrice: unitPrice,
            isWholesalePriceApplied: isWholesale,
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.appliedUnitPrice * item.quantity,
    0
  );

  // Orders Management
  const placeOrder = async (
    orderData: Omit<OrderDetails, 'orderId' | 'createdAt' | 'status'>
  ): Promise<OrderDetails> => {
    const orderId = `BS-${Math.floor(10000 + Math.random() * 90000)}`;
    const orderIndex = orders.length + 1;
    const padded = String(orderIndex).padStart(5, '0');
    const year = new Date().getFullYear();
    const invoiceNumber = `BECCA-${year}-${padded}`;

    const newOrder: OrderDetails = {
      ...orderData,
      orderId,
      invoiceNumber,
      invoiceDate: new Date().toISOString(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 1. Deduct Stock for each product
    orderData.items.forEach((item) => {
      adjustStock(
        item.product.id,
        -item.quantity,
        `Commande client #${orderId}`
      );
    });

    // 2. Add to orders list
    setOrders((prev) => [newOrder, ...prev]);

    // 3. Clear shopping cart
    clearCart();

    // 4. Send & Log Order Confirmation Email
    if (newOrder.customerEmail) {
      const emailHtml = generateOrderConfirmationEmailHtml(newOrder);
      const log = createEmailLog(
        newOrder.customerEmail,
        newOrder.customerName,
        `Confirmation de votre commande #${newOrder.orderId} — BECCA SHOP`,
        'order_confirmation',
        emailHtml
      );
      setEmailLogs((prev) => [log, ...prev]);
    }

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.orderId === orderId) {
          const updated = { ...ord, status, updatedAt: new Date().toISOString() };
          // Log email status notification
          if (ord.customerEmail) {
            const statusLabel =
              status === 'confirmed'
                ? 'Confirmée'
                : status === 'processing'
                ? 'En cours de préparation'
                : status === 'shipped'
                ? 'Expédiée'
                : status === 'delivered'
                ? 'Livrée'
                : 'Annulée';

            const log = createEmailLog(
              ord.customerEmail,
              ord.customerName,
              `Mise à jour de votre commande #${ord.orderId} : ${statusLabel}`,
              'order_status',
              `<div style="font-family:sans-serif; padding:20px; background:#0c0c10; color:#fff;">
                <h2>Statut de commande : ${statusLabel}</h2>
                <p>Votre commande #${ord.orderId} est désormais passée au statut : <strong>${statusLabel}</strong>.</p>
                <p>BECCA SHOP · Comé, Bénin</p>
              </div>`
            );
            setEmailLogs((el) => [log, ...el]);
          }
          return updated;
        }
        return ord;
      })
    );
  };

  // Wishlist
  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      return exists ? prev.filter((p) => p.id !== product.id) : [...prev, product];
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  // Settings & Marketing
  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const subscribeNewsletter = (email: string) => {
    const clean = email.trim().toLowerCase();
    if (!clean.includes('@') || !clean.includes('.')) {
      return { success: false, message: "Adresse email invalide." };
    }
    if (subscribers.some((s) => s.email === clean)) {
      return { success: true, message: "Vous êtes déjà inscrit(e) à nos privilèges !" };
    }
    const newSub: NewsletterSubscriber = {
      id: `sub_${Date.now()}`,
      email: clean,
      subscribedAt: new Date().toISOString(),
    };
    setSubscribers((prev) => [newSub, ...prev]);
    return { success: true, message: "Merci ! Vous recevrez nos invitations exclusives." };
  };

  const isAdmin = currentUser?.role === 'admin';
  const isCustomer = currentUser?.role === 'customer';

  return (
    <StoreContext.Provider
      value={{
        currentUser,
        isAdmin,
        isCustomer,
        login,
        register,
        logout,
        updateProfile,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        inventoryMovements,
        adjustStock,
        promotions,
        addPromotion,
        updatePromotion,
        deletePromotion,
        calculateUnitPrice,
        orders,
        placeOrder,
        updateOrderStatus,
        cartItems,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        settings,
        updateSettings,
        subscribers,
        subscribeNewsletter,
        emailLogs,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
