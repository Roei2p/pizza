import React, { Suspense, lazy, useEffect, useState } from 'react';
import App from './App';

// Lazy so the dashboard's own chunk — including firebase/auth — only
// downloads when someone actually opens #sharon; ordinary customers never
// pay for it.
const SharonDashboard = lazy(() =>
  import('./components/SharonDashboard').then((m) => ({ default: m.SharonDashboard })),
);

// Sharon's live order dashboard lives at #sharon, a hash route (not a real
// path) so it works under GitHub Pages' static hosting with no server-side
// routing. Kept as a separate top-level component from App itself so the
// two screens' hooks never interleave across a hash change.
export default function Root() {
  const [route, setRoute] = useState(() => window.location.hash);

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  if (route === '#sharon') {
    return (
      <Suspense fallback={null}>
        <SharonDashboard />
      </Suspense>
    );
  }
  return <App />;
}
