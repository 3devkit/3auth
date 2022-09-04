import { Web3AuthServerAdapter } from '../application';
import { OAuth } from './oAuth';

export interface BindTwitterProps {
  oauth_token: string;
  oauth_verifier: string;
}

export class OAuthTwitterRepo extends OAuth {
  public constructor(private _serverAdapter: Web3AuthServerAdapter) {
    super();
  }

  public async login(callbackUrl: string): Promise<void> {
    const url = `${location.origin}${callbackUrl}`;

    const authorizationUrl = await this._serverAdapter.reqTwitterLoginUrl(url);

    this.saveCurrFromPageUrl();

    location.href = authorizationUrl;
  }

  public async bind(props: BindTwitterProps): Promise<string | null> {
    const isSuccess = await this._serverAdapter.bindTwitter(
      props.oauth_token,
      props.oauth_verifier,
    );

    if (!isSuccess) return null;

    return this.getFromPageUrl();
  }
}
