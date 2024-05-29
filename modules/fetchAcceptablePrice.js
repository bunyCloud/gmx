const ethers = require("ethers");
const VaultPriceFeed = require("../contracts/VaultPriceFeed.json");
const {provider,tokenName, weth, wavax} = require("../config");
require("dotenv").config();


// Initialize routerContract with the VaultPriceFeed contract
const routerContract = new ethers.Contract(
  VaultPriceFeed.address, // Ensure this address is correctly defined in your VaultPriceFeed.json
  VaultPriceFeed.abi,
  provider
);

const priceBasisPoints = 9997;

// Function to fetch current ETH price
async function handleAcceptablePrice() {
  try {
    // Fetch the price from the contract
    const fetch = await routerContract.getPriceV1(wavax, false, true);
    const acceptablePrice = fetch.mul(priceBasisPoints).div(10000);
    console.log(`_Acceptable: ${acceptablePrice}`);

    //console.log(`Current ${tokenName} Price: ${currentEthPrice}`);
    return acceptablePrice; // Return the current ETH price
  } catch (error) {
    console.error("Error fetching ETH price:", error);
    throw error; // Rethrow the error so it can be handled by the caller
  }
}

// Export the handleAcceptablePrice function
module.exports = { handleAcceptablePrice };
