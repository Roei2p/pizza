import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { auth } from '../lib/firebaseAuth';
import { subscribeToActiveOrders, updateOrderStatus } from '../lib/orders';
import { nextStatus, STATUS_LABELS } from '../lib/orderStages';
import { OrderDoc } from '../types';
import { PhoneCall, MapPin, Check, Sparkles, Send } from '../icons/coreui';
import { summarizeItem } from '../lib/itemSummary';
import { askGemini, geminiEnabled } from '../lib/gemini';

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

function ordersToContext(orders: OrderDoc[]): string {
  if (orders.length === 0) return 'אין הזמנות פעילות כרגע.';
  return orders
    .map((o, i) => {
      const items = o.items.map(summarizeItem).join('; ');
      return `${i + 1}. לקוח: ${o.customerName}, סטטוס: ${STATUS_LABELS[o.status]}, סוג: ${o.deliveryType === 'delivery' ? 'משלוח' : 'איסוף'}, סכום: ₪${o.grandTotal}, פריטים: ${items}`;
    })
    .join('\n');
}

const DashboardAssistant: React.FC<{ orders: OrderDoc[] }> = ({ orders }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    const q = question.trim();
    if (!q || loading) return;
    setLoading(true);
    setAnswer('');
    try {
      const reply = await askGemini(
        [{ role: 'user', text: q }],
        `אתם עוזר/ת אישי/ת לשרון, בעלת הפיצרייה. ענו בעברית, קצר וממוקד, על סמך רשימת ההזמנות הפעילות הבאה בלבד:\n\n${ordersToContext(orders)}`,
      );
      setAnswer(reply);
    } catch {
      setAnswer('לא הצלחתי לענות כרגע.');
    } finally {
      setLoading(false);
    }
  };

  if (!geminiEnabled) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-500" />
        <h2 className="font-bold text-sm text-slate-800">שאלו את העוזר על ההזמנות הפעילות</h2>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
          placeholder="לדוגמה: כמה הזמנות משלוח יש כרגע?"
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-500"
        />
        <button
          type="button"
          onClick={handleAsk}
          disabled={loading || !question.trim()}
          className="w-10 h-10 shrink-0 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl flex items-center justify-center cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
      {loading && <p className="text-xs text-slate-400">חושב/ת...</p>}
      {answer && <p className="text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-3 leading-relaxed">{answer}</p>}
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

        <DashboardAssistant orders={orders} />

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
