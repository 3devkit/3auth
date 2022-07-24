import { HttpClient } from '@/utils';
import {
  AuthServerAdapter,
  AuthToken,
  ChangeUserInfoDto,
  LoginLauncherSdk,
  SiginNonce,
  UserInfoDto,
} from '@3auth/core';
import { random } from 'lodash';

export class TestAuthServerAdapter extends AuthServerAdapter {
  private httpClient: HttpClient;

  public constructor() {
    super();

    const serverUrl = 'https://test-server.apeu.xyz';

    this.httpClient = new HttpClient(serverUrl, () => {
      return LoginLauncherSdk.getToken() ?? '';
    });
  }

  public async walletSignLogin(
    account: string,
    hexsign: string,
    nonce: string,
  ): Promise<AuthToken> {
    const res = await this.httpClient.post({
      url: '/api/auth',
      data: {
        account,
        hexsign,
        nonce,
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

  public async setUserInfo(dto: ChangeUserInfoDto): Promise<boolean> {
    return true;
  }

  public async getSiginNonce(): Promise<SiginNonce> {
    const res = await this.httpClient.get({
      url: '/api/common/nonce?v=' + random(100000),
    });
    return res.Nonce;
  }

  public async auth(): Promise<AuthToken> {
    return '123456789';
  }
}
