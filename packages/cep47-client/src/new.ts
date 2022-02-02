import {
  CLPublicKey,
  CLKey,
  RuntimeArgs,
  CasperClient,
  Contracts,
  Keys,
  CLKeyParameters,
  CLValueBuilder,
  CLValueParsers 
} from "casper-js-sdk";

const { Contract, toCLMap } = Contracts;

export interface CEP47InstallArgs {
  name: string,
  contractName: string,
  symbol: string,
  meta: Map<string, string>
};

export class CEP47Client {
  casperClient: CasperClient;
  contractClient: Contracts.Contract;

  constructor(public nodeAddress: string, public networkName: string) {
    this.casperClient = new CasperClient(nodeAddress);
    this.contractClient = new Contract(this.casperClient);
  }

  public install(
    wasm: Uint8Array,
    args: CEP47InstallArgs,
    paymentAmount: string,
    sender: CLPublicKey,
    keys?: Keys.AsymmetricKey[]
  ) {
    const runtimeArgs = RuntimeArgs.fromMap({
      name: CLValueBuilder.string(args.name),
      contract_name: CLValueBuilder.string(args.contractName),
      symbol: CLValueBuilder.string(args.symbol),
      meta: toCLMap(args.meta),
    });

    return this.contractClient.install(wasm, runtimeArgs, paymentAmount, sender, this.networkName, keys || []);
  }

  public setContractHash(contractHash: string, contractPackageHash?: string) {
    this.contractClient.setContractHash(contractHash, contractPackageHash);
  }
  
  public async name() {
    return this.contractClient.queryContractData(['name']);
  }

  public async symbol() {
    return this.contractClient.queryContractData(['symbol']);
  }

  public async meta() {
    return this.contractClient.queryContractData(['meta']);
  }

  public async totalSupply() {
    return this.contractClient.queryContractData(['total_supply']);
  }
  
  public async balanceOf(account: CLPublicKey) {
    const result = await this.contractClient
      .queryContractDictionary('balances', account.toAccountHashStr().slice(13));

    const maybeValue = result.value().unwrap();

    return maybeValue.value().toString();
  }

  public async getOwnerOf(tokenId: string) {
    const result = await this.contractClient
      .queryContractDictionary('owners', tokenId);

    const maybeValue = result.value().unwrap();

    return `account-hash-${Buffer.from(maybeValue.value().value()).toString(
      "hex"
    )}`;
  }

  public async getTokenMeta(tokenId: string) {
    const result = await this.contractClient
      .queryContractDictionary('metadata', tokenId);

    const maybeValue = result.value().unwrap();

    return fromCLMap(maybeValue);
  }

  public async mint(
    recipient: CLKeyParameters,
    ids: string[],
    metas: Map<string, string>[],
    paymentAmount: string,
    sender: CLPublicKey,
    keys?: Keys.AsymmetricKey[]
  ) {
    const runtimeArgs = RuntimeArgs.fromMap({
      recipient: CLValueBuilder.key(recipient),
      token_ids: CLValueBuilder.list(ids.map(id => CLValueBuilder.u256(id))),
      token_metas: CLValueBuilder.list(metas.map(meta => toCLMap(meta)))
    });

    return this.contractClient.callEntrypoint(
      'mint',
      runtimeArgs,
      sender,
      this.networkName,
      paymentAmount,
      keys
    );
  }

}
