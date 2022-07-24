# casper-contracts-js-clients

This project contains a library that will help you create clients for Casper contracts and a few implementations of such clients dedicated to interacting with smart contracts on Casper. You will find these clients published in `npm`:
- A Casper CEP-47 (NFT) client in JavaScript: [casper-cep47-js-client](https://www.npmjs.com/package/casper-cep47-js-client)
- A Casper ERC-20 client in JavaScript: [casper-erc20-js-client](https://www.npmjs.com/package/casper-erc20-js-client)

Also, we provide a toolkit that you can use to write your contract clients: 
- A JavaScript client helper library: [casper-js-client-helper](https://www.npmjs.com/package/casper-js-client-helper)


## Usage examples

In this project, you will find end-to-end (e2e) tests, which you can also use as examples of interacting and using the contracts. The tests are well documented and can give you an overview of all contract functionality.

Before running an e2e test, run `npm i' inside the project's root directory:

```
cd casper-erc20-js-client
npm i
npm run bootstrap
npm run dist
```

### ERC-20 client usage

Before running this example client, you must specify all the environment variables in the `.env.erc20` file. If you need help, reference the `.env.erc20.example` file.

**Steps:**

- Open the [ERC-20 client example](packages/erc20-client)
- Set the environment variables in the `.env.erc20` file
- Run the [install script](e2e/erc20/install.ts) 
- View the [client usage example](e2e/erc20/installed.ts)
- Install the contract:

    ```
    npm run e2e:erc20:install
    ```

- Run the test example:

    ```
    npm run e2e:erc20:installed
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
