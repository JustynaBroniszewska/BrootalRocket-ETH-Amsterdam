import '@typechain/hardhat'
import '@nomiclabs/hardhat-waffle'
import 'tsconfig-paths/register'
import './abi-exporter'

import mocharc from './.mocharc.json'
import compiler from './.compiler.json'

module.exports = {
  paths: {
    sources: './contracts',
    artifacts: './build',
    cache: './cache',
  },
  abiExporter: {
    path: './build',
    flat: true,
    spacing: 2,
  },
  networks: {
    kovan: {
      url: `https://kovan.optimism.io`,
      accounts: [`${process.env.PRIVATE_KEY}`]
    },
    hardhat: {
      initialDate: '2020-01-01T00:00:00',
      allowUnlimitedContractSize: true,
    },
  },
  typechain: {
    outDir: 'build/types',
    target: 'ethers-v5',
  },
  solidity: {
    compilers: [compiler],
  },
  mocha: {
    ...mocharc,
    timeout: 400000,
  },
}
