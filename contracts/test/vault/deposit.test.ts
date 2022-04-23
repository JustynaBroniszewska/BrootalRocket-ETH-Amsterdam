import { expect } from 'chai'
import { vaultFixture } from 'fixtures/vaultFixture'
import { setupFixtureLoader } from 'test/setup'

describe('Vault.constructor', () => {
  const loadFixture = setupFixtureLoader()

  it('sets asset', async () => {
    const { vault, token } = await loadFixture(vaultFixture)

    expect(await vault.asset()).to.eq(token.address)
  })

  it('deposit', async () => {
    const { vault, token, wallet } = await loadFixture(vaultFixture)
    expect(await vault.deposit(1, wallet.address)).to.emit(vault, 'Deposit').withArgs(wallet.address, wallet.address, 1, 1)
    expect(await vault.convertToShares(1)).to.eq(1)
  })
})