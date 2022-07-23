import { createStore, StoreApi } from 'zustand';
import { UserInfo } from './userInfo';

export type StoreDto = StoreData;

export type LoginStateType =
  | 'notLogin'
  | 'loggingin'
  | 'loginSuccessful'
  | 'myInfoGetting'
  | 'myInfoGetSuccessful';

export interface StoreData {
  loginState: LoginStateType;
  account: string | undefined;
  userInfo: UserInfo | undefined;
}

function createDataStore(data: StoreData): StoreApi<StoreData> {
  return createStore<StoreData>(() => data);
}

export class Store {
  public store: StoreApi<StoreData>;

  public constructor() {
    this.store = createDataStore({
      loginState: 'notLogin',
      account: undefined,
      userInfo: undefined,
    });
  }

  public get update() {
    return this.store.setState;
  }

  public get subscribe() {
    return this.store.subscribe;
  }

  public get destroy() {
    return this.store.destroy;
  }

  public get state() {
    return this.store.getState();
  }
}
