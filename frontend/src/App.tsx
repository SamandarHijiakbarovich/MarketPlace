import { Outlet } from 'react-router-dom';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { AuthModal } from './components/auth/AuthModal';

// Xaridor tomoni layouti: sarlavha (header) + sahifa + futer + auth modal.
export function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#f7f7fb', color: '#111827' }}>
      <Header />
      <Outlet />
      <Footer />
      <AuthModal />
    </div>
  );
}
