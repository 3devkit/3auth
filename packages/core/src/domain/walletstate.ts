import { StoreDto } from './store';

export class WalletState {
  public constructor(
    private connecting: boolean = false,
    private eagerlyConnecting: boolean = false,
    public chainId?: number,
    public account?: string,
  ) {}

  public static fromDto(dto: StoreDto) {
    return new WalletState(
      dto.connecting,
      dto.eagerlyConnecting,
      dto.chainId,
      dto.account,
    );
  }

  public get shortAccount() {
    return (
      this.account?.substring(0, 6) +
      '...' +
      this.account?.substring(this.account.length - 4)
    );
  }

  public get isConnected() {
    return !!this.account;
  }

  public get isConnecting() {
    return this.connecting;
  }

  public get isEagerlyConnecting() {
    return this.eagerlyConnecting;
  }

  public dto() {
    return {
      isEagerlyConnecting: this.isEagerlyConnecting,
      isConnecting: this.isConnecting,
      isConnected: this.isConnected,
      chainId: this.chainId,
      account: this.account,
    };
  }
}
