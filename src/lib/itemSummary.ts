import { CartItem } from '../types';
import { PIZZA_SIZES, DIETARY_OPTIONS } from '../data/menuData';

/** One-line human-readable summary of a cart item, e.g. "2x פיצה משפחתית (טבעוני), 3 תוספות". */
export function summarizeItem(item: CartItem): string {
  if (item.type === 'pizza') {
    const size = PIZZA_SIZES.find((s) => s.id === item.data.size)?.name ?? item.data.size;
    const dietary = DIETARY_OPTIONS.find((d) => d.id === item.data.dietary);
    const dietaryTag = dietary && dietary.id !== 'regular' ? ` (${dietary.name})` : '';
    const toppingsTag = item.data.appliedToppings.length ? `, ${item.data.appliedToppings.length} תוספות` : '';
    return `${item.data.quantity}x פיצה ${size}${dietaryTag}${toppingsTag}`;
  }
  return `${item.data.quantity}x ${item.data.name}`;
}
