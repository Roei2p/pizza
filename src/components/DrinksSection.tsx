import React, { useState } from 'react';
import { motion } from 'motion/react';
import { DRINKS_LIST } from '../data/menuData';
import { DrinkItem, CartDrinkItem } from '../types';
import { Plus, Minus, Check, ShoppingBag, Sparkles } from '../icons/coreui';
import { TiltCard } from './TiltCard';

interface DrinksSectionProps {
  onAddDrink: (item: CartDrinkItem) => void;
}

export const DrinksSection: React.FC<DrinksSectionProps> = ({ onAddDrink }) => {
  const [filter, setFilter] = useState<'all' | '1.5l' | 'can' | 'zero'>('all');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  const filteredDrinks = DRINKS_LIST.filter((drink) => {
    if (filter === '1.5l') return drink.sizeVolume.includes('1.5');
    if (filter === 'can') return drink.sizeVolume.includes('330');
    if (filter === 'zero') return drink.category === 'zero';
    return true;
  });

  const getQuantity = (id: string) => quantities[id] || 1;

  const updateQuantity = (id: string, delta: number) => {
    const current = getQuantity(id);
    const updated = Math.max(1, current + delta);
    setQuantities({ ...quantities, [id]: updated });
  };

  const handleAdd = (drink: DrinkItem) => {
    const qty = getQuantity(drink.id);
    const cartDrink: CartDrinkItem = {
      id: `drink-${drink.id}-${Date.now()}`,
      drinkId: drink.id,
      name: drink.name,
      sizeVolume: drink.sizeVolume,
      unitPrice: drink.price,
      quantity: qty,
      image: drink.image,
    };

    onAddDrink(cartDrink);

    // Flash added feedback
    setAddedItemIds((prev) => ({ ...prev, [drink.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [drink.id]: false }));
    }, 1500);
  };

  return (
    <div id="drinks-section" className="w-full" dir="rtl">
      {/* Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>שתייה קרה וצוננת</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            אופציית השתייה 🥤
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-1">
            משקאות מוגזים צוננים, מים מינרליים, משקאות ללא סוכר ובקבוקים משפחתיים להשלמת חוויית הפיצה.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'all'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          כל המשקאות ({DRINKS_LIST.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('1.5l')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === '1.5l'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          בקבוקים 1.5 ליטר
        </button>
        <button
          type="button"
          onClick={() => setFilter('can')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'can'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          פחיות אישיות (330 מ״ל)
        </button>
        <button
          type="button"
          onClick={() => setFilter('zero')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'zero'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          ללא סוכר (זירו)
        </button>
      </div>

      {/* Drinks Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredDrinks.map((drink) => {
          const isAdded = !!addedItemIds[drink.id];
          const qty = getQuantity(drink.id);

          return (
            <TiltCard
              key={drink.id}
              id={`drink-card-${drink.id}`}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-lg transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="relative h-40 w-full rounded-xl overflow-hidden mb-3 bg-slate-100">
                  <img
                    src={drink.image}
                    alt={drink.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <span className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
                    {drink.sizeVolume}
                  </span>
                  {drink.category === 'zero' && (
                    <span className="absolute bottom-2 right-2 bg-slate-900 text-amber-400 text-[10px] font-black px-2 py-0.5 rounded-md border border-amber-400/30">
                      ZERO סוכר
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-base text-slate-800 mb-1">{drink.name}</h3>
                <p className="text-xs text-slate-500 mb-3 line-clamp-2">{drink.description}</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3 pt-2 border-t border-slate-100">
                  <span className="text-xs text-slate-500 font-medium">מחיר ליחידה:</span>
                  <span className="font-black text-slate-800 text-lg">₪{drink.price}</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Quantity */}
                  <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
                    <button
                      type="button"
                      onClick={() => updateQuantity(drink.id, -1)}
                      className="w-7 h-7 bg-white rounded-md flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer text-xs"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-bold text-xs px-2 text-slate-800 min-w-[24px] text-center">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(drink.id, 1)}
                      className="w-7 h-7 bg-white rounded-md flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer text-xs"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Add Button */}
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleAdd(drink)}
                    className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isAdded
                        ? 'bg-green-600 text-white shadow-xs'
                        : 'bg-red-600 hover:bg-red-700 text-white shadow-xs'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>נוסף!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>הוסף ({qty * drink.price} ₪)</span>
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
