import { fail } from 'assert';
import { expect } from 'chai';
import { ethers } from 'hardhat';

// eslint-disable-next-line node/no-missing-import
import { KikiriCoin } from '../typechain';

const produceStringOfZeros = (length: number) =>
  Array(length)
    .fill('0')
    .reduce((m, i) => `${m}${i}`, '');

const DECIMALS = 18;
const CAP = `1000000${produceStringOfZeros(DECIMALS)}`;

const toDecimalString = (amount: number) => {
  const integer = Math.floor(amount);
  const decimals = amount - integer;
  const decimalsString = `${decimals}`.replace('0.', '');
  return `${integer}${decimalsString}${produceStringOfZeros(DECIMALS - decimalsString.length)}`;
};

describe('KikiriCoin', () => {
  const deployContract = async (cap = CAP): Promise<KikiriCoin> => {
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

      const issueTokenTx = await kikiriCoin.issueToken(owner.address, toDecimalString(1));
      await issueTokenTx.wait();

      expect(await kikiriCoin.totalSupply()).to.equal('1000000000000000000');
    });

    it('Should not issue a negative amount of token', async () => {
      const [owner] = await ethers.getSigners();
      const kikiriCoin = await deployContract();
      try {
        await kikiriCoin.issueToken(owner.address, `-${toDecimalString(1)}`);
      } catch (error) {
        return;
      }
      fail('An error should have been thrown');
    });

    it('Should not issue token to another account', async () => {
      const kikiriCoin = await deployContract();
      const [, addr1] = await ethers.getSigners();
      await expect(kikiriCoin.connect(addr1).issueToken(addr1.address, toDecimalString(1))).to.be.revertedWith(
        'Ownable: caller is not the owner'
      );
    });

    it('Should not allow issuing more than the cap', async () => {
      const smallerCap = `15${produceStringOfZeros(DECIMALS)}`;
      const kikiriCoinSmallerCap = await deployContract(smallerCap);

      expect(await kikiriCoinSmallerCap.cap()).to.equal('15000000000000000000');

      const [owner] = await ethers.getSigners();
      const issueTokenTx = await kikiriCoinSmallerCap.issueToken(owner.address, toDecimalString(10));
      await issueTokenTx.wait();

      await expect(kikiriCoinSmallerCap.issueToken(owner.address, toDecimalString(10))).to.be.revertedWith(
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
