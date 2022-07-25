import { LoginLauncherSdk } from '@3auth/core';
import { WalletSignLoginPlugin } from '@3auth/plugin-walletsign';

export class Plugins {
  public constructor(private _loginLauncher: LoginLauncherSdk) {}

  public get walletLoginPlugin() {
    return this._loginLauncher.factory(WalletSignLoginPlugin);
  }
}
