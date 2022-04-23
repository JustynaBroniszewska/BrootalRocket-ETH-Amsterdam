import { expect } from 'chai'
import { vaultFixture } from 'fixtures/vaultFixture'
import { setupFixtureLoader } from 'test/setup'

describe('Vault.constructor', () => {
  const loadFixture = setupFixtureLoader()

  it('sets asset', async () => {
    const { vault, token } = await loadFixture(vaultFixture)

    expect(await vault.asset()).to.eq(token.address)
  })
})