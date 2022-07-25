import { HttpClient } from '@3auth/helpers';
import {
  AuthServerAdapter,
  AuthToken,
  ChangeUserInfoDto,
  LoginLauncherSdk,
  SiginNonce,
  UserInfoDto,
} from '@3auth/core';
import { random } from 'lodash';

export class Web3AuthServerAdapter extends AuthServerAdapter {
  private httpClient: HttpClient;

  public constructor(serverUrl: string) {
    super();

    this.httpClient = new HttpClient(serverUrl, () => {
      return LoginLauncherSdk.getToken() ?? '';
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
}
