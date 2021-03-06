// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
// import { ethers } from 'hardhat'

import { VaultFactory } from "../build/artifacts"
import { contract, deploy } from "ethereum-mars"

const ORACLE_ADDRESS = '0xa10648Da824330d7C7670E26a234bEf442E77f20'

// async function main() {
//   // Hardhat always runs the compile task when running scripts with its command
//   // line interface.
//   //
//   // If this script is run directly using `node` you may want to call compile
//   // manually to make sure everything is compiled
//   // await hre.run('compile');

//   // We get the contract to deploy
//   const Factory = await ethers.getContractFactory('VaultFactory')
//   const factory = await Factory.deploy(ORACLE_ADDRESS)

//   await factory.deployed()

//   console.log('Factory deployed to:', factory.address)
// }

// // We recommend this pattern to be able to use async/await everywhere
// // and properly handle errors.
// main().catch((error) => {
//   console.error(error)
//   process.exitCode = 1
// })

deploy({ verify: true }, (deployer, { networkName }) => {
  contract(VaultFactory, [ORACLE_ADDRESS])
})
