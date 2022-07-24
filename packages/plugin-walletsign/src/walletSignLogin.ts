import { WalletConnectorSdk } from '@3walletconnector/core';
import { LoginState, BaseLoginPlugin } from '@3auth/core';

export class WalletSignLoginPlugin extends BaseLoginPlugin {
  public async signLogin(
    walletConnector: WalletConnectorSdk,
  ): Promise<LoginState> {
    this.actions.beginLogin();

    try {
      const account = walletConnector.store.state.account;

      if (account) {
        const nonce = await this.authRepo.getSiginNonce();
        const hexsign = await walletConnector.signMessage(nonce);
        const token = await this.authRepo.walletSignLogin(
          account,
          hexsign,
          nonce,
        );

        console.info('=======signLogin=account=====', account);
        console.info('=======signLogin=nonce=====', nonce);
        console.info('=======signLogin=hexsign=====', hexsign);

        this.actions.loginSuccess(account, token);
      }
    } catch (error) {
      this.actions.loginFail();
    }

    return this.loginState;
  }
}
