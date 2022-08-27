import { Actions, LoginState, Store } from '../domain';
import { AuthTokenRepo } from '../repo';
import { Class } from 'utility-types';
import { AuthServerAdapter, BaseLoginPlugin } from '../types';

export class LoginLauncherSdk {
  public store: Store;
  public actions: Actions;
  public authServer: AuthServerAdapter;
  public authTokenRepo: AuthTokenRepo;

  public constructor(authServer: AuthServerAdapter, namespaces: string) {
    this.authServer = authServer;
    this.store = new Store();
    this.authTokenRepo = new AuthTokenRepo(namespaces);
    this.actions = new Actions(this.store, this.authTokenRepo);
  }

  public factory<T extends BaseLoginPlugin>(Plugin: Class<T>): T {
    return new Plugin(this.authServer, this.store, this.actions);
  }

  public get loginState(): LoginState {
    return LoginState.fromDto(this.store.state);
  }

  public static getCookies(namespaces: string) {
    const tokenRepo = new AuthTokenRepo(namespaces);
    return tokenRepo.get();
  }
}
