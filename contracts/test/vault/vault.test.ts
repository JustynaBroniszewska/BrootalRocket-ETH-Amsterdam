import { expect } from 'chai'
import { vaultFixture } from 'fixtures/vaultFixture'
import { setupFixtureLoader } from 'test/setup'
import { constants, utils } from 'ethers'

describe('Vault.constructor', () => {
  const loadFixture = setupFixtureLoader()

  it('sets asset', async () => {
    const { vault, token, wallet } = await loadFixture(vaultFixture)

    expect(await vault.owner()).to.eq(wallet.address)
    expect(await vault.asset()).to.eq(token.address)
  })

  it('deposit', async () => {
    const { vault, wallet, token } = await loadFixture(vaultFixture)
    await token.mint(wallet.address, 1)
    await token.connect(wallet).approve(vault.address, 1)
    expect(await vault.deposit(1, wallet.address)).to.emit(vault, 'Deposit').withArgs(wallet.address, wallet.address, 1, 1)
    expect(await vault.convertToShares(1)).to.eq(1)
    expect(await vault.convertToAssets(1)).to.eq(1)
    expect(await vault.maxMint(wallet.address)).to.eq(constants.MaxUint256)
    expect(await vault.maxDeposit(wallet.address)).to.eq(constants.MaxUint256)
    expect(await vault.maxWithdraw(wallet.address)).to.eq(constants.MaxUint256)
    expect(await vault.maxRedeem(wallet.address)).to.eq(constants.MaxUint256)
  })

  it('execute', async () => {
    const { vault, wallet, other, counter } = await loadFixture(vaultFixture)
    await expect(vault.connect(other).execute(constants.AddressZero, '0x00')).to.be.revertedWith('Only owner allowed')
    expect(await counter.counter()).to.eq(0)
    const counterInt = new utils.Interface(['function increaseCounter() public'])

    const data = counterInt.encodeFunctionData('increaseCounter', [])
    await vault.execute(counter.address, data)
    expect(await counter.counter()).to.eq(1)

    await vault.executeMany([counter.address, counter.address], [data, data])
    expect(await counter.counter()).to.eq(3)
    
  })

  it('shares calculation', async () => {
    const { vault, wallet, other, token } = await loadFixture(vaultFixture)
    await token.mint(wallet.address, 1)
    await token.mint(other.address, 2)
    await token.connect(wallet).approve(vault.address, 1)
    await token.connect(other).approve(vault.address, 2)

    await vault.connect(wallet).deposit(1, wallet.address)
    await token.mint(vault.address, 1)
    await vault.connect(other).deposit(2, other.address)
    
    expect(await vault.balanceOf(wallet.address)).to.eq(1)
    expect(await vault.balanceOf(other.address)).to.eq(1)
  })
})
