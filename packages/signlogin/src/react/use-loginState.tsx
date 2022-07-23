import { useStore } from 'zustand';
import { LoginState } from '../vo/loginState';
import { useLoginLauncher } from './provider';

export function useLoginState() {
  const loginLauncher = useLoginLauncher();

  const state = useStore(loginLauncher.store.store);

  return LoginState.fromDto(state);
}
