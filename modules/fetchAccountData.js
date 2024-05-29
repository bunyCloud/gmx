
const { fetchBalances } = require("./fetchBalances");
const { accountAddress, providerUrl, minAvaxBalance, minBtcBalance, minWethBalance, minUsdcBalance } = require("../config");
var colors = require("colors");
const { fetchTokenValue } = require("./fetchTokenValue");

const fetchAccountData = async () => { 
    try {
        // Fetch account balances
        console.log(
            colors.bgWhite(`Fetching account balances....`));
        
        const { ethBalance, wethBalance, usdcBalance, btcBalance } = await fetchBalances();

        const accountData = {
            accountAddress,
            providerUrl,
            balances: {
                avax: { balance: ethBalance, minBalance: minAvaxBalance },
                weth: { balance: wethBalance, minBalance: minWethBalance },
                btc: { balance: btcBalance, minBalance: minBtcBalance },
                usdc: { balance: usdcBalance, minBalance: minUsdcBalance }
            }
        };

       // const tokenUSD = await fetchTokenValue();
        //console.log(`USD Values: ${tokenUSD}`);
        // Optional: Log data if needed
        
        
        console.log(`${ethBalance}/AVAX | Min. ${minAvaxBalance}`);
        console.log(`${wethBalance}/WETH | Min. ${minWethBalance}`);
        console.log(`${btcBalance}/BTC.b | Min. ${minBtcBalance}`);
        console.log(`${usdcBalance}/USDC | Min. ${minUsdcBalance}`);

        return accountData; // Returning the structured data
    } catch (error) {
        console.error("Error fetching account data:", error);
        throw error; // Rethrow or handle error as necessary
    }
};

module.exports = {
    fetchAccountData
};
