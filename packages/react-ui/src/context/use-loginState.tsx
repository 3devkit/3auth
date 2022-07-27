import { useStore } from 'zustand';
import { useAuth } from './provider';

export function useLoginState() {
  const auth = useAuth();

  useStore(auth.store);

  return auth.loginState;
}
