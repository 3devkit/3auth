import {
  UserInfo,
  LoginLauncherSdk,
  ChangeUserInfoDto,
  LoginState,
} from '@3auth/core';
import { Web3AuthServerAdapter } from './server';
import { Plugins } from './plugins';
import { WalletConnectorSdk } from '@3walletconnector/core';

export class AuthSdk {
  private _serverAdapter: Web3AuthServerAdapter;
  public loginLauncher: LoginLauncherSdk;
  public plugins: Plugins;

  public constructor(
    public serverUrl: string,
    public walletConnector: WalletConnectorSdk,
  ) {
    this._serverAdapter = new Web3AuthServerAdapter(serverUrl);
    this.loginLauncher = new LoginLauncherSdk(this._serverAdapter);
    this.plugins = new Plugins(this.loginLauncher);
  }

  public initLogin() {
    this.loginLauncher.actions.eagerlyLogin();
  }

  public get store() {
    return this.loginLauncher.store.originalStore;
  }

  public get isLogged(): boolean {
    return this.loginLauncher.loginState.isLogged;
  }

  public get myInfo(): UserInfo | undefined {
    return this.loginLauncher.loginState.userInfo;
  }

  public get loginState(): LoginState {
    return this.loginLauncher.loginState;
  }

  public async reqMyInfo(): Promise<UserInfo> {
    const dto = await this._serverAdapter.getMyInfo();
    return UserInfo.fromDto(dto);
  }

  public async updateMyInfo(changeInfo: ChangeUserInfoDto): Promise<boolean> {
    return await this._serverAdapter.updateUserInfo(changeInfo);
  }

  public async signout(): Promise<void> {
    return this.loginLauncher.actions.signout();
  }
}
