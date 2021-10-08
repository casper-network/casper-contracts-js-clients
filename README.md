# casper-contracts-js-clients

This repo contains library that will help you creating clients for Casper contracts as well as few implementations of contract dedicated clients.

All of them are published in npm:
- [casper-cep47-js-client](https://www.npmjs.com/package/casper-cep47-js-client)
- [casper-erc20-js-client](https://www.npmjs.com/package/casper-erc20-js-client)

Also there is an toolbelt library that can be used to write your own contract clients:
- [casper-js-client-helper](https://www.npmjs.com/package/casper-js-client-helper)


## Example usage of contracts

The e2e tests can be treated as examples of usage. They are well documented and gives the overview of all functionalities of contract.
Before running any e2e test please run `npm i` inside root directory.

### erc20

[install script](e2e/erc20/install.ts) / [example usage](e2e/erc20/installed.ts) / [README](packages/cep47-client)

To run the scripts set all the variables in `.env.erc20` file (to make it easier you can use `.env.erc20.example` as a reference).

Than run `npm run e2e:erc20:install` to install the contract and `npm run e2e:erc20:installed` to run the test example.

### cep47

[install script](e2e/cep47/install.ts) / [example usage](e2e/cep47/installed.ts) / [README](packages/erc20-client)

To run the scripts set all the variables in `.env.cep47` file (to make it easier you can use `.env.cep47.example` as a reference).

Than run `npm run e2e:cep47:install` to install the contract and `npm run e2e:cep47:installed` to run the test example.
