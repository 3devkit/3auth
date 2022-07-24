import { ChangeUserInfoDto, UserInfoDto } from '../domain';

export type AuthToken = string;

export type SiginNonce = string;

export abstract class AuthServerAdapter {
  public abstract getSiginNonce(): Promise<SiginNonce>;

  public abstract walletSignLogin(
    account: string,
    hexsign: string,
    nonce: string,
    wallet: string,
  ): Promise<AuthToken>;

  public abstract getMyInfo(): Promise<UserInfoDto>;

  public abstract setUserInfo(dto: ChangeUserInfoDto): Promise<boolean>;
}
