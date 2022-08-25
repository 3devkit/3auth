import { HttpClient } from '@3auth/helpers';
import {
  AuthServerAdapter,
  AuthToken,
  ChangeUserInfoDto,
  SiginNonce,
  UserInfoDto,
} from '@3auth/core';
import { random } from 'lodash';
import { AuthSdk } from './auth';
import { AuthSdkConfig } from './config';

export class Web3AuthServerAdapter extends AuthServerAdapter {
  private httpClient: HttpClient;

  public constructor(public config: AuthSdkConfig) {
    super();

    this.httpClient = new HttpClient(config.serverUrl, () => {
      return AuthSdk.getCookies(config.appName).token ?? '';
    });
  }

  public async walletSignLogin(
    account: string,
    hexsign: string,
    nonce: string,
    wallet: string,
  ): Promise<AuthToken> {
    const res = await this.httpClient.post({
      url: '/api/auth',
      data: {
        account,
        hexsign,
        nonce,
        wallet,
      },
    });
    return res.authorization;
  }

  public async getMyInfo(): Promise<UserInfoDto> {
    const userInfoDto = (await this.httpClient.get({
      url: '/api/user',
    })) as UserInfoDto;

    return userInfoDto;
  }

  public async updateUserInfo(changeInfo: ChangeUserInfoDto): Promise<boolean> {
    try {
      await this.httpClient.put({
        url: '/api/user',
        data: changeInfo,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  public async getSiginNonce(): Promise<SiginNonce> {
    const res = await this.httpClient.get({
      url: '/api/common/nonce?v=' + random(100000),
    });
    return res.Nonce;
  }

  public async reqTwitterLoginUrl(callbackUrl: string): Promise<string> {
    const res = await this.httpClient.get({
      url: '/api/auth/twitter',
      params: {
        callbackUrl,
      },
    });

    return res.authorizationUrl as string;
  }

  public async bindTwitter(
    oauth_token: string,
    oauth_verifier: string,
  ): Promise<boolean> {
    try {
      const res = await this.httpClient.get({
        url: '/api/auth/twitter/callback',
        params: {
          oauth_token,
          oauth_verifier,
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
