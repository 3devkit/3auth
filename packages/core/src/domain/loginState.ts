import { LoginStateType, StoreDto, UserInfo } from '../domain';

export class LoginState {
  public constructor(
    private loginState: LoginStateType = 'notLogin',
    public account?: string | undefined,
    public userInfo?: UserInfo | undefined,
  ) {}

  public static fromDto(dto: StoreDto) {
    return new LoginState(dto.loginState, dto.account, dto.userInfo);
  }

  public get isLogged(): boolean {
    if (this.loginState === 'loginSuccessful' && !this.account) {
      throw new Error('no account');
    }
    return this.loginState === 'loginSuccessful';
  }

  public get hasUserInfo() {
    return !!this.userInfo;
  }

  public get isLoggingin() {
    return this.loginState === 'loggingin';
  }

  public get isMyInfoGetting() {
    return this.loginState === 'loginSuccessful' && !this.userInfo;
  }
}
