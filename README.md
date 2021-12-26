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

# Other commands
npx hardhat clean
npx hardhat node
npx hardhat help
```
