import { AuthTokenRepo } from '../repo';
import { Store } from './store';
import { UserInfo } from './userInfo';

export class Actions {
  public constructor(
    private store: Store,
    private authTokenRepo: AuthTokenRepo,
  ) {}

  // public exec(
  //   op:
  //     | { type: 'eagerlyLogin' }
  //     | { type: 'beginLogin' }
  //     | { type: 'loginSuccess'; account: string; token: string }
  //     | { type: 'getMyInfoSuccess'; userInfo: UserInfo }
  //     | { type: 'loginFail' }
  //     | { type: 'signout' },
  // ) {
  //   switch (op.type) {
  //     case 'eagerlyLogin': {
  //       const { account, token } = this.authTokenRepo.get();
  //       if (account && token) {
  //         this.exec({ type: 'loginSuccess', account, token });
  //       }
  //       break;
  //     }
  //     case 'beginLogin': {
  //       this.store.update({ loginState: 'loggingin' });
  //       break;
  //     }
  //     case 'loginSuccess': {
  //       const { account, token } = op;
  //       this.authTokenRepo.set(account, token);
  //       this.store.update({
  //         loginState: 'loginSuccessful',
  //         account,
  //       });
  //       break;
  //     }
  //     case 'getMyInfoSuccess': {
  //       const { userInfo } = op;
  //       this.store.update({
  //         loginState: 'myInfoGetSuccessful',
  //         userInfo,
  //       });
  //       break;
  //     }
  //     case 'loginFail': {
  //       this._resetState();
  //       break;
  //     }
  //     case 'signout': {
  //       this.authTokenRepo.clear();
  //       this._resetState();
  //       break;
  //     }
  //   }
  // }

  /**
   * Called when the page is initialized
   */
  public eagerlyLogin() {
    const { account, token } = this.authTokenRepo.get();
    if (account && token) {
      this.loginSuccess(account, token);
    }
  }

  /**
   * [Used in the login plugin]
   * this function is called to change the state when the login is started
   */
  public beginLogin() {
    this.store.update({ loginState: 'loggingin' });
  }

  /**
   * [Used in the login plugin]
   * When the login is successful call this function to change the state
   * @param account
   * @param token
   */
  public loginSuccess(account: string, token: string) {
    this.authTokenRepo.set(account, token);

    this.store.update({
      loginState: 'loginSuccessful',
      account,
    });
  }

  /**
   * When the user information is obtained successfully，
   * call this function to change the state
   * @param userInfo
   */
  public getMyInfoSuccess(userInfo: UserInfo) {
    this.store.update({
      loginState: 'myInfoGetSuccessful',
      userInfo,
    });
  }

  /**
   * Called after login failure
   */
  public loginFail() {
    this._resetState();
  }

  /**
   * Called when the user actively logs out
   */
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
