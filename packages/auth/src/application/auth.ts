import {
  UserInfo,
  LoginLauncherSdk,
  ChangeUserInfoDto,
  LoginState,
} from '@3auth/core';
import { AuthProvider, Web3AuthServerAdapter } from './server';
import { Plugins } from './plugins';
import { WalletConnectorSdk } from '@3walletconnector/react';
import { AuthSdkConfig, AuthSdkConfigProps } from './config';
import { BindDiscordProps, OAuthDiscordRepo } from '../repo/oAuthDiscord';
import { BindTwitterProps, OAuthTwitterRepo } from '../repo/oAuthTwitter';
import jwt from 'jsonwebtoken';

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

  /**
   * get my info
   */
  public get myInfo(): UserInfo | undefined {
    return this.loginLauncher.loginState.userInfo;
  }

  /**
   * get login status
   */
  public get loginState(): LoginState {
    return this.loginLauncher.loginState;
  }

  /**
   * https request my info
   * @returns
   */
  public async reqMyInfo(): Promise<UserInfo> {
    const dto = await this._serverAdapter.getMyInfo();

    return UserInfo.fromDto(dto);
  }

  /**
   * refresh Token
   */
  public async refreshToken() {
    const { account } = this.getCookies();

    if (account) {
      const authorization = await this._serverAdapter.refreshToken();

      this.loginLauncher.actions.refreshToken(account, authorization);
    }
  }

  /**
   * update my info
   * @param changeInfo
   * @returns
   */
  public async updateMyInfo(changeInfo: ChangeUserInfoDto): Promise<boolean> {
    return await this._serverAdapter.updateUserInfo(changeInfo);
  }

  /**
   * signout
   * @returns
   */
  public async signout(): Promise<void> {
    this.walletConnector.disconnect();
    return this.loginLauncher.actions.signout();
  }

  /**
   * twitter login
   * @param callbackUrl
   * @returns
   */
  public async twitterLogin(callbackUrl: string = '/login/twitter/callback') {
    return await new OAuthTwitterRepo(this._serverAdapter).login(callbackUrl);
  }

  /**
   * bind twitter
   * @param props
   * @returns
   */
  public async bindTwitter(props: BindTwitterProps) {
    return await new OAuthTwitterRepo(this._serverAdapter).bind(props);
  }

  /**
   * discord login
   * @param callbackUrl
   * @returns
   */
  public async discordLogin(callbackUrl: string = '/login/discord/callback') {
    return await new OAuthDiscordRepo(this._serverAdapter).login(callbackUrl);
  }

  /**
   * bind discord
   * @param props
   * @returns
   */
  public async bindDiscord(props: BindDiscordProps) {
    return await new OAuthDiscordRepo(this._serverAdapter).bind(props);
  }

  /**
   * remove bind
   * @param authProvider
   * @returns
   */
  public async removeBind(authProvider: AuthProvider): Promise<boolean> {
    return this._serverAdapter.removeBind(authProvider);
  }

  public getCookies() {
    return this.loginLauncher.authTokenRepo.get();
  }

  public static getCookies(namespaces: string = '') {
    return LoginLauncherSdk.getCookies(namespaces);
  }
}
