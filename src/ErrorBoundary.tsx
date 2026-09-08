import React from 'react';

interface ErrorBoundaryState {
  error: Error | null;
}

// Catches render/runtime errors anywhere below it and shows the actual
// error on-screen instead of leaving a blank page — this is the only way
// to see what broke on a device with no attached devtools (e.g. a phone).
export class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div dir="rtl" style={{ fontFamily: 'sans-serif', padding: 24, maxWidth: 600, margin: '40px auto' }}>
          <div
            style={{
              background: '#fff3f3',
              border: '2px solid #dc2626',
              borderRadius: 12,
              padding: 24,
              color: '#111',
              lineHeight: 1.6,
            }}
          >
            <h2 style={{ margin: '0 0 12px', color: '#dc2626' }}>משהו השתבש באתר</h2>
            <p>צילום מסך של ההודעה הזו יעזור לאתר את הבעיה:</p>
            <pre
              style={{
                whiteSpace: 'pre-wrap',
                background: '#fff',
                padding: 12,
                borderRadius: 8,
                fontSize: 12,
                direction: 'ltr',
                textAlign: 'left',
              }}
            >
              {this.state.error.message}
              {'\n'}
              {this.state.error.stack}
            </pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
