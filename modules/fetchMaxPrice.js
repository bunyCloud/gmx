const ethers = require("ethers");
const Vault = require("../contracts/Vault.json");
const {provider} = require("../config");
require("dotenv").config();


// Initialize vaultContract with the Vault contract
const vaultContract = new ethers.Contract(
  Vault.address, // Ensure this address is correctly defined in your Vault.json
  Vault.abi,
  provider
);

// Function to fetch current ETH price
async function fetchMaxPrice(indexToken) {
  try {
    // Fetch the price from the contract
    const maxAcceptablePrice = await vaultContract.getMinPrice(indexToken);
  
    return maxAcceptablePrice; // Return the current ETH price
  } catch (error) {
    console.error("Error fetching max price:", error);
    throw error; // Rethrow the error so it can be handled by the caller
  }
}

// Export the fetchMaxPrice function
module.exports = { fetchMaxPrice };
