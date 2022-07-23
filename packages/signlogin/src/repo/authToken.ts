import Cookies from 'js-cookie';
import { isExpired } from 'react-jwt';

export class AuthTokenRepo {
  private AuthTokenKey = 'CURR_ACCOUNT';

  public set(account: string, token: string) {
    Cookies.set(this.AuthTokenKey, account);
    Cookies.set(account, token);
  }

  public has(): boolean {
    const { account, token } = this.get();
    return !!(account && token);
  }

  public get(): { account: string | null; token: string | null } {
    const nullValue = { account: null, token: null };

    const account = Cookies.get(this.AuthTokenKey) ?? null;
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
    const account = Cookies.get(this.AuthTokenKey);
    if (account) {
      Cookies.remove(this.AuthTokenKey);
      Cookies.remove(account);
    }
  }
}
