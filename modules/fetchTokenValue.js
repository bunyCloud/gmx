const { fetchBalances } = require("./fetchBalances");
const { accountAddress, providerUrl, usdcUSD } = require("../config");
var colors = require("colors");
const { handleBtcPrice } = require("./fetchBtcPrice");
const { handleWethPrice } = require("./handleWethPrice");
const { handleWavaxPrice } = require("./fetchWavaxPrice");

const fetchTokenValue = async () => { 
    try {
        console.log(colors.bgWhite(`Fetching balance in USD value...`));
        
        const { ethBalance, wethBalance, usdcBalance, btcBalance } = await fetchBalances();
        const btcPrice = await handleBtcPrice();
        const wethPrice = await handleWethPrice();
        const avaxPrice = await handleWavaxPrice();

        // Calculate the USD values of assets
        const btcUSD = parseFloat(btcPrice) * btcBalance;
        const wethUSD = parseFloat(wethPrice) * wethBalance;
        const avaxUSD = parseFloat(avaxPrice) * ethBalance; // Assuming ethBalance refers to AVAX balance

        const tokenValue = {
            balances: {
                avax: { usdValue: avaxUSD },
                weth: { usdValue: wethUSD },
                btc: { usdValue: btcUSD },
                usdc: { usdValue: usdcBalance * usdcUSD } // Assuming usdcUSD is the price of 1 USDC
            }
        };

        // Optional: Log the USD values for clarity
        console.log(`AVAX Balance: ${ethBalance} | USD Value: ${avaxUSD}`);
        console.log(`WETH Balance: ${wethBalance} | USD Value: ${wethUSD}`);
        console.log(`BTC Balance: ${btcBalance} | USD Value: ${btcUSD}`);
        console.log(`USDC Balance: ${usdcBalance} | USD Value: ${usdcBalance * usdcUSD}`);

        return tokenValue;
    } catch (error) {
        console.error("Error fetching account data:", error);
        throw error;
    }
};

module.exports = {
    fetchTokenValue
};
