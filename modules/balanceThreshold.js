// balanceThreshold.js

const { minAvaxBalance, minWethBalance, minBtcBalance, minUsdcBalance } = require("../config");
var colors = require("colors");

function checkThreshold(balance, token) {
    const thresholds = {
        'AVAX': minAvaxBalance,
        'WETH': minWethBalance,
        'BTC': minBtcBalance,
        'USDC': minUsdcBalance
    };

    if (balance < thresholds[token]) {
        console.log(
            colors.bgRed(`Warning: ${token} balance (${balance}) is below the threshold of ${thresholds[token]} ${token}.`));
        return false;
    }
    return true;
}

module.exports = {
    checkThreshold
};
