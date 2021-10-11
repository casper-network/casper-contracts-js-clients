# `casper-erc20-js-client`

JS Client that gives you easy way to install and interact with Casper ERC20 contract.

## Installation

`npm i casper-erc20-js-client`

## Usage

- Create an instance of ERC20 client

```
const erc20 = new ERC20Client(
  http://localhost:11101, // RPC address
  "casper-net-1", // Network name
  "http://localhost:18101/events/main" // Event stream address
);
```

- Install contract
```
const installDeployHash = await erc20.install(

  KEYS, // Key pair used for signing 
  "ACME Token" // Name of the token
  "ACME", // Token Symbol
  11, // Token decimals
  1000000000000000, // Token supply
  200000000000, // Payment amount
  ../erc20/target/wasm32-unknown-unknown/release/erc20_token.wasm // Path to WASM file
);
```

- Set contract hash

```
await erc20.setContractHash('hash-c2402c3d88b13f14390ff46fde9c06b8590c9e45a9802f7fb8a2674ff9c1e5b1');
```

- Getters

```
const name = await erc20.name();

const symbol = await erc20.symbol();

const totalSupply = await erc20.totalSupply();

const decimals = await erc20.decimals();
```

- Transfer

Transfers an amount of tokens from the direct caller to a recipient.

```
const deployHash = await erc20.transfer(
  KEYS, // Key pair used for signing
  receiverPublicKey, // Receiver public key
  "2000000000", // Amount to transfer
  "10000000000000" // Payment amount
);
```

- Transfer From

Transfers an amount of tokens from the owner to a recipient, if the direct caller has been previously approved to spend the specied amount on behalf of the owner

```
const deployHash = await erc20.transfer(
  KEYS, // Key pair used for signing
  receiverPublicKey, // Receiver public key
  "2000000000", // Amount to transfer
  "10000000000000" // Payment amount
);
```

- Balance of account
```
const balance = await erc20.balanceOf(publicKey);
```

- Approve

Allows a spender to transfer up to an amount of the direct caller’s tokens.

```
const deployHash = await erc20.approve(
  KEYS, // Key pair used for signing
  publicKey, // Spender address
  "1000000000", // amount of tokens that will be allowed to transfer
  "10000000000000" // payment amount
);
```

- Allowance

Returns the amount of owner’s tokens allowed to be spent by spender.

```
const allowance = await erc20.allowances(ownersPublicKey, spenderPublicKey);
```

## Examples

Examples available in a [main repo](https://github.com/casper-network/casper-contracts-js-clients).
