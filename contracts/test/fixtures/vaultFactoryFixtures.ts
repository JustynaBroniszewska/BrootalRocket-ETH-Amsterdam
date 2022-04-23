import { USD__factory, VaultFactory__factory } from 'build/types'
import { Wallet } from 'ethers'

export async function vaultFactoryFixture([wallet]: Wallet[]) {
  const token = await new USD__factory(wallet).deploy('token', 'TOKEN')
  const factory = await new VaultFactory__factory(wallet).deploy()
  return { token, factory }
}
