export interface AuthSdkConfigProps {
  isSignLogin: boolean;
  serverUrl: string;
}

export class AuthSdkConfig {
  public isSignLogin: boolean;
  public serverUrl: string;

  public constructor(props: AuthSdkConfigProps) {
    const { isSignLogin, serverUrl } = props;
    this.isSignLogin = isSignLogin;
    this.serverUrl = serverUrl;
  }
}
