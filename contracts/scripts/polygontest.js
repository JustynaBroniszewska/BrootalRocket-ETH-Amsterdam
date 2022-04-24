(async () => {
    const ethers = require('ethers')

    // The Contract interface
    const poolAbi = [
        'function getReserveAddressById(uint16 id) view returns (address)',
        'function MAX_STABLE_RATE_BORROW_SIZE_PERCENT() view returns (uint256)',
        'function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode)',
        'function getReserveNormalizedIncome(address asset) view returns(uint256)',
        'function getReserveData(address asset) view returns(bytes32)',
    ]

    const tokenAbi = [
        'function approve(address spender, uint256 value) returns (bool)',
        'function mint(address receiver, uint256 amount)',
        'function balanceOf(address account) view returns (uint256)',
    ]

    const factoryAbi = [
        'function createVault(address asset, address collateralAsset, string memory name, string memory symbol)',
    ]

    const vaultAbi = [
        'function requestDeposit(int256 proposedVaultValue)',
        'function deposit(uint256 amount, address receiver) returns (uint256)',
        'event ValuationRequested(bytes32 identifier, uint256 timestamp)',
    ]

    // Connect to the network
    const provider = new ethers.providers.JsonRpcProvider('https://polygon-rpc.com')
    const wallet = new ethers.Wallet('0xf89eea3567bc1dd2e7fdb51266ed6270e6eae0ac5b084851365493450113d6cb', provider)

    // The address from the above deployment example
    const factoryAddress = '0x2Fc606CF59062AF9CfD24007f46287e42ce0C79C'
    const tokenAddress = '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063'
    const portfolioAddress = '0x45a70F6362495beF91f47b0F0D43096E47473b2F'
    const collateralDaiAddress = '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063'


    // We connect to the Contract using a Provider, so we will only
    // have read-only access to the Contract
    const factory = new ethers.Contract(factoryAddress, factoryAbi, provider)
    const token = new ethers.Contract(tokenAddress, tokenAbi, provider)
    const portfolio = new ethers.Contract(portfolioAddress, vaultAbi, provider)

    await factory.connect(wallet).createVault(token.address, token.address, 'Super Secure Stuff', 'SSS', { gasLimit: 10000000, gasPrice: ethers.utils.parseUnits('100', 'gwei') })
    // await debugFactory.connect(wallet).createVault(token.address, collateralDaiAddress, 'Newest Dai', 'ND')
    // const tx = await debugPortfolio.connect(wallet).requestDeposit(ethers.utils.parseEther('10'), { gasLimit: 2999999 })
    // console.log(await tx.wait());

    // await token.connect(wallet).approve(portfolio.address, ethers.utils.parseEther('10'), { gasLimit: 999999 })
    // await debugPortfolio.connect(wallet).deposit(ethers.utils.parseEther('10'), wallet.address, { gasLimit: 999999 })

    // console.log((await aToken.balanceOf(wallet.address)).toString());
    // await token.connect(wallet).mint(wallet.address, ethers.utils.parseEther('1000'))
    // await token.connect(wallet).approve(poolAddress, ethers.utils.parseEther('10'))
    // await pool.connect(wallet).supply(tokenAddress, ethers.utils.parseEther('1'), wallet.address, 0)
    // console.log(await pool.connect(wallet).getReserveAddressById(0));
    // console.log(await pool.connect(wallet).getReserveData(tokenAddress));

    // console.log((await (await provider.getTransaction('0x1b787e9a43384680d2e91d2cf5a169dd7bc423e4ebd990b7a60305996d397114')).wait()));
    // console.log(await provider.getBlock(2247438));
})()