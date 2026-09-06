import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, Award, Flame, Star } from 'lucide-react';
import { PIZZERIA_CONTACT } from '../data/menuData';

interface WelcomeScreenProps {
  onContinue: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onContinue }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Respect the OS-level "reduce motion" setting: freeze on the poster frame instead of autoplaying.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      videoRef.current?.pause();
    }
  }, []);

  return (
    <div id="welcome-overlay" className="fixed inset-0 z-50 overflow-hidden" dir="rtl">
      {/* Cinematic video background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src="/assets/hero-pizza.mp4"
        poster="/assets/hero-pizza-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
      />
      {/* Legibility gradient over the footage */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-slate-950/30" />
      <div className="absolute inset-0 bg-gradient-to-l from-red-950/30 via-transparent to-transparent" />

      <div className="relative z-10 h-full w-full overflow-y-auto flex items-end sm:items-center justify-center p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-2xl text-center my-auto"
        >
          {/* Brand Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-100 text-xs font-bold mb-5">
            <Flame className="w-3.5 h-3.5 text-amber-300" />
            <span>פיצריית בוטיק חמה מהתנור</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4 drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
            הגעתם לאתר של <span className="text-red-500">שרון</span>
          </h1>

          <p className="text-white/85 text-sm sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed drop-shadow-lg">
            פיצות חמות בעבודת יד, בדיוק לפי הטעם שלכם — כולל חלוקת תוספות לפי משולשים ורבעים, שתייה קרה וקינוחים מפנקים.
          </p>

          {/* Feature Highlights — frosted glass chips over the video */}
          <div className="grid grid-cols-3 gap-3 mb-8 max-w-lg mx-auto">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 sm:p-3.5 flex flex-col items-center gap-1">
              <span className="text-xl sm:text-2xl mb-0.5">🍕</span>
              <span className="font-bold text-white text-[11px] sm:text-xs">חלוקת משולשים</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 sm:p-3.5 flex flex-col items-center gap-1">
              <span className="text-xl sm:text-2xl mb-0.5">🧀</span>
              <span className="font-bold text-white text-[11px] sm:text-xs">100% מוצרלה</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 sm:p-3.5 flex flex-col items-center gap-1">
              <span className="text-xl sm:text-2xl mb-0.5">🛵</span>
              <span className="font-bold text-white text-[11px] sm:text-xs">משלוח מהיר</span>
            </div>
          </div>

          {/* Primary CTA button */}
          <motion.button
            id="btn-welcome-continue"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={onContinue}
            className="w-full sm:w-auto px-9 py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-base sm:text-lg shadow-2xl shadow-red-950/60 flex items-center justify-center gap-2.5 mx-auto transition-colors cursor-pointer group"
          >
            <span>לחץ כאן להמשיך להזמנה</span>
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          </motion.button>

          {/* Secondary helper info */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-white/70">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>פתוח כעת להזמנות</span>
            </div>
            <span className="hidden sm:inline text-white/30">•</span>
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              <span>{PIZZERIA_CONTACT.kosher}</span>
            </div>
            <span className="hidden sm:inline text-white/30">•</span>
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>הפיצריה השכונתית האהובה</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
