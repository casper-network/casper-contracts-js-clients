# `casper-cep47-js-client`

## Installation

`npm i casper-cep47-js-client`

## Usage

`casper-cep47-js-client` gives you and easy way to install and interact with Casper `cep47` smart contract.

### Methods

WIP

### Event stream

In `cep47-js-client` it's possible to track all of the events related to your contract.

- you need to provide optional parameter `eventStreamAddress` to `CEP47Client` constructor
- then you can call `onEvent()` method on `CEP47Client`, it requires you to provide:
  - `eventNames` - list of event types that you want to watch (there is a `CEP47Events` enum provided)
  - `callback` - the function that will be triggered when event happen, it will have following parameters
    - `eventName` - name of the event
    - `deployStatus` - it contains basic info about the deploy - `deployHash`, `success` which is a boolean and `error` which can be null or String.
    - `result` - a `CLValue` structure conatining data describing the event

The example usage is [here](../../e2e/cep47/installed.ts#L51-L67).
