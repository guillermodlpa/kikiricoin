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
    const kiririCoin = await KikiriCoin.deploy(cap);
    await kiririCoin.deployed();
    return kiririCoin;
  };

  describe('issueToken', () => {
    it('Should issue token to the owner', async () => {
      const kiririCoin = await deployContract();
      expect(await kiririCoin.totalSupply()).to.equal(0);

      const issueTokenTx = await kiririCoin.issueToken(toDecimalString(1));
      await issueTokenTx.wait();

      expect(await kiririCoin.totalSupply()).to.equal('1000000000000000000');
    });

    it('Should not issue a negative amount of token', async () => {
      const kiririCoin = await deployContract();
      try {
        await kiririCoin.issueToken(`-${toDecimalString(1)}`);
      } catch (error) {
        return;
      }
      fail('An error should have been thrown');
    });

    it('Should not issue token to another account', async () => {
      const kiririCoin = await deployContract();
      const [, ...addr] = await ethers.getSigners();
      await expect(kiririCoin.connect(addr[0]).issueToken(toDecimalString(1))).to.be.revertedWith(
        'Ownable: caller is not the owner'
      );
    });

    it('Should not allow issuing more than 10 tokens', async () => {
      const kiririCoin = await deployContract();
      await expect(kiririCoin.issueToken(toDecimalString(11))).to.be.revertedWith(
        "Amount can't be higher than 10 KIKI"
      );
    });

    it('Should not allow issuing more than the cap', async () => {
      const smallerCap = `15${produceStringOfZeros(DECIMALS)}`;
      const kiririCoinSmallerCap = await deployContract(smallerCap);

      expect(await kiririCoinSmallerCap.cap()).to.equal('15000000000000000000');

      const issueTokenTx = await kiririCoinSmallerCap.issueToken(toDecimalString(10));
      await issueTokenTx.wait();

      await expect(kiririCoinSmallerCap.issueToken(toDecimalString(10))).to.be.revertedWith(
        'ERC20Capped: cap exceeded'
      );
    });
  });
});
