// Assuming this is in a file like fetchBalances.js or similar

const { ethers } = require("ethers");
const ERC20ABI = ["function balanceOf(address owner) view returns (uint256)"];
const { usdc, weth, btc,accountAddress, providerUrl } = require("../config");
const { checkThreshold } = require("./balanceThreshold");

const provider = new ethers.providers.JsonRpcProvider(providerUrl);
const mnemonic = process.env.MNEMONIC;
const wallet = ethers.Wallet.fromMnemonic(mnemonic).connect(provider);

function truncateToTwoDecimals(num) {
    return Math.trunc(num * 100) / 100;
}

function truncateToFourDecimals(num) {
    return Math.trunc(num * 10000) / 10000;
}

async function fetchBalances() {
    try {
        const ethBalance = await provider.getBalance(accountAddress);
        const ethBal = truncateToTwoDecimals(parseFloat(ethers.utils.formatEther(ethBalance)));

        const wethContract = new ethers.Contract(weth, ERC20ABI, provider);
        const wethBalance = await wethContract.balanceOf(wallet.address);
        const wethBal = truncateToFourDecimals(parseFloat(ethers.utils.formatEther(wethBalance)));

        const btcContract = new ethers.Contract(btc, ERC20ABI, provider);
        const btcBalance = await btcContract.balanceOf(wallet.address);
        const btcBal = truncateToFourDecimals(parseFloat(ethers.utils.formatEther(btcBalance)));

        const usdcContract = new ethers.Contract(usdc, ERC20ABI, provider);
        const usdcBalance = await usdcContract.balanceOf(wallet.address);
        const usdcBal = truncateToTwoDecimals(parseFloat(ethers.utils.formatUnits(usdcBalance, 6)));

        // Check thresholds
        checkThreshold(ethBal, 'AVAX');
        checkThreshold(wethBal, 'WETH');
        checkThreshold(btcBal, 'BTC');
        checkThreshold(usdcBal, 'USDC');

        return { ethBalance: ethBal, wethBalance: wethBal, usdcBalance: usdcBal, btcBalance: btcBal };
    } catch (error) {
        console.error("Error fetching balances:", error);
        throw error;
    }
}

module.exports = { fetchBalances };
