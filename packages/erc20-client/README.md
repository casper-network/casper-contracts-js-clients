<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [`casper-erc20-js-client`](#casper-erc20-js-client)
  - [Installation](#installation)
- [Classes](#classes)
  - [Class: ERC20Client](#class-erc20client)
    - [Hierarchy](#hierarchy)
    - [Table of contents](#table-of-contents)
    - [Constructors](#constructors)
    - [Properties](#properties)
    - [Methods](#methods)
- [Enums](#enums)
  - [Enumeration: ERC20Events](#enumeration-erc20events)
    - [Table of contents](#table-of-contents-1)
    - [Enumeration members](#enumeration-members)
- [casper-erc20-js-client](#casper-erc20-js-client)
  - [Table of contents](#table-of-contents-2)
    - [Namespaces](#namespaces)
    - [Classes](#classes-1)
- [Modules](#modules)
  - [Namespace: constants](#namespace-constants)
    - [Table of contents](#table-of-contents-3)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


<a name="readmemd"></a>

casper-erc20-js-client / [Exports](#modulesmd)

# `casper-erc20-js-client`

## Installation

`npm i casper-erc20-js-client`

# Classes


<a name="classeserc20clientmd"></a>

[casper-erc20-js-client](#readmemd) / [Exports](#modulesmd) / ERC20Client

## Class: ERC20Client

### Hierarchy

- `CasperContractClient`

  ↳ **`ERC20Client`**

### Table of contents

#### Constructors

- [constructor](#constructor)

#### Properties

- [chainName](#chainname)
- [contractHash](#contracthash)
- [contractPackageHash](#contractpackagehash)
- [eventStreamAddress](#eventstreamaddress)
- [isListening](#islistening)
- [namedKeys](#namedkeys)
- [nodeAddress](#nodeaddress)
- [pendingDeploys](#pendingdeploys)

#### Methods

- [addPendingDeploy](#addpendingdeploy)
- [allowances](#allowances)
- [approve](#approve)
- [balanceOf](#balanceof)
- [contractCall](#contractcall)
- [decimals](#decimals)
- [handleEvents](#handleevents)
- [install](#install)
- [name](#name)
- [setContractHash](#setcontracthash)
- [symbol](#symbol)
- [totalSupply](#totalsupply)
- [transfer](#transfer)
- [transferFrom](#transferfrom)

### Constructors

#### constructor

• **new ERC20Client**(`nodeAddress`, `chainName`, `eventStreamAddress?`)

##### Parameters

| Name | Type |
| :------ | :------ |
| `nodeAddress` | `string` |
| `chainName` | `string` |
| `eventStreamAddress?` | `string` |

##### Inherited from

CasperContractClient.constructor

##### Defined in

client-helper/dist/casper-contract-client.d.ts:11

### Properties

#### chainName

• **chainName**: `string`

##### Inherited from

CasperContractClient.chainName

##### Defined in

client-helper/dist/casper-contract-client.d.ts:4

___

#### contractHash

• `Optional` **contractHash**: `string`

##### Inherited from

CasperContractClient.contractHash

##### Defined in

client-helper/dist/casper-contract-client.d.ts:6

___

#### contractPackageHash

• `Optional` **contractPackageHash**: `string`

##### Inherited from

CasperContractClient.contractPackageHash

##### Defined in

client-helper/dist/casper-contract-client.d.ts:7

___

#### eventStreamAddress

• `Optional` **eventStreamAddress**: `string`

##### Inherited from

CasperContractClient.eventStreamAddress

##### Defined in

client-helper/dist/casper-contract-client.d.ts:5

___

#### isListening

• `Protected` **isListening**: `boolean`

##### Inherited from

CasperContractClient.isListening

##### Defined in

client-helper/dist/casper-contract-client.d.ts:9

___

#### namedKeys

• `Protected` `Optional` **namedKeys**: `Object`

##### Type declaration

| Name | Type |
| :------ | :------ |
| `allowances` | `string` |
| `balances` | `string` |

##### Overrides

CasperContractClient.namedKeys

##### Defined in

[erc20-client/src/erc20client.ts:41](https://github.com/casper-network/casper-contracts-js-clients/blob/c766d1b/packages/erc20-client/src/erc20client.ts#L41)

___

#### nodeAddress

• **nodeAddress**: `string`

##### Inherited from

CasperContractClient.nodeAddress

##### Defined in

client-helper/dist/casper-contract-client.d.ts:3

___

#### pendingDeploys

• `Protected` **pendingDeploys**: `IPendingDeploy`[]

##### Inherited from

CasperContractClient.pendingDeploys

##### Defined in

client-helper/dist/casper-contract-client.d.ts:10

### Methods

#### addPendingDeploy

▸ `Protected` **addPendingDeploy**(`deployType`, `deployHash`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `deployType` | `any` |
| `deployHash` | `string` |

##### Returns

`void`

##### Inherited from

CasperContractClient.addPendingDeploy

##### Defined in

client-helper/dist/casper-contract-client.d.ts:13

___

#### allowances

▸ **allowances**(`owner`, `spender`): `Promise`<`any`\>

Returns the amount of owner’s tokens allowed to be spent by spender.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `owner` | `RecipientType` | Owner address (it supports CLPublicKey, CLAccountHash and CLByteArray). |
| `spender` | `RecipientType` | Spender address (it supports CLPublicKey, CLAccountHash and CLByteArray). |

##### Returns

`Promise`<`any`\>

Amount in tokens.

##### Defined in

[erc20-client/src/erc20client.ts:282](https://github.com/casper-network/casper-contracts-js-clients/blob/c766d1b/packages/erc20-client/src/erc20client.ts#L282)

___

#### approve

▸ **approve**(`keys`, `spender`, `approveAmount`, `paymentAmount`, `ttl?`): `Promise`<`string`\>

Allows a spender to transfer up to an amount of the direct caller’s tokens.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `keys` | `AsymmetricKey` | AsymmetricKey that will be used to sign the transaction. |
| `spender` | `RecipientType` | Spender address (it supports CLPublicKey, CLAccountHash and CLByteArray). |
| `approveAmount` | `string` | The amount of tokens that will be allowed to transfer. |
| `paymentAmount` | `string` | Amount that will be used to pay the transaction. |
| `ttl` | `number` | Time to live in miliseconds after which transaction will be expired (defaults to 30m). |

##### Returns

`Promise`<`string`\>

Deploy hash.

##### Defined in

[erc20-client/src/erc20client.ts:232](https://github.com/casper-network/casper-contracts-js-clients/blob/c766d1b/packages/erc20-client/src/erc20client.ts#L232)

___

#### balanceOf

▸ **balanceOf**(`account`): `Promise`<`any`\>

Returns the balance of the account address.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `account` | `RecipientType` | Account address (it supports CLPublicKey, CLAccountHash and CLByteArray). |

##### Returns

`Promise`<`any`\>

Balance of an account.

##### Defined in

[erc20-client/src/erc20client.ts:261](https://github.com/casper-network/casper-contracts-js-clients/blob/c766d1b/packages/erc20-client/src/erc20client.ts#L261)

___

#### contractCall

▸ **contractCall**(`__namedParameters`): `Promise`<`string`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `IClassContractCallParams` |

##### Returns

`Promise`<`string`\>

##### Inherited from

CasperContractClient.contractCall

##### Defined in

client-helper/dist/casper-contract-client.d.ts:12

___

#### decimals

▸ **decimals**(): `Promise`<`any`\>

Returns the decimals of the ERC20 token.

##### Returns

`Promise`<`any`\>

##### Defined in

[erc20-client/src/erc20client.ts:132](https://github.com/casper-network/casper-contracts-js-clients/blob/c766d1b/packages/erc20-client/src/erc20client.ts#L132)

___

#### handleEvents

▸ **handleEvents**(`eventNames`, `callback`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `eventNames` | `any`[] |
| `callback` | (`eventName`: `any`, `deployStatus`: { `deployHash`: `string` ; `error`: `string` ; `success`: `boolean`  }, `result`: `any`) => `void` |

##### Returns

`any`

##### Inherited from

CasperContractClient.handleEvents

##### Defined in

client-helper/dist/casper-contract-client.d.ts:14

___

#### install

▸ **install**(`keys`, `tokenName`, `tokenSymbol`, `tokenDecimals`, `tokenTotalSupply`, `paymentAmount`, `wasmPath`): `Promise`<`string`\>

Installs the ERC20 contract.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `keys` | `AsymmetricKey` | AsymmetricKey that will be used to install the contract. |
| `tokenName` | `string` | Name of the ERC20 token. |
| `tokenSymbol` | `string` | Symbol of the ERC20 token. |
| `tokenDecimals` | `string` | Specifies how many decimal places token will have. |
| `tokenTotalSupply` | `string` | Specifies the amount of tokens in existance. |
| `paymentAmount` | `string` | The payment amount that will be used to install the contract. |
| `wasmPath` | `string` | Path to the WASM file that will be installed. |

##### Returns

`Promise`<`string`\>

Installation deploy hash.

##### Defined in

[erc20-client/src/erc20client.ts:60](https://github.com/casper-network/casper-contracts-js-clients/blob/c766d1b/packages/erc20-client/src/erc20client.ts#L60)

___

#### name

▸ **name**(): `Promise`<`any`\>

Returns the name of the ERC20 token.

##### Returns

`Promise`<`any`\>

##### Defined in

[erc20-client/src/erc20client.ts:110](https://github.com/casper-network/casper-contracts-js-clients/blob/c766d1b/packages/erc20-client/src/erc20client.ts#L110)

___

#### setContractHash

▸ **setContractHash**(`hash`): `Promise`<`void`\>

Set ERC20 contract hash so its possible to communicate with it.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hash` | `string` | Contract hash (raw hex string as well as `hash-` prefixed format is supported). |

##### Returns

`Promise`<`void`\>

##### Defined in

[erc20-client/src/erc20client.ts:91](https://github.com/casper-network/casper-contracts-js-clients/blob/c766d1b/packages/erc20-client/src/erc20client.ts#L91)

___

#### symbol

▸ **symbol**(): `Promise`<`any`\>

Returns the symbol of the ERC20 token.

##### Returns

`Promise`<`any`\>

##### Defined in

[erc20-client/src/erc20client.ts:121](https://github.com/casper-network/casper-contracts-js-clients/blob/c766d1b/packages/erc20-client/src/erc20client.ts#L121)

___

#### totalSupply

▸ **totalSupply**(): `Promise`<`any`\>

Returns the total supply of the ERC20 token.

##### Returns

`Promise`<`any`\>

##### Defined in

[erc20-client/src/erc20client.ts:143](https://github.com/casper-network/casper-contracts-js-clients/blob/c766d1b/packages/erc20-client/src/erc20client.ts#L143)

___

#### transfer

▸ **transfer**(`keys`, `recipient`, `transferAmount`, `paymentAmount`, `ttl?`): `Promise`<`string`\>

Transfers an amount of tokens from the direct caller to a recipient.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `keys` | `AsymmetricKey` | AsymmetricKey that will be used to sign the transaction. |
| `recipient` | `RecipientType` | Recipient address (it supports CLPublicKey, CLAccountHash and CLByteArray). |
| `transferAmount` | `string` | Amount of tokens that will be transfered. |
| `paymentAmount` | `string` | Amount that will be used to pay the transaction. |
| `ttl` | `number` | Time to live in miliseconds after which transaction will be expired (defaults to 30m). |

##### Returns

`Promise`<`string`\>

Deploy hash.

##### Defined in

[erc20-client/src/erc20client.ts:163](https://github.com/casper-network/casper-contracts-js-clients/blob/c766d1b/packages/erc20-client/src/erc20client.ts#L163)

___

#### transferFrom

▸ **transferFrom**(`keys`, `owner`, `recipient`, `transferAmount`, `paymentAmount`, `ttl?`): `Promise`<`string`\>

Transfers an amount of tokens from the owner to a recipient, if the direct caller has been previously approved to spend the specied amount on behalf of the owner.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `keys` | `AsymmetricKey` | AsymmetricKey that will be used to sign the transaction. |
| `owner` | `RecipientType` | Owner address (it supports CLPublicKey, CLAccountHash and CLByteArray). |
| `recipient` | `RecipientType` | Recipient address (it supports CLPublicKey, CLAccountHash and CLByteArray). |
| `transferAmount` | `string` | Amount of tokens that will be transfered. |
| `paymentAmount` | `string` | Amount that will be used to pay the transaction. |
| `ttl` | `number` | Time to live in miliseconds after which transaction will be expired (defaults to 30m). |

##### Returns

`Promise`<`string`\>

Deploy hash.

##### Defined in

[erc20-client/src/erc20client.ts:197](https://github.com/casper-network/casper-contracts-js-clients/blob/c766d1b/packages/erc20-client/src/erc20client.ts#L197)

# Enums


<a name="enumsconstantserc20eventsmd"></a>

[casper-erc20-js-client](#readmemd) / [Exports](#modulesmd) / [constants](#modulesconstantsmd) / ERC20Events

## Enumeration: ERC20Events

[constants](#modulesconstantsmd).ERC20Events

### Table of contents

#### Enumeration members

- [Approve](#approve)
- [Transfer](#transfer)

### Enumeration members

#### Approve

• **Approve** = `"approve"`

##### Defined in

[erc20-client/src/constants.ts:3](https://github.com/casper-network/casper-contracts-js-clients/blob/c766d1b/packages/erc20-client/src/constants.ts#L3)

___

#### Transfer

• **Transfer** = `"transfer"`

##### Defined in

[erc20-client/src/constants.ts:2](https://github.com/casper-network/casper-contracts-js-clients/blob/c766d1b/packages/erc20-client/src/constants.ts#L2)


<a name="modulesmd"></a>

[casper-erc20-js-client](#readmemd) / Exports

# casper-erc20-js-client

## Table of contents

### Namespaces

- [constants](#modulesconstantsmd)

### Classes

- [ERC20Client](#classeserc20clientmd)

# Modules


<a name="modulesconstantsmd"></a>

[casper-erc20-js-client](#readmemd) / [Exports](#modulesmd) / constants

## Namespace: constants

### Table of contents

#### Enumerations

- [ERC20Events](#enumsconstantserc20eventsmd)
