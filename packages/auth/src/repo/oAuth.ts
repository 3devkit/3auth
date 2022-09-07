import { AuthSdkConfig } from '../application';

export class OAuth {
  public constructor(private _config: AuthSdkConfig) {}

  public static REDIRECT_KEY = 'BindOAuthRedirectUrl';
  public static NAMESPACE_KEY = 'BindOAuthNamespace';

  public static getBindNamespace(): string | undefined {
    return localStorage.getItem(OAuth.NAMESPACE_KEY) ?? undefined;
  }

  public static getRedirectUrl(): string {
    return localStorage.getItem(OAuth.REDIRECT_KEY) ?? '/';
  }

  protected beginLogin() {
    localStorage.setItem(OAuth.REDIRECT_KEY, location.href);
    localStorage.setItem(OAuth.NAMESPACE_KEY, this._config.namespace);
  }

  protected bindEnd(): string {
    localStorage.removeItem(OAuth.REDIRECT_KEY);
    localStorage.removeItem(OAuth.NAMESPACE_KEY);
    return OAuth.getRedirectUrl();
  }
}

export abstract class ParamVo {
  public abstract get isDenied(): boolean;

  public abstract get isSuccess(): boolean;

  public abstract getBindParam(): Record<any, any>;
}
