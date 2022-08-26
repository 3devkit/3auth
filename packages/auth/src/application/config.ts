export interface AuthSdkConfigProps {
  isSignLogin: boolean;
  serverUrl: string;
  namespaces?: string;
}

export class AuthSdkConfig {
  public isSignLogin: boolean;
  public serverUrl: string;
  public namespaces: string;

  public constructor(props: AuthSdkConfigProps) {
    const { isSignLogin, serverUrl, namespaces } = props;
    this.isSignLogin = isSignLogin;
    this.serverUrl = serverUrl;
    this.namespaces = namespaces ?? '';
  }
}
