import { config } from "dotenv";
config({ path: "./.env.erc20" });
import { ERC20Client } from "casper-erc20-js-client";
import { utils } from "casper-js-client-helper";
import { sleep, getDeploy, getKeyPairOfUserSet } from "../utils";

import {
  CLValueBuilder,
  Keys,
  CLPublicKey,
  CLPublicKeyType,
} from "casper-js-sdk";

const {
  NODE_ADDRESS,
  EVENT_STREAM_ADDRESS,
  CHAIN_NAME,
  WASM_PATH,
  PATH_TO_USERS,
  MASTER_KEY_PAIR_PATH,
  TOKEN_NAME,
  TOKEN_SYMBOL,
  TOKEN_DECIMALS,
  TOKEN_SUPPLY,
  INSTALL_PAYMENT_AMOUNT,
} = process.env;

const KEYS = Keys.Ed25519.parseKeyFiles(
  `${MASTER_KEY_PAIR_PATH}/public_key.pem`,
  `${MASTER_KEY_PAIR_PATH}/secret_key.pem`
);

const test = async () => {
  const erc20 = new ERC20Client(
    NODE_ADDRESS!,
    CHAIN_NAME!,
    EVENT_STREAM_ADDRESS!
  );

  console.log('Test init.');

  await sleep(5 * 1000);

  console.log('... getting Account info');

  let accountInfo = await utils.getAccountInfo(NODE_ADDRESS!, KEYS.publicKey);

  console.log(`... Account Info: `);
  console.log(JSON.stringify(accountInfo, null, 2));

  const contractHash = await utils.getAccountNamedKeyValue(
    accountInfo,
    "erc20_token_contract"
  );

  console.log(`... Contract Hash: ${contractHash}`);
  console.log(contractHash);

  // We don't need hash- prefix so i'm removing it
  await erc20.setContractHash(contractHash.slice(5));

  const name = await erc20.name();
  console.log(`... Contract name: ${name}`);

  const symbol = await erc20.symbol();
  console.log(`... Contract symbol: ${symbol}`);

  let totalSupply = await erc20.totalSupply();
  console.log(`... Total supply: ${totalSupply}`);

  let decimals = await erc20.decimals();
  console.log(`... Decimals: ${decimals}`);

  const userKeyPairSet = getKeyPairOfUserSet(PATH_TO_USERS!);

  let deployHashes: string[] = [];
  
  for (const userKeyPair of userKeyPairSet) {
    const deployHash = await erc20.transfer(
      KEYS,
      userKeyPair.publicKey,
      "2000000000",
      "10000000000000"
    );
    console.log(
      `Transfer from ${KEYS.publicKey.toHex()} to ${userKeyPair.publicKey.toHex()}`
    );
    console.log(`... Deploy Hash: ${deployHash}`);
    deployHashes = [...deployHashes, deployHash];
  };

  await Promise.all(deployHashes.map((hash) => getDeploy(NODE_ADDRESS!, hash)));
  console.log("All deploys succeded");
  deployHashes = [];
  
  for (const userKeyPair of userKeyPairSet) {
    const balance = await erc20.balanceOf(userKeyPair.publicKey);
    console.log(`Balance of ${userKeyPair.publicKey.toHex()}: ${balance}`);
  }

  const balance = await erc20.balanceOf(KEYS.publicKey);
  console.log(`Balance of master account: ${balance}`);

  console.log(`Setup user transfers approve`);

  for (const userKeyPair of userKeyPairSet) {
    const deployHash = await erc20.approve(
      KEYS,
      userKeyPair.publicKey,
      "1000000000",
      "10000000000000"
    );
    console.log(
      `Approve for ${userKeyPair.publicKey.toHex()}`
    );
    console.log(`... Deploy Hash: ${deployHash}`);
    deployHashes = [...deployHashes, deployHash];
  }

  await Promise.all(deployHashes.map((hash) => getDeploy(NODE_ADDRESS!, hash)));
  console.log("All deploys succeded");
  deployHashes = [];

  for (const userKeyPair of userKeyPairSet) {
    const allowance = await erc20.allowances(KEYS.publicKey, userKeyPair.publicKey);
    console.log(`Allowance of ${userKeyPair.publicKey.toHex()}: ${allowance}`);
  }
  
  console.log(`Run transfers from main account`);
  for (const userKeyPair of userKeyPairSet) {
    const deployHash = await erc20.transferFrom(
      userKeyPair,
      KEYS.publicKey,
      userKeyPair.publicKey,
      "100000",
      "10000000000000"
    );
    console.log(
      `Transfer from ${KEYS.publicKey.toHex()} to ${userKeyPair.publicKey.toHex()}`
    );
    console.log(`... Deploy Hash: ${deployHash}`);
    deployHashes = [...deployHashes, deployHash];
  }
  
  await Promise.all(deployHashes.map((hash) => getDeploy(NODE_ADDRESS!, hash)));
  console.log("All deploys succeded");
  deployHashes = [];
};

test();

