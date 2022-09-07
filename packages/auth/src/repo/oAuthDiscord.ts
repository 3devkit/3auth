import { AuthSdkConfig, Web3AuthServerAdapter } from '../application';
import { OAuth, ParamVo } from './oAuth';

export interface BindDiscordProps {
  state: string;
  code: string;
}

export class OAuthDiscordRepo extends OAuth {
  public constructor(
    _config: AuthSdkConfig,
    private _serverAdapter: Web3AuthServerAdapter,
  ) {
    super(_config);
  }

  public async login(callbackUrl: string): Promise<void> {
    const url = `${location.origin}${callbackUrl}`;

    const authorizationUrl = await this._serverAdapter.reqDiscordLoginUrl(url);

    this.beginLogin();

    location.href = authorizationUrl;
  }

  public async bind(props: BindDiscordProps) {
    await this._serverAdapter.bindDiscord(props.state, props.code);

    this.bindEnd();
  }
}

export interface DiscordParamDto {
  code?: string;
  state?: string;
  error?: string;
}

export class DiscordParamVo extends ParamVo {
  public constructor(private dto: DiscordParamDto) {
    super();
  }

  public get isDenied(): boolean {
    return this.dto.error === 'access_denied';
  }

  public get isSuccess(): boolean {
    return !!this.dto.code && !!this.dto.state;
  }

  public getBindParam(): BindDiscordProps {
    return {
      code: this.dto.code!,
      state: this.dto.state!,
    };
  }
}
