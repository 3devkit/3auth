import Cookies from 'js-cookie';
import { Configure } from '../domain';

export class WalletMemoryRepo {
  private key: string;

  public constructor(public configure: Configure) {
    this.key = `LastConnectedWallet_${configure.appName}`;
  }

  public get() {
    return Cookies.get(this.key);
  }

  public set(walletName: string) {
    Cookies.set(this.key, walletName);
  }

  public clear() {
    Cookies.remove(this.key);
  }
}
