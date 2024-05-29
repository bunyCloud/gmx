const ethers = require("ethers");
const VaultPriceFeed = require("../contracts/VaultPriceFeed.json");
const {provider,tokenName, wavax} = require("../config");
require("dotenv").config();


// Initialize routerContract with the VaultPriceFeed contract
const routerContract = new ethers.Contract(
  VaultPriceFeed.address, // Ensure this address is correctly defined in your VaultPriceFeed.json
  VaultPriceFeed.abi,
  provider
);

// Function to fetch current ETH price
async function handleDynamicPrice(indexToken) {
  try {
    // Fetch the price from the contract
    const acceptablePrice = await routerContract.getPriceV1(indexToken, false, true);
    const scaleFactor = ethers.BigNumber.from("10").pow(27);
    const priceInWei = ethers.BigNumber.from(acceptablePrice);
    const currentPrice = priceInWei.div(scaleFactor).toNumber() / 1000;
    //console.log(`Current ${tokenName} Price: ${currentPrice}`);
    return currentPrice; // Return the current ETH price
  } catch (error) {
    console.error("Error fetching ETH price:", error);
    throw error; // Rethrow the error so it can be handled by the caller
  }
}

// Export the handleDynamicPrice function
module.exports = { handleDynamicPrice };
