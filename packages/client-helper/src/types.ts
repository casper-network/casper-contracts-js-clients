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
}

export interface IContractCallParams {
  nodeAddress: string;
  keys: Keys.AsymmetricKey;
  chainName: string;
  entryPoint: string;
  runtimeArgs: RuntimeArgs;
  paymentAmount: string;
  contractHash: string;
  ttl: number;
}
