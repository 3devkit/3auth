import { Web3AuthServerAdapter } from '../application';
import { OAuth } from './oAuth';

export interface BindDiscordProps {
  state: string;
  code: string;
}

export class OAuthDiscordRepo extends OAuth {
  public constructor(private _serverAdapter: Web3AuthServerAdapter) {
    super();
  }

  public async login(callbackUrl: string): Promise<void> {
    const url = `${location.origin}${callbackUrl}`;

    const authorizationUrl = await this._serverAdapter.reqDiscordLoginUrl(url);

    this.saveCurrFromPageUrl();

    location.href = authorizationUrl;
  }

  public async bind(props: BindDiscordProps): Promise<string | null> {
    const isSuccess = await this._serverAdapter.bindDiscord(
      props.state,
      props.code,
    );

    if (!isSuccess) return null;

    return this.getFromPageUrl();
  }
}
