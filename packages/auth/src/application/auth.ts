import {
  UserInfo,
  LoginLauncherSdk,
  ChangeUserInfoDto,
  LoginState,
} from '@3auth/core';
import { Web3AuthServerAdapter } from './server';
import { Plugins } from './plugins';
import { WalletConnectorSdk } from '@3walletconnector/react';
import { AuthSdkConfig, AuthSdkConfigProps } from './config';

export class AuthSdk {
  private _serverAdapter: Web3AuthServerAdapter;
  public loginLauncher: LoginLauncherSdk;
  public plugins: Plugins;
  public config: AuthSdkConfig;
  public walletConnector: WalletConnectorSdk;

  public constructor(
    configProps: AuthSdkConfigProps,
    walletConnector: WalletConnectorSdk,
  ) {
    this.walletConnector = walletConnector;

    this.config = new AuthSdkConfig(configProps);

    this._serverAdapter = new Web3AuthServerAdapter(this.config);

    this.loginLauncher = new LoginLauncherSdk(
      this._serverAdapter,
      this.config.namespaces,
    );

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
    this.walletConnector.disconnect();
    return this.loginLauncher.actions.signout();
  }

  /**
   * 跳转到twitter登录
   * @param callbackUrl 回调地址, /login/twitter/callback为默认回调地址
   */
  public async twitterLogin(
    callbackUrl: string = '/login/twitter/callback',
  ): Promise<void> {
    const url = `${window.location.origin}${callbackUrl}`;

    const authorizationUrl = await this._serverAdapter.reqTwitterLoginUrl(url);

    window.localStorage.setItem('OAuthRedirectUrl', window.location.href);

    window.location.href = authorizationUrl;
  }

  /**
   * 绑定twitter
   * @param oauth_token
   * @param oauth_verifier
   * @returns 绑定成功后重定向的页面
   */
  public async bindTwitter(
    oauth_token: string,
    oauth_verifier: string,
  ): Promise<string | null> {
    const isSuccess = await this._serverAdapter.bindTwitter(
      oauth_token,
      oauth_verifier,
    );

    if (!isSuccess) {
      return null;
    }

    const redirectUrl = window.localStorage.getItem('OAuthRedirectUrl') ?? '/';

    window.localStorage.removeItem('OAuthRedirectUrl');

    return redirectUrl;
  }

  public getCookies() {
    return this.loginLauncher.authTokenRepo.get();
  }

  public static getCookies(namespaces: string = '') {
    return LoginLauncherSdk.getCookies(namespaces);
  }
}
