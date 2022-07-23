import React from 'react';
import { BaseProvider, BaseConnector, Bytes } from '@3auth/core';
import { ReactComponent as PhantomIcon } from './phantom.svg';
import {
  Connection,
  PublicKey,
  SendOptions,
  Transaction,
  TransactionSignature,
} from '@solana/web3.js';

interface PhantomProvider extends BaseProvider {
  isPhantom?: boolean;
  isConnected: () => boolean;
  disconnect: () => Promise<void>;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
  signAndSendTransaction: (
    transaction: Transaction,
    options?: SendOptions,
  ) => Promise<{ signature: TransactionSignature }>;
  signMessage: (message: Uint8Array) => Promise<{ signature: Uint8Array }>;
  connect: (...arg: any) => Promise<{
    publicKey: PublicKey;
  }>;
}

export class PhantomConnector extends BaseConnector<PhantomProvider> {
  public readonly name = 'Phantom';

  public readonly installUrl = 'https://phantom.app/download';

  public get icon(): JSX.Element {
    return <PhantomIcon />;
  }

  protected initialization(): void {
    this.provider.on('accountChanged', publicKey => {
      if (publicKey) {
        this.actions.accountsChanged(publicKey.toString());
      }
    });
  }

  public get isInstalled(): boolean {
    return !!this.anyWindow?.phantom?.solana;
  }

  protected getProvider() {
    if (this.isInstalled) {
      const provider = this.anyWindow?.phantom?.solana as PhantomProvider;
      if (provider.isPhantom) {
        return provider;
      }
    }

    throw new Error('no provider');
  }

  public async connect(props: { eagerly: boolean }): Promise<void> {
    const { eagerly } = props;

    this.actions.beginConnect(eagerly);

    try {
      const account = await new PhantomRepo(this.provider).reqPublicKey({
        eagerly,
      });

      this.actions.connectSuccess({ account });
    } catch (error) {
      this.actions.connectFail();
    }
  }

  public async signMessage(message: string): Promise<string | Bytes> {
    const encodedMessage = new TextEncoder().encode(message);

    const { signature } = await this.provider.signMessage(encodedMessage);

    return signature;
  }

  public async disconnect(): Promise<void> {
    await this.provider.disconnect();
  }
}

class PhantomRepo {
  public constructor(private provider: PhantomProvider) {}

  public async reqPublicKey(props: { eagerly: boolean }): Promise<string> {
    const resp = await this.provider.connect({ onlyIfTrusted: props.eagerly });
    return resp.publicKey.toString();
  }
}
