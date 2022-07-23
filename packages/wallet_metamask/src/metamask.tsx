import React from 'react';
import { EthConnector, BaseProvider, Bytes } from '@3auth/core';
import { EthereumChainInfo } from '@3auth//helpers';
import { ReactComponent as MetaMaskIcon } from './metamask.svg';

interface MetamaskProvider extends BaseProvider {
  isMetaMask: boolean;
}

export class MetamaskConnector extends EthConnector<MetamaskProvider> {
  public readonly name = 'Metamask';

  public readonly installUrl = 'https://metamask.io/download';

  public get icon(): JSX.Element {
    return <MetaMaskIcon />;
  }

  protected initialization(): void {
    this.provider.on('chainChanged', (chainId: string): void => {
      this.actions.chainChanged(parseChainId(chainId));
    });

    this.provider.on('accountsChanged', (accounts: string[]): void => {
      if (accounts.length > 0) {
        this.actions.accountsChanged(accounts[0]);
      } else {
        this.actions.disconnect();
      }
    });
  }

  protected getProvider() {
    if (this.isInstalled) {
      return this.anyWindow?.ethereum as MetamaskProvider;
    }
    throw new Error('no provider');
  }

  public get isInstalled(): boolean {
    return !!this.anyWindow?.ethereum?.isMetaMask;
  }

  public async connect(props: { eagerly: boolean }): Promise<void> {
    const { eagerly } = props;

    this.actions.beginConnect(eagerly);

    try {
      const repo = new MetamaskRepo(this.provider);
      const account = await repo.reqAccount({ eagerly });
      const chainId = await repo.reqChainId();

      if (!eagerly) {
        await this._handleChain(chainId);
      }

      this.actions.connectSuccess({ account, chainId });
    } catch (error) {
      this.actions.connectFail();
    }
  }

  public async signMessage(message: string): Promise<string> {
    const signer = this.web3Provider.getSigner();

    return await signer.signMessage(message);
  }

  private async _handleChain(currChainId: number) {
    const repo = new MetamaskRepo(this.provider);

    if (currChainId === this.configure.defaultConnectChainId) return;

    try {
      await repo.reqSwitchChain(this.configure.defaultConnectChainId);
    } catch (error) {
      const e = error as any;
      if (e.code === 4902) {
        const chainInfo = this.configure.getEthereumChainInfo(
          this.configure.defaultConnectChainId,
        );
        if (chainInfo) {
          await repo.reqAddChain(chainInfo);
        }
      }
    }
  }

  public async disconnect(): Promise<void> {}
}

class MetamaskRepo {
  public constructor(private provider: MetamaskProvider) {}

  public async reqChainId(): Promise<number> {
    const chainId = (await this.provider.request({
      method: 'eth_chainId',
    })) as string;

    return parseChainId(chainId);
  }

  public async reqAccount(props: { eagerly: boolean }): Promise<string> {
    const resp = await this.provider.request({
      method: props.eagerly ? 'eth_accounts' : 'eth_requestAccounts',
    });

    const accounts = resp as string[];

    return accounts[0];
  }

  public async reqSwitchChain(chainId: number): Promise<void> {
    await this.provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
  }

  public async reqAddChain(
    ethereumChainInfo: EthereumChainInfo,
  ): Promise<void> {
    const addChainInfo = {
      ...ethereumChainInfo,
      chainId: `0x${ethereumChainInfo.chainId.toString(16)}`,
    };

    await this.provider.request({
      method: 'wallet_addEthereumChain',
      params: [{ ...addChainInfo }],
    });
  }
}

function parseChainId(chainId: string) {
  return Number.parseInt(chainId, 16);
}
