import { Actions, Store } from '../domain';
import { LoginState } from '../domain/loginState';
import { AuthServerAdapter } from './authServer';

export class BaseLoginPlugin {
  public constructor(
    protected authRepo: AuthServerAdapter,
    protected store: Store,
    protected actions: Actions,
  ) {}

  public get loginState() {
    return LoginState.fromDto(this.store.state);
  }
}
