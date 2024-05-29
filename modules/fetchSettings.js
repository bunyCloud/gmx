const { accountAddress,
    sellLimit,
    lossLimit,
    newEntryLimit,
    leverage,
    increaseSize,
    decreaseSize,
    minSize,
    timeDelay,
    cooldownPeriod,
    providerUrl } = require("../config");
var colors = require("colors");

const fetchSettings = async () => { 
    try {
        // Log fetching operation
        console.log(colors.bgWhite(`Fetching settings data...`));

        // Logging all configuration values
        console.log(colors.blue(`Account Address: ${accountAddress}`));
        console.log(colors.blue(`Provider URL: ${providerUrl}`));
        console.log(colors.blue(`Sell Limit: ${sellLimit}`));
        console.log(colors.blue(`Loss Limit: ${lossLimit}`));
        console.log(colors.blue(`New Entry Limit: ${newEntryLimit}`));
        console.log(colors.blue(`Leverage: ${leverage}`));
        console.log(colors.blue(`Increase Size: ${increaseSize}`));
        console.log(colors.blue(`Decrease Size: ${decreaseSize}`));
        console.log(colors.blue(`Minimum Size: ${minSize}`));
        console.log(colors.blue(`Time Delay: ${timeDelay}`));
        console.log(colors.blue(`Cooldown Period: ${cooldownPeriod}`));

        // Constructing settingsData object
        const settingsData = {
            accountAddress,
            providerUrl,
            sellLimit,
            lossLimit,
            newEntryLimit,
            leverage,
            increaseSize,
            decreaseSize,
            minSize,
            timeDelay,
            cooldownPeriod
        };

        // Returning the structured data
        return settingsData;
    } catch (error) {
        console.error("Error fetching settings data:", error);
        throw error; // Rethrow or handle error as necessary
    }
};

module.exports = {
    fetchSettings
};
