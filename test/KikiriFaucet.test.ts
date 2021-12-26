// import { fail } from 'assert';
import { expect } from 'chai';
import { ethers } from 'hardhat';

// eslint-disable-next-line node/no-missing-import
import { KikiriCoin, KikiriFaucet } from '../typechain';
import { increaseTimeAndMine } from './util/time';
import { toWei } from './util/conversion';

const CAP = `1000000000000000000000000`;

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

  const issueTokenAndFundFaucet = async (token: KikiriCoin, faucet: KikiriFaucet, amount: string) => {
    const [owner] = await ethers.getSigners();
    await token.issueToken(owner.address, amount);
    await token.transfer(faucet.address, amount);
  };

  it('Should start with zero tokens', async () => {
    const kikiriCoin = await deployKikiriCoinContract();
    const kikiriFaucet = await deployKikiriFaucetContract(kikiriCoin.address);

    expect(await ethers.provider.getBalance(kikiriFaucet.address)).to.be.equal('0');
  });

  describe('claim', () => {
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
      await kikiriCoin.issueToken(owner.address, toWei(100));
      expect(await kikiriCoin.balanceOf(owner.address)).to.be.equal(toWei(100));

      // Transfer tokens from owner address to faucet address
      expect(await kikiriCoin.balanceOf(addr1.address)).to.be.equal('0');
      kikiriCoin.transfer(faucet.address, toWei(50));
      expect(await kikiriCoin.balanceOf(faucet.address)).to.be.equal(toWei(50));

      // Claim as another user
      await faucet.connect(addr1).claim();

      // Expect another user to have balance in their address
      expect(await kikiriCoin.balanceOf(addr1.address)).to.be.equal(toWei(10));

      // Expect faucet balance to have decreased
      expect(await kikiriCoin.balanceOf(faucet.address)).to.be.equal(toWei(40));
    });

    it('Should not be able to claim funds twice in a row', async () => {
      const [owner, addr1] = await ethers.getSigners();

      const kikiriCoin = await deployKikiriCoinContract();
      const faucet = await deployKikiriFaucetContract(kikiriCoin.address);

      expect(await kikiriCoin.balanceOf(faucet.address)).to.be.equal('0');

      // Issue tokens to the owner address
      await kikiriCoin.issueToken(owner.address, toWei(100));

      // Transfer tokens from owner address to faucet address
      kikiriCoin.transfer(faucet.address, toWei(50));

      await faucet.connect(addr1).claim();

      await expect(faucet.connect(addr1).claim()).to.be.revertedWith('FaucetError: Try again later');

      // After enough time passes, it should work again
      const rateLimitTime = await faucet.RATE_LIMIT_TIME();
      await increaseTimeAndMine(rateLimitTime + 10);
      await faucet.connect(addr1).claim();
    });

    it('Should trigger an event when claiming token', async () => {
      const [, addr1] = await ethers.getSigners();
      const kikiriCoin = await deployKikiriCoinContract();
      const faucet = await deployKikiriFaucetContract(kikiriCoin.address);

      await issueTokenAndFundFaucet(kikiriCoin, faucet, toWei(100));

      await expect(faucet.connect(addr1).claim())
        .to.emit(faucet, 'Claim')
        .withArgs(addr1.address, toWei(await faucet.DRIP_AMOUNT()));
    });
  });

  describe('widthdrawToken', () => {
    it('Should allow the owner to widthdraw', async () => {
      const [owner] = await ethers.getSigners();
      const kikiriCoin = await deployKikiriCoinContract();
      const faucet = await deployKikiriFaucetContract(kikiriCoin.address);

      await issueTokenAndFundFaucet(kikiriCoin, faucet, toWei(100));

      expect(await kikiriCoin.balanceOf(owner.address)).to.be.equal(0);
      await faucet.withdrawToken(owner.address, toWei(100));
      expect(await kikiriCoin.balanceOf(owner.address)).to.be.equal(toWei(100));
    });

    it('Should allow the owner to widthdraw to another account', async () => {
      const [, addr1] = await ethers.getSigners();
      const kikiriCoin = await deployKikiriCoinContract();
      const faucet = await deployKikiriFaucetContract(kikiriCoin.address);

      await issueTokenAndFundFaucet(kikiriCoin, faucet, toWei(100));

      expect(await kikiriCoin.balanceOf(addr1.address)).to.be.equal(0);
      await faucet.withdrawToken(addr1.address, toWei(100));
      expect(await kikiriCoin.balanceOf(addr1.address)).to.be.equal(toWei(100));
    });

    it('Should NOT allow another account to widthdraw', async () => {
      const [owner, addr1] = await ethers.getSigners();
      const kikiriCoin = await deployKikiriCoinContract();
      const faucet = await deployKikiriFaucetContract(kikiriCoin.address);

      await issueTokenAndFundFaucet(kikiriCoin, faucet, toWei(100));

      await expect(faucet.connect(addr1).withdrawToken(addr1.address, toWei(100))).to.be.revertedWith(
        'Ownable: caller is not the owner'
      );
      await expect(faucet.connect(addr1).withdrawToken(owner.address, toWei(100))).to.be.revertedWith(
        'Ownable: caller is not the owner'
      );
    });

    it('Should NOT allow to withdraw more than the current funds', async () => {
      const [, addr1] = await ethers.getSigners();
      const kikiriCoin = await deployKikiriCoinContract();
      const faucet = await deployKikiriFaucetContract(kikiriCoin.address);

      await issueTokenAndFundFaucet(kikiriCoin, faucet, toWei(100));

      await expect(faucet.withdrawToken(addr1.address, toWei(101))).to.be.revertedWith(
        'FaucetError: Insufficient funds'
      );
    });

    it('Should trigger an event when withdrawing token', async () => {
      const [owner, , addr2] = await ethers.getSigners();
      const kikiriCoin = await deployKikiriCoinContract();
      const faucet = await deployKikiriFaucetContract(kikiriCoin.address);

      await issueTokenAndFundFaucet(kikiriCoin, faucet, toWei(100));

      await expect(faucet.withdrawToken(addr2.address, toWei(1)))
        .to.emit(faucet, 'Withdraw')
        .withArgs(owner.address, addr2.address, toWei(1));
    });
  });
});
