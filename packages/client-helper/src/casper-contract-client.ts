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
import { DEFAULT_TTL } from "./constants";
import * as utils from "./helpers/utils";
import {
  toCLMap,
  installContract,
  setClient,
  contractSimpleGetter,
  contractCallFn,
} from "./helpers/lib";
import { RecipientType, IPendingDeploy, IClassContractCallParams } from "./types";

class ContractClient {
  public contractHash?: string;
  public contractPackageHash?: string;
  protected namedKeys?: any;
  protected isListening = false;
  protected pendingDeploys: IPendingDeploy[] = [];

  constructor(
    public nodeAddress: string,
    public chainName: string,
    public eventStreamAddress?: string
  ) {}

  public async contractCall({
    keys,
    paymentAmount,
    entryPoint,
    runtimeArgs,
    cb,
    ttl = DEFAULT_TTL,
    dependencies = []
  }: IClassContractCallParams) {
    const deployHash = await contractCallFn({
      chainName: this.chainName,
      contractHash: this.contractHash!,
      entryPoint,
      paymentAmount,
      nodeAddress: this.nodeAddress,
      keys: keys,
      runtimeArgs,
      ttl,
      dependencies
    });

    if (deployHash !== null) {
      cb && cb(deployHash);
      return deployHash;
    } else {
      throw Error("Invalid Deploy");
    }
  }

  protected addPendingDeploy(deployType: any, deployHash: string) {
    this.pendingDeploys = [...this.pendingDeploys, { deployHash, deployType }];
  }

  public handleEvents(
    eventNames: any[],
    callback: (
      eventName: any,
      deployStatus: {
        deployHash: string;
        success: boolean;
        error: string | null;
      },
      result: any | null
    ) => void
  ): any {
    if (!this.eventStreamAddress) {
      throw Error("Please set eventStreamAddress before!");
    }
    if (this.isListening) {
      throw Error(
        "Only one event listener can be create at a time. Remove the previous one and start new."
      );
    }
    const es = new EventStream(this.eventStreamAddress);
    this.isListening = true;

    es.subscribe(EventName.DeployProcessed, (value: any) => {
      const deployHash = value.body.DeployProcessed.deploy_hash;

      const pendingDeploy = this.pendingDeploys.find(
        (pending) => pending.deployHash === deployHash
      );

      if (!pendingDeploy) {
        return;
      }

      const parsedEvent = utils.parseEvent(
        { contractPackageHash: this.contractPackageHash!, eventNames, eventsURef: this.namedKeys!.events },
        value
      );

      if (parsedEvent.error !== null) {
        callback(
          pendingDeploy.deployType,
          {
            deployHash,
            error: parsedEvent.error,
            success: false,
          },
          null
        );
      } else {
        parsedEvent.data.forEach((d: any) =>
          callback(
            d.name,
            { deployHash, error: null, success: true },
            d.clValue
          )
        );
      }

      this.pendingDeploys = this.pendingDeploys.filter(
        (pending) => pending.deployHash !== deployHash
      );
    });

    es.start();

    return {
      stopListening: () => {
        es.unsubscribe(EventName.DeployProcessed);
        es.stop();
        this.isListening = false;
        this.pendingDeploys = [];
      },
    };
  }
}

export default ContractClient;

