import { initializeApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Auth is only needed by Sharon's dashboard (src/lib/firebaseAuth.ts, lazy
// imported from SharonDashboard) — kept out of this module so ordinary
// customers placing an order never download the auth SDK.

const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-sharon-pizza';

// A real backend is configured only when a real project id was provided
// (via .env.gh-pages in production, or .env.local in dev).
export const firebaseConfigured = Boolean(import.meta.env.VITE_FIREBASE_PROJECT_ID);

// No real project id configured -> assume local dev against the emulator
// (firebase emulators:start) rather than failing, but ONLY during
// `bun run dev` (import.meta.env.DEV). A production build with no real
// config must NOT try to reach a phantom localhost:8080 on a real visitor's
// device — that just hangs instead of failing fast. VITE_USE_FIREBASE_EMULATOR
// can still force emulator use explicitly in any mode.
export const useEmulator =
  import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true' ||
  (import.meta.env.DEV && !firebaseConfigured);

// Whether Firestore/Auth calls are actually expected to work: either a real
// project is wired up, or we're intentionally talking to the local emulator.
// Used to fail fast (instead of hanging) when neither is true.
export const backendUsable = firebaseConfigured || useEmulator;

export const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${projectId}.firebaseapp.com`,
  projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'demo-app-id',
};

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);

if (useEmulator) {
  // Guarded so Vite's HMR (which re-runs this module) doesn't try to
  // connect twice and throw.
  const w = window as unknown as { __firestoreEmulatorConnected?: boolean };
  if (!w.__firestoreEmulatorConnected) {
    connectFirestoreEmulator(db, 'localhost', 8080);
    w.__firestoreEmulatorConnected = true;
  }
}
