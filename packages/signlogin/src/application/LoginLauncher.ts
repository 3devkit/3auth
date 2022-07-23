import { Actions, Store } from '../domain';
import { AuthServerAdapter } from '../domain/authServerAdapter';
import { LoginState } from '../domain/loginState';
import { UserInfo } from '../domain/userInfo';
import { AuthTokenRepo } from '../repo';

export class LoginLauncherSdk {
  private store: Store;
  private actions: Actions;
  private authTokenRepo: AuthTokenRepo;

  public constructor(public authServer: AuthServerAdapter) {
    this.store = new Store();
    this.actions = new Actions(this.store);
    this.authTokenRepo = new AuthTokenRepo();
  }

  public beginLogin() {
    this.actions.beginLogin();
  }

  public eagerlyLogin() {
    if (this.authTokenRepo.has()) {
      this.actions.beginGetMyInfo();
    }
  }

  public loginSuccess(account: string, token: string) {
    this.authTokenRepo.set(account, token);

    this.actions.loginSuccess(account);
  }

  public getMyInfoSuccess(userInfo: UserInfo) {
    this.actions.getMyInfoSuccess(userInfo);
  }

  public loginFail() {
    this.actions.loginFail();
  }

  public signout() {
    this.authTokenRepo.clear();

    this.actions.signout();
  }

  public get subscribeChange() {
    return this.store.subscribe;
  }

  public get loginState(): LoginState {
    return LoginState.fromDto(this.store.state);
  }
}
