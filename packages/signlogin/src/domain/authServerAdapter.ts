import { Bytes } from '@3auth/core';
import { ChangeUserInfoDto, UserInfoDto } from './userInfo';

export type AuthToken = string;

export type SiginNonce = string;

export abstract class AuthServerAdapter {
  public abstract getSiginNonce(): Promise<SiginNonce>;

  public abstract walletAuthLogin(
    account: string,
    hexsign: string | Bytes,
    nonce: string,
  ): Promise<AuthToken>;

  public abstract getMyInfo(): Promise<UserInfoDto>;

  public abstract setUserInfo(dto: ChangeUserInfoDto): Promise<boolean>;
}
