import { ERC20__factory, Vault__factory } from 'build/types'
import { Wallet } from 'ethers'

export async function vaultFixture([wallet]: Wallet[]) {
  const token = await new ERC20__factory(wallet).deploy('token', 'TOKEN')
  const vault = await new Vault__factory(wallet).deploy(token.address, 'Vault', 'VAULT')
  return { token, vault }
}
