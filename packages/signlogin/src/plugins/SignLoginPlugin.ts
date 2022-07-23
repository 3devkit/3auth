import { WalletConnectorSdk, WalletState } from '@3auth/core';
import { LoginLauncherSdk } from '../application';
import { LoginState } from '../domain/loginState';
import { SignLoginServerAdapter } from './SignLoginServerAdapter';

interface SignLoginPluginContext {
  walletState: WalletState;
  walletConnector: WalletConnectorSdk;
  authServerAdapter: SignLoginServerAdapter;
}

export class SignLoginPlugin {
  public constructor(private loginLauncher: LoginLauncherSdk) {}

  private context!: SignLoginPluginContext;

  public setContext(context: SignLoginPluginContext) {
    this.context = context;
  }

  public async signLogin(): Promise<LoginState> {
    this.loginLauncher.beginLogin();

    try {
      const account = this.context.walletState.account;

      if (account) {
        const nonce = await this.context.authServerAdapter.getSiginNonce();
        const hexsign = await this.context.walletConnector.signMessage(nonce);
        const token = await this.context.authServerAdapter.auth(
          account,
          hexsign,
          nonce,
        );

        console.info('=======signLogin======', account, nonce, hexsign, token);

        this.loginLauncher.loginSuccess(account, token);
      }
    } catch (error) {
      this.loginLauncher.loginFail();
    }

    return this.loginLauncher.loginState;
  }

  public signout() {
    console.info('======signout====');

    this.loginLauncher.signout();
    this.context.walletConnector.disconnect();
  }
}
