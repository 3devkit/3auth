import { AuthTokenRepo } from '../repo';
import { Store } from './store';
import { UserInfo } from './userInfo';

export class Actions {
  public constructor(
    private store: Store,
    private authTokenRepo: AuthTokenRepo,
  ) {}

  public beginLogin() {
    this.store.update({ loginState: 'loggingin' });
  }

  public loginSuccess(account: string, token: string) {
    this.authTokenRepo.set(account, token);

    this.store.update({
      loginState: 'loginSuccessful',
      account,
    });
  }

  public getMyInfoSuccess(userInfo: UserInfo) {
    this.store.update({
      loginState: 'myInfoGetSuccessful',
      userInfo,
    });
  }

  public loginFail() {
    this._resetState();
  }

  public signout() {
    this.authTokenRepo.clear();

    this._resetState();
  }

  private _resetState() {
    this.store.update({
      loginState: 'notLogin',
      account: undefined,
      userInfo: undefined,
    });
  }
}
