import { Bytes } from '@3auth/core';

type AuthToken = string;
type SiginNonce = string;

export abstract class SignLoginServerAdapter {
  public abstract getSiginNonce(): Promise<SiginNonce>;
  public abstract auth(
    account: string,
    hexsign: string | Bytes,
    nonce: string,
  ): Promise<AuthToken>;
}
