import { fail } from 'assert';
import { expect } from 'chai';
import { ethers } from 'hardhat';

import { KikiriCoin } from '../typechain';
import { toWei } from './util/conversion';

describe('KikiriCoin', () => {
  const deployContract = async (cap = toWei(1000000)): Promise<KikiriCoin> => {
    const KikiriCoin = await ethers.getContractFactory('KikiriCoin');
    const kikiriCoin = await KikiriCoin.deploy(cap);
    await kikiriCoin.deployed();
    return kikiriCoin;
  };

  describe('issueToken', () => {
    it('Should issue token to the owner', async () => {
      const [owner] = await ethers.getSigners();
      const kikiriCoin = await deployContract();
      expect(await kikiriCoin.totalSupply()).to.equal(0);

      const issueTokenTx = await kikiriCoin.issueToken(owner.address, toWei(1));
      await issueTokenTx.wait();

      expect(await kikiriCoin.totalSupply()).to.equal('1000000000000000000');
    });

    it('Should not issue a negative amount of token', async () => {
      const [owner] = await ethers.getSigners();
      const kikiriCoin = await deployContract();
      try {
        await kikiriCoin.issueToken(owner.address, `-${toWei(1)}`);
      } catch (error) {
        return;
      }
      fail('An error should have been thrown');
    });

    it('Should not issue token to another account', async () => {
      const kikiriCoin = await deployContract();
      const [, addr1] = await ethers.getSigners();
      await expect(kikiriCoin.connect(addr1).issueToken(addr1.address, toWei(1))).to.be.revertedWith(
        'Ownable: caller is not the owner'
      );
    });

    it('Should not allow issuing more than the cap', async () => {
      const smallerCap = toWei(15);
      const kikiriCoinSmallerCap = await deployContract(smallerCap);

      expect(await kikiriCoinSmallerCap.cap()).to.equal('15000000000000000000');

      const [owner] = await ethers.getSigners();
      const issueTokenTx = await kikiriCoinSmallerCap.issueToken(owner.address, toWei(10));
      await issueTokenTx.wait();

      await expect(kikiriCoinSmallerCap.issueToken(owner.address, toWei(10))).to.be.revertedWith(
        'ERC20Capped: cap exceeded'
      );
    });

    it('Should trigger an event when issuing token', async () => {
      const [owner] = await ethers.getSigners();
      const kikiriCoin = await deployContract();

      await expect(kikiriCoin.issueToken(owner.address, 1000000))
        .to.emit(kikiriCoin, 'Mint')
        .withArgs(owner.address, owner.address, 1000000);
    });
  });
});
