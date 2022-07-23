import { Web3Provider } from '@ethersproject/providers';
import { Actions } from './actions';
import { Configure } from './configure';

export type Bytes = ArrayLike<number>;

export abstract class BaseConnector<T = any> {
  public constructor(
    protected actions: Actions,
    protected configure: Configure,
  ) {}

  private _onlyProvider?: T;

  public get provider(): T {
    if (!this._onlyProvider) {
      this._onlyProvider = this.getProvider();
      this.initialization();
    }
    return this._onlyProvider;
  }

  protected get anyWindow(): any {
    return window as any;
  }

  protected abstract initialization(): void;

  protected abstract getProvider(): T;

  public abstract get isInstalled(): boolean;

  public abstract get name(): string;

  public abstract get installUrl(): string;

  public abstract get icon(): JSX.Element;

  public abstract connect(props: { eagerly: boolean }): Promise<void>;

  public abstract disconnect(): Promise<void>;

  public abstract signMessage(message: string): Promise<string>;
}

export abstract class EthConnector<T> extends BaseConnector<T> {
  private _onlyWeb3Provider?: Web3Provider;

  public get web3Provider() {
    if (!this._onlyWeb3Provider) {
      this._onlyWeb3Provider = new Web3Provider(this.provider);
    }
    return this._onlyWeb3Provider;
  }
}
