const express = require("express");
const ethers = require("ethers");
const app = express();
const cors = require("cors");
const PositionRouter = require("../contracts/PositionRouter.json");
const {
  wavax,
  executionFee,
  minOut,
  tokenName,
  accountAddress,
  wallet,
  minAvaxBalance,
  usdc,
} = require("../config");

const { calculateSize } = require("../modules/calculateSizeModule");
const { fetchMaxPrice } = require("../modules/fetchMaxPrice");
const { fetchMinPrice } = require("../modules/fetchMinPrice");

require("dotenv").config();
app.use(express.json());
app.use(cors());
const nativeTokenAddress = ethers.constants.AddressZero;

const collateralToken = [usdc];

async function handleClosePosition(indexToken, sizeDelta, amountIn, isLong) {
  try {
    console.log("Starting decrease transaction...");

    const contract = new ethers.Contract(
      PositionRouter.address,
      PositionRouter.abi,
      wallet
    );

    // Collateral in
    const _amountIn = amountIn;
    // Position size
    const positionSize = sizeDelta;

    // Format amount and size
    const formatAmount = calculateSize(_amountIn);
    const formatSize = calculateSize(positionSize);

    let acceptablePrice = 0;

    if (isLong) {
      // Fetch max price for long positions
      acceptablePrice = await fetchMaxPrice(indexToken);
    } else {
      // Fetch min price for short positions
      acceptablePrice = await fetchMinPrice(indexToken);
    }

    // Estimate gas
    const gasEstimate = await contract.estimateGas.createDecreasePosition(
      collateralToken,
      indexToken,
      formatAmount,
      formatSize,
      isLong,
      accountAddress,
      acceptablePrice,
      minOut,
      executionFee,
      false,
      nativeTokenAddress,
      {
        value: executionFee,
      }
    );

    console.log(`Estimated gas limit: ${gasEstimate.toString()}`);

    // Contract call with estimated gas
    const tx = await contract.createDecreasePosition(
      collateralToken,
      indexToken,
      formatAmount,
      formatSize,
      isLong,
      accountAddress,
      acceptablePrice,
      minOut,
      executionFee,
      false,
      nativeTokenAddress,
      {
        gasLimit: gasEstimate,
        value: executionFee,
      }
    );

    const receipt = await tx.wait();
    console.log(`Close position submitted successfully: ${receipt.transactionHash}`);
  } catch (error) {
    console.error("Error closing position", error);
    throw error;
  }
}

// Export the functions
module.exports = {
  handleClosePosition,
};
