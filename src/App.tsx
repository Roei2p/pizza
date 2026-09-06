import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Header } from './components/Header';
import { PizzaBuilder } from './components/PizzaBuilder';
import { DrinksSection } from './components/DrinksSection';
import { DessertsSection } from './components/DessertsSection';
import { CartDrawer } from './components/CartDrawer';
import { StickyContactBars } from './components/StickyContactBars';
import { CartItem, CustomPizzaItem, CartDrinkItem, CartDessertItem } from './types';
import { PIZZERIA_CONTACT } from './data/menuData';
import { Pizza, GlassWater, Cake } from 'lucide-react';

export default function App() {
  // Requirement 1: Welcome screen ("הגעתם לאתר של שרון לחץ כאן להמשיך")
  const [showWelcome, setShowWelcome] = useState<boolean>(true);

  // Active Menu Category: Pizza | Drinks | Desserts
  const [activeTab, setActiveTab] = useState<'pizza' | 'drinks' | 'desserts'>('pizza');

  // Shopping cart items state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Add Pizza to Cart
  const handleAddPizza = (pizza: CustomPizzaItem) => {
    setCartItems((prev) => [...prev, { type: 'pizza', data: pizza }]);
  };

  // Add Drink to Cart
  const handleAddDrink = (drink: CartDrinkItem) => {
    setCartItems((prev) => {
      // If already exists with same drinkId, increment
      const existingIdx = prev.findIndex(
        (item) => item.type === 'drink' && item.data.drinkId === drink.drinkId
      );
      if (existingIdx !== -1) {
        const copy = [...prev];
        const existing = copy[existingIdx] as { type: 'drink'; data: CartDrinkItem };
        copy[existingIdx] = {
          type: 'drink',
          data: {
            ...existing.data,
            quantity: existing.data.quantity + drink.quantity,
          },
        };
        return copy;
      }
      return [...prev, { type: 'drink', data: drink }];
    });
  };

  // Add Dessert to Cart
  const handleAddDessert = (dessert: CartDessertItem) => {
    setCartItems((prev) => {
      // If already exists with same dessertId, increment
      const existingIdx = prev.findIndex(
        (item) => item.type === 'dessert' && item.data.dessertId === dessert.dessertId
      );
      if (existingIdx !== -1) {
        const copy = [...prev];
        const existing = copy[existingIdx] as { type: 'dessert'; data: CartDessertItem };
        copy[existingIdx] = {
          type: 'dessert',
          data: {
            ...existing.data,
            quantity: existing.data.quantity + dessert.quantity,
          },
        };
        return copy;
      }
      return [...prev, { type: 'dessert', data: dessert }];
    });
  };

  // Cart item management
  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(index);
      return;
    }
    setCartItems((prev) => {
      const copy = [...prev];
      const target = copy[index];
      if (target) {
        copy[index] = {
          ...target,
          data: {
            ...target.data,
            quantity: newQty,
          },
        } as CartItem;
      }
      return copy;
    });
  };

  const handleRemoveItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Calculate cart badge counts and price
  const cartTotalCount = cartItems.reduce((acc, item) => acc + item.data.quantity, 0);
  const cartTotalPrice = cartItems.reduce(
    (acc, item) => acc + item.data.unitPrice * item.data.quantity,
    0
  );

  const TABS: { id: 'pizza' | 'drinks' | 'desserts'; label: string; shortLabel: string; icon: React.ElementType }[] = [
    { id: 'pizza', label: 'פיצות בהרכבה אישית', shortLabel: 'פיצות', icon: Pizza },
    { id: 'drinks', label: 'שתייה קרה', shortLabel: 'שתייה', icon: GlassWater },
    { id: 'desserts', label: 'קינוחים', shortLabel: 'קינוחים', icon: Cake },
  ];

  return (
    <div
      className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff7ed_0%,_#f8fafc_45%)] text-slate-800 flex flex-col font-['Rubik',sans-serif] selection:bg-red-600 selection:text-white"
      dir="rtl"
    >
      {/* 1. WELCOME SCREEN OVERLAY (Requirement 1) */}
      {showWelcome && (
        <WelcomeScreen onContinue={() => setShowWelcome(false)} />
      )}

      {/* TOP HEADER */}
      <Header
        cartCount={cartTotalCount}
        cartTotal={cartTotalPrice}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWelcome={() => setShowWelcome(true)}
      />

      {/* SINGLE CATEGORY NAVIGATION — sticky under the header, one source of truth */}
      <nav
        id="category-nav"
        aria-label="ניווט בין קטגוריות התפריט"
        className="sticky top-[60px] sm:top-[68px] z-20 bg-slate-50/90 backdrop-blur-md border-b border-slate-200"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-center gap-1.5 sm:gap-3 py-2.5 sm:py-3 overflow-x-auto">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  id={`tab-btn-${tab.id}`}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative shrink-0 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 ${
                    isActive
                      ? 'bg-red-600 text-white shadow-md shadow-red-200'
                      : 'bg-white text-slate-700 hover:bg-red-50 hover:text-red-700 border border-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="sm:hidden">{tab.shortLabel}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-36">
        {/* ACTIVE CONTENT VIEW */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {activeTab === 'pizza' && (
              <PizzaBuilder onAddToCart={handleAddPizza} />
            )}

            {activeTab === 'drinks' && (
              <DrinksSection onAddDrink={handleAddDrink} />
            )}

            {activeTab === 'desserts' && (
              <DessertsSection onAddDessert={handleAddDessert} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* FOOTER INFO */}
      <footer className="bg-white border-t border-slate-200 text-slate-500 text-xs py-8 px-4 sm:px-6 mb-24 sm:mb-20 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍕</span>
            <div>
              <span className="font-bold text-slate-800 text-sm">הפיצה של שרון</span>
              <p className="text-[11px] text-slate-400">{PIZZERIA_CONTACT.tagline}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-600">
            <span>{PIZZERIA_CONTACT.address}</span>
            <span>•</span>
            <span>{PIZZERIA_CONTACT.kosher}</span>
            <span>•</span>
            <span>טלפון: {PIZZERIA_CONTACT.phoneDisplay}</span>
          </div>
        </div>
      </footer>

      {/* FLOATING CONTACT ACTIONS: compact round buttons for WhatsApp large-orders,
          help/support info, and a direct call — small footprint so they never
          cover page content (add-to-cart button, toppings grid, etc). */}
      <StickyContactBars />

      {/* CART DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />
    </div>
  );
}
