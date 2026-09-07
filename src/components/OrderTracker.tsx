import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Receipt, Flame, Bike, PartyPopper, Check, PhoneCall } from '../icons/coreui';
import { ChefHat, Package } from 'lucide-react';
import { PIZZERIA_CONTACT } from '../data/menuData';
import { OrderStatus } from '../types';
import { subscribeToOrder } from '../lib/orders';
import { DELIVERY_STATUSES, PICKUP_STATUSES } from '../lib/orderStages';

interface OrderTrackerProps {
  deliveryType: 'delivery' | 'pickup';
  onNewOrder: () => void;
  /** When set, live status comes from Sharon's dashboard via Firestore. */
  orderId?: string;
}

// Fallback for when there's no live order to follow (no orderId — e.g. the
// Firestore write failed, or no backend is configured yet): a simulated
// progress animation for delight, timed rather than fed by a real kitchen.
// Stage timing is deliberately compressed to a short, watchable demo; only
// the final ETA countdown uses a realistic minute estimate.
const STAGE_TIMES_SEC = [0, 8, 20, 35, 48]; // when each stage before "on the way" starts
const PICKUP_READY_MINUTES = 18;

function parseEtaMinutes(range: string): number {
  const nums = range.match(/\d+/g)?.map(Number) ?? [40, 60];
  const [min, max] = nums.length > 1 ? nums : [nums[0], nums[0]];
  return Math.round((min + max) / 2);
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({ deliveryType, onNewOrder, orderId }) => {
  const [elapsedSec, setElapsedSec] = useState(0);
  const startedAt = useMemo(() => Date.now(), []);
  const totalEtaMinutes = useMemo(
    () => (deliveryType === 'delivery' ? parseEtaMinutes(PIZZERIA_CONTACT.deliveryTime) : PICKUP_READY_MINUTES),
    [deliveryType],
  );
  const totalEtaSec = totalEtaMinutes * 60;

  // Live status from Sharon's dashboard, when this order has one.
  const [liveStatus, setLiveStatus] = useState<OrderStatus | null>(null);
  const [liveConnected, setLiveConnected] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    const unsubscribe = subscribeToOrder(orderId, (order) => {
      setLiveConnected(true);
      setLiveStatus(order?.status ?? null);
    });
    return unsubscribe;
  }, [orderId]);

  useEffect(() => {
    // Only the simulated fallback needs a ticking clock.
    if (liveConnected) return;
    const id = setInterval(() => {
      setElapsedSec(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [startedAt, liveConnected]);

  const stages =
    deliveryType === 'delivery'
      ? [
          { label: 'ההזמנה התקבלה', icon: Receipt },
          { label: 'מכינים בצק טרי', icon: ChefHat },
          { label: 'אופים בתנור האבן', icon: Flame },
          { label: 'אורזים ויוצאים לדרך', icon: Package },
          { label: 'השליח בדרך אליכם', icon: Bike },
        ]
      : [
          { label: 'ההזמנה התקבלה', icon: Receipt },
          { label: 'מכינים בצק טרי', icon: ChefHat },
          { label: 'אופים בתנור האבן', icon: Flame },
          { label: 'ההזמנה מוכנה לאיסוף', icon: Package },
        ];

  const statusList = deliveryType === 'delivery' ? DELIVERY_STATUSES : PICKUP_STATUSES;

  const simulatedFinished = elapsedSec >= totalEtaSec;
  const simulatedIndex = simulatedFinished
    ? stages.length - 1
    : STAGE_TIMES_SEC.slice(0, stages.length).reduce((acc, t, i) => (elapsedSec >= t ? i : acc), 0);

  const finished = liveConnected ? liveStatus === 'completed' : simulatedFinished;
  const activeIndex = liveConnected
    ? finished
      ? stages.length - 1
      : Math.max(0, statusList.indexOf(liveStatus ?? 'received'))
    : simulatedIndex;

  const remainingSec = Math.max(0, totalEtaSec - elapsedSec);
  const remainingMin = Math.ceil(remainingSec / 60);
  const progressPct = finished
    ? 100
    : liveConnected
      ? ((activeIndex + 1) / stages.length) * 100
      : Math.min(100, (elapsedSec / totalEtaSec) * 100);

  return (
    <div dir="rtl" className="p-6 sm:p-8 flex-1 flex flex-col bg-white overflow-y-auto">
      {/* ETA header */}
      <div className="text-center mb-6">
        <AnimatePresence mode="wait">
          {finished ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center"
            >
              <div className="w-20 h-20 rounded-full bg-green-50 border border-green-200 text-green-600 flex items-center justify-center mb-3">
                <PartyPopper className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-black text-slate-800">
                {deliveryType === 'delivery' ? 'השליח הגיע!' : 'ההזמנה מחכה לכם!'}
              </h4>
              <p className="text-slate-500 text-sm mt-1">בתאבון! 🍕</p>
            </motion.div>
          ) : (
            <motion.div key="eta" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                {liveConnected
                  ? 'סטטוס חי מהמטבח'
                  : deliveryType === 'delivery'
                    ? 'זמן הגעה משוער'
                    : 'מוכן לאיסוף בעוד'}
              </p>
              {liveConnected ? (
                <p className="text-xl font-black text-red-700">{stages[activeIndex]?.label}</p>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <motion.span
                    key={remainingMin}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-black text-red-700"
                  >
                    {remainingMin}
                  </motion.span>
                  <span className="text-lg font-bold text-slate-500">דקות</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-8 relative">
        <motion.div
          className="h-full bg-gradient-to-l from-red-600 to-orange-500 rounded-full"
          animate={{ width: `${progressPct}%` }}
          transition={{ ease: 'easeOut', duration: 0.6 }}
        />
      </div>

      {/* Stage timeline */}
      <div className="space-y-0 mb-8">
        {stages.map((stage, i) => {
          const Icon = stage.icon;
          const isDone = i < activeIndex || finished;
          const isActive = i === activeIndex && !finished;
          const isLast = i === stages.length - 1;

          return (
            <div key={stage.label} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <motion.div
                  animate={isActive ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                  transition={isActive ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' } : {}}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 ${
                    isDone
                      ? 'bg-green-50 border-green-300 text-green-600'
                      : isActive
                        ? 'bg-red-50 border-red-400 text-red-600'
                        : 'bg-slate-50 border-slate-200 text-slate-300'
                  }`}
                >
                  {isDone ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </motion.div>
                {!isLast && (
                  <div
                    className={`w-0.5 h-8 transition-colors duration-500 ${
                      i < activeIndex || finished ? 'bg-green-300' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
              <div className={`pt-2 ${isLast ? '' : 'pb-6'}`}>
                <p
                  className={`text-sm font-bold transition-colors ${
                    isDone ? 'text-slate-500' : isActive ? 'text-slate-800' : 'text-slate-400'
                  }`}
                >
                  {stage.label}
                </p>
                {isActive && !finished && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[11px] text-red-600 font-medium mt-0.5"
                  >
                    כרגע מתבצע...
                  </motion.p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-3 mt-auto">
        <a
          href={`tel:${PIZZERIA_CONTACT.phoneDial}`}
          className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-xs transition-all"
        >
          <PhoneCall className="w-4 h-4" />
          <span>בירור מצב הזמנה: {PIZZERIA_CONTACT.phoneDisplay}</span>
        </a>
        <button
          type="button"
          onClick={onNewOrder}
          className="w-full py-3 bg-slate-100 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-200 border border-slate-200 transition-all cursor-pointer"
        >
          התחל הזמנה חדשה
        </button>
      </div>
    </div>
  );
};
