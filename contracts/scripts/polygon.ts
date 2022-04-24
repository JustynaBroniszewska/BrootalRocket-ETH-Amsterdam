import { VaultFactory, MockUmaWarrior } from "../build/artifacts"
import { contract, deploy } from "ethereum-mars"

deploy({ verify: true }, (deployer, { networkName }) => {
  const mockUmaWarrior = contract(MockUmaWarrior)
  contract(VaultFactory, [mockUmaWarrior])
})
