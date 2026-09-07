import {
  collection,
  doc,
  addDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import { OrderDoc, OrderStatus } from '../types';

const ORDERS_COLLECTION = 'orders';

export async function createOrder(order: Omit<OrderDoc, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const now = Date.now();
  const ref = await addDoc(collection(db, ORDERS_COLLECTION), {
    ...order,
    status: 'received' as OrderStatus,
    createdAt: now,
    updatedAt: now,
  });
  return ref.id;
}

export function subscribeToOrder(orderId: string, onChange: (order: OrderDoc | null) => void): Unsubscribe {
  return onSnapshot(
    doc(db, ORDERS_COLLECTION, orderId),
    (snap) => {
      if (!snap.exists()) {
        onChange(null);
        return;
      }
      onChange({ id: snap.id, ...(snap.data() as Omit<OrderDoc, 'id'>) });
    },
    () => onChange(null),
  );
}

// Sharon's dashboard: every order that isn't finished yet, newest first.
export function subscribeToActiveOrders(onChange: (orders: OrderDoc[]) => void): Unsubscribe {
  const q = query(
    collection(db, ORDERS_COLLECTION),
    where('status', '!=', 'completed'),
    orderBy('status'),
    orderBy('createdAt', 'desc'),
  );
  return onSnapshot(q, (snap) => {
    onChange(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<OrderDoc, 'id'>) })));
  });
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  await updateDoc(doc(db, ORDERS_COLLECTION, orderId), { status, updatedAt: Date.now() });
}
