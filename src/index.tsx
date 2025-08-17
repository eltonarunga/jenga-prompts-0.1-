import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Type assertion for better TypeScript support
const rootElement = document.getElementById('root') as HTMLElement;

if (!rootElement) {
  console.error('Failed to find the root element');
  throw new Error('Root element with id "root" not found. Please check your HTML file.');
}

// Create root with error boundary
const root = createRoot(rootElement);

// Error boundary wrapper component
const AppWithErrorBoundary: React.FC = () => (
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Simple error boundary component
class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  { hasError: boolean; error?: Error }
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Something went wrong!</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error?.toString()}
          </details>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Render with error handling
try {
  root.render(<AppWithErrorBoundary />);
} catch (error) {
  console.error('Failed to render React app:', error);
  rootElement.innerHTML = `
    <div style="padding: 20px; text-align: center; color: red;">
      <h2>Failed to load application</h2>
      <p>Please refresh the page or check the console for errors.</p>
    </div>
  `;
}