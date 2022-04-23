import { USD__factory, Vault__factory, Counter__factory } from 'build/types'
import { Wallet } from 'ethers'

export async function vaultFixture([wallet]: Wallet[]) {
  const token = await new USD__factory(wallet).deploy('token', 'TOKEN')
  const vault = await new Vault__factory(wallet).deploy(token.address, 'Vault', 'VAULT')
  const counter = await new Counter__factory(wallet).deploy()
  return { token, vault, counter }
}
