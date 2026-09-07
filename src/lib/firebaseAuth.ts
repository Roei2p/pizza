import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { firebaseApp, useEmulator } from './firebase';

// Split out from lib/firebase.ts and only imported by SharonDashboard, so
// customers placing an order never download the auth SDK — only Sharon,
// opening her dashboard, does.
export const auth = getAuth(firebaseApp);

if (useEmulator) {
  const w = window as unknown as { __authEmulatorConnected?: boolean };
  if (!w.__authEmulatorConnected) {
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    w.__authEmulatorConnected = true;
  }
}
