import { WalletConnectorSdk } from '@3auth/core';
import { LoginState } from '../../vo/loginState';
import { Actions } from '../actions';
import { AuthServerAdapter } from '../authServerAdapter';
import { Store } from '../store';

export class WalletSignLoginPlugin {
  public constructor(
    public authServer: AuthServerAdapter,
    public store: Store,
    public actions: Actions,
  ) {}

  public async signLogin(
    walletConnector: WalletConnectorSdk,
  ): Promise<LoginState> {
    this.actions.beginLogin();

    try {
      const account = walletConnector.store.state.account;

      if (account) {
        const nonce = await this.authServer.getSiginNonce();
        const hexsign = await walletConnector.signMessage(nonce);
        const token = await this.authServer.walletSignLogin(
          account,
          hexsign,
          nonce,
        );

        console.info('=======signLogin======', account, nonce, hexsign, token);

        this.actions.loginSuccess(account, token);
      }
    } catch (error) {
      this.actions.loginFail();
    }

    return LoginState.fromDto(this.store.state);
  }
}
