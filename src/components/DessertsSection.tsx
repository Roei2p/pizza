import React, { useState } from 'react';
import { motion } from 'motion/react';
import { DESSERTS_LIST } from '../data/menuData';
import { DessertItem, CartDessertItem } from '../types';
import { Plus, Minus, Check, ShoppingBag, Sparkles, Heart } from 'lucide-react';
import { TiltCard } from './TiltCard';

interface DessertsSectionProps {
  onAddDessert: (item: CartDessertItem) => void;
}

export const DessertsSection: React.FC<DessertsSectionProps> = ({ onAddDessert }) => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  const getQuantity = (id: string) => quantities[id] || 1;

  const updateQuantity = (id: string, delta: number) => {
    const current = getQuantity(id);
    const updated = Math.max(1, current + delta);
    setQuantities({ ...quantities, [id]: updated });
  };

  const handleAdd = (dessert: DessertItem) => {
    const qty = getQuantity(dessert.id);
    const cartDessert: CartDessertItem = {
      id: `dessert-${dessert.id}-${Date.now()}`,
      dessertId: dessert.id,
      name: dessert.name,
      unitPrice: dessert.price,
      quantity: qty,
      image: dessert.image,
    };

    onAddDessert(cartDessert);

    // Feedback
    setAddedItemIds((prev) => ({ ...prev, [dessert.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [dessert.id]: false }));
    }, 1500);
  };

  return (
    <div id="desserts-section" className="w-full" dir="rtl">
      {/* Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 border border-rose-200 rounded-full text-rose-700 text-xs font-bold mb-2">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>סיום מתוק ומפנק</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            אופציית קינוחים 🍰
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-1">
            מאפי שוקולד חמים מהתנור, קלצונה נוטלה מושחת, מלבי אסלי וגלידות משובחות.
          </p>
        </div>
      </div>

      {/* Desserts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {DESSERTS_LIST.map((dessert) => {
          const isAdded = !!addedItemIds[dessert.id];
          const qty = getQuantity(dessert.id);

          return (
            <TiltCard
              key={dessert.id}
              id={`dessert-card-${dessert.id}`}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-lg transition-shadow flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 w-full rounded-xl overflow-hidden mb-4 bg-slate-100">
                  <img
                    src={dessert.image}
                    alt={dessert.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {dessert.badge && (
                    <span className="absolute top-3 right-3 bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded-lg shadow-xs flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      {dessert.badge}
                    </span>
                  )}
                </div>

                <h3 className="font-black text-lg text-slate-800 mb-2 leading-snug">
                  {dessert.name}
                </h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  {dessert.description}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4 pt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-500 font-medium">מחיר מנה:</span>
                  <span className="font-black text-slate-800 text-xl">₪{dessert.price}</span>
                </div>

                <div className="flex items-center gap-2.5">
                  {/* Quantity */}
                  <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
                    <button
                      type="button"
                      onClick={() => updateQuantity(dessert.id, -1)}
                      className="w-8 h-8 bg-white rounded-md flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer text-xs"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-bold text-sm px-2.5 text-slate-800 min-w-[28px] text-center">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(dessert.id, 1)}
                      className="w-8 h-8 bg-white rounded-md flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer text-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Add Button */}
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleAdd(dessert)}
                    className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isAdded
                        ? 'bg-green-600 text-white shadow-xs'
                        : 'bg-red-600 hover:bg-red-700 text-white shadow-xs'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>נוסף בהצלחה!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>הוסף קינוח ({qty * dessert.price} ₪)</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </TiltCard>
          );
        })}
      </div>
    </div>
  );
};
