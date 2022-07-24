import { BaseStore } from '../types';
import { UserInfo } from './userInfo';

export type StoreDto = StoreData;

export type LoginStateType =
  | 'notLogin'
  | 'loggingin'
  | 'loginSuccessful'
  | 'myInfoGetSuccessful';

export interface StoreData {
  loginState: LoginStateType;
  account: string | undefined;
  userInfo: UserInfo | undefined;
}

export class Store extends BaseStore<StoreData> {
  public constructor() {
    super({
      loginState: 'notLogin',
      account: undefined,
      userInfo: undefined,
    });
  }
}
