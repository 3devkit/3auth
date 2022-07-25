import { Actions, LoginState, Store } from '../domain';
import { AuthTokenRepo } from '../repo';
import { Class } from 'utility-types';
import { AuthServerAdapter, BaseLoginPlugin } from '../types';

export class LoginLauncherSdk {
  public store: Store;
  public actions: Actions;
  public authServer: AuthServerAdapter;
  private authTokenRepo: AuthTokenRepo;

  public constructor(authServer: AuthServerAdapter) {
    this.authServer = authServer;
    this.store = new Store();
    this.authTokenRepo = new AuthTokenRepo();
    this.actions = new Actions(this.store, this.authTokenRepo);
  }

  public factory<T extends BaseLoginPlugin>(Plugin: Class<T>): T {
    return new Plugin(this.authServer, this.store, this.actions);
  }

  public get loginState(): LoginState {
    return LoginState.fromDto(this.store.state);
  }

  public static getCookies() {
    const tokenRepo = new AuthTokenRepo();
    return tokenRepo.get();
  }
}
