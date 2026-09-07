import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { auth } from '../lib/firebaseAuth';
import { subscribeToActiveOrders, updateOrderStatus } from '../lib/orders';
import { nextStatus, STATUS_LABELS } from '../lib/orderStages';
import { OrderDoc, CartItem } from '../types';
import { PIZZA_SIZES, DIETARY_OPTIONS } from '../data/menuData';
import { PhoneCall, MapPin, Check } from '../icons/coreui';

function summarizeItem(item: CartItem): string {
  if (item.type === 'pizza') {
    const size = PIZZA_SIZES.find((s) => s.id === item.data.size)?.name ?? item.data.size;
    const dietary = DIETARY_OPTIONS.find((d) => d.id === item.data.dietary);
    const dietaryTag = dietary && dietary.id !== 'regular' ? ` (${dietary.name})` : '';
    const toppingsTag = item.data.appliedToppings.length ? `, ${item.data.appliedToppings.length} תוספות` : '';
    return `${item.data.quantity}x פיצה ${size}${dietaryTag}${toppingsTag}`;
  }
  if (item.type === 'drink') return `${item.data.quantity}x ${item.data.name}`;
  if (item.type === 'dessert') return `${item.data.quantity}x ${item.data.name}`;
  return `${item.data.quantity}x ${item.data.name}`;
}

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError('התחברות נכשלה. בדקו אימייל וסיסמה.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <form onSubmit={handleLogin} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 w-full max-w-sm space-y-4">
        <h1 className="text-xl font-black text-slate-800 text-center">כניסת שרון</h1>
        <p className="text-xs text-slate-500 text-center">לוח הזמנות חי — למי שמנהל/ת את המטבח בלבד</p>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="אימייל"
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-red-500"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="סיסמה"
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-red-500"
          required
        />
        {error && <p className="text-xs text-red-600 font-bold text-center">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold rounded-xl text-sm cursor-pointer transition-all"
        >
          {loading ? 'מתחבר/ת...' : 'התחברות'}
        </button>
      </form>
    </div>
  );
};

const OrderCard: React.FC<{ order: OrderDoc }> = ({ order }) => {
  const isDone = order.status === 'completed';
  const upcoming = nextStatus(order.status, order.deliveryType);

  return (
    <div className={`bg-white rounded-2xl border p-4 space-y-3 ${isDone ? 'border-green-200 opacity-60' : 'border-slate-200 shadow-sm'}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="font-bold text-slate-800 text-sm">{order.customerName}</p>
          <a href={`tel:${order.customerPhone}`} className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
            <PhoneCall className="w-3 h-3" />
            <span dir="ltr">{order.customerPhone}</span>
          </a>
        </div>
        <span className="text-[11px] font-bold px-2 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
          {STATUS_LABELS[order.status]}
        </span>
      </div>

      {order.deliveryType === 'delivery' && (order.city || order.street) && (
        <p className="text-xs text-slate-600 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span>{order.city} {order.street}</span>
        </p>
      )}

      <div className="bg-slate-50 rounded-lg p-2.5 space-y-1 border border-slate-200">
        {order.items.map((item, i) => (
          <p key={i} className="text-xs text-slate-700">{summarizeItem(item)}</p>
        ))}
        {order.notes && <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-200">הערה: {order.notes}</p>}
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500">
          {order.deliveryType === 'delivery' ? 'משלוח' : 'איסוף עצמי'} · {order.paymentMethod === 'cash' ? 'מזומן' : order.paymentMethod === 'credit' ? 'אשראי בהגעה' : 'ביט'}
        </span>
        <span className="font-black text-slate-800">₪{order.grandTotal}</span>
      </div>

      {!isDone && (
        <button
          type="button"
          onClick={() => order.id && updateOrderStatus(order.id, upcoming)}
          className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
        >
          <Check className="w-3.5 h-3.5" />
          <span>סמן: {STATUS_LABELS[upcoming]}</span>
        </button>
      )}
    </div>
  );
};

export const SharonDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [orders, setOrders] = useState<OrderDoc[]>([]);

  useEffect(() => onAuthStateChanged(auth, (u) => { setUser(u); setAuthChecked(true); }), []);

  useEffect(() => {
    if (!user) return;
    return subscribeToActiveOrders(setOrders);
  }, [user]);

  if (!authChecked) return null;
  if (!user) return <LoginScreen />;

  return (
    <div dir="rtl" className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-black text-slate-800">הזמנות פעילות ({orders.length})</h1>
          <button
            type="button"
            onClick={() => signOut(auth)}
            className="text-xs text-slate-500 hover:text-red-600 font-medium cursor-pointer"
          >
            התנתקות
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-400 text-sm">
            אין הזמנות פעילות כרגע
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
