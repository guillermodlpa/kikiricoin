# KikiriCoin

KikiriCoin is an ERC20 token developed to learn smart contract development and for fun.

KikiriCoin and its faucet for distribution are deployed on Polygon. They can be interacted with on the following addresses:

- Mumbai
  - KikiriCoin:
  - KikiriFaucet:
- Mainnet
  - KikiriCoin:
  - KikiriFaucet:

## Commands

Developed using [Hardhat](https://hardhat.org/), using ESLint, Prettier, and TypeScript. Useful commands:

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
npx hardhat issue-token  --network localhost --contract [address] --amount 20000000000000000000

# Confirm the new total supply of KIKI. Expect to see "20000000000000000000 KIKI wei"
npx hardhat total-supply --network localhost --contract [address]

# Confirm the KIKI balance of the owner's address. Expect to see "20000000000000000000 KIKI wei"
npx hardhat balance-of --network localhost --contract [address] --account [account \#0 address]
```
