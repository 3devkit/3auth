import { createStore, StoreApi } from 'zustand';

export class BaseStore<T extends object = object> {
  public originalStore: StoreApi<T>;

  public constructor(data: T) {
    this.originalStore = this.createDataStore(data);
  }

  private createDataStore(data: T): StoreApi<T> {
    return createStore<T>(() => data);
  }

  public get update() {
    return this.originalStore.setState;
  }

  public get subscribe() {
    return this.originalStore.subscribe;
  }

  public get destroy() {
    return this.originalStore.destroy;
  }

  public get state() {
    return this.originalStore.getState();
  }
}
