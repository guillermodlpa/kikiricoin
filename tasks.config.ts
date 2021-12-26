// These are Hardhat tasks that can be called from command line
// This is part of Hardhat config

import { task } from 'hardhat/config';
import '@nomiclabs/hardhat-ethers';

task('total-supply', 'Prints the total supply of KikiriCoin')
  .addParam('contract', "The contract's address")
  .setAction(async (taskArgs, { ethers }) => {
    const KikiriCoin = await ethers.getContractFactory('KikiriCoin');
    const kikiriCoin = await KikiriCoin.attach(taskArgs.contract);
    const totalSupply = await kikiriCoin.totalSupply();
    console.log(totalSupply.toString(), 'KIKI wei');
  });

task('balance-of', 'Prints the KIKI wei balance of the given address')
  .addParam('contract', "The contract's address")
  .addParam('account', "The account's address")
  .setAction(async (taskArgs, { ethers }) => {
    const KikiriCoin = await ethers.getContractFactory('KikiriCoin');
    const kikiriCoin = await KikiriCoin.attach(taskArgs.contract);
    const balance = await kikiriCoin.balanceOf(taskArgs.account);
    console.log(balance.toString(), 'KIKI wei');
  });

task('mint', 'Issues KIKI token to the owner of the smart contract')
  .addParam('contract', "The contract's address")
  .addParam('amount', 'The amount of KIKI wei to issue')
  .setAction(async (taskArgs, { ethers }) => {
    const [owner] = await ethers.getSigners();

    const KikiriCoin = await ethers.getContractFactory('KikiriCoin');
    const kikiriCoin = await KikiriCoin.attach(taskArgs.contract);
    await kikiriCoin.mint(owner.address, taskArgs.amount);
    console.log(`Done. Issued ${taskArgs.amount} wei to ${owner.address}`);
  });
