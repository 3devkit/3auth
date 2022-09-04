export abstract class OAuth {
  public static KEY = 'BindOAuthRedirectUrl';

  protected saveCurrFromPageUrl() {
    localStorage.setItem(OAuth.KEY, location.href);
  }

  protected getFromPageUrl(): string {
    const redirectUrl = localStorage.getItem(OAuth.KEY) ?? '/';

    localStorage.removeItem(OAuth.KEY);

    return redirectUrl;
  }
}
