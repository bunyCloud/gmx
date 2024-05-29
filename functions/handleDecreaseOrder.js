const { ethers } = require('ethers');


const OrderBook = require("../contracts/OrderBook.json");
const {
  minOut,
  accountAddress,
  wallet,
  wavax,
  usdc,
} = require("../config");
// Initialize the contract with the provided ABI and address

const orderBookContract = new ethers.Contract(
    OrderBook.address,
    OrderBook.abi,
    wallet,
  );
  
/**
 * Create a decrease order for a short position.
 * @param {string} indexToken - Address of the index token.
 * @param {number} sizeDelta - The size delta for the decrease.
 * @param {string} collateralToken - Address of the collateral token.
 * @param {number} collateralDelta - The amount of collateral to decrease.
 * @param {boolean} isLong - If the position is long. For short orders, this should be false.
 * @param {number} triggerPrice - Price at which the order should be triggered.
 * @param {boolean} triggerAboveThreshold - Whether the trigger price is above the threshold.
 * @returns {Promise<void>}
 */
async function handleDecreaseOrder(indexToken, sizeDelta, collateralToken, collateralDelta, isLong, triggerPrice, triggerAboveThreshold) {
    try {
        const tx = await orderBookContract.createDecreaseOrder(
            indexToken,
            ethers.utils.parseUnits(sizeDelta.toString(), 18), // Assuming sizeDelta needs 18 decimal places
            collateralToken,
            ethers.utils.parseUnits(collateralDelta.toString(), 18), // Assuming collateralDelta needs 18 decimal places
            isLong,
            ethers.utils.parseUnits(triggerPrice.toString(), 18), // Assuming triggerPrice needs 18 decimal places
            triggerAboveThreshold,
            {
                value: ethers.utils.parseEther("0.1") // Assume 0.1 ETH is the required fee; adjust as necessary
            }
        );
        const receipt = await tx.wait();
        console.log(`Transaction successful with hash: ${receipt.transactionHash}`);
    } catch (error) {
        console.error(`Failed to create decrease order: ${error.message}`);
        throw error;
    }
}

module.exports = { handleDecreaseOrder };
