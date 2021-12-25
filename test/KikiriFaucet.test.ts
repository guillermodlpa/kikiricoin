// import { fail } from 'assert';
import { expect } from 'chai';
import { ethers } from 'hardhat';

// eslint-disable-next-line node/no-missing-import
import { KikiriCoin, KikiriFaucet } from '../typechain';

const increaseTimeAndMine = async (amount: number) => {
  await ethers.provider.send('evm_increaseTime', [amount]);
  await ethers.provider.send('evm_mine', []);
};

const produceStringOfZeros = (length: number) =>
  Array(length)
    .fill('0')
    .reduce((m, i) => `${m}${i}`, '');
const DECIMALS = 18;
const CAP = `1000000000000000000000000`;

const toDecimalString = (amount: number) => {
  const integer = Math.floor(amount);
  const decimals = amount - integer;
  const decimalsString = `${decimals}`.replace('0.', '');
  return `${integer}${decimalsString}${produceStringOfZeros(DECIMALS - decimalsString.length)}`;
};

describe('KikiriFaucet', () => {
  const deployKikiriCoinContract = async (cap = CAP): Promise<KikiriCoin> => {
    const KikiriCoin = await ethers.getContractFactory('KikiriCoin');
    const kiririCoin = await KikiriCoin.deploy(cap);
    await kiririCoin.deployed();
    return kiririCoin;
  };

  const deployKikiriFaucetContract = async (kikiriCoinAddress: string): Promise<KikiriFaucet> => {
    const KikiriFaucet = await ethers.getContractFactory('KikiriFaucet');
    const kiririFaucet = await KikiriFaucet.deploy(kikiriCoinAddress);
    await kiririFaucet.deployed();
    return kiririFaucet;
  };

  it('Should start with zero tokens', async () => {
    const kikiriCoin = await deployKikiriCoinContract();
    const kikiriFaucet = await deployKikiriFaucetContract(kikiriCoin.address);

    expect(await ethers.provider.getBalance(kikiriFaucet.address)).to.be.equal('0');
  });

  it('Should not be able to claim when empty', async () => {
    const kikiriCoin = await deployKikiriCoinContract();
    const kikiriFaucet = await deployKikiriFaucetContract(kikiriCoin.address);

    expect(await ethers.provider.getBalance(kikiriFaucet.address)).to.be.equal('0');
    await expect(kikiriFaucet.claim()).to.be.revertedWith('FaucetError: Empty');
  });

  it('Should be able to claim when there are funds', async () => {
    const [owner, addr1] = await ethers.getSigners();

    const kikiriCoin = await deployKikiriCoinContract();
    const faucet = await deployKikiriFaucetContract(kikiriCoin.address);

    expect(await kikiriCoin.balanceOf(faucet.address)).to.be.equal('0');

    // Issue tokens to the owner address
    await kikiriCoin.issueToken(owner.address, toDecimalString(100));
    expect(await kikiriCoin.balanceOf(owner.address)).to.be.equal(toDecimalString(100));

    // Transfer tokens from owner address to faucet address
    expect(await kikiriCoin.balanceOf(addr1.address)).to.be.equal('0');
    kikiriCoin.transfer(faucet.address, toDecimalString(50));
    expect(await kikiriCoin.balanceOf(faucet.address)).to.be.equal(toDecimalString(50));

    // Claim as another user
    await faucet.connect(addr1).claim();

    // Expect another user to have balance in their address
    expect(await kikiriCoin.balanceOf(addr1.address)).to.be.equal(toDecimalString(10));

    // Expect faucet balance to have decreased
    expect(await kikiriCoin.balanceOf(faucet.address)).to.be.equal(toDecimalString(40));
  });

  it('Should not be able to claim funds twice in a row', async () => {
    const [owner, addr1] = await ethers.getSigners();

    const kikiriCoin = await deployKikiriCoinContract();
    const faucet = await deployKikiriFaucetContract(kikiriCoin.address);

    expect(await kikiriCoin.balanceOf(faucet.address)).to.be.equal('0');

    // Issue tokens to the owner address
    await kikiriCoin.issueToken(owner.address, toDecimalString(100));

    // Transfer tokens from owner address to faucet address
    kikiriCoin.transfer(faucet.address, toDecimalString(50));

    await faucet.connect(addr1).claim();

    await expect(faucet.connect(addr1).claim()).to.be.revertedWith('FaucetError: Try again later');

    // After enough time passes, it should work again
    const rateLimitTime = await faucet.RATE_LIMIT_TIME();
    await increaseTimeAndMine(rateLimitTime + 10);
    await faucet.connect(addr1).claim();
  });
});
