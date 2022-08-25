import Cookies from 'js-cookie';
import { isExpired } from 'react-jwt';

export class AuthTokenRepo {
  private AUTH_TOKEN_KEY: string;

  public constructor(appName: String) {
    this.AUTH_TOKEN_KEY = appName + '_CURR_ACCOUNT';
  }

  public set(account: string, token: string) {
    Cookies.set(this.AUTH_TOKEN_KEY, account);
    Cookies.set(account, token);
  }

  public has(): boolean {
    const { account, token } = this.get();
    return !!(account && token);
  }

  public get(): { account: string | null; token: string | null } {
    const nullValue = { account: null, token: null };

    const account = Cookies.get(this.AUTH_TOKEN_KEY) ?? null;
    const token = account ? Cookies.get(account) ?? null : null;

    if (account && token) {
      const isExpiredBool = isExpired(token);
      if (isExpiredBool) {
        this.clear();
        return nullValue;
      }
    }

    return {
      account,
      token,
    };
  }

  public clear() {
    const account = Cookies.get(this.AUTH_TOKEN_KEY);

    if (account) {
      Cookies.remove(this.AUTH_TOKEN_KEY);
      Cookies.remove(account);
    }
  }
}
