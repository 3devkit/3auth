import { Store } from './store';
import { UserInfo } from './userInfo';

export class Actions {
  public constructor(private store: Store) {}

  public beginLogin() {
    this.store.update({ loginState: 'loggingin' });
  }

  public loginSuccess(account: string) {
    this.store.update({
      loginState: 'loginSuccessful',
      account,
    });
  }

  public beginGetMyInfo() {
    this.store.update({ loginState: 'myInfoGetting' });
  }

  public getMyInfoSuccess(userInfo: UserInfo) {
    this.store.update({
      loginState: 'myInfoGetSuccessful',
      userInfo,
    });
  }

  public loginFail() {
    this.resetState();
  }

  public signout() {
    this.resetState();
  }

  public resetState() {
    this.store.update({
      loginState: 'notLogin',
      account: undefined,
      userInfo: undefined,
    });
  }
}
