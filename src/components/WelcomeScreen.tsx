import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowLeft, PhoneCall, MessageCircle, Clock, Award, Flame } from 'lucide-react';
import { PIZZERIA_CONTACT } from '../data/menuData';

interface WelcomeScreenProps {
  onContinue: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onContinue }) => {
  return (
    <div
      id="welcome-overlay"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      dir="rtl"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-2xl text-slate-800 relative overflow-hidden text-center my-auto"
      >
        {/* Brand Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold mb-5">
          <Flame className="w-3.5 h-3.5 text-red-600" />
          <span>פיצריית בוטיק חמה מהתנור</span>
          <Sparkles className="w-3.5 h-3.5 text-red-600" />
        </div>

        {/* Big Pizza Icon Badge */}
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-4xl shadow-xs">
          🍕
        </div>

        {/* Main Headline requested explicitly by user */}
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
          הגעתם לאתר של <span className="text-red-700">שרון</span>!
        </h1>

        <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed">
          שמחים שהגעתם אלינו! כאן תוכלו להרכיב פיצות חמות בדיוק לפי טעמכם – כולל חלוקת תוספות לפי משולשים ורבעים, שתייה קרה וקינוחים מפנקים.
        </p>

        {/* Feature Highlights Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8 text-xs sm:text-sm text-slate-700">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col items-center gap-1">
            <span className="text-2xl mb-0.5">🍕</span>
            <span className="font-bold text-slate-800 text-xs sm:text-sm">חלוקת משולשים</span>
            <span className="text-slate-500 text-[11px]">תוספות לפי רבע, חצי ושלם</span>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col items-center gap-1">
            <span className="text-2xl mb-0.5">🧀</span>
            <span className="font-bold text-slate-800 text-xs sm:text-sm">100% מוצרלה</span>
            <span className="text-slate-500 text-[11px]">בצק מותפח 48 שעות</span>
          </div>
          <div className="col-span-2 sm:col-span-1 bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col items-center gap-1">
            <span className="text-2xl mb-0.5">🛵</span>
            <span className="font-bold text-slate-800 text-xs sm:text-sm">משלוח מהיר וחם</span>
            <span className="text-slate-500 text-[11px]">ישירות עד פתח הבית</span>
          </div>
        </div>

        {/* Primary CTA button matching exact wording requested */}
        <motion.button
          id="btn-welcome-continue"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onContinue}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-base sm:text-lg shadow-lg shadow-red-200 flex items-center justify-center gap-2.5 mx-auto transition-all cursor-pointer group"
        >
          <span>לחץ כאן להמשיך להזמנה</span>
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
        </motion.button>

        {/* Secondary helper info */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-600" />
            <span>פתוח כעת להזמנות</span>
          </div>
          <span className="hidden sm:inline text-slate-300">•</span>
          <div className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-slate-600" />
            <span>{PIZZERIA_CONTACT.kosher}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
