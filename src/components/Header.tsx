import React from 'react';
import { PIZZERIA_CONTACT } from '../data/menuData';
import { ShoppingBag } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenWelcome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenWelcome,
}) => {
  return (
    <header
      id="main-header"
      className="sticky top-0 z-30 bg-gradient-to-l from-red-700 via-red-700 to-red-800 text-white shadow-md shrink-0 border-b border-red-900/40"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo & Name */}
          <button
            type="button"
            onClick={onOpenWelcome}
            className="flex items-center gap-3 text-right group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-xl -m-1 p-1"
            title="לחץ לפתיחת מסך הפתיחה"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center text-red-700 font-bold text-2xl shadow-sm group-hover:scale-105 transition-transform">
              ש
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-black tracking-tight text-white group-hover:text-amber-100 transition-colors">
                הפיצה של שרון
              </h1>
              <p className="text-[11px] text-red-100/80 hidden sm:block font-medium">
                תנור אבן • בצק מותפח 48 שעות • {PIZZERIA_CONTACT.kosher}
              </p>
            </div>
          </button>

          {/* Right Area: Cart Button */}
          <button
            id="btn-open-cart"
            type="button"
            onClick={onOpenCart}
            aria-label={`פתיחת העגלה, ${cartCount} פריטים, סה״כ ${cartTotal} שקלים`}
            className="flex items-center gap-2.5 bg-white hover:bg-red-50 text-red-700 px-3.5 sm:px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95 border border-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
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
    </header>
  );
};
