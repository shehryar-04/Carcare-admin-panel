import { StrictMode } from 'react';  
import { createRoot } from 'react-dom/client';  
import { Provider } from 'react-redux'; // Import Provider  
import { store } from './store/store.js'; // Import your Redux store  
import App from './App.jsx';  
import './index.css';  
import './index2.css'
  
const root = createRoot(document.getElementById('root'));  
  
root.render(  
  <StrictMode>  
    <Provider store={store}> {/* Wrap App with Provider */}  
      <App />  
    </Provider>  
  </StrictMode>  
);  