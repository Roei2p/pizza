import { CartItem } from '../types';

// Client-only "returning customer" memory. There's no backend/accounts on
// this static site — orders go out as a WhatsApp message — so this only
// recognizes the same browser/device, not the customer across devices.
const STORAGE_KEY = 'sharon-pizza:customer-profile:v1';

export interface CustomerProfile {
  name: string;
  phone: string;
  deliveryType: 'delivery' | 'pickup';
  city: string;
  street: string;
  paymentMethod: 'cash' | 'credit' | 'bit';
  lastOrderAt: number;
  lastOrderItems: CartItem[];
}

export function loadCustomerProfile(): CustomerProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.lastOrderItems)) return null;
    return parsed as CustomerProfile;
  } catch {
    return null;
  }
}

export function saveCustomerProfile(profile: CustomerProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Private browsing / storage blocked — quietly skip, nothing to recover.
  }
}
