import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PhoneCall, MessageCircle, CalendarDays, HelpCircle, X, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
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
          ITEM 5: BOTTOM RIGHT (בלמטה צד ימין להזמנות גדולות ישירות לוואטסאפ של שרון)
          ============================================================ */}
      <div
        id="widget-large-orders-bottom-right"
        className="fixed bottom-4 right-4 z-40 max-w-[300px] sm:max-w-xs"
        dir="rtl"
      >
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white text-slate-800 rounded-2xl shadow-lg border border-slate-200 p-3.5 transition-all hover:shadow-xl"
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
              אירועים וקבוצות
            </span>
            <button
              id="btn-large-orders-info"
              type="button"
              onClick={() => setShowLargeOrderModal(true)}
              title="מידע על הזמנות מראש"
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs font-bold text-slate-700 leading-snug mb-2.5">
            להזמנות גדולות (לכמה ימים קדימה)
          </p>

          <a
            id="btn-whatsapp-sharon-bottom-right"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-full font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <span>להזמנות גדולות (מראש)</span>
            <span className="text-sm">💬</span>
          </a>
        </motion.div>
      </div>

      {/* ============================================================
          ITEM 6: BOTTOM LEFT (בלמטה צד שמאל לפנייה לעזרה תתקשרו למספר הפיצה)
          ============================================================ */}
      <div
        id="widget-help-call-bottom-left"
        className="fixed bottom-4 left-4 z-40 max-w-[300px] sm:max-w-xs"
        dir="rtl"
      >
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="bg-white text-slate-800 rounded-2xl shadow-lg border border-slate-200 p-3.5 transition-all hover:shadow-xl"
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
              עזרה ותמיכה
            </span>
            <button
              id="btn-open-help-modal"
              type="button"
              onClick={() => setShowHelpModal(true)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              title="שעות פעילות ומידע"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs font-bold text-slate-700 leading-snug mb-2.5">
            צריכים עזרה בהזמנה? תתקשרו אלינו
          </p>

          <a
            id="btn-call-pizzeria-bottom-left"
            href={`tel:${PIZZERIA_CONTACT.phoneDial}`}
            className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200/80 px-4 py-2.5 rounded-full font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px]">
              📞
            </span>
            <span>לפניה לעזרה: {PIZZERIA_CONTACT.phoneDisplay}</span>
          </a>
        </motion.div>
      </div>

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
                className="absolute top-4 left-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
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
                className="absolute top-4 left-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
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
                    <strong className="text-slate-900">כתובת:</strong> {PIZZERIA_CONTACT.address}
                  </p>
                  <p className="text-red-700 font-bold">
                    ⭐ {PIZZERIA_CONTACT.kosher}
                  </p>
                </div>
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
