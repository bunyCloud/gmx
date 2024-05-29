const express = require("express");
const ethers = require("ethers");
const app = express();
const cors = require("cors");
const OrderBook = require("../contracts/OrderBook.json");
const { wallet } = require("../config");
const { calculateSize } = require("../modules/calculateSizeModule");

require("dotenv").config();
app.use(express.json());
app.use(cors());

async function handleCreateDecreaseOrder(
  indexToken,
  sizeDelta,
  collateralToken,
  collateralDelta,
  isLong,
  triggerPrice,
  triggerAboveThreshold,
) {
  // Format increase size

  // Check weth balance, check avax balance before submitting.

  try {
    console.log("starting decrease transaction...");
    

    const contract = new ethers.Contract(
      OrderBook.address,
      OrderBook.abi,
      wallet,
    );

    const size = calculateSize(sizeDelta);
    const col = calculateSize(collateralDelta);
    const target = calculateSize(triggerPrice);
    console.log(target);

    const tx = await contract.createDecreaseOrder(
      indexToken,
      size,
      collateralToken,
      col,
      isLong,
      target,
      triggerAboveThreshold,
      {
        value: ethers.utils.parseEther("0.1") // Assume 0.1 ETH is the required fee; adjust as necessary
    }
    );
    const receipt = await tx.wait();
    console.log(
      `Close order submitted successfully: ${receipt.transactionHash}`,
    );
  } catch (error) {
    console.error("Error closing position", error);
    throw error;
  }
}

// Export the functions
module.exports = {
  handleCreateDecreaseOrder,
};

//3425.86
