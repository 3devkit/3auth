import { Store } from './store';

export class Actions {
  public constructor(private store: Store) {}

  public beginConnect(eagerly: boolean) {
    if (eagerly) {
      this.store.update({ eagerlyConnecting: true });
    } else {
      this.store.update({ connecting: true });
    }
  }

  public connectSuccess(props: { account: string; chainId?: number }) {
    const { account, chainId } = props;
    this.store.update({
      connecting: false,
      eagerlyConnecting: false,
      account,
      chainId,
    });
  }

  public connectFail() {
    this.resetState();
  }

  public disconnect() {
    this.resetState();
  }

  public chainChanged(chainId: number) {
    this.store.update({ chainId });
  }

  public accountsChanged(account: string) {
    this.store.update({ account });
  }

  public resetState() {
    this.store.update({
      connecting: false,
      eagerlyConnecting: false,
      account: undefined,
    });
  }
}
