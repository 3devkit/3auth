import Cookies from 'js-cookie';
import { isExpired } from 'react-jwt';

export class AuthTokenRepo {
  private AUTH_TOKEN_KEY: string;

  public constructor(namespaces: String) {
    this.AUTH_TOKEN_KEY = namespaces + '_USER';
  }

  public set(account: string, token: string) {
    Cookies.set(this.AUTH_TOKEN_KEY, {
      account,
      token,
    });
  }

  public has(): boolean {
    const { account, token } = this.get();
    return !!(account && token);
  }

  public get(): { account: string | null; token: string | null } {
    const json = Cookies.get(this.AUTH_TOKEN_KEY);

    if (!json) return { account: null, token: null };

    const { account, token } = JSON.parse(json);

    if (isExpired(token)) {
      this.clear();

      return { account: null, token: null };
    }

    return { account, token };
  }

  public clear() {
    Cookies.remove(this.AUTH_TOKEN_KEY);
  }
}
