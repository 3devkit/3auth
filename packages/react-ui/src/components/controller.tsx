import React, { createContext, useContext, useMemo } from 'react';
import EventEmitter from 'eventemitter3';
import { BaseStore } from '@3auth/core';
import { LoginBoxHome } from './LoginBoxHome';
import { SignBox } from './WalletList';
import { useStore } from 'zustand';

type DisplayView = 'home' | 'signLogin';

interface ViewRouter {
  getView: () => JSX.Element;
}

const loginBoxRouter: Record<DisplayView, ViewRouter> = {
  home: {
    getView: () => <LoginBoxHome />,
  },
  signLogin: {
    getView: () => <SignBox />,
  },
};

interface StoreData {
  viewRouter: ViewRouter;
}

class ControllerStore extends BaseStore<StoreData> {
  public constructor() {
    super({
      viewRouter: loginBoxRouter.home,
    });
  }
}

export class LoginBoxController extends EventEmitter {
  public store = new ControllerStore();

  public constructor() {
    super();
  }

  public show(displayView: DisplayView) {
    this.store.update({ viewRouter: loginBoxRouter[displayView] });
  }
}

const LoginConnext = createContext<LoginBoxController | null>(null);

export function LoginProvider(props: React.PropsWithChildren<unknown>) {
  const loginController = useMemo(() => {
    return new LoginBoxController();
  }, []);

  return (
    <LoginConnext.Provider value={loginController}>
      {props.children}
    </LoginConnext.Provider>
  );
}

export function useView() {
  const controller = useLoginBoxController();

  const viewRouter = useStore(
    controller.store.originalStore,
    state => state.viewRouter,
  );

  return viewRouter.getView();
}

export function useLoginBoxController() {
  const context = useContext(LoginConnext);

  if (!context) throw new Error('no LoginConnext');

  return context;
}
