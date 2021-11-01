# `casper-erc20-js-client`

This JavaScript client gives you an easy way to install and interact with the Casper ERC-20 contract.

## Installation

Run this command to install the client:

```
npm i casper-erc20-js-client
```

## Usage example

Create an instance of the ERC-20 client:

```
const erc20 = new ERC20Client(
  http://localhost:11101, // RPC address
  "casper-net-1", // Network name
  "http://localhost:18101/events/main" // Event stream address
);
```

Install the contract:

```
const installDeployHash = await erc20.install(
  KEYS, // Key pair used for signing 
  "ACME Token" // Name of the token
  "ACME", // Token Symbol
  11, // Token decimals
  1000000000000000, // Token supply
  200000000000, // Payment amount
  "../erc20/target/wasm32-unknown-unknown/release/erc20_token.wasm" // Path to WASM file
);
```

Set the contract hash (a unique identifier for the network):

```
await erc20.setContractHash('hash-c2402c3d88b13f14390ff46fde9c06b8590c9e45a9802f7fb8a2674ff9c1e5b1');
```

Set functions (getters) to retrieve values:

```
const name = await erc20.name();

const symbol = await erc20.symbol();

const totalSupply = await erc20.totalSupply();

const decimals = await erc20.decimals();
```

**Transfers**

Transfer some tokens from the direct caller to a recipient:

```
const deployHash = await erc20.transfer(
  KEYS, // Key pair used for signing
  receiverPublicKey, // Receiver public key
  "2000000000", // Amount to transfer
  "10000000000000" // Payment amount
);
```

Transfer from an account owner to a recipient given that the direct caller has been previously approved to spend the specified amount on behalf of the owner:

```
const deployHash = await erc20.transfer(
  KEYS, // Key pair used for signing
  receiverPublicKey, // Receiver public key
  "2000000000", // Amount to transfer
  "10000000000000" // Payment amount
);
```

**Balances**

Request the balance of an account with *balanceOf*:

```
const balance = await erc20.balanceOf(publicKey);
```

**Approvals**

Allow a spender to transfer up to a number of the direct caller’s tokens:

```
const deployHash = await erc20.approve(
  KEYS, // Key pair used for signing
  publicKey, // Spender address
  "1000000000", // amount of tokens that will be allowed to transfer
  "10000000000000" // payment amount
);
```

**Allowance**

Return the number of owner’s tokens allowed to be spent by spender:

```
const allowance = await erc20.allowances(ownersPublicKey, spenderPublicKey);
```

## More examples

You can find all the available examples in the [central project repository](https://github.com/casper-network/casper-contracts-js-clients).
