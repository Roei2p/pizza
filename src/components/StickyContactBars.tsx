import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PhoneCall, MessageCircle, HelpCircle, X, ShieldCheck } from 'lucide-react';
import { PIZZERIA_CONTACT } from '../data/menuData';

export const StickyContactBars: React.FC = () => {
  const [showLargeOrderModal, setShowLargeOrderModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const whatsappMessage = encodeURIComponent(
    'שלום שרון! הגעתי מהאתר שלך, ואני מעוניין לתאם הזמנה גדולה של פיצות לאירוע / מסיבה לכמה ימים קדימה.'
  );
  const whatsappUrl = `https://wa.me/${PIZZERIA_CONTACT.whatsappNumber}?text=${whatsappMessage}`;

  return (
    <>
      {/* ============================================================
          COMPACT FLOATING ACTION BUTTONS (bottom-left, stacked)
          Kept small on purpose so they never cover page content like
          the "add to cart" button or the toppings grid.
          ============================================================ */}
      <div
        id="floating-contact-actions"
        className="fixed bottom-4 left-4 z-40 flex flex-col items-start gap-2.5"
        dir="rtl"
      >
        <motion.button
          id="btn-large-orders-info"
          type="button"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 260, damping: 18 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setShowLargeOrderModal(true)}
          title="הזמנות גדולות ואירועים"
          aria-label="פתיחת מידע על הזמנות גדולות ואירועים"
          className="group relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-900/20 flex items-center justify-center cursor-pointer ring-4 ring-white"
        >
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hidden sm:block">
            הזמנות גדולות ואירועים
          </span>
        </motion.button>

        <motion.button
          id="btn-open-help-modal"
          type="button"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 18 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setShowHelpModal(true)}
          title="עזרה ותמיכה"
          aria-label="פתיחת מידע על עזרה ותמיכה"
          className="group relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 shadow-lg flex items-center justify-center cursor-pointer ring-4 ring-white"
        >
          <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hidden sm:block">
            עזרה ותמיכה
          </span>
        </motion.button>
      </div>

      {/* Quick direct call button, bottom-right, single small pill */}
      <motion.a
        id="btn-call-pizzeria-quick"
        href={`tel:${PIZZERIA_CONTACT.phoneDial}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.45, type: 'spring', stiffness: 260, damping: 18 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        dir="rtl"
        title={`חייגו אלינו: ${PIZZERIA_CONTACT.phoneDisplay}`}
        aria-label={`חיוג ישיר לפיצריה, ${PIZZERIA_CONTACT.phoneDisplay}`}
        className="fixed bottom-4 right-4 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20 flex items-center justify-center cursor-pointer ring-4 ring-white"
      >
        <PhoneCall className="w-5 h-5 sm:w-6 sm:h-6" />
      </motion.a>

      {/* MODAL: Large Orders Details (ווטסאפ שרון להזמנות מראש) */}
      <AnimatePresence>
        {showLargeOrderModal && (
          <div
            id="modal-large-orders"
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
            dir="rtl"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full text-slate-800 shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => setShowLargeOrderModal(false)}
                aria-label="סגירת חלון"
                className="absolute top-4 left-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center border border-green-200">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">הזמנות גדולות ואירועים</h3>
                  <p className="text-xs text-slate-500">תיאום מראש מול שרון לכמה ימים קדימה</p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-slate-600 mb-6 leading-relaxed">
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                  <p className="font-bold text-slate-800 mb-1">🎉 חוגגים יום הולדת, הרמת כוסית או אירוע חברה?</p>
                  <p className="text-xs text-slate-600">
                    הזמנות גדולות (10 מגשים ומעלה) מתואמות לכמה ימים מראש כדי שנוכל להכין עבורכם בצק מותפח טרי, לאפות בדיוק בזמן ולתת לכם מחיר חבילה מיוחד כולל שתייה וקינוחים!
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-green-700 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>מענה מהיר ואישי ישירות משרון בוואטסאפ</span>
                </div>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md text-sm transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>מעבר מהיר לווטסאפ של שרון 💬</span>
              </a>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Customer Support / Help */}
      <AnimatePresence>
        {showHelpModal && (
          <div
            id="modal-help-support"
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
            dir="rtl"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full text-slate-800 shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                aria-label="סגירת חלון"
                className="absolute top-4 left-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center border border-blue-200">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">מוקד העזרה והשירות</h3>
                  <p className="text-xs text-slate-500">{PIZZERIA_CONTACT.name}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-slate-600 mb-6">
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 text-xs">
                  <p className="text-slate-700">
                    <strong className="text-slate-900">טלפון למשלוחים ועזרה:</strong> {PIZZERIA_CONTACT.phoneDisplay}
                  </p>
                  <p className="text-slate-700">
                    <strong className="text-slate-900">שעות פתיחה:</strong> {PIZZERIA_CONTACT.openingHours}
                  </p>
                  <p className="text-slate-700">
                    <strong className="text-slate-900">זמן משלוח משוער:</strong> {PIZZERIA_CONTACT.deliveryTime}
                  </p>
                  <p className="text-slate-700">
                    <strong className="text-slate-900">כתובת:</strong> {PIZZERIA_CONTACT.address}
                  </p>
                  <p className="text-red-700 font-bold">
                    ⭐ {PIZZERIA_CONTACT.kosher}
                  </p>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  ⚠️ {PIZZERIA_CONTACT.allergenNote}
                </p>
              </div>

              <a
                href={`tel:${PIZZERIA_CONTACT.phoneDial}`}
                className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md text-sm transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                <span>חיוג ישיר למספר הפיצה: {PIZZERIA_CONTACT.phoneDisplay}</span>
              </a>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
