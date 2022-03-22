import {
  CasperServiceByJsonRPC,
  CLValue,
  CLMap,
  CLValueParsers,
  CLValueBuilder,
  CLKey,
  CLAccountHash,
  Keys,
  CLPublicKey,
  RuntimeArgs,
  CasperClient,
  DeployUtil,
  CLURef,
  CLTypeTag
} from "casper-js-sdk";
import { concat } from "@ethersproject/bytes";
import blake from "blakejs";
import fs from "fs";

import { RecipientType } from "../types";

export const camelCased = (myString: string) =>
  myString.replace(/_([a-z])/g, (g) => g[1].toUpperCase());

/**
 * Returns an ECC key pair mapped to an NCTL faucet account.
 * @param pathToFaucet - Path to NCTL faucet directory.
 */
export const getKeyPairOfContract = (pathToFaucet: string) =>
  Keys.Ed25519.parseKeyFiles(
    `${pathToFaucet}/public_key.pem`,
    `${pathToFaucet}/secret_key.pem`
  );

/**
 * Returns a binary as u8 array.
 * @param pathToBinary - Path to binary file to be loaded into memory.
 * @return Uint8Array Byte array.
 */
export const getBinary = (pathToBinary: string) => {
  return new Uint8Array(fs.readFileSync(pathToBinary, null).buffer);
};

/**
 * Returns global state root hash at current block.
 * @param {Object} client - JS SDK client for interacting with a node.
 * @return {String} Root hash of global state at most recent block.
 */
export const getStateRootHash = async (nodeAddress: string) => {
  const client = new CasperServiceByJsonRPC(nodeAddress);
  const { block } = await client.getLatestBlockInfo();
  if (block) {
    return block.header.state_root_hash;
  } else {
    throw Error("Problem when calling getLatestBlockInfo");
  }
};

export const getAccountInfo: any = async (
  nodeAddress: string,
  publicKey: CLPublicKey
) => {
  const stateRootHash = await getStateRootHash(nodeAddress);
  const client = new CasperServiceByJsonRPC(nodeAddress);
  const accountHash = publicKey.toAccountHashStr();
  const blockState = await client.getBlockState(stateRootHash, accountHash, []);
  return blockState.Account;
};

/**
 * Returns a value under an on-chain account's storage.
 * @param accountInfo - On-chain account's info.
 * @param namedKey - A named key associated with an on-chain account.
 */
export const getAccountNamedKeyValue = (accountInfo: any, namedKey: string) => {
  const found = accountInfo.namedKeys.find((i: any) => i.name === namedKey);
  if (found) {
    return found.key;
  }
  return undefined;
};

export const getContractData = async (
  nodeAddress: string,
  stateRootHash: string,
  contractHash: string,
  path: string[] = []
) => {
  const client = new CasperServiceByJsonRPC(nodeAddress);
  const blockState = await client.getBlockState(
    stateRootHash,
    `hash-${contractHash}`,
    path
  );
  return blockState;
};

export const contractDictionaryGetter = async (
  nodeAddress: string,
  dictionaryItemKey: string,
  seedUref: string
) => {
  const stateRootHash = await getStateRootHash(nodeAddress);

  const client = new CasperServiceByJsonRPC(nodeAddress);

  const storedValue = await client.getDictionaryItemByURef(
    stateRootHash,
    dictionaryItemKey,
    seedUref
  );

  if (storedValue && storedValue.CLValue.isCLValue) {
    return storedValue.CLValue!.value();
  } else {
    throw Error("Invalid stored value");
  }
};

export const contractHashToByteArray = (contractHash: string) =>
  Uint8Array.from(Buffer.from(contractHash, "hex"));

export const sleep = (num: number) => {
  return new Promise((resolve) => setTimeout(resolve, num));
};

export const parseEvent = (
  {
    contractPackageHash,
    eventNames,
    eventsURef
  }: { contractPackageHash: string; eventNames: any[], eventsURef: string },
  value: any
) => {
  if (value.body.DeployProcessed.execution_result.Failure) {
    return {
      error: value.body.DeployProcessed.execution_result.Failure.error_message,
      success: false,
    };
  } else {
    const { transforms } =
      value.body.DeployProcessed.execution_result.Success.effect;

        const cep47Events = transforms.reduce((acc: any, val: any) => {
          if (
            val.transform.hasOwnProperty("WriteCLValue") &&
            typeof val.transform.WriteCLValue.parsed === "object" &&
            val.transform.WriteCLValue.parsed !== null
          ) {
            const maybeCLValue = CLValueParsers.fromJSON(
              val.transform.WriteCLValue
            );
            const clValue = maybeCLValue.unwrap();
            if (clValue && clValue.clType().tag === CLTypeTag.Map) {
              const hash = (clValue as CLMap<CLValue, CLValue>).get(
                CLValueBuilder.string("contract_package_hash")
              );
              const event = (clValue as CLMap<CLValue, CLValue>).get(CLValueBuilder.string("event_type"));
              if (
                hash &&
                // NOTE: Calling toLowerCase() because current JS-SDK doesn't support checksumed hashes and returns all lower case value
                // Remove it after updating SDK
                hash.value() === contractPackageHash.toLowerCase() &&
                event &&
                eventNames.includes(event.value())
              ) {
                acc = [...acc, { name: event.value(), clValue }];
              }
            }
          }
          return acc;
        }, []);

    return { error: null, success: !!cep47Events.length, data: cep47Events };
  }
};

interface IInstallParams {
  nodeAddress: string;
  keys: Keys.AsymmetricKey;
  chainName: string;
  pathToContract: string;
  runtimeArgs: RuntimeArgs;
  paymentAmount: string;
}

export const installWasmFile = async ({
  nodeAddress,
  keys,
  chainName,
  pathToContract,
  runtimeArgs,
  paymentAmount,
}: IInstallParams): Promise<string> => {
  const client = new CasperClient(nodeAddress);

  // Set contract installation deploy (unsigned).
  let deploy = DeployUtil.makeDeploy(
    new DeployUtil.DeployParams(
      CLPublicKey.fromHex(keys.publicKey.toHex()),
      chainName
    ),
    DeployUtil.ExecutableDeployItem.newModuleBytes(
      getBinary(pathToContract),
      runtimeArgs
    ),
    DeployUtil.standardPayment(paymentAmount)
  );

  // Sign deploy.
  deploy = client.signDeploy(deploy, keys);

  // Dispatch deploy to node.
  return await client.putDeploy(deploy);
};

export const toAccountHashString = (hash: Uint8Array) =>
  Buffer.from(hash).toString("hex");

export const getDictionaryKeyHash = (uref: string, id: string) => {
  const eventsUref = CLURef.fromFormattedStr(uref);
  const eventsUrefBytes = eventsUref.value().data;
  const idNum = Uint8Array.from(Buffer.from(id));
  const finalBytes = concat([eventsUrefBytes, idNum]);
  const blaked = blake.blake2b(finalBytes, undefined, 32);
  const str = Buffer.from(blaked).toString("hex");

  return `dictionary-${str}`;
};

