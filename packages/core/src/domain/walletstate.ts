import { StoreDto } from './store';

export class WalletState {
  public constructor(private connecting: boolean = false, public chainId?: number, public account?: string) {}

  public static fromDto(dto: StoreDto) {
    return new WalletState(dto.connecting, dto.chainId, dto.account);
  }

  public get isConnected() {
    return !!this.account;
  }

  public get isConnecting() {
    return this.connecting;
  }

  public dto() {
    return {
      isConnecting: this.isConnecting,
      isConnected: this.isConnected,
      chainId: this.chainId,
      account: this.account,
    };
  }
}
