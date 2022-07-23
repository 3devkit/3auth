import { Actions, Store } from '../domain';
import { AuthServerAdapter } from '../domain/authServerAdapter';
import { WalletSignLoginPlugin } from '../domain/plugins/walletSignLogin';
import { AuthTokenRepo } from '../repo';
import { LoginState } from '../vo/loginState';

export class LoginLauncherSdk {
  public store: Store;
  public actions: Actions;
  private authTokenRepo: AuthTokenRepo;

  public walletSignLoginPlugin: WalletSignLoginPlugin;

  public constructor(public authServer: AuthServerAdapter) {
    this.store = new Store();
    this.authTokenRepo = new AuthTokenRepo();
    this.actions = new Actions(this.store, this.authTokenRepo);
    this.walletSignLoginPlugin = new WalletSignLoginPlugin(
      authServer,
      this.store,
      this.actions,
    );
  }

  public get subscribeChange() {
    return this.store.subscribe;
  }

  public get loginState(): LoginState {
    return LoginState.fromDto(this.store.state);
  }
}
