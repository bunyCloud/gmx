const ethers = require("ethers");
const VaultPriceFeed = require("../contracts/VaultPriceFeed.json");
const { provider, wavax } = require("../config");
require("dotenv").config();

// Initialize routerContract with the VaultPriceFeed contract
const routerContract = new ethers.Contract(
  VaultPriceFeed.address,  // Ensure this address is correctly defined in your VaultPriceFeed.json
  VaultPriceFeed.abi,
  provider
);

// Function to fetch current WAVAX price in Wei
async function fetchWavaxPriceWei() {
  try {
    // Fetch the price from the contract
    const acceptablePrice = await routerContract.getPriceV1(wavax, false, true);
    const priceInWei = ethers.BigNumber.from(acceptablePrice);  // Price in Wei as BigNumber

    // Return the price in Wei as a string to handle big numbers safely in JavaScript
    return priceInWei.toString();
  } catch (error) {
    console.error("Error fetching WAVAX price:", error);
    throw error;  // Rethrow the error so it can be handled by the caller
  }
}

// Export the fetchWavaxPriceWei function
module.exports = { fetchWavaxPriceWei };
