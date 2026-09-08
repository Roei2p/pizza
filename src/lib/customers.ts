import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, backendUsable } from './firebase';
import { CustomerProfile } from '../utils/customerProfile';

const CUSTOMERS_COLLECTION = 'customers';

// Keyed by a normalized phone number, so a customer typing the same phone
// on a different device/browser is recognized — unlike the localStorage
// profile, which only remembers the current device.
function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

export async function lookupCustomerByPhone(phone: string): Promise<CustomerProfile | null> {
  if (!backendUsable) return null;
  const key = normalizePhone(phone);
  if (!key) return null;
  const snap = await getDoc(doc(db, CUSTOMERS_COLLECTION, key));
  return snap.exists() ? (snap.data() as CustomerProfile) : null;
}

export async function saveCustomerToCloud(profile: CustomerProfile): Promise<void> {
  if (!backendUsable) return;
  const key = normalizePhone(profile.phone);
  if (!key) return;
  await setDoc(doc(db, CUSTOMERS_COLLECTION, key), profile, { merge: true });
}
