# `casper-cep47-js-client`

This client gives you an easy way to install and interact with the Casper CEP-47 (NFT) smart contract.

## Installation

Run this command to install the CEP-47 JavaScript client:

```
npm i casper-cep47-js-client
```

## Usage

### Methods

This description is work in progress.

### Event stream

With this client, you can track all of the events related to your contract. You will find the example usage [here](../../e2e/cep47/installed.ts#L51-L67).

**Steps to track events:**

- Provide the optional parameter `eventStreamAddress` to the `CEP47Client` constructor
- Call the `onEvent()` method on the `CEP47Client`, which requires you to provide the following:
  - `eventNames` - a list of event types that you want to monitor; note the `CEP47Events` enum provided
  - `callback` - a function that will be triggered when an event happens, with the following parameters:
    - `eventName` - the name of the event
    - `deployStatus` - provides basic information about the deploy, with these possible values: *deployHash*, *success* (which is a boolean), and *error* (which can be null or String)
    - `result` - a `CLValue` structure containing data describing the event

