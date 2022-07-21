import { Actions } from '../domain/actions';
import { BaseConnector, Bytes } from '../domain/connector';
import { WalletState } from '../domain/walletstate';
import { Store } from '../domain/store';
import { Configure } from '../domain';
import { WalletMemoryRepo } from '../repo';

export class WalletConnectorSdk {
  private store: Store;
  private actions: Actions;
  public connectors: BaseConnector[] = [];
  public connector?: BaseConnector;
  private _walletMemoryRepo: WalletMemoryRepo;

  public constructor(public configure: Configure) {
    this.store = new Store();
    this.actions = new Actions(this.store);
    this._walletMemoryRepo = new WalletMemoryRepo(this.configure);
  }

  /**
   * addConnector
   * @param createFun
   */
  public addConnector(
    createFun: (actions: Actions, configure: Configure) => BaseConnector,
  ) {
    this.connectors.push(createFun(this.actions, this.configure));
  }

  /**
   * connect
   * @param walletName
   * @returns
   */
  public async connect(walletName: string) {
    this.connector = this._findConnector(walletName);

    if (!this.connector) throw new Error(`no wallet by ${walletName}`);

    await this.connector.connect({ eagerly: false });

    this._walletMemoryRepo.set(walletName);

    return WalletState.fromDto(this.store.state);
  }

  /**
   * signMessage
   * @param message
   * @returns
   */
  public async signMessage(message: string): Promise<string | Bytes> {
    return await this.connector!.signMessage(message);
  }

  /**
   * eagerly Connect
   */
  public async eagerlyConnect(): Promise<void> {
    const walletName = this._walletMemoryRepo.get();
    if (!walletName) return;

    this.connector = this._findConnector(walletName);
    if (!this.connector) return;

    await this.connector.connect({ eagerly: true });
  }

  /**
   * Disconnect Wallet
   */
  public async disconnect(): Promise<void> {
    await this.connector?.disconnect();

    this.actions.disconnect();

    this._walletMemoryRepo.clear();
  }

  /**
   * subscribeChange
   */
  public get subscribeChange() {
    return this.store.subscribe;
  }

  private _findConnector(connectorName: string): BaseConnector | undefined {
    return this.connectors.find(c => c.name === connectorName);
  }
}
