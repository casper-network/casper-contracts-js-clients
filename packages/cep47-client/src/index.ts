import {
  CLPublicKey,
  CLTypeBuilder,
  CLValue,
  CLValueBuilder,
  EventName,
  Keys,
  RuntimeArgs,
} from "casper-js-sdk";
import { Some, None } from "ts-results";
import { CasperContractClient, constants, utils, helpers, types } from "@casper-contracts/client-helper";
const { DEFAULT_TTL } = constants;
import { CEP47Events } from "./constants";
const {
  fromCLMap,
  toCLMap,
  installContract,
  setClient,
  contractSimpleGetter,
  contractCallFn,
  createRecipientAddress
} = helpers;
type RecipientType = types.RecipientType;
type IPendingDeploy = types.IPendingDeploy;
type IClassContractCallParams = types.IClassContractCallParams;

class CEP47Client extends CasperContractClient {
  protected namedKeys?: {
    balances: string;
    metadata: string;
    ownedTokens: string;
    owners: string;
    paused: string;
    events: string;
  };

  public async install(
    keys: Keys.AsymmetricKey,
    tokenName: string,
    tokenSymbol: string,
    tokenMeta: Map<string, string>,
    paymentAmount: string,
    wasmPath: string
  ) {
    const runtimeArgs = RuntimeArgs.fromMap({
      token_name: CLValueBuilder.string(tokenName),
      token_symbol: CLValueBuilder.string(tokenSymbol),
      token_meta: toCLMap(tokenMeta),
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
    const LIST_OF_NAMED_KEYS = [
      "balances",
      "metadata",
      "owned_tokens",
      "owners",
      "paused",
      "events"
    ];

    const { contractPackageHash, namedKeys } = await setClient(
      this.nodeAddress,
      hash,
      LIST_OF_NAMED_KEYS
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

  public async meta() {
    const map: Array<[CLValue, CLValue]> = await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash!,
      ["meta"]
    );

    return fromCLMap(map);
  }

  public async totalSupply() {
    return await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash!,
      ["total_supply"]
    );
  }

  public async balanceOf(account: CLPublicKey) {
    const accountHash = utils.toAccountHashString(account.toAccountHash());
    const result = await utils.contractDictionaryGetter(
      this.nodeAddress,
      accountHash,
      this.namedKeys!.balances
    );
    const maybeValue = result.unwrap();
    return maybeValue.value().toString();
  }

  public async getOwnerOf(tokenId: string) {
    const result = await utils.contractDictionaryGetter(
      this.nodeAddress,
      tokenId,
      this.namedKeys!.owners
    );
    const maybeValue = result.unwrap();
    return `account-hash-${Buffer.from(maybeValue.value().value()).toString(
      "hex"
    )}`;
  }

  public async getTokenMeta(tokenId: string) {
    const result = await utils.contractDictionaryGetter(
      this.nodeAddress,
      tokenId,
      this.namedKeys!.metadata
    );
    const maybeValue = result.unwrap();
    const map: Array<[CLValue, CLValue]> = maybeValue.value();

    return fromCLMap(map);
  }

  public async pause(
    keys: Keys.AsymmetricKey,
    paymentAmount: string,
    ttl = DEFAULT_TTL
  ) {
    const runtimeArgs = RuntimeArgs.fromMap({});

    return await this.contractCall({
      entryPoint: "pause",
      paymentAmount,
      keys: keys,
      runtimeArgs,
      ttl,
    });
  }

  public async unpause(
    keys: Keys.AsymmetricKey,
    paymentAmount: string,
    ttl = DEFAULT_TTL
  ) {
    const runtimeArgs = RuntimeArgs.fromMap({});

    return await this.contractCall({
      entryPoint: "unpause",
      paymentAmount,
      keys: keys,
      runtimeArgs,
      ttl,
    });
  }

  public async isPaused() {
    const result = await contractSimpleGetter(
      this.nodeAddress,
      this.contractHash!,
      ["is_paused"]
    );
    return result.value();
  }

  public async getTokensOf(account: CLPublicKey) {
    const accountHash = Buffer.from(account.toAccountHash()).toString("hex");
    const result = await utils.contractDictionaryGetter(
      this.nodeAddress,
      accountHash,
      this.namedKeys!.ownedTokens
    );
    const maybeValue = result.unwrap();
    return maybeValue.value();
  }

  public async mintOne(
    keys: Keys.AsymmetricKey,
    recipient: RecipientType,
    id: string | null,
    meta: Map<string, string>,
    paymentAmount: string,
    ttl = DEFAULT_TTL
  ) {
    const tokenId = id
      ? CLValueBuilder.option(Some(CLValueBuilder.string(id)))
      : CLValueBuilder.option(None, CLTypeBuilder.string());

    const runtimeArgs = RuntimeArgs.fromMap({
      recipient: createRecipientAddress(recipient),
      token_id: tokenId,
      token_meta: toCLMap(meta),
    });

    return await this.contractCall({
      entryPoint: "mint_one",
      paymentAmount,
      keys: keys,
      runtimeArgs,
      cb: deployHash => this.addPendingDeploy(CEP47Events.MintOne, deployHash),
      ttl,
    });
  }

  public async mintCopies(
    keys: Keys.AsymmetricKey,
    recipient: RecipientType,
    meta: Map<string, string>,
    ids: string[] | null,
    count: number,
    paymentAmount: string,
    ttl = DEFAULT_TTL
  ) {
    const tokenIds = ids
      ? CLValueBuilder.option(
          Some(CLValueBuilder.list(ids.map((id) => CLValueBuilder.string(id))))
        )
      : CLValueBuilder.option(None, CLTypeBuilder.list(CLTypeBuilder.string()));

    const runtimeArgs = RuntimeArgs.fromMap({
      count: CLValueBuilder.u32(count),
      recipient: createRecipientAddress(recipient),
      token_ids: tokenIds,
      token_meta: toCLMap(meta),
    });

    return await this.contractCall({
      entryPoint: "mint_copies",
      paymentAmount,
      keys: keys,
      runtimeArgs,
      cb: deployHash => this.addPendingDeploy(CEP47Events.MintOne, deployHash),
      ttl,
    });
  }

  public async mintMany(
    keys: Keys.AsymmetricKey,
    recipient: RecipientType,
    meta: Array<Map<string, string>>,
    ids: string[] | null,
    paymentAmount: string,
    ttl = DEFAULT_TTL
  ) {
    if (ids && ids.length !== meta.length) {
      throw new Error(
        `Ids length (${ids.length}) not equal to meta length (${meta.length})!`
      );
    }

    const clMetas = meta.map(toCLMap);

    const tokenIds = ids
      ? CLValueBuilder.option(
          Some(CLValueBuilder.list(ids.map((id) => CLValueBuilder.string(id))))
        )
      : CLValueBuilder.option(None, CLTypeBuilder.list(CLTypeBuilder.string()));

    const runtimeArgs = RuntimeArgs.fromMap({
      recipient: createRecipientAddress(recipient),
      token_ids: tokenIds,
      token_metas: CLValueBuilder.list(clMetas),
    });

    return await this.contractCall({
      entryPoint: "mint_many",
      paymentAmount,
      keys: keys,
      runtimeArgs,
      cb: deployHash => this.addPendingDeploy(CEP47Events.MintOne, deployHash),
      ttl,
    });
  }

  public async updateTokenMetadata(
    keys: Keys.AsymmetricKey,
    tokenId: string,
    meta: Map<string, string>,
    paymentAmount: string,
    ttl = DEFAULT_TTL
  ) {
    const runtimeArgs = RuntimeArgs.fromMap({
      token_id: CLValueBuilder.string(tokenId),
      token_meta: toCLMap(meta),
    });

    return await this.contractCall({
      entryPoint: "update_token_metadata",
      keys,
      paymentAmount,
      runtimeArgs,
      cb: deployHash => this.addPendingDeploy(CEP47Events.MetadataUpdate, deployHash),
      ttl,
    });
  }

  public async burnOne(
    keys: Keys.AsymmetricKey,
    owner: RecipientType,
    tokenId: string,
    paymentAmount: string,
    ttl = DEFAULT_TTL
  ) {
    const runtimeArgs = RuntimeArgs.fromMap({
      owner: createRecipientAddress(owner),
      token_id: CLValueBuilder.string(tokenId),
    });

    return await this.contractCall({
      entryPoint: "burn_one",
      keys,
      paymentAmount,
      runtimeArgs,
      cb: deployHash => this.addPendingDeploy(CEP47Events.BurnOne, deployHash),
      ttl,
    });
  }

  public async burnMany(
    keys: Keys.AsymmetricKey,
    owner: RecipientType,
    tokenIds: string[],
    paymentAmount: string,
    ttl = DEFAULT_TTL
  ) {
    const clTokenIds = tokenIds.map(CLValueBuilder.string);
    const runtimeArgs = RuntimeArgs.fromMap({
      owner: createRecipientAddress(owner),
      token_ids: CLValueBuilder.list(clTokenIds),
    });

    return await this.contractCall({
      entryPoint: "burn_many",
      keys,
      paymentAmount,
      runtimeArgs,
      cb: deployHash => this.addPendingDeploy(CEP47Events.BurnOne, deployHash),
      ttl,
    });
  }

  public async transferToken(
    keys: Keys.AsymmetricKey,
    recipient: RecipientType,
    tokenId: string,
    paymentAmount: string,
    ttl = DEFAULT_TTL
  ) {
    const runtimeArgs = RuntimeArgs.fromMap({
      recipient: createRecipientAddress(recipient),
      token_id: CLValueBuilder.string(tokenId),
    });

    return await this.contractCall({
      entryPoint: "transfer_token",
      keys,
      paymentAmount,
      runtimeArgs,
      cb: deployHash => this.addPendingDeploy(CEP47Events.TransferToken, deployHash),
      ttl,
    });
  }

  public async transferManyTokens(
    keys: Keys.AsymmetricKey,
    recipient: RecipientType,
    tokenIds: string[],
    paymentAmount: string,
    ttl = DEFAULT_TTL
  ) {
    const clTokenIds = tokenIds.map(CLValueBuilder.string);
    const runtimeArgs = RuntimeArgs.fromMap({
      recipient: createRecipientAddress(recipient),
      token_ids: CLValueBuilder.list(clTokenIds),
    });

    return await this.contractCall({
      entryPoint: "transfer_many_tokens",
      keys,
      paymentAmount,
      runtimeArgs,
      cb: deployHash => this.addPendingDeploy(CEP47Events.TransferToken, deployHash),
      ttl,
    });
  }

  public async transferAllTokens(
    keys: Keys.AsymmetricKey,
    recipient: RecipientType,
    paymentAmount: string,
    ttl = DEFAULT_TTL
  ) {
    const runtimeArgs = RuntimeArgs.fromMap({
      recipient: createRecipientAddress(recipient),
    });

    return await this.contractCall({
      entryPoint: "transfer_all_tokens",
      keys,
      paymentAmount,
      runtimeArgs,
      cb: deployHash => this.addPendingDeploy(CEP47Events.TransferToken, deployHash),
      ttl,
    });
  }

  public onEvent(
    eventNames: CEP47Events[],
    callback: (
      eventName: CEP47Events,
      deployStatus: {
        deployHash: string;
        success: boolean;
        error: string | null;
      },
      result: any | null
    ) => void
  ): any {
    return this.handleEvents(eventNames, callback);
  }
}


export default CEP47Client;

