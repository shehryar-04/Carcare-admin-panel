import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store.js';
import App from './App.jsx';
import { ErrorBoundary } from './components/ErrorBoundary'; // Import ErrorBoundary
import './index.css';
import './index2.css';

const root = createRoot(document.getElementById('root'));

// main.jsx
root.render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <App />
      </Provider>
    </ErrorBoundary>
  </StrictMode>
);