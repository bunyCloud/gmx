const ethers = require("ethers");
const { parsePositionsData } = require("./parsePositions"); // Ensure this module exists and is correctly implemented
const { vaultAddress, accountAddress, provider } = require("../config"); // Ensure these configurations are correctly set
const Reader = require("../contracts/Reader.json"); // Ensure the Reader contract is correctly set up

// Reader Contract
const readerContract = new ethers.Contract(
  Reader.address,
  Reader.abi,
  provider
);

/**
 * Fetch positions based on specified tokens and position type.
 * 
 * @param {Array} collateralTokens Array of collateral token addresses
 * @param {Array} indexTokens Array of index token addresses
 * @param {Array} positionTypes Array of booleans indicating if the position is long
 * @returns {Object} Parsed position data
 */
async function fetchPosition(collateralTokens, indexTokens, positionTypes, currentPrice, isShort, tokenName) {
  try {
    const positionsData = await readerContract.getPositions(
      vaultAddress,
      accountAddress,
      collateralTokens,
      indexTokens,
      positionTypes,
    );
    return parsePositionsData(positionsData, currentPrice, isShort, tokenName);
  } catch (err) {
    console.error("Error fetching positions:", err);
    throw new Error("Error fetching positions");
  }
}

module.exports = { fetchPosition };
