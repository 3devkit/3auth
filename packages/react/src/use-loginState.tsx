import { useStore } from 'zustand';
import { LoginState } from '@3auth/core';
import { useLoginLauncher } from './provider';

export function useLoginState() {
  const loginLauncher = useLoginLauncher();

  const state = useStore(loginLauncher.store.originalStore);

  return LoginState.fromDto(state);
}
