export interface AuthSdkConfigProps {
  isSignLogin: boolean;
  serverUrl: string;
  namespace?: string;
}

export class AuthSdkConfig {
  public isSignLogin: boolean;
  public serverUrl: string;
  public namespace: string;

  public constructor(props: AuthSdkConfigProps) {
    const { isSignLogin, serverUrl, namespace } = props;
    this.isSignLogin = isSignLogin;
    this.serverUrl = serverUrl;
    this.namespace = namespace ?? '';
  }
}
