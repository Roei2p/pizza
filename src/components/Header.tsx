import React from 'react';
import { PIZZERIA_CONTACT } from '../data/menuData';
import { ShoppingBag, Pizza, GlassWater, Cake, Phone, MessageCircle } from 'lucide-react';

interface HeaderProps {
  activeTab: 'pizza' | 'drinks' | 'desserts';
  onTabChange: (tab: 'pizza' | 'drinks' | 'desserts') => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenWelcome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenWelcome,
}) => {
  return (
    <header
      id="main-header"
      className="sticky top-0 z-30 bg-red-700 text-white shadow-md shrink-0 border-b border-red-800"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo & Name */}
          <button
            type="button"
            onClick={onOpenWelcome}
            className="flex items-center gap-3 text-right group cursor-pointer focus:outline-none"
            title="לחץ לפתיחת מסך הפתיחה"
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-red-700 font-bold text-2xl shadow-sm group-hover:scale-105 transition-transform">
              ש
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-amber-100 transition-colors">
                  הפיצה של שרון
                </h1>
              </div>
              <p className="text-[11px] text-red-100/80 hidden sm:block font-medium">
                תנור אבן • בצק מותפח 48 שעות • {PIZZERIA_CONTACT.kosher}
              </p>
            </div>
          </button>

          {/* Center Tagline Pill from Professional Polish design */}
          <div className="hidden lg:flex items-center bg-red-800/60 px-4 py-2 rounded-xl border border-red-400/30">
            <p className="text-xs sm:text-sm text-red-100 italic">
              הגעתם לאתר של שרון! תתחילו להרכיב...
            </p>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 bg-red-800/70 p-1.5 rounded-2xl border border-red-600/50">
            <button
              id="tab-btn-pizza"
              type="button"
              onClick={() => onTabChange('pizza')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'pizza'
                  ? 'bg-white text-red-700 shadow-sm'
                  : 'text-red-100 hover:text-white hover:bg-red-700/60'
              }`}
            >
              <Pizza className="w-4 h-4" />
              <span>פיצות חמות</span>
            </button>

            <button
              id="tab-btn-drinks"
              type="button"
              onClick={() => onTabChange('drinks')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'drinks'
                  ? 'bg-white text-red-700 shadow-sm'
                  : 'text-red-100 hover:text-white hover:bg-red-700/60'
              }`}
            >
              <GlassWater className="w-4 h-4" />
              <span>שתייה קרה</span>
            </button>

            <button
              id="tab-btn-desserts"
              type="button"
              onClick={() => onTabChange('desserts')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'desserts'
                  ? 'bg-white text-red-700 shadow-sm'
                  : 'text-red-100 hover:text-white hover:bg-red-700/60'
              }`}
            >
              <Cake className="w-4 h-4" />
              <span>קינוחים</span>
            </button>
          </nav>

          {/* Right Area: Cart Button */}
          <div className="flex items-center gap-3">
            <button
              id="btn-open-cart"
              type="button"
              onClick={onOpenCart}
              className="flex items-center gap-2.5 bg-white hover:bg-red-50 text-red-700 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95 border border-red-200"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-red-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 text-white rounded-full text-[10px] font-black flex items-center justify-center shadow">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="flex flex-col items-start leading-tight">
                <span className="text-[10px] text-red-800/80 font-bold">הסל שלי</span>
                <span className="font-black text-sm text-red-700">₪{cartTotal}</span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden items-center justify-around gap-1.5 mt-3 pt-2.5 border-t border-red-600/60">
          <button
            type="button"
            onClick={() => onTabChange('pizza')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeTab === 'pizza'
                ? 'bg-white text-red-700 shadow-sm'
                : 'text-red-100 hover:text-white'
            }`}
          >
            <Pizza className="w-3.5 h-3.5" />
            <span>פיצות</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('drinks')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeTab === 'drinks'
                ? 'bg-white text-red-700 shadow-sm'
                : 'text-red-100 hover:text-white'
            }`}
          >
            <GlassWater className="w-3.5 h-3.5" />
            <span>שתייה</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('desserts')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeTab === 'desserts'
                ? 'bg-white text-red-700 shadow-sm'
                : 'text-red-100 hover:text-white'
            }`}
          >
            <Cake className="w-3.5 h-3.5" />
            <span>קינוחים</span>
          </button>
        </div>
      </div>
    </header>
  );
};
