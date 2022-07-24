import { Actions, Store } from '../domain';
import { AuthTokenRepo } from '../repo';
import { Class } from 'utility-types';
import { AuthServerAdapter, BaseLoginPlugin } from '../types';

export class LoginLauncherSdk {
  public store: Store;
  public actions: Actions;
  private authTokenRepo: AuthTokenRepo;

  public constructor(public authServerAdapter: AuthServerAdapter) {
    this.store = new Store();
    this.authTokenRepo = new AuthTokenRepo();
    this.actions = new Actions(this.store, this.authTokenRepo);
  }

  public factory<T extends BaseLoginPlugin>(Plugin: Class<T>): T {
    return new Plugin(this.authServerAdapter, this.store, this.actions);
  }

  public static getToken() {
    const tokenRepo = new AuthTokenRepo();
    const { token } = tokenRepo.get();
    return token;
  }
}
