import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PIZZA_SIZES,
  PIZZA_CRUSTS,
  TOPPINGS_LIST,
  DIETARY_OPTIONS,
} from '../data/menuData';
import {
  PizzaSizeId,
  CrustId,
  DietaryId,
  QuarterId,
  PortionMode,
  AppliedTopping,
  CustomPizzaItem,
} from '../types';
import { Check, Plus, Minus, Info, Sparkles, Trash2, PieChart, RotateCcw } from 'lucide-react';

interface PizzaBuilderProps {
  onAddToCart: (pizza: CustomPizzaItem) => void;
}

const TOPPING_CATEGORIES: { id: 'veggies' | 'cheese' | 'specials'; label: string; icon: string }[] = [
  { id: 'veggies', label: 'ירקות ותבלינים', icon: '🥬' },
  { id: 'cheese', label: 'גבינות', icon: '🧀' },
  { id: 'specials', label: 'תוספות מיוחדות', icon: '⭐' },
];

export const PizzaBuilder: React.FC<PizzaBuilderProps> = ({ onAddToCart }) => {
  const [dietary, setDietary] = useState<DietaryId>('regular');
  const [selectedSize, setSelectedSize] = useState<PizzaSizeId>('family');
  const [selectedCrust, setSelectedCrust] = useState<CrustId>('classic');
  const [sauce, setSauce] = useState<'classic_tomato' | 'spicy_tomato' | 'bianco_cream'>('classic_tomato');
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');

  // Selected portion mode for assigning toppings
  const [activePortionMode, setActivePortionMode] = useState<PortionMode>('whole');
  // Currently active quarters targeted for topping clicks
  const [activeQuarters, setActiveQuarters] = useState<QuarterId[]>([1, 2, 3, 4]);

  // List of applied toppings on this pizza
  const [appliedToppings, setAppliedToppings] = useState<AppliedTopping[]>([]);

  // Feedback state for added animation
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Handle setting portion preset
  const handleSetPortionMode = (mode: PortionMode) => {
    setActivePortionMode(mode);
    switch (mode) {
      case 'whole':
        setActiveQuarters([1, 2, 3, 4]);
        break;
      case 'half':
        setActiveQuarters([1, 2]); // First half
        break;
      case 'three_quarters':
        setActiveQuarters([1, 2, 3]); // Three quarters
        break;
      case 'quarter':
        setActiveQuarters([1]); // Single quarter
        break;
      case 'custom':
        break;
    }
  };

  // Toggle individual quarter click
  const toggleQuarter = (q: QuarterId) => {
    let updated: QuarterId[];
    if (activeQuarters.includes(q)) {
      if (activeQuarters.length === 1) {
        // keep at least 1
        return;
      }
      updated = activeQuarters.filter((item) => item !== q);
    } else {
      updated = [...activeQuarters, q].sort() as QuarterId[];
    }
    setActiveQuarters(updated);

    if (updated.length === 4) setActivePortionMode('whole');
    else if (updated.length === 2) setActivePortionMode('half');
    else if (updated.length === 3) setActivePortionMode('three_quarters');
    else if (updated.length === 1) setActivePortionMode('quarter');
    else setActivePortionMode('custom');
  };

  // Toggle a topping on the activeQuarters
  const toggleToppingOnActiveQuarters = (toppingId: string) => {
    const existingIndex = appliedToppings.findIndex((at) => at.toppingId === toppingId);

    if (existingIndex === -1) {
      // Add topping on active quarters
      setAppliedToppings([
        ...appliedToppings,
        { toppingId, quarters: [...activeQuarters] },
      ]);
    } else {
      const existing = appliedToppings[existingIndex];
      // Check if it already covers ALL activeQuarters
      const hasAllActive = activeQuarters.every((q) => existing.quarters.includes(q));

      if (hasAllActive) {
        // Remove active quarters from this topping
        const remainingQuarters = existing.quarters.filter(
          (q) => !activeQuarters.includes(q)
        );
        if (remainingQuarters.length === 0) {
          // Remove topping completely
          setAppliedToppings(appliedToppings.filter((at) => at.toppingId !== toppingId));
        } else {
          setAppliedToppings(
            appliedToppings.map((at, idx) =>
              idx === existingIndex ? { ...at, quarters: remainingQuarters } : at
            )
          );
        }
      } else {
        // Merge active quarters into this topping
        const combined = Array.from(new Set([...existing.quarters, ...activeQuarters])).sort() as QuarterId[];
        setAppliedToppings(
          appliedToppings.map((at, idx) =>
            idx === existingIndex ? { ...at, quarters: combined } : at
          )
        );
      }
    }
  };

  // Remove a topping completely
  const removeToppingCompletely = (toppingId: string) => {
    setAppliedToppings(appliedToppings.filter((at) => at.toppingId !== toppingId));
  };

  // Dietary variant (regular / vegan / gluten-free) — constrains which sizes,
  // crusts and toppings are offered, matching Sharon's real menu rules.
  const dietaryObj = DIETARY_OPTIONS.find((d) => d.id === dietary) || DIETARY_OPTIONS[0];
  const availableSizes = PIZZA_SIZES.filter((s) => dietaryObj.sizesAllowed.includes(s.id));
  const availableCrusts = dietary === 'vegan' ? PIZZA_CRUSTS.filter((c) => c.id !== 'cheese_crust') : PIZZA_CRUSTS;
  const availableToppings = dietary === 'vegan' ? TOPPINGS_LIST.filter((t) => t.vegan) : TOPPINGS_LIST;

  const handleSetDietary = (id: typeof dietary) => {
    setDietary(id);
    const newDietaryObj = DIETARY_OPTIONS.find((d) => d.id === id)!;

    // Gluten-free is personal-size-only with a fixed classic-style dough.
    if (id === 'gluten_free') {
      if (!newDietaryObj.sizesAllowed.includes(selectedSize)) setSelectedSize('personal');
      setSelectedCrust('classic');
    }

    // Vegan drops the cheese-stuffed crust and any non-vegan toppings already applied.
    if (id === 'vegan') {
      if (selectedCrust === 'cheese_crust') setSelectedCrust('classic');
      setAppliedToppings((prev) =>
        prev.filter((at) => TOPPINGS_LIST.find((t) => t.id === at.toppingId)?.vegan)
      );
    }
  };

  // Calculate Unit Price
  const sizeObj = availableSizes.find((s) => s.id === selectedSize) || availableSizes[0];
  const crustObj = availableCrusts.find((c) => c.id === selectedCrust) || availableCrusts[0];

  const toppingsPrice = appliedToppings.reduce((acc, item) => {
    const toppingData = TOPPINGS_LIST.find((t) => t.id === item.toppingId);
    if (!toppingData) return acc;
    // If covers all 4 quarters, charge priceWhole, else pricePerQuarter * quarters.length
    if (item.quarters.length === 4) {
      return acc + toppingData.priceWhole;
    } else {
      return acc + toppingData.pricePerQuarter * item.quarters.length;
    }
  }, 0);

  const unitPrice = sizeObj.basePrice + dietaryObj.extraPrice + crustObj.extraPrice + toppingsPrice;
  const totalPrice = unitPrice * quantity;

  // Add to cart action
  const handleAddToCart = () => {
    const newPizza: CustomPizzaItem = {
      id: `pizza-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      size: selectedSize,
      crust: selectedCrust,
      dietary,
      sauce,
      appliedToppings: [...appliedToppings],
      quantity,
      notes: notes.trim() || undefined,
      unitPrice,
    };

    onAddToCart(newPizza);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  // Reset toppings
  const handleResetToppings = () => {
    setAppliedToppings([]);
  };

  // Portion label helper
  const getPortionLabel = (quarters: QuarterId[]) => {
    if (quarters.length === 4) return 'כל הפיצה (שלם)';
    if (quarters.length === 3) return '3/4 פיצה (3 רבעים)';
    if (quarters.length === 2) return 'חצי פיצה (1/2)';
    if (quarters.length === 1) return `רבע פיצה (רבע מס׳ ${quarters[0]})`;
    return `${quarters.length} רבעים (${quarters.join(', ')})`;
  };

  return (
    <div id="pizza-builder-section" className="w-full" dir="rtl">
      {/* Header Banner - cinematic photo backdrop matching the welcome hero */}
      <div
        className="relative overflow-hidden rounded-2xl mb-8 shadow-lg bg-slate-900 bg-cover bg-center"
        style={{ backgroundImage: `url('${import.meta.env.BASE_URL}assets/hero-pizza-poster.jpg')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/75 to-slate-950/40" />
        <div className="relative p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-amber-100 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>התאמה אישית מלאה לפי רבעים ומשולשים</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-lg">
              הרכבת הפיצה שלך 🍕
            </h2>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed mt-1 max-w-xl">
              בחרו את כמות הפיצות, גודל המגש, וסוג הבצק. תוכלו לחלק את התוספות לפי רבע, חצי, 3/4 או פיצה שלמה – ולבחור מספר תוספות באותו המשולש!
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shrink-0">
            <span className="text-sm font-bold text-white/90">כמות פיצות:</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-slate-700 font-bold hover:bg-slate-100 shadow-xs text-xs cursor-pointer"
              >
                -
              </button>
              <span className="w-8 text-center font-black text-white text-base">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-slate-700 font-bold hover:bg-slate-100 shadow-xs text-xs cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT / CENTER COLUMN: Step-by-step Builder Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* DIETARY VARIANT SELECTOR */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-lg text-slate-800 mb-3">סוג הפיצה</h3>
            <div className="grid grid-cols-3 gap-2.5">
              {DIETARY_OPTIONS.map((opt) => {
                const isSelected = dietary === opt.id;
                return (
                  <button
                    key={opt.id}
                    id={`btn-dietary-${opt.id}`}
                    type="button"
                    onClick={() => handleSetDietary(opt.id)}
                    className={`p-3 rounded-xl text-center transition-all text-xs cursor-pointer ${
                      isSelected
                        ? 'border-2 border-red-600 bg-red-50 font-bold text-red-700 shadow-sm'
                        : 'border border-slate-200 hover:border-slate-300 text-slate-700 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-lg mb-1">{opt.icon}</div>
                    <div className="font-bold text-slate-800">{opt.name}</div>
                    {opt.extraPrice > 0 && (
                      <div className="text-[10px] text-red-700 font-bold mt-0.5">+₪{opt.extraPrice}</div>
                    )}
                  </button>
                );
              })}
            </div>
            {dietary === 'gluten_free' && (
              <div className="mt-3 flex items-start gap-1.5 text-[11px] text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-2.5">
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>פיצה ללא גלוטן זמינה בגודל אישי בלבד, עם בצק ייעודי קבוע (ללא שדרוג שוליים).</span>
              </div>
            )}
            {dietary === 'vegan' && (
              <div className="mt-3 flex items-start gap-1.5 text-[11px] text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-2.5">
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>בגרסה הטבעונית לא זמינים שוליים ממולאים בגבינה, וכן תוספות המכילות מוצרי חלב או דגים.</span>
              </div>
            )}
          </div>

          {/* STEP 1: SIZE SELECTION */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-red-600 text-white font-bold text-sm flex items-center justify-center">
                  1
                </span>
                <h3 className="font-bold text-lg text-slate-800">בחירת גודל הפיצה</h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">כולל בצק טרי ורוטב</span>
            </div>

            <div className={`grid grid-cols-1 gap-3 ${availableSizes.length > 1 ? 'sm:grid-cols-3' : 'sm:max-w-xs'}`}>
              {availableSizes.map((size) => {
                const isSelected = selectedSize === size.id;
                return (
                  <button
                    key={size.id}
                    id={`btn-size-${size.id}`}
                    type="button"
                    onClick={() => setSelectedSize(size.id)}
                    className={`relative p-4 rounded-xl text-right transition-all flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-2 border-red-600 bg-red-50 text-red-700 font-bold shadow-sm'
                        : 'border border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {size.popular && (
                      <span className="absolute -top-2.5 left-3 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                        הכי נמכר 🔥
                      </span>
                    )}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-800 text-sm">{size.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-red-600" />}
                      </div>
                      <p className="text-xs text-slate-500 mb-2 font-normal">
                        {size.slices} משולשים • קוטר {size.diameter}
                      </p>
                    </div>
                    <div className="font-black text-red-700 text-base">
                      ₪{size.basePrice}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: CRUST & SAUCE */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-red-600 text-white font-bold text-sm flex items-center justify-center">
                  2
                </span>
                <h3 className="font-bold text-lg text-slate-800">סוג הבצק והרוטב</h3>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">
                  סוג הבצק:
                </label>
                {dietary === 'gluten_free' ? (
                  <div className="p-3 rounded-xl border-2 border-red-600 bg-red-50 text-xs">
                    <span className="font-bold text-slate-800">בצק ייעודי ללא גלוטן</span>
                    <p className="text-[10px] text-slate-500 font-normal mt-1">
                      נאפה בציוד נפרד ככל האפשר, אך המטבח אינו סטרילי לחלוטין
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {availableCrusts.map((crust) => {
                      const isSelected = selectedCrust === crust.id;
                      return (
                        <button
                          key={crust.id}
                          id={`btn-crust-${crust.id}`}
                          type="button"
                          onClick={() => setSelectedCrust(crust.id)}
                          className={`p-3 rounded-xl text-right transition-all text-xs cursor-pointer ${
                            isSelected
                              ? 'border-2 border-red-600 bg-red-50 font-bold text-red-700 shadow-sm'
                              : 'border border-slate-200 hover:border-slate-300 text-slate-700 bg-white hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-slate-800">{crust.name}</span>
                            {crust.extraPrice > 0 && (
                              <span className="text-red-700 font-extrabold text-[11px]">
                                +₪{crust.extraPrice}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 font-normal line-clamp-2">
                            {crust.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">
                  בסיס רוטב:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSauce('classic_tomato')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      sauce === 'classic_tomato'
                        ? 'bg-red-50 text-red-700 border-2 border-red-600 shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    🥫 עגבניות קלאסי
                  </button>
                  <button
                    type="button"
                    onClick={() => setSauce('spicy_tomato')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      sauce === 'spicy_tomato'
                        ? 'bg-red-50 text-red-700 border-2 border-red-600 shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    🌶️ עגבניות פיקנטי
                  </button>
                  <button
                    type="button"
                    onClick={() => setSauce('bianco_cream')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      sauce === 'bianco_cream'
                        ? 'bg-red-50 text-red-700 border-2 border-red-600 shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    🥛 רוטב ביאנקו (שמנת)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 3: FRACTION SELECTOR & TOPPINGS (USER REQUIREMENT 2) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-red-600 text-white font-bold text-sm flex items-center justify-center">
                  3
                </span>
                <h3 className="font-bold text-lg text-slate-800">
                  1. בחר גודל משולשים (כיסוי הפיצה)
                </h3>
              </div>
              {appliedToppings.length > 0 && (
                <button
                  type="button"
                  onClick={handleResetToppings}
                  className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 font-bold cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  נקה תוספות
                </button>
              )}
            </div>

            {/* Coverage fraction buttons: שלם, חצי, שלושת רבעי, רבע */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <PieChart className="w-4 h-4 text-red-600" />
                  בחרו באיזה חלק של הפיצה תרצו לשים את התוספות:
                </span>
                <span className="text-[11px] font-bold text-slate-600 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full">
                  נבחרו: {activeQuarters.length} מתוך 4 רבעים
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  id="btn-portion-whole"
                  onClick={() => handleSetPortionMode('whole')}
                  className={`p-3 rounded-xl text-center font-bold text-sm transition-all cursor-pointer ${
                    activePortionMode === 'whole'
                      ? 'border-2 border-red-600 bg-red-50 text-red-700 shadow-sm'
                      : 'border border-slate-200 bg-white text-slate-700 hover:border-red-400'
                  }`}
                >
                  שלם (4 רבעים)
                </button>

                <button
                  type="button"
                  id="btn-portion-half"
                  onClick={() => handleSetPortionMode('half')}
                  className={`p-3 rounded-xl text-center font-bold text-sm transition-all cursor-pointer ${
                    activePortionMode === 'half'
                      ? 'border-2 border-red-600 bg-red-50 text-red-700 shadow-sm'
                      : 'border border-slate-200 bg-white text-slate-700 hover:border-red-400'
                  }`}
                >
                  חצי פיצה (2 רבעים)
                </button>

                <button
                  type="button"
                  id="btn-portion-three-quarters"
                  onClick={() => handleSetPortionMode('three_quarters')}
                  className={`p-3 rounded-xl text-center font-bold text-sm transition-all cursor-pointer ${
                    activePortionMode === 'three_quarters'
                      ? 'border-2 border-red-600 bg-red-50 text-red-700 shadow-sm'
                      : 'border border-slate-200 bg-white text-slate-700 hover:border-red-400'
                  }`}
                >
                  שלושת רבעי (3 רבעים)
                </button>

                <button
                  type="button"
                  id="btn-portion-quarter"
                  onClick={() => handleSetPortionMode('quarter')}
                  className={`p-3 rounded-xl text-center font-bold text-sm transition-all cursor-pointer ${
                    activePortionMode === 'quarter'
                      ? 'border-2 border-red-600 bg-red-50 text-red-700 shadow-sm'
                      : 'border border-slate-200 bg-white text-slate-700 hover:border-red-400'
                  }`}
                >
                  רבע פיצה
                </button>
              </div>

              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-600">
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>
                  ניתן לבחור <strong>כמה תוספות שרוצים</strong> באותם המשולשים!
                </span>
              </div>
            </div>

            {/* Toppings Grid with multi-select on the active portion, grouped by category */}
            <div className="space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h4 className="font-bold text-slate-700 text-sm">
                  2. הוסף תוספות למשולשים שבחרת ({getPortionLabel(activeQuarters)}):
                </h4>
                <div className="flex items-center gap-3 text-[10px] text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-red-600 inline-block" /> על כל המשולשים שנבחרו
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" /> על חלק מהם
                  </span>
                </div>
              </div>

              {TOPPING_CATEGORIES.map((cat) => {
                const items = availableToppings.filter((t) => t.category === cat.id);
                if (items.length === 0) return null;
                return (
                  <div key={cat.id}>
                    <h5 className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1.5">
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </h5>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {items.map((topping) => {
                        const applied = appliedToppings.find((at) => at.toppingId === topping.id);
                        const isFullyOnActive =
                          applied && activeQuarters.every((q) => applied.quarters.includes(q));
                        const isPartiallyOnActive =
                          applied && activeQuarters.some((q) => applied.quarters.includes(q));

                        return (
                          <button
                            key={topping.id}
                            id={`btn-topping-${topping.id}`}
                            type="button"
                            onClick={() => toggleToppingOnActiveQuarters(topping.id)}
                            aria-pressed={!!isFullyOnActive}
                            className={`p-2.5 rounded-xl text-right transition-all border flex flex-col justify-between cursor-pointer group relative focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 ${
                              isFullyOnActive
                                ? 'border-2 border-red-600 bg-red-50 text-red-700 shadow-sm'
                                : isPartiallyOnActive
                                ? 'border border-amber-400 bg-amber-50/50 text-slate-800'
                                : 'border-slate-200 hover:bg-slate-50 bg-white text-slate-700 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1 mb-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-lg">{topping.icon}</span>
                                <span className="font-bold text-xs leading-tight text-slate-800">
                                  {topping.name}
                                </span>
                              </div>
                              {isFullyOnActive ? (
                                <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-xs shrink-0 font-bold">
                                  ✓
                                </span>
                              ) : isPartiallyOnActive ? (
                                <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                                  ½
                                </span>
                              ) : (
                                <span className="w-5 h-5 rounded-full border border-slate-300 group-hover:border-slate-400 text-slate-400 flex items-center justify-center text-xs shrink-0">
                                  +
                                </span>
                              )}
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                              <span>₪{topping.priceWhole} שלם</span>
                              <span>₪{topping.pricePerQuarter} לרבע</span>
                            </div>

                            {applied && (
                              <div className="mt-1.5 pt-1 border-t border-slate-200 text-[10px] text-red-700 font-bold flex items-center justify-between">
                                <span>{getPortionLabel(applied.quarters)}</span>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Currently Applied Toppings Summary list */}
            {appliedToppings.length > 0 && (
              <div className="mt-5 pt-4 border-t border-slate-200">
                <span className="block text-xs font-bold text-slate-700 mb-2">
                  תוספות שנבחרו לפיצה זו ({appliedToppings.length}):
                </span>
                <div className="flex flex-wrap gap-2">
                  {appliedToppings.map((at) => {
                    const toppingData = TOPPINGS_LIST.find((t) => t.id === at.toppingId);
                    if (!toppingData) return null;
                    return (
                      <div
                        key={at.toppingId}
                        className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg text-xs text-slate-800"
                      >
                        <span>{toppingData.icon}</span>
                        <span className="font-bold">{toppingData.name}</span>
                        <span className="text-[10px] bg-white border border-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                          {getPortionLabel(at.quarters)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeToppingCompletely(at.toppingId)}
                          className="text-slate-400 hover:text-red-600 p-0.5 rounded transition-colors"
                          title="הסר תוספת זו"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* STEP 4: NOTES */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <label className="block font-bold text-sm text-slate-800 mb-2">
              הערות לשף הפיצה (אופציונלי):
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="לדוגמה: לאפות קריספי, לחתוך למשולשים קטנים, לשים תבלין פיצה בצד..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500"
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Pizza Slice Visualizer & Add To Cart Summary */}
        <div className="lg:col-span-5 sticky top-24 space-y-6">
          {/* Visual Interactive Pizza Board - Professional Polish Style */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-slate-800">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-black text-base text-slate-800 flex items-center gap-1.5">
                  <span>הדמיית הפיצה שלך</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  לחצו על רבע ישירות במעגל כדי לבחור או להסיר אותו
                </p>
              </div>
              <span className="text-xs bg-red-50 text-red-700 font-bold px-2.5 py-1 rounded-full border border-red-200">
                {dietary !== 'regular' && `${dietaryObj.icon} `}{sizeObj.name}
              </span>
            </div>

            {/* Circular Pizza Interactive Diagram as in Design HTML */}
            <div className="relative w-64 h-64 mx-auto my-6 bg-amber-50 border-4 border-dashed border-amber-200 rounded-full flex items-center justify-center">
              {/* Crossed lines across quarters */}
              <div className="absolute w-full h-[1px] bg-amber-200 rotate-45 pointer-events-none"></div>
              <div className="absolute w-full h-[1px] bg-amber-200 -rotate-45 pointer-events-none"></div>

              {/* Quarter Labels around the circle matching Design HTML */}
              <div className="absolute -top-3.5 bg-white px-2.5 py-0.5 border border-slate-200 rounded-md text-[11px] font-bold text-slate-700 shadow-xs">
                רבע 1 (ימין מעלה)
              </div>
              <div className="absolute -left-3.5 bg-white px-2.5 py-0.5 border border-slate-200 rounded-md text-[11px] font-bold text-slate-700 shadow-xs">
                רבע 2 (שמאל)
              </div>
              <div className="absolute -bottom-3.5 bg-white px-2.5 py-0.5 border border-slate-200 rounded-md text-[11px] font-bold text-slate-700 shadow-xs">
                רבע 3 (תחתון)
              </div>
              <div className="absolute -right-3.5 bg-white px-2.5 py-0.5 border border-slate-200 rounded-md text-[11px] font-bold text-slate-700 shadow-xs">
                רבע 4 (ימין)
              </div>

              {/* Inner Pizza Disc */}
              <div className="w-52 h-52 bg-gradient-to-tr from-orange-400 to-yellow-300 rounded-full shadow-inner border-4 border-orange-600 flex items-center justify-center overflow-hidden relative">
                {/* 4 Clickable Quarters */}
                {/* Q1: Top Right */}
                <button
                  type="button"
                  onClick={() => toggleQuarter(1)}
                  className={`absolute top-0 right-0 w-1/2 h-1/2 cursor-pointer transition-all flex flex-col items-center justify-center p-1 group border-b border-l border-orange-600/40 ${
                    activeQuarters.includes(1)
                      ? 'bg-red-600/30 ring-2 ring-red-600/70'
                      : 'hover:bg-white/20'
                  }`}
                  title="רבע 1"
                >
                  <span className="text-[9px] font-black bg-white/90 text-slate-800 px-1.5 py-0.5 rounded shadow-xs mb-1">
                    רבע 1 {activeQuarters.includes(1) && '✓'}
                  </span>
                  <div className="flex flex-wrap items-center justify-center gap-0.5 max-w-[65px]">
                    {appliedToppings
                      .filter((at) => at.quarters.includes(1))
                      .map((at) => {
                        const t = TOPPINGS_LIST.find((x) => x.id === at.toppingId);
                        return (
                          <span key={at.toppingId} className="text-sm drop-shadow">
                            {t?.icon}
                          </span>
                        );
                      })}
                  </div>
                </button>

                {/* Q2: Top Left */}
                <button
                  type="button"
                  onClick={() => toggleQuarter(2)}
                  className={`absolute top-0 left-0 w-1/2 h-1/2 cursor-pointer transition-all flex flex-col items-center justify-center p-1 group border-b border-r border-orange-600/40 ${
                    activeQuarters.includes(2)
                      ? 'bg-red-600/30 ring-2 ring-red-600/70'
                      : 'hover:bg-white/20'
                  }`}
                  title="רבע 2"
                >
                  <span className="text-[9px] font-black bg-white/90 text-slate-800 px-1.5 py-0.5 rounded shadow-xs mb-1">
                    רבע 2 {activeQuarters.includes(2) && '✓'}
                  </span>
                  <div className="flex flex-wrap items-center justify-center gap-0.5 max-w-[65px]">
                    {appliedToppings
                      .filter((at) => at.quarters.includes(2))
                      .map((at) => {
                        const t = TOPPINGS_LIST.find((x) => x.id === at.toppingId);
                        return (
                          <span key={at.toppingId} className="text-sm drop-shadow">
                            {t?.icon}
                          </span>
                        );
                      })}
                  </div>
                </button>

                {/* Q3: Bottom Left */}
                <button
                  type="button"
                  onClick={() => toggleQuarter(3)}
                  className={`absolute bottom-0 left-0 w-1/2 h-1/2 cursor-pointer transition-all flex flex-col items-center justify-center p-1 group border-t border-r border-orange-600/40 ${
                    activeQuarters.includes(3)
                      ? 'bg-red-600/30 ring-2 ring-red-600/70'
                      : 'hover:bg-white/20'
                  }`}
                  title="רבע 3"
                >
                  <span className="text-[9px] font-black bg-white/90 text-slate-800 px-1.5 py-0.5 rounded shadow-xs mb-1">
                    רבע 3 {activeQuarters.includes(3) && '✓'}
                  </span>
                  <div className="flex flex-wrap items-center justify-center gap-0.5 max-w-[65px]">
                    {appliedToppings
                      .filter((at) => at.quarters.includes(3))
                      .map((at) => {
                        const t = TOPPINGS_LIST.find((x) => x.id === at.toppingId);
                        return (
                          <span key={at.toppingId} className="text-sm drop-shadow">
                            {t?.icon}
                          </span>
                        );
                      })}
                  </div>
                </button>

                {/* Q4: Bottom Right */}
                <button
                  type="button"
                  onClick={() => toggleQuarter(4)}
                  className={`absolute bottom-0 right-0 w-1/2 h-1/2 cursor-pointer transition-all flex flex-col items-center justify-center p-1 group border-t border-l border-orange-600/40 ${
                    activeQuarters.includes(4)
                      ? 'bg-red-600/30 ring-2 ring-red-600/70'
                      : 'hover:bg-white/20'
                  }`}
                  title="רבע 4"
                >
                  <span className="text-[9px] font-black bg-white/90 text-slate-800 px-1.5 py-0.5 rounded shadow-xs mb-1">
                    רבע 4 {activeQuarters.includes(4) && '✓'}
                  </span>
                  <div className="flex flex-wrap items-center justify-center gap-0.5 max-w-[65px]">
                    {appliedToppings
                      .filter((at) => at.quarters.includes(4))
                      .map((at) => {
                        const t = TOPPINGS_LIST.find((x) => x.id === at.toppingId);
                        return (
                          <span key={at.toppingId} className="text-sm drop-shadow">
                            {t?.icon}
                          </span>
                        );
                      })}
                  </div>
                </button>
              </div>
            </div>

            {/* Selection Guidance */}
            <div className="mt-3 text-center">
              <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                חלק נבחר כרגע: {getPortionLabel(activeQuarters)}
              </span>
            </div>
          </div>

          {/* ADD TO CART & QUANTITY CARD */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h4 className="font-black text-slate-800 mb-3 text-base border-b border-slate-100 pb-2">
              סיכום פיצה זו
            </h4>

            {/* Price breakdown */}
            <div className="space-y-2 text-xs text-slate-600 border-b border-slate-200 pb-3 mb-4">
              <div className="flex justify-between">
                <span>{sizeObj.name}</span>
                <span className="font-bold text-slate-800">₪{sizeObj.basePrice}</span>
              </div>
              {dietaryObj.extraPrice > 0 && (
                <div className="flex justify-between">
                  <span>{dietaryObj.icon} {dietaryObj.name}</span>
                  <span className="font-bold text-slate-800">+₪{dietaryObj.extraPrice}</span>
                </div>
              )}
              {crustObj.extraPrice > 0 && (
                <div className="flex justify-between">
                  <span>{crustObj.name}</span>
                  <span className="font-bold text-slate-800">+₪{crustObj.extraPrice}</span>
                </div>
              )}
              {toppingsPrice > 0 && (
                <div className="flex justify-between text-red-700 font-bold">
                  <span>תוספות ({appliedToppings.length})</span>
                  <span>+₪{toppingsPrice}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-800 font-black pt-2 text-base border-t border-slate-100">
                <span>מחיר לפיצה בודדת:</span>
                <span className="text-red-700">₪{unitPrice}</span>
              </div>
            </div>

            {/* Quantity Selector ("נגיד הלקוח בחר שתיים...") */}
            <div className="flex items-center justify-between mb-5 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-700">
                כמות פיצות בהרכב זה:
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  id="btn-pizza-qty-minus"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 flex items-center justify-center text-slate-700 font-bold transition-all"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-black text-slate-800 text-base min-w-[20px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  id="btn-pizza-qty-plus"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 flex items-center justify-center text-slate-700 font-bold transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Big Action Button */}
            <motion.button
              id="btn-add-pizza-to-cart"
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className={`w-full py-3.5 px-6 rounded-xl font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                addedAnimation
                  ? 'bg-green-600 text-white shadow-green-600/30'
                  : 'bg-red-600 hover:bg-red-700 text-white shadow-red-200 shadow-md'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>הפיצה נוספה לעגלה בהצלחה!</span>
                </>
              ) : (
                <>
                  <span>הוסף {quantity > 1 ? `${quantity} פיצות` : 'פיצה'} לעגלה</span>
                  <span>•</span>
                  <span>₪{totalPrice}</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};
