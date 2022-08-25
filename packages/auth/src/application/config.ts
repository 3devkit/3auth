export interface AuthSdkConfigProps {
  isSignLogin: boolean;
  serverUrl: string;
  appName: string;
}

export class AuthSdkConfig {
  public isSignLogin: boolean;
  public serverUrl: string;
  public appName: string;

  public constructor(props: AuthSdkConfigProps) {
    const { isSignLogin, serverUrl, appName } = props;
    this.isSignLogin = isSignLogin;
    this.serverUrl = serverUrl;
    this.appName = appName;
  }
}
