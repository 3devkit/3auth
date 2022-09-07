import { AuthSdkConfig, Web3AuthServerAdapter } from '../application';
import { OAuth, ParamVo } from './oAuth';

export interface BindTwitterProps {
  oauth_token: string;
  oauth_verifier: string;
}

export class OAuthTwitterRepo extends OAuth {
  public constructor(
    _config: AuthSdkConfig,
    private _serverAdapter: Web3AuthServerAdapter,
  ) {
    super(_config);
  }

  public async login(callbackUrl: string): Promise<void> {
    const url = `${location.origin}${callbackUrl}`;

    const authorizationUrl = await this._serverAdapter.reqTwitterLoginUrl(url);

    this.beginLogin();

    location.href = authorizationUrl;
  }

  public async bind(props: BindTwitterProps) {
    await this._serverAdapter.bindTwitter(
      props.oauth_token,
      props.oauth_verifier,
    );

    this.bindEnd();
  }
}

export interface TwitterParamDto {
  oauth_token?: string;
  oauth_verifier?: string;
  denied?: string;
}

export class TwitterParamVo extends ParamVo {
  public constructor(private dto: TwitterParamDto) {
    super();
  }

  public get isDenied(): boolean {
    return !!this.dto.denied;
  }

  public get isSuccess(): boolean {
    return !!this.dto.oauth_token && !!this.dto.oauth_verifier;
  }

  public getBindParam() {
    return {
      oauth_token: this.dto.oauth_token!,
      oauth_verifier: this.dto.oauth_verifier!,
    };
  }
}
