import { Actions, Store } from '../domain';

export class LoginLauncherSdk {
  private store: Store;
  private actions: Actions;

  public constructor() {
    this.store = new Store();
    this.actions = new Actions(this.store);
  }

  public get beginLogin() {
    return this.actions.beginLogin;
  }
}
