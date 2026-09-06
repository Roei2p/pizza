import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, CustomPizzaItem, QuarterId } from '../types';
import { PIZZERIA_CONTACT, PIZZA_SIZES, PIZZA_CRUSTS, TOPPINGS_LIST, DIETARY_OPTIONS } from '../data/menuData';
import { X, Trash2, Plus, Minus, ShoppingBag, Send, PhoneCall, Check, MapPin, User, MessageCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [notes, setNotes] = useState('');
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ name?: boolean; phone?: boolean }>({});

  // Portion label helper for cart
  const getPortionLabel = (quarters: QuarterId[]) => {
    if (quarters.length === 4) return 'כל הפיצה';
    if (quarters.length === 3) return '3/4 פיצה';
    if (quarters.length === 2) return 'חצי פיצה';
    if (quarters.length === 1) return `רבע ${quarters[0]}`;
    return `${quarters.length} רבעים`;
  };

  // Subtotal calculation
  const subtotal = cartItems.reduce((acc, item) => acc + item.data.unitPrice * item.data.quantity, 0);

  const deliveryFee = deliveryType === 'delivery' && cartItems.length > 0 ? PIZZERIA_CONTACT.deliveryFee : 0;
  const grandTotal = subtotal + deliveryFee;

  // Build WhatsApp text for sending order to Sharon
  const generateWhatsAppOrderText = () => {
    let text = `🍕 *הזמנה חדשה מהאתר של שרון!* 🍕\n\n`;
    text += `👤 *שם לקוח:* ${customerName || 'לא צוין'}\n`;
    text += `📞 *טלפון:* ${phone || 'לא צוין'}\n`;
    text += `🛵 *סוג הזמנה:* ${deliveryType === 'delivery' ? 'משלוח לבית' : 'איסוף עצמי'}\n`;

    if (deliveryType === 'delivery') {
      text += `📍 *כתובת למשלוח:* ${city} ${street}\n`;
    }

    text += `\n📋 *פירוט ההזמנה:*\n`;

    cartItems.forEach((item, i) => {
      if (item.type === 'pizza') {
        const sizeObj = PIZZA_SIZES.find((s) => s.id === item.data.size);
        const crustObj = PIZZA_CRUSTS.find((c) => c.id === item.data.crust);
        const dietaryObj = DIETARY_OPTIONS.find((d) => d.id === item.data.dietary);

        text += `\n🔹 *פיצה #${i + 1}:* ${item.data.quantity}x ${sizeObj?.name || ''} (₪${item.data.unitPrice})\n`;
        if (dietaryObj && dietaryObj.id !== 'regular') {
          text += `   - סוג: ${dietaryObj.icon} ${dietaryObj.name}\n`;
        }
        text += `   - בצק: ${crustObj?.name || ''}\n`;

        if (item.data.appliedToppings.length === 0) {
          text += `   - ללא תוספות (מרגריטה נקייה)\n`;
        } else {
          text += `   - תוספות:\n`;
          item.data.appliedToppings.forEach((at) => {
            const tData = TOPPINGS_LIST.find((t) => t.id === at.toppingId);
            text += `     • ${tData?.name || at.toppingId} [${getPortionLabel(at.quarters)}]\n`;
          });
        }

        if (item.data.notes) {
          text += `   - הערות לפיצה: ${item.data.notes}\n`;
        }
      } else if (item.type === 'drink') {
        text += `\n🥤 ${item.data.quantity}x ${item.data.name} (${item.data.sizeVolume}) - ₪${item.data.unitPrice * item.data.quantity}\n`;
      } else if (item.type === 'dessert') {
        text += `\n🍰 ${item.data.quantity}x ${item.data.name} - ₪${item.data.unitPrice * item.data.quantity}\n`;
      } else if (item.type === 'specialty') {
        text += `\n${item.data.icon} ${item.data.quantity}x ${item.data.name} - ₪${item.data.unitPrice * item.data.quantity}\n`;
      }
    });

    text += `\n💰 *סה"כ לתשלום: ₪${grandTotal}*`;
    if (deliveryFee > 0) {
      text += ` (כולל דמי משלוח ₪${deliveryFee})`;
    }

    if (notes.trim()) {
      text += `\n\n📝 *הערות כלליות להזמנה:* ${notes.trim()}`;
    }

    text += `\n\nתודה רבה!`;
    return encodeURIComponent(text);
  };

  const handleSendOrderWhatsApp = () => {
    const errors = {
      name: !customerName.trim(),
      phone: !phone.trim(),
    };
    if (errors.name || errors.phone) {
      setFieldErrors(errors);
      document.getElementById('input-customer-name')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setFieldErrors({});
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    const url = `https://wa.me/${PIZZERIA_CONTACT.whatsappNumber}?text=${generateWhatsAppOrderText()}`;
    window.open(url, '_blank');
    setOrderCompleted(true);
  };

  if (!isOpen) return null;

  return (
    <div
      id="cart-drawer-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end"
      dir="rtl"
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-lg bg-slate-50 h-full flex flex-col shadow-2xl overflow-hidden border-r border-slate-200"
      >
        {/* Top Cart Bar - Professional Polish Red */}
        <div className="bg-red-700 text-white p-4 sm:p-5 flex items-center justify-between border-b border-red-800 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-800/80 text-white border border-red-600 flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">העגלה שלכם</h3>
              <p className="text-xs text-red-100">{cartItems.length} פריטים נבחרו</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cartItems.length > 0 && (
              <button
                type="button"
                onClick={onClearCart}
                className="text-xs text-red-200 hover:text-white px-2 py-1 transition-colors cursor-pointer"
                title="רוקן עגלה"
              >
                רוקן עגלה
              </button>
            )}
            <button
              id="btn-close-cart"
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-red-200 hover:text-white hover:bg-red-800/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Screen after submission */}
        {orderCompleted ? (
          <div className="p-8 text-center flex-1 flex flex-col items-center justify-center bg-white">
            <div className="w-20 h-20 rounded-full bg-green-50 border border-green-200 text-green-600 flex items-center justify-center text-4xl mb-4 shadow-xs">
              ✓
            </div>
            <h4 className="text-2xl font-black text-slate-800 mb-2">ההזמנה בדרך לשרון!</h4>
            <p className="text-slate-600 text-sm mb-6 max-w-xs leading-relaxed">
              הפרטים נשלחו בהצלחה לוואטסאפ של שרון. הפיצה תיכנס לאפייה חמה מיד!
            </p>
            <div className="space-y-3 w-full max-w-xs">
              <a
                href={`tel:${PIZZERIA_CONTACT.phoneDial}`}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-xs transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                <span>בירור מצב הזמנה: {PIZZERIA_CONTACT.phoneDisplay}</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  onClearCart();
                  setOrderCompleted(false);
                  onClose();
                }}
                className="w-full py-3 bg-slate-100 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-200 border border-slate-200 transition-all cursor-pointer"
              >
                התחל הזמנה חדשה
              </button>
            </div>
          </div>
        ) : cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white">
            <div className="w-20 h-20 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center text-4xl mb-4">
              🍕
            </div>
            <h4 className="text-xl font-bold text-slate-800 mb-2">העגלה שלכם ריקה עדיין</h4>
            <p className="text-slate-500 text-xs sm:text-sm max-w-xs mb-6 leading-relaxed">
              בחרו פיצה טעימה עם חלוקת תוספות לפי משולשים, הוסיפו שתייה וקינוח, ונכין לכם משלוח חם ומהיר!
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm shadow-sm transition-all cursor-pointer"
            >
              התחל להרכיב פיצה
            </button>
          </div>
        ) : (
          /* Cart Content & Checkout */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* List of Cart Items */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                פירוט הפריטים בעגלה
              </h4>

              {cartItems.map((item, index) => {
                if (item.type === 'pizza') {
                  const sizeObj = PIZZA_SIZES.find((s) => s.id === item.data.size);
                  const crustObj = PIZZA_CRUSTS.find((c) => c.id === item.data.crust);
                  const dietaryObj = DIETARY_OPTIONS.find((d) => d.id === item.data.dietary);

                  return (
                    <div
                      key={item.data.id || index}
                      className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs relative space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-base">🍕</span>
                            <span className="font-bold text-slate-800 text-sm">
                              {sizeObj?.name}
                            </span>
                            {dietaryObj && dietaryObj.id !== 'regular' && (
                              <span className="text-[10px] bg-green-50 text-green-700 border border-green-200 px-1.5 py-0.5 rounded font-bold">
                                {dietaryObj.icon} {dietaryObj.name}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500">
                            {crustObj?.name}
                          </p>
                        </div>
                        <span className="font-black text-red-700 text-sm">
                          ₪{item.data.unitPrice * item.data.quantity}
                        </span>
                      </div>

                      {/* Toppings Breakdown by Quarters */}
                      <div className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1">
                        <span className="font-bold text-slate-700 text-[11px] block">
                          חלוקת תוספות לפי משולשים:
                        </span>
                        {item.data.appliedToppings.length === 0 ? (
                          <span className="text-slate-500 text-[11px]">פיצה נקייה ללא תוספות</span>
                        ) : (
                          item.data.appliedToppings.map((at) => {
                            const toppingData = TOPPINGS_LIST.find((t) => t.id === at.toppingId);
                            return (
                              <div
                                key={at.toppingId}
                                className="flex items-center justify-between text-[11px] text-slate-700"
                              >
                                <div className="flex items-center gap-1">
                                  <span>{toppingData?.icon}</span>
                                  <span className="font-medium">{toppingData?.name}</span>
                                </div>
                                <span className="text-red-700 font-bold">
                                  {getPortionLabel(at.quarters)}
                                </span>
                              </div>
                            );
                          })
                        )}
                        {item.data.notes && (
                          <p className="text-[10px] text-slate-500 italic mt-1 pt-1 border-t border-slate-200">
                            הערה: {item.data.notes}
                          </p>
                        )}
                      </div>

                      {/* Quantity & Delete Controls */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(index, item.data.quantity - 1)}
                            className="w-6 h-6 bg-white rounded-md flex items-center justify-center text-slate-700 text-xs hover:bg-slate-200 transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-bold text-xs px-2 text-slate-800">
                            {item.data.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(index, item.data.quantity + 1)}
                            className="w-6 h-6 bg-white rounded-md flex items-center justify-center text-slate-700 text-xs hover:bg-slate-200 transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(index)}
                          className="text-slate-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                          title="הסר פיצה זו"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                } else if (item.type === 'drink') {
                  return (
                    <div
                      key={item.data.id || index}
                      className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.data.image}
                          alt={item.data.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <h5 className="font-bold text-xs text-slate-800">{item.data.name}</h5>
                          <span className="text-[10px] text-slate-500">{item.data.sizeVolume}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(index, item.data.quantity - 1)}
                            className="w-6 h-6 bg-white rounded-md flex items-center justify-center text-slate-700 text-xs cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-bold text-xs px-2 text-slate-800">
                            {item.data.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(index, item.data.quantity + 1)}
                            className="w-6 h-6 bg-white rounded-md flex items-center justify-center text-slate-700 text-xs cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-black text-slate-800 text-xs min-w-[36px] text-left">
                          ₪{item.data.unitPrice * item.data.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(index)}
                          className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                } else if (item.type === 'dessert') {
                  return (
                    <div
                      key={item.data.id || index}
                      className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.data.image}
                          alt={item.data.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <h5 className="font-bold text-xs text-slate-800">{item.data.name}</h5>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(index, item.data.quantity - 1)}
                            className="w-6 h-6 bg-white rounded-md flex items-center justify-center text-slate-700 text-xs cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-bold text-xs px-2 text-slate-800">
                            {item.data.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(index, item.data.quantity + 1)}
                            className="w-6 h-6 bg-white rounded-md flex items-center justify-center text-slate-700 text-xs cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-black text-slate-800 text-xs min-w-[36px] text-left">
                          ₪{item.data.unitPrice * item.data.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(index)}
                          className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                } else if (item.type === 'specialty') {
                  return (
                    <div
                      key={item.data.id || index}
                      className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 shrink-0 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl">
                          {item.data.icon}
                        </div>
                        <div>
                          <h5 className="font-bold text-xs text-slate-800">{item.data.name}</h5>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(index, item.data.quantity - 1)}
                            className="w-6 h-6 bg-white rounded-md flex items-center justify-center text-slate-700 text-xs cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-bold text-xs px-2 text-slate-800">
                            {item.data.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(index, item.data.quantity + 1)}
                            className="w-6 h-6 bg-white rounded-md flex items-center justify-center text-slate-700 text-xs cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-black text-slate-800 text-xs min-w-[36px] text-left">
                          ₪{item.data.unitPrice * item.data.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(index)}
                          className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>

            {/* Delivery vs Pickup Toggle */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-3">
              <label className="block text-xs font-bold text-slate-800">
                איך תרצו לקבל את ההזמנה?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryType('delivery')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    deliveryType === 'delivery'
                      ? 'bg-red-600 text-white border-red-600 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  🛵 משלוח עד הבית (+₪{PIZZERIA_CONTACT.deliveryFee})
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryType('pickup')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    deliveryType === 'pickup'
                      ? 'bg-red-600 text-white border-red-600 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  🏪 איסוף עצמי מהסניף (חינם)
                </button>
              </div>
            </div>

            {/* Customer Contact Details */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-3">
              <label className="block text-xs font-bold text-slate-800">
                פרטי הלקוח למשלוח ואישור:
              </label>
              <div className="space-y-2">
                <div>
                  <input
                    id="input-customer-name"
                    type="text"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: false }));
                    }}
                    placeholder="שם מלא *"
                    aria-invalid={fieldErrors.name || undefined}
                    className={`w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-colors ${
                      fieldErrors.name
                        ? 'border-red-500 ring-2 ring-red-200'
                        : 'border-slate-200 focus:border-red-500'
                    }`}
                  />
                  {fieldErrors.name && (
                    <p className="text-[11px] text-red-600 font-bold mt-1">יש להזין שם מלא כדי לשלוח את ההזמנה</p>
                  )}
                </div>
                <div>
                  <input
                    id="input-customer-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (fieldErrors.phone) setFieldErrors((prev) => ({ ...prev, phone: false }));
                    }}
                    placeholder="מספר טלפון להתקשרות *"
                    aria-invalid={fieldErrors.phone || undefined}
                    className={`w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-colors ${
                      fieldErrors.phone
                        ? 'border-red-500 ring-2 ring-red-200'
                        : 'border-slate-200 focus:border-red-500'
                    }`}
                  />
                  {fieldErrors.phone && (
                    <p className="text-[11px] text-red-600 font-bold mt-1">יש להזין מספר טלפון כדי לשלוח את ההזמנה</p>
                  )}
                </div>
                {deliveryType === 'delivery' && (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="עיר"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-500"
                    />
                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="רחוב ומספר בית"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-500"
                    />
                  </div>
                )}
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="הערות לשליח / פיצרייה (קומה, קוד כניסה וכו')"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Bottom Total & Order Buttons */}
        {!orderCompleted && cartItems.length > 0 && (
          <div className="bg-white p-4 sm:p-5 border-t border-slate-200 space-y-3 shadow-xs">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>סה״כ פריטים:</span>
                <span className="font-bold text-slate-800">₪{subtotal}</span>
              </div>
              {deliveryFee > 0 && (
                <div className="flex justify-between">
                  <span>דמי משלוח:</span>
                  <span className="font-bold text-slate-800">₪{deliveryFee}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>לתשלום כולל:</span>
                <span className="text-red-700 text-lg">₪{grandTotal}</span>
              </div>
            </div>

            {/* WhatsApp Send Button */}
            <motion.button
              id="btn-submit-order-whatsapp"
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={handleSendOrderWhatsApp}
              className="w-full py-3.5 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm text-sm cursor-pointer transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              <span>שליחת ההזמנה המלאה לוואטסאפ של שרון</span>
            </motion.button>

            {/* Direct Phone Call Alternative */}
            <div className="flex items-center justify-center">
              <a
                href={`tel:${PIZZERIA_CONTACT.phoneDial}`}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5 font-medium"
              >
                <PhoneCall className="w-3.5 h-3.5 text-red-600" />
                <span>מעדיפים להזמין בטלפון? חייגו {PIZZERIA_CONTACT.phoneDisplay}</span>
              </a>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
