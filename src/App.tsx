import React, { useState } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Header } from './components/Header';
import { PizzaBuilder } from './components/PizzaBuilder';
import { DrinksSection } from './components/DrinksSection';
import { DessertsSection } from './components/DessertsSection';
import { CartDrawer } from './components/CartDrawer';
import { StickyContactBars } from './components/StickyContactBars';
import { CartItem, CustomPizzaItem, CartDrinkItem, CartDessertItem } from './types';
import { PIZZERIA_CONTACT } from './data/menuData';
import { Pizza, GlassWater, Cake, Phone, Clock, MapPin, Sparkles, Award } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-['Rubik',sans-serif] selection:bg-red-600 selection:text-white" dir="rtl">
      {/* 1. WELCOME SCREEN OVERLAY (Requirement 1) */}
      {showWelcome && (
        <WelcomeScreen onContinue={() => setShowWelcome(false)} />
      )}

      {/* TOP HEADER */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        cartCount={cartTotalCount}
        cartTotal={cartTotalPrice}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWelcome={() => setShowWelcome(true)}
      />

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-36">
        {/* Category Navigation Pills */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8">
          <button
            type="button"
            onClick={() => setActiveTab('pizza')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'pizza'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Pizza className="w-4 h-4" />
            <span>פיצות בהרכבה אישית</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('drinks')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'drinks'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <GlassWater className="w-4 h-4" />
            <span>אופציית השתייה</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('desserts')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'desserts'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Cake className="w-4 h-4" />
            <span>אופציית קינוחים</span>
          </button>
        </div>

        {/* ACTIVE CONTENT VIEW */}
        {activeTab === 'pizza' && (
          <PizzaBuilder onAddToCart={handleAddPizza} />
        )}

        {activeTab === 'drinks' && (
          <DrinksSection onAddDrink={handleAddDrink} />
        )}

        {activeTab === 'desserts' && (
          <DessertsSection onAddDessert={handleAddDessert} />
        )}
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

      {/* 5 & 6. STICKY ACTIONS:
          - Bottom Right: Large Orders to Sharon's WhatsApp (אירועים לכמה ימים קדימה)
          - Bottom Left: Help & Call Pizzeria Phone Number
      */}
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
