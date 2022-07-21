import type { EventEmitter } from 'node:events';

interface RequestArguments {
  readonly method: string;
  readonly params?: readonly unknown[] | object;
}

export interface BaseProvider extends EventEmitter {
  request: (args: RequestArguments) => Promise<unknown>;
}

export interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}
