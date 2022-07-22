import React, { createContext, useContext, useMemo } from 'react';
import { useUpdate } from 'ahooks';
import EventEmitter from 'eventemitter3';

type DisplayView = 'WalletList' | 'SignLogin';

export class LoginController extends EventEmitter {
  private displayView: DisplayView = 'WalletList';

  public constructor() {
    super();
    this.emit('onChange', '1', '2');
  }

  public apply(op: { type: 'showWalletList' }) {}
}

const LoginConnext = createContext<LoginController | null>(null);

export function LoginProvider(props: React.PropsWithChildren<unknown>) {
  const onUpdate = useUpdate();

  const loginController = useMemo(() => {
    const controller = new LoginController();
    controller.on('onChange', (a, b) => {
      console.info('=================1=====', a, b);
    });
    return controller;
  }, []);

  return (
    <LoginConnext.Provider value={loginController}>
      {props.children}
    </LoginConnext.Provider>
  );
}

export function useLoginController() {
  const context = useContext(LoginConnext);

  if (!context) throw new Error('no LoginConnext');

  return context;
}
