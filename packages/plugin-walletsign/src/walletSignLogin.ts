import { WalletConnectorSdk } from '@3walletconnector/react';
import { LoginState, BaseLoginPlugin } from '@3auth/core';

export class WalletSignLoginPlugin extends BaseLoginPlugin {
  public async signLogin(
    walletConnector: WalletConnectorSdk,
  ): Promise<LoginState> {
    this.actions.beginLogin();

    try {
      const account = walletConnector.store.state.account;

      const walletName = walletConnector.connector?.name;

      if (account && walletName) {
        const nonce = await this.authServer.getSiginNonce();

        const hexsign = await walletConnector.signMessage(nonce);

        const token = await this.authServer.walletSignLogin(
          account,
          hexsign,
          nonce,
          walletName,
        );

        this.actions.loginSuccess(account, token);
      }
    } catch (error) {
      this.actions.loginFail();
    }

    return this.loginState;
  }
}
