import { CLAccountHash, CLByteArray, CLPublicKey, Keys, RuntimeArgs } from "casper-js-sdk";

export type RecipientType = CLPublicKey | CLAccountHash | CLByteArray;

export interface IPendingDeploy {
  deployHash: string;
  deployType: any;
}

export interface IClassContractCallParams {
  keys: Keys.AsymmetricKey;
  entryPoint: string;
  runtimeArgs: RuntimeArgs;
  paymentAmount: string;
  cb?: (deployHash: string) => void;
  ttl: number;
  dependencies?: string[];
}

export interface IContractCallParams {
  nodeAddress: string;
  keys: Keys.AsymmetricKey;
  chainName: string;
  contractHash: string;
  entryPoint: string;
  runtimeArgs: RuntimeArgs;
  paymentAmount: string;
  ttl: number;
  dependencies?: string[];
}
