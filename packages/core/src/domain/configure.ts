import { EthereumChainInfo } from '@3auth/helpers';

export interface ConfigureParam {
  appName: string;
  defaultConnectChainId: number;
  isSignLogin: boolean;
  signNoceMessage: string;
  supportedEthereumChain: EthereumChainInfo[];
}

export class Configure {
  public constructor(
    public appName: string,
    public defaultConnectChainId: number,
    public isSignLogin: boolean,
    public signNoceMessage: string,
    public supportedEthereumChain: EthereumChainInfo[],
  ) {}

  public static fromParam(dto: ConfigureParam) {
    return new Configure(
      dto.appName,
      dto.defaultConnectChainId,
      dto.isSignLogin,
      dto.signNoceMessage,
      dto.supportedEthereumChain,
    );
  }

  public getEthereumChainInfo(chainId: number) {
    return this.supportedEthereumChain.find(chain => chain.chainId === chainId);
  }
}
