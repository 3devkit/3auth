import { Store } from './store';

export class Actions {
  public constructor(private store: Store) {}

  public beginLogin(eagerly: boolean) {
    if (eagerly) {
      this.store.update({ eagerlyLoggingin: true });
    } else {
      this.store.update({ loggingin: true });
    }
  }

  public loginSuccess(props: { userInfo: any }) {
    const { userInfo } = props;
    this.store.update({
      loggingin: false,
      eagerlyLoggingin: false,
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
      loggingin: false,
      eagerlyLoggingin: false,
      userInfo: undefined,
    });
  }
}
