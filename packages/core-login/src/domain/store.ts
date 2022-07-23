import { createStore, StoreApi } from 'zustand';

export type StoreDto = StoreData;

export interface StoreData {
  eagerlyLoggingin: boolean;
  loggingin: boolean;
  userInfo?: any;
}

function createDataStore(defData: StoreData): StoreApi<StoreData> {
  return createStore<StoreData>(() => defData);
}

export class Store {
  private store: StoreApi<StoreData>;

  public constructor() {
    this.store = createDataStore({
      eagerlyLoggingin: false,
      loggingin: false,
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
