import { OrderStatus } from '../types';

export const DELIVERY_STATUSES: OrderStatus[] = ['received', 'dough', 'oven', 'packing', 'out_for_delivery'];
export const PICKUP_STATUSES: OrderStatus[] = ['received', 'dough', 'oven', 'ready_pickup'];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  received: 'התקבלה',
  dough: 'מכינים בצק',
  oven: 'בתנור',
  packing: 'אורזים',
  out_for_delivery: 'השליח בדרך',
  ready_pickup: 'מוכנה לאיסוף',
  completed: 'הושלמה',
};

export function statusesFor(deliveryType: 'delivery' | 'pickup'): OrderStatus[] {
  return deliveryType === 'delivery' ? DELIVERY_STATUSES : PICKUP_STATUSES;
}

/** Next status in this order's flow, or 'completed' past the last active stage. */
export function nextStatus(current: OrderStatus, deliveryType: 'delivery' | 'pickup'): OrderStatus {
  const list = statusesFor(deliveryType);
  const idx = list.indexOf(current);
  if (idx === -1 || idx === list.length - 1) return 'completed';
  return list[idx + 1];
}
