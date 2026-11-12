import React, { useState } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { MobileBottomBar } from './components/MobileBottomBar';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { CollectionsPage } from './pages/public/CollectionsPage';
import { ContactPage } from './pages/public/ContactPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { ForgotPasswordPage } from './pages/public/ForgotPasswordPage';

// Customer Pages
import { ShopPage } from './pages/customer/ShopPage';
import { ProductDetailPage } from './pages/customer/ProductDetailPage';
import { CartPage } from './pages/customer/CartPage';
import { CheckoutPage } from './pages/customer/CheckoutPage';
import { AccountPage } from './pages/customer/AccountPage';
import { OrdersPage } from './pages/customer/OrdersPage';
import { ProfilePage } from './pages/customer/ProfilePage';
import { WishlistPage } from './pages/customer/WishlistPage';

// Admin Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminInventory } from './pages/admin/AdminInventory';
import { AdminPromotions } from './pages/admin/AdminPromotions';
import { AdminWholesale } from './pages/admin/AdminWholesale';
import { AdminMarketing } from './pages/admin/AdminMarketing';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminInvoices } from './pages/admin/AdminInvoices';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';

const StorefrontApp: React.FC = () => {
  const [location, setLocation] = useLocation();
  const {
    cartItems,
    cartCount,
    cartTotal,
    wishlist,
    updateCartQuantity,
    removeFromCart,
    addToCart,
    toggleWishlist,
    settings,
  } = useStore();

  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [wishlistDrawerOpen, setWishlistDrawerOpen] = useState(false);

  // Dedicated Admin Login Route
  if (location === '/admin/login') {
    return <AdminLoginPage onSuccess={() => setLocation('/admin')} />;
  }

  const isAdminRoute = location.startsWith('/admin');

  // If in admin dashboard, render solely the Admin layout
  if (isAdminRoute) {
    return (
      <AdminLayout>
        <Switch>
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/login">
            {() => <AdminLoginPage onSuccess={() => setLocation('/admin')} />}
          </Route>
          <Route path="/admin/products" component={AdminProducts} />
          <Route path="/admin/categories" component={AdminCategories} />
          <Route path="/admin/orders" component={AdminOrders} />
          <Route path="/admin/invoices" component={AdminInvoices} />
          <Route path="/admin/customers" component={AdminCustomers} />
          <Route path="/admin/inventory" component={AdminInventory} />
          <Route path="/admin/promotions" component={AdminPromotions} />
          <Route path="/admin/wholesale" component={AdminWholesale} />
          <Route path="/admin/marketing" component={AdminMarketing} />
          <Route path="/admin/settings" component={AdminSettings} />
          <Route>
            <AdminDashboard />
          </Route>
        </Switch>
      </AdminLayout>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0d] text-[#f3f3f6] flex flex-col selection:bg-[#d4af37] selection:text-black">
      {/* Optional Store Announcement Bar from site settings */}
      {settings.bannerActive && settings.bannerAnnouncement && (
        <div className="bg-gradient-to-r from-[#1c180e] via-[#d4af37]/20 to-[#1c180e] border-b border-[#d4af37]/40 py-2 px-4 text-center text-[11px] font-semibold text-[#e5c158] tracking-wide">
          ✨ {settings.bannerAnnouncement}
        </div>
      )}

      {/* Global Store Navigation */}
      <Navbar
        cartCount={cartCount}
        cartTotal={cartTotal}
        wishlistCount={wishlist.length}
        onOpenCart={() => setCartDrawerOpen(true)}
        onOpenWishlist={() => setWishlistDrawerOpen(true)}
      />

      {/* Route Switch */}
      <main className="flex-1 pb-16 md:pb-0">
        <Switch>
          {/* Public Routes */}
          <Route path="/" component={HomePage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/collections" component={CollectionsPage} />
          <Route path="/contact" component={ContactPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/forgot-password" component={ForgotPasswordPage} />

          {/* Customer Routes */}
          <Route path="/shop">
            <ShopPage />
          </Route>
          <Route path="/shop/pagnes">
            <ShopPage initialCategory="pagnes" />
          </Route>
          <Route path="/shop/chaussures">
            <ShopPage initialCategory="chaussures" />
          </Route>
          <Route path="/product/:id" component={ProductDetailPage} />
          <Route path="/cart" component={CartPage} />
          <Route path="/checkout" component={CheckoutPage} />
          <Route path="/account" component={AccountPage} />
          <Route path="/account/orders" component={OrdersPage} />
          <Route path="/account/profile" component={ProfilePage} />
          <Route path="/account/wishlist" component={WishlistPage} />

          {/* 404 Fallback */}
          <Route>
            <div className="py-24 text-center space-y-4">
              <h1 className="font-luxury text-3xl font-bold text-white">Page introuvable</h1>
              <p className="text-xs text-[#a1a1aa]">L'adresse demandée n'existe pas ou a été déplacée.</p>
              <button
                onClick={() => setLocation('/')}
                className="px-6 py-2.5 rounded-full bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wider"
              >
                Retour à l'accueil
              </button>
            </div>
          </Route>
        </Switch>
      </main>

      {/* Global Storefront Footer */}
      <Footer onSelectCategory={() => setLocation('/shop')} />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onProceedToCheckout={() => {
          setCartDrawerOpen(false);
          setLocation('/checkout');
        }}
        onContinueShopping={() => {
          setCartDrawerOpen(false);
          setLocation('/shop');
        }}
      />

      {/* Slide-over Wishlist Drawer */}
      <WishlistDrawer
        isOpen={wishlistDrawerOpen}
        onClose={() => setWishlistDrawerOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={(id) => {
          const item = wishlist.find((p) => p.id === id);
          if (item) toggleWishlist(item);
        }}
        onAddToCart={(p, size, color) => addToCart(p, size, color, 1)}
      />

      {/* Floating WhatsApp Action Button */}
      <WhatsAppFloatingButton />

      {/* Mobile Ergonomic Bottom Bar */}
      <MobileBottomBar
        activeCategory="all"
        onSelectCategory={() => setLocation('/shop')}
        cartCount={cartCount}
        onOpenCart={() => setCartDrawerOpen(true)}
      />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <StorefrontApp />
    </StoreProvider>
  );
}
