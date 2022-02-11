# KikiriCoin

![CI badge](https://github.com/guillermodlpa/kikiricoin/workflows/Continuous%20Integration/badge.svg)

KikiriCoin is an ERC20 token developed to learn smart contract development and for fun.

KikiriCoin's token and its faucet for token distribution are deployed on Polygon. Polygon is a scaling solution for Ethereum that provides faster and cheaper transactions on Ethereum.

## Commands

Developed using [Hardhat](https://hardhat.org/), with ESLint, Prettier, and TypeScript. Useful commands:

```shell
# Compile contracts
npx hardhat compile

# Run unit tests
npx hardhat test

# Produce test coverage report
npx hardhat coverage

# Deploy
npx hardhat run scripts/deploy.ts

# Code style commands
npx eslint '**/*.{js,ts}'
npx prettier '**/*.{json,sol,md}' --check
npx solhint 'contracts/**/*.sol'

# Prints the list of accounts
npx hardhat accounts

# Run standalone local blockchain for testing
npx hardhat node
npx hardhat run --network localhost scripts/...

# Other commands
npx hardhat clean
npx hardhat help
```

## Local testing with a network

Using Hardhat tasks, we can interact with the smart contract from command line.

```shell
# Set up a local network
npx hardhat node

# Deploy KikiriCoin. This will return the contract's address
npx hardhat run --network localhost scripts/deployKikiriCoin.ts

# Set the private key and URL in .env as values of LOCALHOST_NETWORK_URL and LOCALHOST_PRIVATE_KEY

# Confirm contract has no token. Expect to see "0 KIKI wei"
npx hardhat total-supply --network localhost --contract [address]

# Issue token as the contract owner. Here we issue 20 KIKI
npx hardhat mint  --network localhost --contract [address] --amount 20000000000000000000

# Confirm the new total supply of KIKI. Expect to see "20000000000000000000 KIKI wei"
npx hardhat total-supply --network localhost --contract [address]

# Confirm the KIKI balance of the owner's address. Expect to see "20000000000000000000 KIKI wei"
npx hardhat balance-of --network localhost --contract [address] --account [account \#0 address]

# Deploy KikiriCoin's Faucet. This will return the contract's address
TOKEN_ADDRESS=0x... npx hardhat run --network localhost scripts/deployKikiriFaucet.ts

# Issue token as the contract owner to the faucet. Here we issue 500 KIKI
npx hardhat mint  --network localhost --contract [address] --recipient [faucet address] --amount 500000000000000000000
```

## Instructions for testing in Test Network Polygon Mumbai

In `.env`, define the following two variables:

- `POLYGON_MUMBAI_NETWORK_URL` - This will be given to you by Alchemy when you create an app on the Polygon Mumbai network ([instructions](https://docs.alchemy.com/alchemy/introduction/getting-started)).
- `OWNER_ACCOUNT_PRIVATE_KEY` - This is the private key of the account you want to use for deploying. Note this account would become the smart contract owner when deploying, the only one with minting permission and ability to transfer ownership.

Then, in [https://faucet.polygon.technology/](https://faucet.polygon.technology/), get test tokens for that account. This is necessary since deploying the smart contract is a transaction and costs some MATIC.

Then, deploy the KikiriCoin smart contract. Fee for me was 0.01662201 MATIC.

```shell
npx hardhat run --network mumbai scripts/deployKikiriCoin.ts
```

Take note of the smart contract address, and use it to deploy the faucet smart contract. Fee for me was 0.01074775 MATIC.

```shell
TOKEN_ADDRESS=[address] npx hardhat run --network mumbai scripts/deployKikiriFaucet.ts
```

Use those two addresses to interact with the smart contracts using the Hardhat tasks in this repository, or to plug them as environment variables on the KikiriCoin website or another dApp.

It makes sense to start by minting some KIKI token for the faucet. Fee for me was 0.00056718 MATIC

```shell
npx hardhat mint  --network mumbai --contract [token address] --recipient [faucet address] --amount 100000000000000000000
```

## Instructions for deploying to Polygon Mainnet

In `.env`, define the following two variables:

- `POLYGON_MAINNET_NETWORK_URL` - This will be given to you by Alchemy when you create an app on the Polygon Mumbai network ([instructions](https://docs.alchemy.com/alchemy/introduction/getting-started)).
- `OWNER_ACCOUNT_PRIVATE_KEY` - This is the private key of the account you want to use for deploying. Note this account would become the smart contract owner when deploying, the only one with minting permission and ability to transfer ownership.

Then, get tokens for that account. This is necessary since deploying the smart contract is a transaction and costs some MATIC.

Then, deploy the KikiriCoin smart contract. Fee for me ws around ~0.015 MATIC.

```shell
npx hardhat run --network mainnet scripts/deployKikiriCoin.ts
```

Take note of the smart contract address, and use it to deploy the faucet smart contract.

```shell
TOKEN_ADDRESS=[address] npx hardhat run --network mainnet scripts/deployKikiriFaucet.ts
```

Use those two addresses to interact with the smart contracts using the Hardhat tasks in this repository, or to plug them as environment variables on the KikiriCoin website or another dApp.

It makes sense to start by minting some KIKI token for the faucet.

```shell
npx hardhat mint  --network mainnet --contract [token address] --recipient [faucet address] --amount 100000000000000000000
```
