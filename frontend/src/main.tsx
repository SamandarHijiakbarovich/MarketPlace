import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { AppRoutes } from './router';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { SearchProvider } from './context/SearchContext';
import { CartProvider } from './context/CartContext';

// Provayderlar tartibi muhim: ichkaridagilar tashqaridagilardan foydalanadi.
// Toast → Auth/Data/Cart (ular toast chaqiradi), Data → Cart/Home (mahsulotlar).
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <DataProvider>
            <SearchProvider>
              <CartProvider>
                <AppRoutes />
              </CartProvider>
            </SearchProvider>
          </DataProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
);
