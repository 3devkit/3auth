export interface EthereumChainInfo {
  chainId: number;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: 18;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[];
}

export class EthereumChainInfoHelper {
  public static getRinkeby(rpcUrls: string[] = []): EthereumChainInfo {
    return {
      chainId: 4,
      rpcUrls,
      chainName: 'Ethereum Rinkeby',
      nativeCurrency: {
        name: 'Ethereum Rinkeby',
        symbol: 'ETH',
        decimals: 18,
      },
      blockExplorerUrls: ['https://rinkeby.etherscan.io'],
    };
  }

  public static getMainnet(rpcUrls: string[] = []): EthereumChainInfo {
    return {
      chainId: 1,
      rpcUrls,
      chainName: 'Ethereum Mainnet',
      nativeCurrency: {
        name: 'Ethereum Mainnet',
        symbol: 'ETH',
        decimals: 18,
      },
      blockExplorerUrls: ['https://etherscan.io'],
    };
  }
}
