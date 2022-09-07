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

  public abstract updateUserInfo(dto: ChangeUserInfoDto): Promise<boolean>;

  public abstract reqTwitterLoginUrl(callbackUrl: string): Promise<string>;

  public abstract bindTwitter(
    oauth_token: string,
    oauth_verifier: string,
  ): Promise<void>;

  public abstract reqDiscordLoginUrl(callbackUrl: string): Promise<string>;

  public abstract bindDiscord(state: string, code: string): Promise<void>;
}
