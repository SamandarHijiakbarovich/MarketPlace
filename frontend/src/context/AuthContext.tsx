import { createContext, useContext, useState, type ReactNode } from 'react';
import type { BuyerUser } from '../types/shop';
import { authApi } from '../api/auth';
import { useToast } from './ToastContext';

// Xaridor login/register formasi (buyer auth backend'da yo'q — lokal mock bo'lib qoladi)
export interface AuthForm {
  name: string;
  email: string;
  phone: string;
  pass: string;
  pass2: string;
}

export type AuthModalMode = 'login' | 'register' | null;

interface AuthContextValue {
  // --- Admin (haqiqiy JWT, backend orqali) ---
  token: string | null;
  isAuthenticated: boolean;
  adminLogin: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;

  // --- Xaridor (buyer) — lokal mock ---
  currentUser: BuyerUser | null;
  registerBuyer: (form: AuthForm) => string | null;
  loginBuyer: (form: AuthForm) => string | null;
  logoutBuyer: () => void;

  // --- Auth modal ---
  authModal: AuthModalMode;
  openLogin: () => void;
  openRegister: () => void;
  switchAuth: (mode: AuthModalMode) => void;
  closeAuth: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function validEmail(e: string) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test((e || '').trim());
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [token, setToken] = useState<string | null>(localStorage.getItem('adminToken'));
  const [users, setUsers] = useState<BuyerUser[]>([
    { name: 'Jasur Karimov', email: 'user@mail.uz', phone: '+998 90 123 45 67', pass: '12345' },
  ]);
  const [currentUser, setCurrentUser] = useState<BuyerUser | null>(null);
  const [authModal, setAuthModal] = useState<AuthModalMode>(null);

  // --- Admin: backend /auth/login (JWT) ---
  const adminLogin = async (email: string, pass: string): Promise<boolean> => {
    try {
      const res = await authApi.login({ email: email.trim(), password: pass });
      setToken(res.token); // token authApi ichida localStorage'ga saqlangan
      return true;
    } catch {
      return false;
    }
  };
  const logout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
  };

  // --- Xaridor (lokal) ---
  const registerBuyer = (f: AuthForm): string | null => {
    if (f.name.trim().length < 2) return "Ismni to'liq kiriting";
    if (!validEmail(f.email)) return "To'g'ri email kiriting";
    if (users.some((u) => u.email.toLowerCase() === f.email.trim().toLowerCase()))
      return "Bu email allaqachon ro'yxatdan o'tgan";
    if (f.pass.length < 4) return "Parol kamida 4 ta belgidan iborat bo'lsin";
    if (f.pass !== f.pass2) return 'Parollar mos kelmadi';
    const user: BuyerUser = { name: f.name.trim(), email: f.email.trim(), phone: f.phone.trim(), pass: f.pass };
    setUsers((prev) => [...prev, user]);
    setCurrentUser(user);
    setAuthModal(null);
    toast('Xush kelibsiz, ' + user.name.split(' ')[0] + '!');
    return null;
  };

  const loginBuyer = (f: AuthForm): string | null => {
    const user = users.find(
      (u) => u.email.toLowerCase() === f.email.trim().toLowerCase() && u.pass === f.pass,
    );
    if (!user) return "Email yoki parol noto'g'ri";
    setCurrentUser(user);
    setAuthModal(null);
    toast('Xush kelibsiz, ' + user.name.split(' ')[0] + '!');
    return null;
  };

  const logoutBuyer = () => {
    setCurrentUser(null);
    toast('Tizimdan chiqdingiz');
  };

  const openLogin = () => setAuthModal('login');
  const openRegister = () => setAuthModal('register');
  const switchAuth = (mode: AuthModalMode) => setAuthModal(mode);
  const closeAuth = () => setAuthModal(null);

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        adminLogin,
        logout,
        currentUser,
        registerBuyer,
        loginBuyer,
        logoutBuyer,
        authModal,
        openLogin,
        openRegister,
        switchAuth,
        closeAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth AuthProvider ichida ishlatilishi kerak');
  return ctx;
}
