import { expect } from 'chai'
import { setupFixtureLoader } from 'test/setup'
import { vaultFactoryFixture } from 'fixtures/vaultFactoryFixtures'
import { Vault__factory } from 'build/types'

describe('VaultFactory', () => {
  const loadFixture = setupFixtureLoader()

  it('creates vault', async () => {
    const { factory, token, wallet } = await loadFixture(vaultFactoryFixture)

    const tx = await factory.createVault(token.address, 'Vault', 'VAULT')
    const vaultAddress = (await tx.wait()).events[0].args.vault
    const vault = Vault__factory.connect(vaultAddress, wallet)

    expect(await vault.owner()).to.eq(wallet.address)
    expect(await vault.asset()).to.eq(token.address)
  })
})
