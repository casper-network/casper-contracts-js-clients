# casper-contracts-js-clients

This project contains a library that will help you create clients for Casper contracts and a few implementations of such clients dedicated to interacting with smart contracts on Casper. You will find these clients published in `npm`:

- A [Casper CEP-47 (NFT)](https://github.com/casper-ecosystem/casper-nft-cep47) client in JavaScript: [casper-cep47-js-client](https://www.npmjs.com/package/casper-cep47-js-client)

> Looking for CEP-18(ERC20) client? Please check [here](https://github.com/casper-ecosystem/cep18/tree/master/client-js)

## Usage examples

In this project, you will find end-to-end (e2e) tests, which you can also use as examples of interacting and using the contracts. The tests are well documented and can give you an overview of all contract functionality.

Before running an e2e test, run `npm i' inside the project's root directory:

```
cd packages/cep47-js-client
npm i
npm run bootstrap
npm run dist
```

### CEP-47 client usage

Before running this example client, you must specify all the environment variables in the `.env.cep47` file. If you need help, reference the `.env.cep47.example` file.

**Steps:**

- Open the [CEP-47 client example](packages/cep47-client)
- Set the environment variables in the `.env.cep47` file
- Run the [install script](e2e/cep47/install.ts)
- View the [client usage example](e2e/cep47/usage.ts)
- Install the contract:

  ```
  npm run e2e:cep47:install
  ```

- Run the test example:

  ```
  npm run e2e:cep47:usage
  ```
