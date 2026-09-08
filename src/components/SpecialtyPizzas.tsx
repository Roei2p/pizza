import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SPECIALTY_ITEMS } from '../data/menuData';
import { SpecialtyItem, CartSpecialtyItem } from '../types';
import { Plus, Minus, Check, ShoppingBag } from '../icons/coreui';
import { TiltCard } from './TiltCard';

interface SpecialtyPizzasProps {
  onAddSpecialty: (item: CartSpecialtyItem) => void;
}

export const SpecialtyPizzas: React.FC<SpecialtyPizzasProps> = ({ onAddSpecialty }) => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  const getQuantity = (id: string) => quantities[id] || 1;

  const updateQuantity = (id: string, delta: number) => {
    const current = getQuantity(id);
    const updated = Math.max(1, current + delta);
    setQuantities({ ...quantities, [id]: updated });
  };

  const handleAdd = (item: SpecialtyItem) => {
    const qty = getQuantity(item.id);
    const cartItem: CartSpecialtyItem = {
      id: `specialty-${item.id}-${Date.now()}`,
      specialtyId: item.id,
      name: item.name,
      unitPrice: item.price,
      quantity: qty,
      icon: item.icon,
    };

    onAddSpecialty(cartItem);

    setAddedItemIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [item.id]: false }));
    }, 1500);
  };

  return (
    <div id="specialty-pizzas-section" className="w-full mb-8" dir="rtl">
      <h3 className="font-bold text-lg text-slate-800 mb-3 flex items-center gap-2">
        <span>נשנושים ומנות צד</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SPECIALTY_ITEMS.map((item) => {
          const isAdded = !!addedItemIds[item.id];
          const qty = getQuantity(item.id);

          return (
            <TiltCard
              key={item.id}
              id={`specialty-card-${item.id}`}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-lg transition-shadow flex items-center gap-4"
            >
              <div className="w-16 h-16 shrink-0 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  item.icon
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-bold text-sm text-slate-800">{item.name}</h4>
                  {item.badge && (
                    <span className="shrink-0 bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mb-2 leading-relaxed">{item.description}</p>

                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-800 text-sm">₪{item.price}</span>

                  <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200 mr-auto">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-6 h-6 bg-white rounded-md flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-bold text-xs px-2 text-slate-800 min-w-[20px] text-center">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-6 h-6 bg-white rounded-md flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleAdd(item)}
                    className={`py-1.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                      isAdded
                        ? 'bg-green-600 text-white shadow-xs'
                        : 'bg-red-600 hover:bg-red-700 text-white shadow-xs'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>נוסף!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>הוסף</span>
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
