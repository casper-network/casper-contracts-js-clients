import {
  CasperClient,
  CLPublicKey,
  CLAccountHash,
  CLByteArray,
  CLKey,
  CLString,
  CLTypeBuilder,
  CLValue,
  CLValueBuilder,
  CLValueParsers,
  CLMap,
  DeployUtil,
  EventName,
  EventStream,
  Keys,
  RuntimeArgs,
} from "casper-js-sdk";
import { Some, None } from "ts-results";
import * as blake from "blakejs";
import { concat } from "@ethersproject/bytes";
import { CasperContractClient, constants, utils, helpers, types } from "@casper-contracts/client-helper";
import { ERC20Events } from "./constants";
const { DEFAULT_TTL } = constants;
const {
  fromCLMap,
  toCLMap,
  installContract,
  setClient,
  contractSimpleGetter,
  contractCallFn,
  createRecipientAddress
} = helpers;

class ERC20Client extends CasperContractClient {
  protected namedKeys?: {
    allowances: string;
    balances: string;
  };

  public async install(
    keys: Keys.AsymmetricKey,
    tokenName: string,
    tokenSymbol: string,
    tokenDecimals: string,
    tokenTotalSupply: string,
    paymentAmount: string,
    wasmPath: string
  ) {
  const runtimeArgs = RuntimeArgs.fromMap({
    name: CLValueBuilder.string(tokenName),
    symbol: CLValueBuilder.string(tokenSymbol),
    decimals: CLValueBuilder.u8(tokenDecimals),
    total_supply: CLValueBuilder.u256(tokenTotalSupply)
  });

    return await installContract(
      this.chainName,
      this.nodeAddress,
      keys,
      runtimeArgs,
      paymentAmount,
      wasmPath
    );
  }

  public async setContractHash(hash: string) {
    const { contractPackageHash, namedKeys } = await setClient(
      this.nodeAddress,
      hash,
      [
        "balances",
        "allowances"
      ]
    );
    this.contractHash = hash;
    this.contractPackageHash = contractPackageHash;
    /* @ts-ignore */
    this.namedKeys = namedKeys;
  }

  public async name() {
    return await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash!,
      ["name"]
    );
  }

  public async symbol() {
    return await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash!,
      ["symbol"]
    );
  }

  public async decimals() {
    return await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash!,
      ["decimals"]
    );
  }

  public async totalSupply() {
    return await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash!,
      ["total_supply"]
    );
  }

  public async transfer(
    keys: Keys.AsymmetricKey,
    recipient: RecipientType,
    transferAmount: string,
    paymentAmount: string,
    ttl = DEFAULT_TTL
  ) {
    const runtimeArgs = RuntimeArgs.fromMap({
      recipient: createRecipientAddress(recipient),
      amount: CLValueBuilder.u256(transferAmount),
    });

    return await this.contractCall({
      entryPoint: "transfer",
      keys,
      paymentAmount,
      runtimeArgs,
      cb: deployHash => this.addPendingDeploy(ERC20Events.Transfer, deployHash),
      ttl,
    });
  }

  public async transferFrom(
    keys: Keys.AsymmetricKey,
    owner: RecipientType,
    recipient: RecipientType,
    transferAmount: string,
    paymentAmount: string,
    ttl = DEFAULT_TTL
  ) {
    const runtimeArgs = RuntimeArgs.fromMap({
      recipient: createRecipientAddress(recipient),
      owner: createRecipientAddress(owner),
      amount: CLValueBuilder.u256(transferAmount),
    });

    return await this.contractCall({
      entryPoint: "transfer_from",
      keys,
      paymentAmount,
      runtimeArgs,
      cb: deployHash => this.addPendingDeploy(ERC20Events.Transfer, deployHash),
      ttl,
    });
  }

  public async approve(
    keys: Keys.AsymmetricKey,
    spender: RecipientType,
    approveAmount: string,
    paymentAmount: string,
    ttl = DEFAULT_TTL
  ) {
    const runtimeArgs = RuntimeArgs.fromMap({
      spender: createRecipientAddress(spender),
      amount: CLValueBuilder.u256(approveAmount),
    });

    return await this.contractCall({
      entryPoint: "approve",
      keys,
      paymentAmount,
      runtimeArgs,
      cb: deployHash => this.addPendingDeploy(ERC20Events.Approve, deployHash),
      ttl,
    });
  }

  public async balanceOf(account: CLPublicKey) {
    const key = new CLKey(new CLAccountHash(account.toAccountHash()));
    const keyBytes = CLValueParsers.toBytes(key).unwrap();
    const itemKey = Buffer.from(keyBytes).toString("base64");
    const result = await utils.contractDictionaryGetter(
      this.nodeAddress,
      itemKey,
      this.namedKeys!.balances
    );
    return result.toString();
  }

  public async allowances(owner: CLPublicKey, spender: CLPublicKey) {
    // TODO: REUSEABLE METHOD
    const keyOwner = new CLKey(new CLAccountHash(owner.toAccountHash()));
    const keySpender = new CLKey(new CLAccountHash(spender.toAccountHash()));
    const finalBytes = concat([CLValueParsers.toBytes(keyOwner).unwrap(), CLValueParsers.toBytes(keySpender).unwrap()]);
    const blaked = blake.blake2b(finalBytes, undefined, 32);
    const encodedBytes = Buffer.from(blaked).toString("hex");

    const result = await utils.contractDictionaryGetter(
      this.nodeAddress,
      encodedBytes,
      this.namedKeys!.allowances
    );

    return result.toString();
  }
}

export default ERC20Client;
