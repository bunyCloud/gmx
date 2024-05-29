const { ethers } = require("ethers");

// Convert USD to position size
function calculateSize(usdValue, decimals = 0) {
  const value = parseFloat(usdValue);
  if (isNaN(value)) {
    throw new Error("Invalid input: usdValue must be a number.");
  }
  
  // Convert to a whole number based on specified decimals
  // For example, if usdValue is 123.456 and decimals is 2, this results in 12345
  const adjustedValue = Math.floor(value * Math.pow(10, decimals)).toString();
  
  // Now use BigNumber for the adjusted value and multiply
  const size = ethers.BigNumber.from(adjustedValue).mul(
    ethers.BigNumber.from("10").pow(30)
  );
  
  return size;
}

module.exports = { calculateSize };
